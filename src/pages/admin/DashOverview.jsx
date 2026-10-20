import { Link } from "react-router-dom"
import { MOCK_REPORTS } from "../../data/mockReports"

/* Admin overview — static KPIs + compact preview of the open report queue.
   Detailed management lives on its own pages (/Dashboard/...), never here. */

const KPIS = [
  { label: "New signups 7d", value: "312" },
  { label: "Active users 7d", value: "8,421" },
  { label: "Posts 24h", value: "1,284" },
  { label: "Jobs posted 7d", value: "96" },
  { label: "Applications 7d", value: "184" },
  { label: "Open reports", value: "17" },
  { label: "Hidden items", value: "3" },
  { label: "DMs 24h", value: "2,412" },
]

const QUICK_LINKS = [
  { to: "/Dashboard/Acceptances", name: "Job acceptances", desc: "Users' applications — past 7 days only" },
  { to: "/Dashboard/Reports", name: "Reports", desc: "Harassment, sexual content, spam, scams" },
  { to: "/Dashboard/CommunityPosts", name: "Community posts", desc: "Jobs posted on the community page" },
  { to: "/Dashboard/HomePosts", name: "Home posts", desc: "Feed posts on the home page" },
]

function DashOverview() {
  const attention = MOCK_REPORTS.filter((r) => r.status === "Pending").slice(0, 4)

  return (
    <div>
      <div className="dash-grid-kpi">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="dash-kpi">
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
          </div>
        ))}
      </div>

      <div className="dash-two">
        <section className="dash-panel">
          <h2>Needs attention</h2>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {attention.map((r) => (
                <tr key={r.id}>
                  <td>{r.type}</td>
                  <td>{r.target}</td>
                  <td><span className="dash-badge bad">{r.reason}</span></td>
                  <td>{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="dash-note">
            <Link to="/Dashboard/Reports">Open the full report queue →</Link>
          </p>
        </section>

        <section className="dash-panel">
          <h2>Manage</h2>
          <ul className="dash-link-list">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>
                  <span>
                    <strong>{link.name}</strong>
                    <span className="dash-link-desc">{link.desc}</span>
                  </span>
                  <span className="dash-link-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default DashOverview
