import { useState } from "react"
import YourAcc from "../components/YourAcc"

function SettingsPage() {
  const [idk, setIdk] = useState('YourAcc')

  return (
    <div className="page-layout settings-page-layout">
      <div className="settings-navigation">
        <div className="settings-header">
          <h2>Settings</h2>
        </div>
        <button type="button" className={idk == 'YourAcc' ? 'setting-nav-item Active' : 'setting-nav-item'} onClick={() => setIdk('YourAcc')}>
          <span>Your Account</span>
        </button>
        <button type="button" className={idk == 'Secure' ? 'setting-nav-item Active' : 'setting-nav-item'} onClick={() => setIdk('Secure')}>
          <span>Security and account access</span>
        </button>
        <button type="button" className={idk == 'Privacy' ? 'setting-nav-item Active' : 'setting-nav-item'} onClick={() => setIdk('Privacy')}>
          <span>Privacy and safety</span>
        </button>
        <button type="button" className={idk == 'Notif' ? 'setting-nav-item Active' : 'setting-nav-item'} onClick={() => setIdk('Notif')}>
          <span>Notifications</span>
        </button>
        <button type="button" className={idk == 'Language' ? 'setting-nav-item Active' : 'setting-nav-item'} onClick={() => setIdk('Language')}>
          <span>Accessibility, display, and languages</span>
        </button>
      </div>

       {idk == 'YourAcc' ? <YourAcc /> : null}
    </div>
  )
}

export default SettingsPage