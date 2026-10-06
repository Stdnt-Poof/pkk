import { Outlet } from 'react-router-dom'
import Adminsidebar from './adminsidebar'
import Usersidebar from './usersidebar'

function HomeShell() {

  return (
    <div className="app-shell">
      <Adminsidebar />
      {/* <Usersidebar /> */}

      <div className='outlet-wrapper'>
        <Outlet />
      </div>
    </div>
  )
}

export default HomeShell
