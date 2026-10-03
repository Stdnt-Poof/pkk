import { Outlet } from 'react-router-dom'
import Adminsidebar from './adminsidebar'

function HomeShell() {

  return (
    <div className="app-shell">
      <Adminsidebar />

      <div className='outlet-wrapper'>
        <Outlet />
      </div>
    </div>
  )
}

export default HomeShell
