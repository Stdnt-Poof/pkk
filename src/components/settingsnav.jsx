import { NavLink } from "react-router-dom";

function SettingsNav() {
    return (
        <div className="settings-navigation">
            <h2>Settings</h2>
            <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`} to="/Your_Account">
              <span>Your Account</span>
            </NavLink>
            <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`} to="/Security">
              <span>Security and account access</span>
            </NavLink>
            <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`} to="/Privacy">
              <span>Privacy and safety</span>
            </NavLink>
            <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`} to="/Notification">
              <span>Notifications</span>
            </NavLink>
            <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`} to="/Accessibilty">
              <span>Accessibility, display, and languages</span>
            </NavLink>
        </div>
    )
}