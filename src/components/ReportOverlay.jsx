import { useEffect, useState } from "react"
import { REPORT_REASONS } from "../data/mockReports.js"
import { IconX } from "./icons"

/**
 * The shared report overlay — one dialog for flagging a post and for
 * reporting a member, so both flows feel identical.
 *
 * The preset chips cover the common cases; picking "Other" reveals a
 * required 100-character text field, stored exactly as typed.
 *
 * Contract: onSubmit(reason) resolves to `null` on success (the overlay
 * closes itself) or to an error message string on failure (shown inline
 * and the overlay stays open).
 */
function ReportOverlay({ title, onClose, onSubmit }) {
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === "Escape" && !busy) onClose()
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [onClose, busy])

  const needsText = reason === "Other"
  const ready = reason !== "" && (!needsText || details.trim() !== "")

  async function submit(e) {
    e.preventDefault()
    if (!ready || busy) return
    setBusy(true)
    setError("")
    const outcome = await onSubmit(needsText ? details.trim() : reason)
    if (outcome === null) return // success — the parent closes the overlay
    setBusy(false)
    setError(typeof outcome === "string" ? outcome : "Could not send the report. Try again.")
  }

  return (
    <div className="pf-add-backdrop" onClick={busy ? undefined : onClose}>
      <div
        className="pf-add-dialog report-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pf-add-header">
          <button type="button" className="pf-add-x" onClick={onClose} aria-label="Close" disabled={busy}>
            <IconX />
          </button>
          <h2>{title}</h2>
        </header>

        <form className="pf-add-body" onSubmit={submit}>
          <p className="dash-note">
            Pick one of the reasons below, or choose &quot;Other&quot; and describe what happened.
          </p>

          <div className="report-chips" role="group" aria-label="Report reason">
            {REPORT_REASONS.map((option) => (
              <button
                key={option}
                type="button"
                className={reason === option ? "report-chip is-active" : "report-chip"}
                aria-pressed={reason === option}
                onClick={() => {
                  setReason(option)
                  setError("")
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {needsText ? (
            <label className="job-field">
              <span>What happened?</span>
              <input
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue"
                maxLength={100}
                autoFocus
              />
              <small className="pf-add-file-name">{details.length}/100</small>
            </label>
          ) : null}

          {error ? <p className="job-form-error">{error}</p> : null}

          <div className="report-actions">
            <button type="button" className="job-btn" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="job-btn job-btn-primary" disabled={!ready || busy}>
              Submit report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportOverlay
