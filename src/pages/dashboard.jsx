import { Outlet } from "react-router-dom"
import Dashnav from "../components/Dashnav"
import { useAuth } from "../lib/auth"

/* Admin dashboard shell — each area is its own page under /Dashboard/...
   (see App.jsx): Overview, Reports, Hire Services. Moderation pages
   render list views only; content is never shown in full. */

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dash-wrap">
      <div className="dash-title-row">
        <h1>Admin Dashboard</h1>
      </div>
      <p className="dash-welcome">Welcome {user?.username}!</p>
      <Dashnav />
      <Outlet />
    </div>
  )
}

export default Dashboard
