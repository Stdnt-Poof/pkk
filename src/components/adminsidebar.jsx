import { NavLink, Link } from "react-router-dom"
import Switch from "./switch"
import Icon from "./Icon"
import { useAuth } from "../lib/auth"

function Adminsidebar() {
    const { logout } = useAuth()
    return (
        <>
        <aside className="left-sidebar" idkname>
            {/* Replace this temporary mark with the real logo */}
            <NavLink className="brand" to="/Home">
              <span className="brand-mark" />
            </NavLink>

            <nav className="sidebar-navigation">
              <NavLink className={({ isActive })=> `sidebar-item${isActive ? ' isActive' : ''}`} to="/Home">
                  <Icon name="home" />
                  <span>Home</span>
                </NavLink>
                <NavLink className={({isActive})=> `sidebar-item${isActive ? ' isActive':''}`} to="/Profile">
                  <Icon name="profile" />
                  <span>Profile</span>
                </NavLink>
                <NavLink className={({isActive})=> `sidebar-item${isActive ? ' isActive':''}`} to="/Messages">
                  <Icon name="messages" />
                  <span>Messages</span>
                </NavLink>
                <NavLink className={({isActive})=> `sidebar-item${isActive ? ' isActive':''}`} to="/Community">
                  <Icon name="community" />
                  <span>Community</span>
                </NavLink>
                <NavLink className={({isActive})=> `sidebar-item${isActive ? ' isActive':''}`} to="/Settings">
                  <Icon name="settings" />
                  <span>Settings</span>
                </NavLink>
                <NavLink className={({isActive})=> `sidebar-item${isActive ? ' isActive':''}`} to="/Dashboard">
                  <Icon name="dashboard" />
                  <span>Dashboard</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
              <span className="sidebar-item-switch">
                <Switch />
              </span>
              <hr />
              <span className='sidebar-footer-item'>
                  <p><Link to="/Login" onClick={() => { void logout() }}>Log Out!</Link></p>
              </span>
            </div>
          </aside>
        </>
    )
}

export default Adminsidebar