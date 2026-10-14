import { useEffect, useState } from "react"

function PortfolioAddModal({ onClose }) {
  const [title, setTitle] = useState("")

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

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
          {/* No backend yet — Save intentionally does nothing for now */}
          <button type="button" className="pf-add-save" onClick={() => {}}>
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
        </div>
      </div>
    </div>
  )
}

export default PortfolioAddModal
