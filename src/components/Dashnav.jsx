import { NavLink } from "react-router-dom"

const NAV_ITEMS = [
  { to: "/Dashboard", label: "Overview", end: true },
  { to: "/Dashboard/Reports", label: "Reports" },
  { to: "/Dashboard/HireServices", label: "Hire Services" },
]

function Dashnav() {
  return (
    <nav className="dash-nav" aria-label="Dashboard sections">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `dash-nav-item${isActive ? " is-active" : ""}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Dashnav
