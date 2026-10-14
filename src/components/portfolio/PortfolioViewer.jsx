import { useEffect, useMemo } from "react"
import { downloadUrl, ensurePdfFilename, makePlaceholderPdfBlob } from "./portfolioUtils"

// Preview is CV-only. Portfolio items never reach this viewer —
// they open directly in a new browser tab from the list.
function PortfolioViewer({ item, onClose }) {
  const cvObjectUrl = useMemo(() => {
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

  function handleDownload() {
    downloadUrl(cvObjectUrl, ensurePdfFilename(item.fileName || item.title))
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

        <div className="pf-strip">
          <iframe className="pf-pdf" title={`${item.title} preview`} src={cvObjectUrl} />
        </div>

        <div className="job-card-actions">
          <button type="button" className="job-btn job-btn-primary" onClick={handleDownload}>
            Download .pdf
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioViewer
