import { useState } from "react"
import { MOCK_JOBS, formatBudget } from "../../data/mockJobs"

const STORAGE_KEY = "community-jobs-v1"

// Same storage the community page reads, so this list reflects what is
// actually being posted in the community in this browser (mock-only).
function loadStoredJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((job) => ({ currency: "USD", ...job }))
  } catch {
    return []
  }
}

/* Community jobs moderation — per-user LIST VIEW ONLY: title, tags, payment.
   Job descriptions are never rendered in full on this page. */

function DashCommunityPosts() {
  const [jobs, setJobs] = useState(() => [...loadStoredJobs(), ...MOCK_JOBS])

  function setStatus(id, status) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)))
  }

  function remove(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  return (
    <section className="dash-panel">
      <h2>Community posts — {jobs.length} live</h2>
      {jobs.length === 0 ? (
        <p className="dash-empty">Nothing posted right now.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Job</th>
              <th>Tags</th>
              <th>Payment</th>
              <th>Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const status = job.status || "Published"
              return (
                <tr key={job.id}>
                  <td>
                    <strong>{job.author}</strong><br />
                    <span className="dash-dim">{job.handle}</span>
                  </td>
                  <td>{job.title}</td>
                  <td>
                    <div className="dash-tags">
                      {job.skills.map((skill) => (
                        <span key={skill} className="job-skill-tag">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="job-budget">{formatBudget(job.budget, job.currency)}</span>{" "}
                    <span className="dash-dim">{job.budgetType}</span>
                  </td>
                  <td>{job.postedAt}</td>
                  <td>
                    <span className={`dash-badge ${status === "Published" ? "good" : "off"}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="dash-actions">
                      <button
                        type="button"
                        className="dash-btn"
                        onClick={() => setStatus(job.id, status === "Published" ? "Hidden" : "Published")}
                      >
                        {status === "Published" ? "Hide" : "Publish"}
                      </button>
                      <button type="button" className="dash-btn danger" onClick={() => remove(job.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default DashCommunityPosts
