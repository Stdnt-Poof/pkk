import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import { timeAgo } from "../../lib/time"
import { SkeletonDashTable } from "../../components/skeleton"
import ConfirmOverlay from "../../components/ConfirmOverlay"

/* The flag queue — posts and members in one list (one row per flag).
   Dismiss clears a single flag; removing deletes the flagged post for
   everyone and clears all of its flags. Member flags only ever offer
   dismiss — deleting an account is not a list-row action. */

const REASON_BADGE = {
  Spam: "warn",
  Harassment: "bad",
  "Sexual content": "bad",
  Scam: "bad",
  Impersonation: "warn",
  Copyright: "warn",
  Other: "",
}

function badgeClass(key) {
  const tone = REASON_BADGE[key]
  return tone ? `dash-badge ${tone}` : "dash-badge"
}

function DashReports() {
  const [reports, setReports] = useState(null) // null = still loading
  const [error, setError] = useState("")
  const [confirmReport, setConfirmReport] = useState(null) // post flag awaiting removal

  useEffect(() => {
    let cancelled = false
    api("/admin/reports")
      .then((payload) => {
        if (!cancelled) {
          setReports(payload?.data ?? [])
          setError("")
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setReports([])
          setError(err.message || "Could not load the reports.")
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  function dismissFlag(reportId) {
    api(`/admin/reports/${reportId}`, { method: "DELETE" })
      .then(() => {
        setReports((prev) => (prev ?? []).filter((r) => r.id !== reportId))
      })
      .catch((err) => setError(err.message || "Could not dismiss this flag."))
  }

  function removePost(report) {
    if (!report.post) return
    setConfirmReport(report)
  }

  function confirmRemovePost() {
    const post = confirmReport?.post
    setConfirmReport(null)
    if (!post) return
    api(`/admin/posts/${post.id}`, { method: "DELETE" })
      .then(() => {
        setReports((prev) => (prev ?? []).filter((r) => r.post?.id !== post.id))
      })
      .catch((err) => setError(err.message || "Could not remove this post."))
  }

  const openCount = reports?.length ?? 0

  return (
    <section className="dash-panel">
      <h2>Reports — {openCount} open</h2>
      {error ? <p className="job-form-error">{error}</p> : null}
      {reports === null ? (
        <SkeletonDashTable rows={4} cells={6} />
      ) : reports.length === 0 ? null : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Target</th>
              <th>Reason</th>
              <th>Reporter</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const isPost = r.type === "post"
              return (
                <tr key={r.id}>
                  <td>
                    <span className={isPost ? "dash-badge off" : "dash-badge warn"}>
                      {isPost ? "Post" : "Member"}
                    </span>
                  </td>
                  <td className="report-post-cell">
                    {isPost ? (
                      r.post?.author?.username ? (
                        <Link className="dash-user-link" to={`/Profile/${r.post.author.username}`}>
                          @{r.post.author.username}
                        </Link>
                      ) : null
                    ) : (
                      <Link className="dash-user-link" to={`/Profile/${r.user?.username}`}>
                        @{r.user?.username ?? "—"}
                      </Link>
                    )}
                    <span className="dash-dim">
                      {isPost ? ` — ${r.post?.body}` : " — reported account"}
                    </span>
                  </td>
                  <td>
                    <span className={badgeClass(r.reason)}>{r.reason}</span>
                  </td>
                  <td>
                    <Link className="dash-user-link" to={`/Profile/${r.reporter?.username}`}>
                      {r.reporter?.username ?? "—"}
                    </Link>
                  </td>
                  <td>{timeAgo(r.created_at)}</td>
                  <td>
                    <div className="dash-actions">
                      <button
                        type="button"
                        className="dash-btn"
                        onClick={() => dismissFlag(r.id)}
                      >
                        Dismiss
                      </button>
                      {isPost ? (
                        <button
                          type="button"
                          className="dash-btn danger"
                          onClick={() => removePost(r)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {confirmReport?.post ? (
        <ConfirmOverlay
          title="Remove post"
          message="Remove this post for everyone? This can't be undone."
          confirmLabel="Remove"
          onClose={() => setConfirmReport(null)}
          onConfirm={confirmRemovePost}
        />
      ) : null}
    </section>
  )
}

export default DashReports
