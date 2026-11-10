import { useEffect, useState } from "react"
import api from "../../lib/api"
import { downloadUrl, ensurePdfFilename } from "./portfolioUtils"
import { SkeletonPreview } from "../skeleton"

// Preview is CV-only. Portfolio items never reach this viewer —
// they open directly in a new browser tab from the list.
//
// The PDF needs the bearer token, so it is fetched as bytes and handed to the
// iframe/download as a blob URL — no public file path is ever exposed.
function PortfolioViewer({ item, onClose }) {
  const [fileUrl, setFileUrl] = useState(null)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    let active = true
    let objectUrl = null

    async function loadPdf() {
      setLoadError("")

      try {
        const blob = await api(`/portfolios/${item.id}/file`, { raw: true })

        if (!active) return

        objectUrl = URL.createObjectURL(blob)
        setFileUrl(objectUrl)
      } catch (error) {
        if (active) {
          setLoadError(error.message || "Could not load the PDF.")
        }
      }
    }

    loadPdf()

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [item.id])

  function handleDownload() {
    if (!fileUrl) return
    downloadUrl(fileUrl, ensurePdfFilename(item.file_name || item.title))
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

        <div className="pf-strip">
          {loadError ? (
            <p className="job-form-error">{loadError}</p>
          ) : fileUrl ? (
            <iframe className="pf-pdf" title={`${item.title} preview`} src={fileUrl} />
          ) : (
            <SkeletonPreview />
          )}
        </div>

        <div className="job-card-actions">
          <button
            type="button"
            className="job-btn job-btn-primary"
            onClick={handleDownload}
            disabled={!fileUrl}
          >
            Download .pdf
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioViewer
