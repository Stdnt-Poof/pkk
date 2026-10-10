import { useState } from "react"
import { JOB_CATEGORIES } from "../../data/mockJobs"

const emptyForm = {
  title: "",
  description: "",
  budget: "",
  budgetType: "Fixed",
  category: "UI Design",
  skills: "",
}

function PostJobModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.")
      return
    }
    const budget = Number(form.budget)
    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Budget must be a number above 0.")
      return
    }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      budget,
      budgetType: form.budgetType,
      category: form.category,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8),
    })
  }

  return (
    <div className="job-modal-backdrop" onClick={onClose}>
      <div
        className="job-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Post a job"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="job-modal-header">
          <h2>Post a job offer</h2>
          <button type="button" className="job-btn" onClick={onClose}>
            Close
          </button>
        </header>
        <form className="job-form" onSubmit={handleSubmit}>
          <label className="job-field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex. Need a logo designer for cafe"
              maxLength={120}
            />
          </label>
          <label className="job-field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What do you need, deliverables, timeline..."
              rows={5}
            />
          </label>
          <div className="job-form-row">
            <label className="job-field">
              <span>Budget (USD)</span>
              <input
                type="number"
                min="1"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                placeholder="150"
              />
            </label>
            <label className="job-field">
              <span>Type</span>
              <select value={form.budgetType} onChange={(e) => set("budgetType", e.target.value)}>
                <option value="Fixed">Fixed</option>
                <option value="Hourly">Hourly</option>
              </select>
            </label>
          </div>
          <div className="job-form-row">
            <label className="job-field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {JOB_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="job-field">
              <span>Skills (comma separated)</span>
              <input
                value={form.skills}
                onChange={(e) => set("skills", e.target.value)}
                placeholder="Figma, Logo, Branding"
              />
            </label>
          </div>
          {error ? <p className="job-form-error">{error}</p> : null}
          <button type="submit" className="job-btn job-btn-primary job-form-submit">
            Publish job
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostJobModal
