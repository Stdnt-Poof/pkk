import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: PATCH /api/users/me/settings/profileVisibility — mock only. */

const OPTIONS = [
  { id: "everyone", label: "Everyone" },
  { id: "followers", label: "Followers only" },
  { id: "onlyyou", label: "Only you" },
]

function ProfileVisibility() {
  const [vis, setVis] = useState("everyone")

  return (
    <SettingsSub backTo="/Settings/Privacy" backLabel="Privacy and Safety" title="Who can see your profile">
      <div className="settings-radios" role="radiogroup" aria-label="Profile visibility">
        {OPTIONS.map((option) => (
          <label key={option.id} className="settings-radio">
            <input
              type="radio"
              name="profile-visibility"
              checked={vis === option.id}
              onChange={() => setVis(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <p className="settings-note">Default: Everyone (public, like X/Twitter). Mock — not saved.</p>
    </SettingsSub>
  )
}

export default ProfileVisibility
