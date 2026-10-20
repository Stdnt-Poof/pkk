import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import Toggle from "../../components/settings/Toggle"
import Switch from "../../components/switch"

/* BACKEND NEEDED: accessibility prefs — only Theme is real (localStorage). */

function Appearance() {
  const [reduceMotion, setReduceMotion] = useState(false)

  return (
    <SettingsSub backTo="/Settings/Display" backLabel="Display, and Language" title="Display">
      <div className="settings-row">
        <span className="settings-row-label">Theme</span>
        <Switch />
      </div>
      <Toggle
        checked={reduceMotion}
        onToggle={setReduceMotion}
        label="Reduce motion (animations)"
      />
      <p className="settings-note">Theme applies instantly — dark is the default. Mock — not saved.</p>
    </SettingsSub>
  )
}

export default Appearance
