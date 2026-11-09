import { useEffect } from "react"
import { IconX } from "./icons"

/**
 * The shared yes/no confirmation — the in-app replacement for
 * window.confirm ("localhost says…"), sharing the report overlay's
 * backdrop/dialog shell so both flows look identical.
 *
 * Contract: onConfirm() runs when the member confirms (the caller
 * closes the overlay), onClose() cancels via the X, backdrop or Escape.
 */
function ConfirmOverlay({ title, message, confirmLabel = "Delete", onClose, onConfirm }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [onClose])

  return (
    <div className="pf-add-backdrop" onClick={onClose}>
      <div
        className="pf-add-dialog report-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pf-add-header">
          <button type="button" className="pf-add-x" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
          <h2>{title}</h2>
        </header>

        <div className="pf-add-body">
          <p className="dash-note">{message}</p>

          <div className="report-actions">
            <button type="button" className="job-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="job-btn job-btn-danger" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOverlay
