import { Outlet } from 'react-router-dom'
import Adminsidebar from './adminsidebar'

function HomeShell() {

  return (
    <div className="app-shell">
      <Adminsidebar />

      <Outlet />
    </div>
  )
}

export default HomeShell
