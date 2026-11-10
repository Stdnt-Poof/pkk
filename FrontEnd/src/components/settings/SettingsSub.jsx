import { Link } from "react-router-dom"

/* Sub-page wrapper — swaps the right settings pane in place while keeping a
   distinct path (/Settings/<Section>/<Page>) and a back link to the section. */

function SettingsSub({ backTo, backLabel, title, children }) {
  return (
    <div className="settings-pane">
      <Link className="settings-back" to={backTo}>
        <span aria-hidden="true">‹</span> {backLabel}
      </Link>
      <h2 className="settings-sub-title">{title}</h2>
      {children}
    </div>
  )
}

export default SettingsSub
