import { Outlet } from "react-router-dom"
import Dashnav from "../components/Dashnav"

/* Admin dashboard shell — each area is its own page under /Dashboard/...
   (see App.jsx): Overview, Acceptances, Reports, CommunityPosts, HomePosts.
   Moderation pages render list views only; content is never shown in full. */

function Dashboard() {
  return (
    <div className="dash-wrap">
      <div className="dash-title-row">
        <h1>Admin Dashboard</h1>
        <p>Mock data — no backend calls</p>
      </div>
      <Dashnav />
      <Outlet />
    </div>
  )
}

export default Dashboard
