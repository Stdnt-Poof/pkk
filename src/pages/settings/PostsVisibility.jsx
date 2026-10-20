import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: PATCH /api/users/me/settings/postsVisibility — mock only. */

const OPTIONS = [
  { id: "everyone", label: "Everyone" },
  { id: "followers", label: "Followers only" },
  { id: "onlyyou", label: "Only you" },
]

function PostsVisibility() {
  const [vis, setVis] = useState("everyone")

  return (
    <SettingsSub backTo="/Settings/Privacy" backLabel="Privacy and Safety" title="Your Posts">
      <div className="settings-radios" role="radiogroup" aria-label="Post visibility">
        {OPTIONS.map((option) => (
          <label key={option.id} className="settings-radio">
            <input
              type="radio"
              name="your-posts-visibility"
              checked={vis === option.id}
              onChange={() => setVis(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <p className="settings-note">Default: Everyone. Your post is visible where it is shared. Mock — not saved.</p>
    </SettingsSub>
  )
}

export default PostsVisibility
