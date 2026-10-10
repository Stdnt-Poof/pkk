import { useEffect, useState } from "react"
import { isValidExternalUrl } from "./portfolioUtils"

function PortfolioAddModal({ onClose, onAdd }) {
  const [title, setTitle] = useState("")
  const [kind, setKind] = useState("project")
  const [images, setImages] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [openMode, setOpenMode] = useState("slideshow")
  const [externalUrl, setExternalUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
      if (cvFile) URL.revokeObjectURL(cvFile.url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickImages(e) {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"))
    if (files.length === 0) return
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({ url: URL.createObjectURL(file), name: file.name })),
    ])
  }

  function pickCv(e) {
    const file = (e.target.files || [])[0]
    if (!file) return
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name)
    if (!isPdf) {
      setError("CV must be a .pdf file and nothing else.")
      return
    }
    if (cvFile) URL.revokeObjectURL(cvFile.url)
    setError("")
    setCvFile({ url: URL.createObjectURL(file), name: file.name })
  }

  function handleSave() {
    if (!title.trim()) {
      setError("Give this item a title first.")
      return
    }
    if (kind === "project" && images.length === 0) {
      setError("Add at least one portfolio image.")
      return
    }
    if (kind === "cv" && !cvFile) {
      setError("Pick a CV .pdf file first.")
      return
    }
    if (openMode === "external" && !isValidExternalUrl(externalUrl)) {
      setError("External links must be valid https domains (no localhost, http, or relative links).")
      return
    }
    onAdd({
      id: `pf-user-${Date.now()}`,
      kind: kind === "cv" ? "cv" : openMode === "external" ? "external" : "project",
      title: title.trim(),
      preview: kind === "cv" ? "" : images[0].url,
      images: kind === "cv" ? [] : images.map((img) => img.url),
      description: "",
      tools: [],
      openMode,
      externalUrl: openMode === "external" ? externalUrl.trim() : "",
      likes: 0,
      views: 0,
      fileUrl: kind === "cv" ? cvFile.url : "",
      fileName: kind === "cv" ? cvFile.name : "",
    })
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
            ✕
          </button>
          <h2>Add to portfolio</h2>
          <button type="button" className="pf-add-save" onClick={handleSave}>
            Save
          </button>
        </header>

        <div className="pf-add-body">
          <label className="job-field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Dashboard redesign"
              maxLength={80}
            />
          </label>

          <div className="job-field">
            <span>Type (portfolio or CV only)</span>
            <div className="job-chip-row">
              <button
                type="button"
                className={kind === "project" ? "job-chip is-active" : "job-chip"}
                onClick={() => setKind("project")}
              >
                Portfolio
              </button>
              <button
                type="button"
                className={kind === "cv" ? "job-chip is-active" : "job-chip"}
                onClick={() => setKind("cv")}
              >
                CV (.pdf)
              </button>
            </div>
          </div>

          {kind === "project" ? (
            <div className="job-field">
              <span>Slides (images)</span>
              <input type="file" accept="image/*" multiple onChange={pickImages} />
              {images.length > 0 ? (
                <div className="pf-add-thumbs">
                  {images.map((img, i) => (
                    <img key={i} src={img.url} alt="" />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="job-field">
              <span>CV file (.pdf only)</span>
              <input type="file" accept="application/pdf,.pdf" onChange={pickCv} />
              {cvFile ? <p className="messages-placeholder">{cvFile.name} — downloads as .pdf</p> : null}
            </div>
          )}

          <div className="job-field">
            <span>When someone clicks this (owner sets it)</span>
            <div className="job-chip-row">
              <button
                type="button"
                className={openMode === "slideshow" ? "job-chip is-active" : "job-chip"}
                onClick={() => setOpenMode("slideshow")}
              >
                In-app preview
              </button>
              <button
                type="button"
                className={openMode === "external" ? "job-chip is-active" : "job-chip"}
                onClick={() => setOpenMode("external")}
              >
                New browser tab
              </button>
            </div>
          </div>

          {openMode === "external" ? (
            <label className="job-field">
              <span>External https URL (valid domain only)</span>
              <input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                inputMode="url"
              />
            </label>
          ) : null}

          {error ? <p className="job-form-error">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default PortfolioAddModal
