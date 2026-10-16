import { useState } from "react"
import { Link } from "react-router-dom"
import { formatBudget } from "../../data/mockJobs"

function JobDetail({ job, isSaved, onClose, onToggleSave, onAddComment }) {
  const [comment, setComment] = useState("")

  function submitComment(e) {
    e.preventDefault()
    const text = comment.trim()
    if (!text) return
    onAddComment(job.id, text)
    setComment("")
  }

  return (
    <div className="job-modal-backdrop" onClick={onClose}>
      <div
        className="job-modal"
        role="dialog"
        aria-modal="true"
        aria-label={job.title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="job-modal-header">
          <h2>{job.title}</h2>
          <button type="button" className="job-btn" onClick={onClose}>
            Close
          </button>
        </header>

        <p className="job-card-meta">
          <span className="job-budget">
            {formatBudget(job.budget, job.currency)} {job.budgetType}
          </span>
          <span aria-hidden="true"> · </span>
          <span>{job.category}</span>
          <span aria-hidden="true"> · </span>
          <span>{job.postedAt}</span>
          <span aria-hidden="true"> · </span>
          <span>{job.proposals} proposals</span>
        </p>
        <p className="job-card-author">
          Posted by {job.author} <span>{job.handle}</span>
        </p>
        <p className="job-detail-desc">{job.description}</p>
        <div className="job-card-skills">
          {job.skills.map((skill) => (
            <span key={skill} className="job-skill-tag">
              {skill}
            </span>
          ))}
        </div>

        <div className="job-card-actions">
          <button
            type="button"
            className={isSaved ? "job-btn job-btn-saved" : "job-btn"}
            onClick={() => onToggleSave(job.id)}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
          <Link
            className="job-btn job-btn-primary"
            to="/Messages"
            state={{ applyJobId: job.id, applyJobTitle: job.title }}
          >
            Apply via DM
          </Link>
        </div>

        <section className="job-comments">
          <h3>Discussion ({job.comments.length})</h3>
          {job.comments.length === 0 ? (
            <p className="messages-placeholder">No comments yet. Ask the first question.</p>
          ) : (
            <ul className="job-comment-list">
              {job.comments.map((c) => (
                <li key={c.id} className="job-comment">
                  <strong>{c.author}</strong>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          )}
          <form className="composer-form job-comment-form" onSubmit={submitComment}>
            <input
              className="composer-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ask about scope, timeline, deliverables..."
              aria-label="Add a comment"
            />
            <button type="submit" className="job-btn job-btn-primary">
              Reply
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default JobDetail
