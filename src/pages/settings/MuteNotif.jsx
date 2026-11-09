import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import Toggle from "../../components/settings/Toggle"
import { useSettings } from "../../lib/settings"

const TYPE_ROWS = [
  { key: "mentions", label: "Mentions" },
  { key: "replies", label: "Replies" },
  { key: "likes", label: "Likes" },
  { key: "follows", label: "Follows" },
  { key: "jobs", label: "New job posts" },
  { key: "dms", label: "Direct messages" },
]

const DURATIONS = [
  { value: "1", label: "1 hour" },
  { value: "12", label: "12 hours" },
  { value: "24", label: "24 hours" },
  { value: "168", label: "7 days" },
]

const DEFAULT_TYPES = {
  mentions: true,
  replies: true,
  likes: true,
  follows: true,
  jobs: true,
  dms: true,
}

function MuteNotif() {
  const { settings, error, save } = useSettings()
  const [muteAll, setMuteAll] = useState(() => settings.mute_all ?? false)
  const [duration, setDuration] = useState(() => settings.mute_duration ?? "1")
  const [types, setTypes] = useState(() => ({ ...DEFAULT_TYPES, ...(settings.notif_types ?? {}) }))

  function onMute(value) {
    setMuteAll(value)
    save({ mute_all: value })
  }

  function onDuration(value) {
    setDuration(value)
    save({ mute_duration: value })
  }

  function setType(key) {
    return (value) => {
      const next = { ...types, [key]: value }
      setTypes(next)
      save({ notif_types: next })
    }
  }

  return (
    <SettingsSub backTo="/Settings/Notifications" backLabel="Notification" title="Mute Notification">
      <Toggle checked={muteAll} onToggle={onMute} label="Mute all notifications" />
      {muteAll ? (
        <label className="settings-field">
          <span>Mute for</span>
          <select
            className="settings-select"
            value={duration}
            onChange={(e) => onDuration(e.target.value)}
          >
            {DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </label>
      ) : null}

      <h3 className="settings-group-title">Notification types</h3>
      {TYPE_ROWS.map((row) => (
        <Toggle
          key={row.key}
          checked={types[row.key]}
          onToggle={setType(row.key)}
          label={row.label}
        />
      ))}
      {error ? <p className="job-form-error">{error}</p> : null}
    </SettingsSub>
  )
}

export default MuteNotif
