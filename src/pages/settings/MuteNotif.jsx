import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import Toggle from "../../components/settings/Toggle"

/* BACKEND NEEDED: PATCH /api/users/me/settings/notifications — mock only. */

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

function MuteNotif() {
  const [muteAll, setMuteAll] = useState(false)
  const [duration, setDuration] = useState("1")
  const [types, setTypes] = useState({
    mentions: true,
    replies: true,
    likes: true,
    follows: true,
    jobs: true,
    dms: true,
  })

  function setType(key) {
    return (value) => setTypes((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsSub backTo="/Settings/Notifications" backLabel="Notification" title="Mute Notification">
      <Toggle checked={muteAll} onToggle={setMuteAll} label="Mute all notifications" />
      {muteAll ? (
        <label className="settings-field">
          <span>Mute for</span>
          <select className="settings-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
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
      <p className="settings-note">Defaults: everything on, like X/Twitter. Mock — not saved.</p>
    </SettingsSub>
  )
}

export default MuteNotif
