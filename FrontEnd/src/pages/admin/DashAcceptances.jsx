import { formatBudget } from "../../data/mockJobs"
import { MOCK_ACCEPTANCES } from "../../data/mockAcceptances"

/* Users' job applications — PAST 7 DAYS ONLY (mock data is already scoped).
   List view: user, job title, tags, payment. No full job detail is shown. */

function DashAcceptances() {
  return (
    <section className="dash-panel">
      <h2>Job acceptances — past 7 days</h2>
      <table className="dash-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Job</th>
            <th>Tags</th>
            <th>Payment</th>
            <th>Applied</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_ACCEPTANCES.map((a) => (
            <tr key={a.id}>
              <td>
                <strong>{a.user}</strong><br />
                <span className="dash-dim">{a.handle}</span>
              </td>
              <td>{a.jobTitle}</td>
              <td>
                <div className="dash-tags">
                  {a.tags.map((tag) => (
                    <span key={tag} className="job-skill-tag">{tag}</span>
                  ))}
                </div>
              </td>
              <td>
                <span className="job-budget">{formatBudget(a.budget, a.currency)}</span>{" "}
                <span className="dash-dim">{a.budgetType}</span>
              </td>
              <td>{a.appliedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default DashAcceptances
