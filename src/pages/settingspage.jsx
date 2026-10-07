import { useState } from "react"
import YourAcc from "../components/YourAcc"
import Privacy from "../components/privacy"
import Notif from "../components/notif"
import Language from "../components/language"
import Secure from "../components/secure"

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
          <span>Account Security</span>
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
       {idk == 'Privacy' ? <Privacy /> : null}
       {idk == 'Secure' ? <Secure /> : null}
       {idk == 'Notif' ? <Notif /> : null}
       {idk == 'Language' ? <Language /> : null}
    </div>
  )
}

export default SettingsPage