import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import { useSettings } from "../../lib/settings"

const OPTIONS = [
  { id: "everyone", label: "Everyone" },
  { id: "followers", label: "Followers only" },
  { id: "onlyyou", label: "Only you" },
]

function PostsVisibility() {
  const { settings, error, save } = useSettings()
  const [vis, setVis] = useState(() => settings.posts_visibility ?? "everyone")

  function pick(value) {
    setVis(value)
    save({ posts_visibility: value })
  }

  return (
    <SettingsSub backTo="/Settings/Privacy" backLabel="Privacy and Safety" title="Your Posts">
      <div className="settings-radios" role="radiogroup" aria-label="Post visibility">
        {OPTIONS.map((option) => (
          <label key={option.id} className="settings-radio">
            <input
              type="radio"
              name="your-posts-visibility"
              checked={vis === option.id}
              onChange={() => pick(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? <p className="job-form-error">{error}</p> : null}
    </SettingsSub>
  )
}

export default PostsVisibility
