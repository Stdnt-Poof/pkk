import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import Toggle from "../../components/settings/Toggle"
import { useSettings } from "../../lib/settings"

function ChatsPrivacy() {
  const { settings, error, save } = useSettings()
  const [state, setState] = useState(() => ({
    requests: settings.chat_requests ?? true,
    receipts: settings.chat_receipts ?? true,
  }))

  function set(field) {
    return (value) => {
      setState((prev) => ({ ...prev, [field]: value }))
      save(field === "requests" ? { chat_requests: value } : { chat_receipts: value })
    }
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
      {error ? <p className="job-form-error">{error}</p> : null}
    </SettingsSub>
  )
}

export default ChatsPrivacy
