import { useEffect, useMemo, useState } from "react"
import {
  downloadUrl,
  ensurePdfFilename,
  isValidExternalUrl,
  makePlaceholderPdfBlob,
} from "./portfolioUtils"

function PortfolioViewer({ item, onClose }) {
  const [linkError, setLinkError] = useState("")

  const cvObjectUrl = useMemo(() => {
    if (item.kind !== "cv") return ""
    if (item.fileUrl) return item.fileUrl
    return URL.createObjectURL(makePlaceholderPdfBlob(item.title))
  }, [item])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    return () => {
      if (cvObjectUrl.startsWith("blob:") && !item.fileUrl) URL.revokeObjectURL(cvObjectUrl)
    }
  }, [cvObjectUrl, item.fileUrl])

  function handleOpenExternal() {
    if (!isValidExternalUrl(item.externalUrl)) {
      setLinkError("This link is not a valid https domain (localhost / http / relative links are blocked).")
      return
    }
    window.open(item.externalUrl, "_blank", "noopener,noreferrer")
  }

  function handleDownload() {
    if (item.kind === "cv") {
      downloadUrl(cvObjectUrl, ensurePdfFilename(item.fileName || item.title))
      return
    }
    const first = item.images[0]
    if (first) {
      const name = `${item.title.replace(/[^\w\- ]+/g, "").trim() || "portfolio"}-slide-1.jpg`
      downloadUrl(first, name)
    }
  }

  return (
    <div className="job-modal-backdrop" onClick={onClose}>
      <div
        className="job-modal pf-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="job-modal-header">
          <h2>{item.title}</h2>
          <button type="button" className="job-btn" onClick={onClose}>
            Close
          </button>
        </header>

        {item.description ? <p className="job-detail-desc">{item.description}</p> : null}

        {item.openMode === "external" ? (
          <div className="pf-external-box">
            <p className="messages-placeholder">This item opens in a separate browser window.</p>
            <p className="pf-external-url">{item.externalUrl || "(no link set)"}</p>
            {linkError ? <p className="job-form-error">{linkError}</p> : null}
            <button type="button" className="job-btn job-btn-primary" onClick={handleOpenExternal}>
              Open link ↗
            </button>
          </div>
        ) : item.kind === "cv" ? (
          <div className="pf-strip">
            <iframe className="pf-pdf" title={`${item.title} preview`} src={cvObjectUrl} />
          </div>
        ) : (
          <div className="pf-strip" aria-label="Slides in a long strip">
            {item.images.map((src, i) => (
              <img key={i} className="pf-strip-img no-drag" src={src} alt={`${item.title} slide ${i + 1}`} />
            ))}
          </div>
        )}

        <div className="job-card-actions">
          {item.openMode !== "external" ? (
            <button type="button" className="job-btn job-btn-primary" onClick={handleDownload}>
              {item.kind === "cv" ? "Download .pdf" : "Download"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PortfolioViewer
