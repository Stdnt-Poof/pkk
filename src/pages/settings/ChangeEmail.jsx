import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: POST /api/users/me/email — mock only, nothing is sent. */

const CURRENT_EMAIL = "shlofte@mail.com"

function ChangeEmail() {
  const [next, setNext] = useState("")
  const [sent, setSent] = useState(false)
  const valid = next.includes("@") && next.trim() !== CURRENT_EMAIL

  function submit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Change Your Email">
      <form className="settings-form" onSubmit={submit}>
        <label className="settings-field">
          <span>Current email</span>
          <input value={CURRENT_EMAIL} disabled readOnly />
        </label>
        <label className="settings-field">
          <span>New email</span>
          <input
            type="email"
            placeholder="new@mail.com"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
          />
        </label>
        <button className="settings-btn" type="submit" disabled={!valid}>
          Send verification code
        </button>
        {sent ? (
          <p className="settings-note">
            Mock — a verification code would be sent to {next}. No email actually goes out.
          </p>
        ) : null}
      </form>
    </SettingsSub>
  )
}

export default ChangeEmail
