import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import { useAuth } from "../../lib/auth"

/* Current email comes from the logged in account. BACKEND NEEDED for the
   submit: POST /api/users/me/email — the form below is still a mock. */

function ChangeEmail() {
  const { user } = useAuth()
  const currentEmail = user?.email ?? ""
  const [next, setNext] = useState("")
  const valid = next.includes("@") && next.trim() !== "" && next.trim() !== currentEmail

  function submit(e) {
    e.preventDefault()
  }

  return (
    <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Change Your Email">
      <form className="settings-form" onSubmit={submit}>
        <label className="settings-field">
          <span>Current email</span>
          <input value={currentEmail} disabled readOnly />
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
      </form>
    </SettingsSub>
  )
}

export default ChangeEmail
