import { useEffect, useRef, useState } from "react"
import api from "../../lib/api"
import { isValidExternalUrl } from "./portfolioUtils"
import { IconX } from "../icons"

const KINDS = [
  { value: "portfolio", label: "Portfolio link" },
  { value: "cv", label: "CV (PDF)" },
]

/**
 * Overlay used to add a portfolio item.
 *
 * Order: Title → link or file chooser → preview box → choose preview photo →
 * Upload. A CV can be uploaded without a photo (the backend assigns the
 * default preview); a portfolio link needs one.
 */
function PortfolioAddModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("")
  const [kind, setKind] = useState("portfolio")
  const [link, setLink] = useState("")
  const [cvFile, setCvFile] = useState(null)
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

  const isCv = kind === "cv"
  const cvIsPdf = cvFile === null || cvFile.type === "application/pdf" || /\.pdf$/i.test(cvFile.name)
  const titleOk = title.trim().length >= 3
  const linkOk = isCv || isValidExternalUrl(link)
  const fileOk = !isCv || (cvFile !== null && cvIsPdf)
  const previewOk = isCv || previewFile !== null
  const canUpload = titleOk && linkOk && fileOk && previewOk && !submitting

  function selectKind(next) {
    setKind(next)
    setError("")
  }

  function pickCv(e) {
    const file = (e.target.files || [])[0]
    if (!file) return

    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name)
    if (!isPdf) {
      setCvFile(null)
      setError("The CV must be a .pdf file and nothing else.")
      return
    }

    setError("")
    setCvFile(file)
  }

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
      setError("Add a title, a valid link or CV file, and a preview photo first.")
      return
    }

    setError("")
    setSubmitting(true)

    try {
      const form = new FormData()
      form.append("title", title.trim())
      form.append("kind", kind)

      if (isCv) {
        form.append("file", cvFile)
      } else {
        form.append("external_url", link.trim())
      }

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
        aria-label="Add to portfolio"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pf-add-header">
          <button type="button" className="pf-add-x" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
          <h2>Add to portfolio</h2>
        </header>

        <form className="pf-add-body" onSubmit={handleSubmit}>
          <label className="job-field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Dashboard redesign"
              maxLength={120}
              required
            />
          </label>

          <div className="job-chip-row" role="group" aria-label="Portfolio item type">
            {KINDS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={kind === option.value ? "job-chip is-active" : "job-chip"}
                onClick={() => selectKind(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {isCv ? (
            <label className="job-field">
              <span>Link to the CV (file)</span>
              <input type="file" accept="application/pdf,.pdf" onChange={pickCv} />
              {cvFile ? <small className="pf-add-file-name">{cvFile.name}</small> : null}
            </label>
          ) : (
            <label className="job-field">
              <span>Link to the portfolio</span>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/my-project"
                maxLength={500}
              />
            </label>
          )}

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
            <span>
              Choose preview photo
              {isCv ? " (optional — a default is used for CVs)" : " (required)"}
            </span>
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

export default PortfolioAddModal
