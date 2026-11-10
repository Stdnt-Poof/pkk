import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import { SkeletonDashTable, SkeletonOverviewCards } from "../../components/skeleton"

/* Admin overview — three cards and the member list. Reading order is
   left to right, top to bottom: Total users on the left, Active users
   above Reports on the right. "see details" on the reports card switches
   to the queue at /Dashboard/Reports. Every member row opens
   /Profile/:username, shows how many flags that account carries and can
   promote a member to admin from its Actions cell. */

function DashOverview() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState(null) // null = still loading
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    api("/admin/overview")
      .then((payload) => {
        if (!cancelled) setStats(payload?.data ?? null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load the overview.")
      })

    api("/admin/users")
      .then((payload) => {
        if (!cancelled) setUsers(payload?.data ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load the members.")
      })

    return () => {
      cancelled = true
    }
  }, [])

  /* The overview's "Make admin" action: a proper in-app dialog (not the
     browser's generic "localhost says" confirm) guards it because the
     list offers no undo; the row updates from the role the API stored. */
  const [promoteTarget, setPromoteTarget] = useState(null)

  useEffect(() => {
    if (!promoteTarget) return undefined

    function onKey(e) {
      if (e.key === "Escape") setPromoteTarget(null)
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [promoteTarget])

  function makeAdmin(u) {
    setPromoteTarget(u)
  }

  function confirmPromote() {
    const target = promoteTarget
    if (!target) return
    setPromoteTarget(null)
    api(`/admin/users/${target.id}`, { method: "PATCH", body: { role: "admin" } })
      .then((payload) => {
        const role = payload?.data?.role ?? "admin"
        setUsers((prev) => (prev ?? []).map((row) => (row.id === target.id ? { ...row, role } : row)))
      })
      .catch((err) => setError(err.message || "Could not change this member's role."))
  }

  return (
    <div>
      {error ? <p className="job-form-error">{error}</p> : null}

      {stats === null ? (
        <SkeletonOverviewCards />
      ) : (
        <div className="dash-cards">
          <div className="dash-card dash-card-total">
            <span>Total users</span>
            <strong>{stats.total_users}</strong>
            <p className="dash-card-sub">
              {stats.members} {stats.members === 1 ? "member" : "members"} ·{" "}
              {stats.admins} {stats.admins === 1 ? "admin" : "admins"}
            </p>
          </div>

          <div className="dash-card dash-card-active">
            <span>Active users (7d)</span>
            <strong>{stats.active_users_7d}</strong>
            <p className="dash-card-sub">
              Posted, commented, messaged or published a service this week
            </p>
          </div>

          <div className="dash-card dash-card-reports">
            <span>Reports</span>
            <strong>{stats.open_reports}</strong>
            <Link className="dash-card-more" to="/Dashboard/Reports">
              see details <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}

      <section className="dash-panel">
        <h2>Members</h2>
        {users === null ? (
          <SkeletonDashTable rows={4} cells={5} />
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Reports</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link className="dash-user-link" to={`/Profile/${u.username}`}>
                      {u.username}
                    </Link>
                  </td>
                  <td>
                    <span className={u.role === "admin" ? "dash-badge warn" : "dash-badge"}>
                      {u.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </td>
                  <td>
                    {u.reports_count > 0 ? (
                      <span className="dash-badge bad">{u.reports_count}</span>
                    ) : (
                      <span className="dash-dim">0</span>
                    )}
                  </td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td>
                    {u.role === "admin" ? null : (
                      <button type="button" className="dash-btn" onClick={() => makeAdmin(u)}>
                        Make admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {promoteTarget ? (
        <div className="pf-add-backdrop" onClick={() => setPromoteTarget(null)}>
          <div
            className="pf-add-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm admin promotion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-add-body">
              <strong>Make {promoteTarget.username} an admin?</strong>
              <div className="pf-add-actions pf-add-actions-split">
                <button type="button" className="job-btn" onClick={() => setPromoteTarget(null)}>
                  Cancel
                </button>
                <button type="button" className="job-btn job-btn-primary" onClick={confirmPromote}>
                  Make admin
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DashOverview
