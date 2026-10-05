import { NavLink } from "react-router-dom"
// import { useState } from 'react'

// const settingsSections = [
//   'Your account',
//   'Security and account access',
//   'Privacy and safety',
//   'Notifications',
//   'Accessibility, display, and languages',
// ]

function SettingsPage() {
  // const [isActive, setisActive] = useState('Notifications')

  return (
    <div className="page-layout settings-page-layout">
      <div className="settings-navigation">
        <h2>Settings</h2>
        <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`}>
          <span>Your Account</span>
        </NavLink>
        <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`}>
          <span>Security and account access</span>
        </NavLink>
        <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`}>
          <span>Privacy and safety</span>
        </NavLink>
        <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`}>
          <span>Notifications</span>
        </NavLink>
        <NavLink className={({isActive})=> `setting-nav-item${isActive ? ' isActive':''}`}>
          <span>Accessibility, display, and languages</span>
        </NavLink>
      </div>
    </div>
  )
}

export default SettingsPage