import { BUDGET_FILTERS, JOB_CATEGORIES } from "../../data/mockJobs"

function JobFilterBar({
  search,
  onSearch,
  category,
  onCategory,
  budget,
  onBudget,
  onPost,
}) {
  return (
    <div className="job-filterbar">
      <div className="job-filterbar-top">
        <input
          className="search-bar job-search"
          type="search"
          placeholder="Search jobs, skills, keywords"
          aria-label="Search jobs"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button type="button" className="job-btn job-btn-primary" onClick={onPost}>
          Post a Job
        </button>
      </div>
      <div className="job-filterbar-row">
        <div className="job-chip-row" role="group" aria-label="Category">
          {JOB_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={category === c ? "job-chip is-active" : "job-chip"}
              onClick={() => onCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          className="job-select"
          aria-label="Budget filter"
          value={budget}
          onChange={(e) => onBudget(e.target.value)}
        >
          {BUDGET_FILTERS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default JobFilterBar
