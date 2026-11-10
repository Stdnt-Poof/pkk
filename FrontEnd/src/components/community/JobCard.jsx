import { Link } from "react-router-dom"
import { formatBudget } from "../../data/mockJobs"

function JobCard({ job, isSaved, onOpen, onToggleSave }) {
  return (
    <article className="job-card">
      <button type="button" className="job-card-main" onClick={() => onOpen(job)}>
        <h3 className="job-card-title">{job.title}</h3>
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
        <p className="job-card-desc">{job.description}</p>
        <div className="job-card-skills">
          {job.skills.map((skill) => (
            <span key={skill} className="job-skill-tag">
              {skill}
            </span>
          ))}
        </div>
        <p className="job-card-author">
          Posted by {job.author} <span>{job.handle}</span>
        </p>
      </button>
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
    </article>
  )
}

export default JobCard
