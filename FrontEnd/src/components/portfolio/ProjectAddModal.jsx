import { useEffect, useRef, useState } from "react"
import api from "../../lib/api"
import { isValidProjectUrl } from "./portfolioUtils"
import { IconX } from "../icons"

/**
 * Overlay for adding a project from GitHub or GitLab.
 *
 * Only https links to github.com / gitlab.com repositories are accepted.
 * The preview photo is optional — projects without one show the bundled
 * placeholder image in the list.
 */
function ProjectAddModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [previewFile, setPreviewFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const previewUrlRef = useRef(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const titleOk = title.trim().length >= 3
  const linkOk = isValidProjectUrl(link)
  const canUpload = titleOk && linkOk && !submitting

  function pickPreview(e) {
    const file = (e.target.files || [])[0]
    if (!file) return

    setError("")

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = URL.createObjectURL(file)

    setPreviewFile(file)
    setPreviewUrl(previewUrlRef.current)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!canUpload) {
      setError("Add a title and a valid GitHub or GitLab repository link first.")
      return
    }

    setError("")
    setSubmitting(true)

    try {
      const form = new FormData()
      form.append("title", title.trim())
      form.append("kind", "project")
      form.append("external_url", link.trim())

      if (previewFile) {
        form.append("preview", previewFile)
      }

      await api("/portfolios", { method: "POST", form })
      onCreated?.()
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="pf-add-backdrop" onClick={onClose}>
      <div
        className="pf-add-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Add project"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pf-add-header">
          <button type="button" className="pf-add-x" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
          <h2>Add project</h2>
        </header>

        <form className="pf-add-body" onSubmit={handleSubmit}>
          <label className="job-field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Portfolio website"
              maxLength={120}
              required
            />
          </label>

          <label className="job-field">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/you/your-repo"
              maxLength={500}
            />
            <small className="pf-add-file-name">
              Only github.com and gitlab.com repository links are accepted.
            </small>
          </label>

          <div className="pf-add-field">
            <span className="pf-add-label">Preview</span>
            <div className="pf-add-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Selected preview" />
              ) : (
                <span>Nothing selected yet</span>
              )}
            </div>
          </div>

          <label className="job-field">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickPreview} />
          </label>

          {error ? <p className="job-form-error">{error}</p> : null}

          <div className="pf-add-actions">
            <button type="submit" className="pf-add-save" disabled={!canUpload}>
              {submitting ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectAddModal
