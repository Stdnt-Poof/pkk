import { useState } from "react"
import { MOCK_REPORTS } from "../../data/mockReports"

/* Report queue — a user reports a post/comment/user with a fixed reason; the
   admin sees the reason + reporter note and can dismiss, warn, or remove.
   Actions are mock-only (useState) until the backend lands. */

const REASON_BADGE = {
  Spam: "warn",
  Harassment: "bad",
  "Sexual content": "bad",
  Scam: "bad",
  Impersonation: "warn",
  Copyright: "warn",
  Other: "",
}

const STATUS_BADGE = {
  Pending: "warn",
  Reviewing: "",
  Removed: "good",
  Dismissed: "off",
  Warned: "good",
}

function badgeClass(map, key) {
  const tone = map[key]
  return tone ? `dash-badge ${tone}` : "dash-badge"
}

function DashReports() {
  const [reports, setReports] = useState(MOCK_REPORTS)

  function act(id, status) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const openCount = reports.filter(
    (r) => r.status === "Pending" || r.status === "Reviewing",
  ).length

  return (
    <section className="dash-panel">
      <h2>Reports queue — {openCount} open</h2>
      <p className="dash-note">Dismiss, warn, or remove the reported target. Actions are mock-only.</p>
      {reports.length === 0 ? (
        <p className="dash-empty">Queue is clear — no reports left.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Target</th>
              <th>Report</th>
              <th>Reporter</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.type}</td>
                <td>{r.target}</td>
                <td>
                  <span className={badgeClass(REASON_BADGE, r.reason)}>
                    {r.reason}
                  </span>
                  <p className="dash-note report-details">{r.details}</p>
                </td>
                <td>{r.reporter}</td>
                <td>{r.time}</td>
                <td>
                  <span className={badgeClass(STATUS_BADGE, r.status)}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === "Pending" || r.status === "Reviewing" ? (
                    <div className="dash-actions">
                      <button type="button" className="dash-btn" onClick={() => act(r.id, "Dismissed")}>
                        Dismiss
                      </button>
                      {r.status === "Pending" ? (
                        <button type="button" className="dash-btn" onClick={() => act(r.id, "Warned")}>
                          Warn
                        </button>
                      ) : null}
                      <button type="button" className="dash-btn danger" onClick={() => act(r.id, "Removed")}>
                        Remove
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default DashReports
