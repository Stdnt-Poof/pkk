import { NavLink, Outlet } from "react-router-dom"

/* Settings = 2-pane layout. Left: fixed section nav (NavLinks). Right: pane
   that swaps per path — section link list at /Settings/<Section>, sub-page
   form at /Settings/<Section>/<Page> (see App.jsx). */

const SECTIONS = [
  { to: "/Settings/YourAccount", label: "Your Account" },
  { to: "/Settings/Security", label: "Account Security" },
  { to: "/Settings/Privacy", label: "Privacy and safety" },
  { to: "/Settings/Notifications", label: "Notifications" },
  { to: "/Settings/Display", label: "Accessibility, display, and languages" },
]

function SettingsPage() {
  return (
    <div className="page-layout settings-page-layout">
      <div className="settings-navigation">
        <div className="settings-header">
          <h2>Settings</h2>
        </div>
        {SECTIONS.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            className={({ isActive }) => `setting-nav-item${isActive ? " Active" : ""}`}
          >
            <span>{section.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  )
}

export default SettingsPage
