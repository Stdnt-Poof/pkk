import { useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: DELETE /api/users/me — mock only, nothing is deleted. */

function DeleteAcc() {
  const [confirm, setConfirm] = useState("")
  const [done, setDone] = useState(false)
  const ready = confirm.trim() === "DELETE"

  function submit(e) {
    e.preventDefault()
    setDone(true)
  }

  return (
    <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Delete Your Account">
      <form className="settings-form" onSubmit={submit}>
        <div className="settings-danger">
          <strong>Delete your account permanently?</strong>
          <p className="settings-note">
            This is permanent. Your posts, portfolios, job applications, and messages are removed.
          </p>
          <label className="settings-field">
            <span>Type DELETE to confirm</span>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="DELETE"
            />
          </label>
          <button type="submit" className="settings-btn-danger" disabled={!ready}>
            Delete Account
          </button>
          {done ? (
            <p className="settings-note">Mock — the request was recorded locally, nothing real happened.</p>
          ) : null}
        </div>
      </form>
    </SettingsSub>
  )
}

export default DeleteAcc
