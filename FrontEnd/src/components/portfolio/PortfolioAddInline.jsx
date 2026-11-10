import { useState } from "react"
import { isValidExternalUrl } from "./portfolioUtils"

function PortfolioAddInline() {
  const [kind, setKind] = useState("project")
  const [link, setLink] = useState("")
  const [cvName, setCvName] = useState("")
  const [error, setError] = useState("")

  function selectKind(next) {
    setKind(next)
    setError("")
  }

  function pickCv(e) {
    const file = (e.target.files || [])[0]
    if (!file) return
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name)
    if (!isPdf) {
      setError("CV must be a .pdf file and nothing else.")
      return
    }
    setError("")
    setCvName(file.name)
  }

  const linkTouched = link.trim().length > 0

  return (
    <div className="pf-add-inline">
      <div className="job-chip-row">
        <button
          type="button"
          className={kind === "project" ? "job-chip is-active" : "job-chip"}
          onClick={() => selectKind("project")}
        >
          Portfolio
        </button>
        <button
          type="button"
          className={kind === "cv" ? "job-chip is-active" : "job-chip"}
          onClick={() => selectKind("cv")}
        >
          CV (.pdf)
        </button>
      </div>

      {kind === "project" ? (
        <label className="job-field">
          <span>Portfolio link</span>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            inputMode="url"
          />
          {linkTouched && !isValidExternalUrl(link) ? (
            <p className="job-form-error">
              Must be a valid https domain (no localhost, http, or relative links).
            </p>
          ) : null}
        </label>
      ) : (
        <label className="job-field">
          <span>Upload CV (.pdf only)</span>
          <input type="file" accept="application/pdf,.pdf" onChange={pickCv} />
          {cvName ? <p className="messages-placeholder">{cvName}</p> : null}
        </label>
      )}

      {error ? <p className="job-form-error">{error}</p> : null}
    </div>
  )
}

export default PortfolioAddInline
