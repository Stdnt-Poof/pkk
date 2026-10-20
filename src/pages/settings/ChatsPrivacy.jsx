import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import Toggle from "../../components/settings/Toggle"

/* BACKEND NEEDED: PATCH /api/users/me/settings/chats — mock only. */

function ChatsPrivacy() {
  const [state, setState] = useState({ requests: true, receipts: true })

  function set(field) {
    return (value) => setState((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <SettingsSub backTo="/Settings/Privacy" backLabel="Privacy and Safety" title="Chats">
      <Toggle
        checked={state.requests}
        onToggle={set("requests")}
        label="Allow message requests from everyone"
      />
      <Toggle
        checked={state.receipts}
        onToggle={set("receipts")}
        label="Show read receipts"
      />
      <p className="settings-note">Defaults are on, like X/Twitter. Mock — not saved.</p>
    </SettingsSub>
  )
}

export default ChatsPrivacy
