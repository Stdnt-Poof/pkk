import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import Toggle from "../../components/settings/Toggle"
import Switch from "../../components/switch"
import { useSettings } from "../../lib/settings"

/* Theme stays a local (instant) preference; reduce-motion is saved to
   the account so it follows the user across devices. */

function Appearance() {
  const { settings, error, save } = useSettings()
  const [reduceMotion, setReduceMotion] = useState(() => settings.reduce_motion ?? false)

  function onReduceMotion(value) {
    setReduceMotion(value)
    save({ reduce_motion: value })
  }

  return (
    <SettingsSub backTo="/Settings/Display" backLabel="Display, and Language" title="Display">
      <div className="settings-row">
        <span className="settings-row-label">Theme</span>
        <Switch />
      </div>
      <Toggle
        checked={reduceMotion}
        onToggle={onReduceMotion}
        label="Reduce motion (animations)"
      />
      {error ? <p className="job-form-error">{error}</p> : null}
    </SettingsSub>
  )
}

export default Appearance
