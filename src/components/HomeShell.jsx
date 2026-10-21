import { Outlet } from 'react-router-dom'
import Adminsidebar from './adminsidebar'
import Usersidebar from './usersidebar'
import { useAuth } from '../lib/auth'

function HomeShell() {
  const { isAdmin } = useAuth()

  return (
    <div className="app-shell">
      {isAdmin ? <Adminsidebar /> : <Usersidebar />}

      <div className='outlet-wrapper'>
        <Outlet />
      </div>
    </div>
  )
}

export default HomeShell
