import { useState } from "react"
import api from "../../lib/api"
import { CURRENCIES } from "../../lib/money"
import { SERVICE_TAGS } from "../../data/serviceTags"

/**
 * Offer (or edit) a service on the Hire page.
 *
 * A service says "I am free and willing to do <tags> for <price> — just
 * DM me and I will do my best", so the form is title, description, craft
 * tags and a starting price.
 */
function PostServiceModal({ service, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    tags: (service?.tags || []).join(", "),
    price: service ? String(service.price) : "",
    currency: service?.currency || "USD",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5)
    const price = Number(form.price)

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.")
      return
    }
    if (tags.length === 0) {
      setError("Add at least one craft tag.")
      return
    }
    if (!Number.isInteger(price) || price < 0) {
      setError("Price must be a whole number (0 or more).")
      return
    }

    setError("")
    setSaving(true)

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        tags,
        price,
        currency: form.currency,
      }

      const saved = service
        ? await api(`/services/${service.id}`, { method: "PATCH", body: payload })
        : await api("/services", { method: "POST", body: payload })

      onSaved(saved.data)
    } catch (err) {
      setError(err.message || "Could not save the service.")
      setSaving(false)
    }
  }

  return (
    <div className="job-modal-backdrop" onClick={onClose}>
      <div
        className="job-modal"
        role="dialog"
        aria-modal="true"
        aria-label={service ? "Edit service" : "Offer a service"}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="job-modal-header">
          <h2>{service ? "Edit your service" : "Offer a service"}</h2>
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
              placeholder="Ex. I will build your landing page in React"
              maxLength={120}
            />
          </label>
          <label className="job-field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What you are free and willing to do, deliverables, timeline..."
              rows={5}
              maxLength={2000}
            />
          </label>
          <label className="job-field">
            <span>Tags (comma separated, max 5)</span>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Web Dev, React"
              list="service-tag-suggestions"
            />
            <datalist id="service-tag-suggestions">
              {SERVICE_TAGS.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
          </label>
          <div className="job-form-row">
            <label className="job-field">
              <span>Starting price ({form.currency})</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder={form.currency === "IDR" ? "350000" : "150"}
              />
            </label>
            <label className="job-field">
              <span>Currency</span>
              <select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error ? <p className="job-form-error">{error}</p> : null}
          <button type="submit" className="job-btn job-btn-primary job-form-submit" disabled={saving}>
            {saving ? "Saving..." : service ? "Save changes" : "Publish service"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostServiceModal
