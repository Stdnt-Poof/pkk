import { NavLink } from "react-router-dom"

/* Section index — X/Twitter-style link list. Each row is a nested route under
   /Settings/<Section>/..., rendered as its own sub-page (see App.jsx). */

function SettingsSection({ title, subtitle, links }) {
  return (
    <div className="settings-pane">
      <div className="settings-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <nav className="settings-list" aria-label={`${title} options`}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="settings-list-item">
            <span>{link.label}</span>
            <span className="settings-chevron" aria-hidden="true">›</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default SettingsSection
