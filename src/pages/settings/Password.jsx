import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import api from "../../lib/api"

function Password() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const ok = form.current !== "" && form.next.length >= 8 && form.next === form.confirm

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function submit(e) {
    e.preventDefault()
    setDone(false)
    setError("")
    api("/auth/password", {
      method: "POST",
      body: { current: form.current, next: form.next, confirm: form.confirm },
    })
      .then(() => {
        setDone(true)
        setForm({ current: "", next: "", confirm: "" })
      })
      .catch((err) => setError(err.message || "Could not change your password."))
  }

  return (
    <SettingsSub backTo="/Settings/Security" backLabel="Account Security" title="Change Password">
      <form className="settings-form" onSubmit={submit}>
        <label className="settings-field">
          <span>Current password</span>
          <input type="password" value={form.current} onChange={set("current")} autoComplete="current-password" required />
        </label>
        <label className="settings-field">
          <span>New password</span>
          <input type="password" value={form.next} onChange={set("next")} autoComplete="new-password" required />
        </label>
        <label className="settings-field">
          <span>Confirm new password</span>
          <input type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" required />
        </label>
        <p className="settings-note">At least 8 characters.</p>
        <button className="settings-btn" type="submit" disabled={!ok}>
          Save password
        </button>
        {done ? (
          <p className="settings-note">Your password has been updated.</p>
        ) : null}
        {error ? <p className="job-form-error">{error}</p> : null}
      </form>
    </SettingsSub>
  )
}

export default Password
