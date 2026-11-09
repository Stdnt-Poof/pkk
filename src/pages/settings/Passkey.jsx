import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: passkey registration (WebAuthn) — mock list only. */

function Passkey() {
  const [passkeys, setPasskeys] = useState([])

  function addPasskey() {
    setPasskeys((prev) => [...prev, { id: Date.now(), name: "This device (mock)" }])
  }

  return (
    <SettingsSub backTo="/Settings/Security" backLabel="Account Security" title="Manage Passkey">
      {passkeys.length === 0 ? (
        <p className="settings-note">No passkeys on this account yet.</p>
      ) : (
        <ul className="settings-rows">
          {passkeys.map((key) => (
            <li key={key.id}>
              <span className="settings-row-label">{key.name}</span>
              <span className="dash-badge">Mock</span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="settings-btn" onClick={addPasskey}>
        Add passkey
      </button>
    </SettingsSub>
  )
}

export default Passkey
