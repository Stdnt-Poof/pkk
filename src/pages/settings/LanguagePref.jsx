import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: i18n — mock only, language switching is not wired up. */

const LANGUAGES = [
  { value: "en", label: "English (US)" },
  { value: "id", label: "Bahasa Indonesia" },
]

function LanguagePref() {
  const [lang, setLang] = useState("en")

  return (
    <SettingsSub backTo="/Settings/Display" backLabel="Display, and Language" title="Language">
      <form className="settings-form">
        <label className="settings-field">
          <span>Display language</span>
          <select
            className="settings-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {LANGUAGES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </form>
      <p className="settings-note">Mock — the interface language is not wired up yet. Default: English (US).</p>
    </SettingsSub>
  )
}

export default LanguagePref
