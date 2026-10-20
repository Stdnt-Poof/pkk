import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: POST /api/auth/password — mock only. */

function Password() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })
  const [done, setDone] = useState(false)
  const ok = form.current !== "" && form.next.length >= 8 && form.next === form.confirm

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function submit(e) {
    e.preventDefault()
    setDone(true)
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
          <p className="settings-note">Mock — the password would be changed now. Nothing is stored.</p>
        ) : null}
      </form>
    </SettingsSub>
  )
}

export default Password
