import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import { useSettings } from "../../lib/settings"

/* The chosen language is saved to the account and restored on login.
   Translating the interface itself is a separate (i18n) task. */

const LANGUAGES = [
  { value: "en", label: "English (US)" },
  { value: "id", label: "Bahasa Indonesia" },
]

function LanguagePref() {
  const { settings, error, save } = useSettings()
  const [lang, setLang] = useState(() => settings.language ?? "en")

  function pick(value) {
    setLang(value)
    save({ language: value })
  }

  return (
    <SettingsSub backTo="/Settings/Display" backLabel="Display, and Language" title="Language">
      <form className="settings-form">
        <label className="settings-field">
          <span>Display language</span>
          <select
            className="settings-select"
            value={lang}
            onChange={(e) => pick(e.target.value)}
          >
            {LANGUAGES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </form>
      {error ? <p className="job-form-error">{error}</p> : null}
    </SettingsSub>
  )
}

export default LanguagePref
