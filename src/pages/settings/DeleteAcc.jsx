import { useEffect, useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import api from "../../lib/api"
import { useAuth } from "../../lib/auth"

/* Real deletion: DELETE /api/users/me removes the account and everything
   that hangs off it, then the session is dropped and the login page opens. */

function DeleteAcc() {
  const [asking, setAsking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const { logout } = useAuth()

  // Escape closes the confirmation window and leaves everything as it was.
  useEffect(() => {
    if (!asking || deleting) return undefined

    function onKey(e) {
      if (e.key === "Escape") setAsking(false)
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [asking, deleting])

  function confirmDelete() {
    if (deleting) return
    setDeleting(true)
    setError("")

    api("/users/me", { method: "DELETE" })
      .then(() => logout())
      .catch((err) => {
        setDeleting(false)
        setError(err.message || "Could not delete your account.")
      })
  }

  return (
    <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Delete Your Account">
      <div className="settings-form">
        <div className="settings-danger">
          <strong>Delete your account permanently?</strong>
          <p className="settings-note">
            This action is permanent, we cannot recover your account after deletion.
          </p>
          <button type="button" className="settings-btn-danger" onClick={() => setAsking(true)}>
            Delete Account
          </button>
        </div>
      </div>

      {asking ? (
        <div className="pf-add-backdrop" onClick={deleting ? undefined : () => setAsking(false)}>
          <div
            className="pf-add-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm account deletion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-add-body">
              <strong>Delete your account permanently?</strong>
              <p className="settings-note">Are you sure you want to delete your account?</p>
              <p className="settings-note">
                This action is permanent, we cannot recover your account after deletion.
              </p>
              {error ? <p className="job-form-error">{error}</p> : null}
              <div className="pf-add-actions pf-add-actions-split">
                <button
                  type="button"
                  className="job-btn"
                  onClick={() => setAsking(false)}
                  disabled={deleting}
                >
                  nvm i change my mind
                </button>
                <button
                  type="button"
                  className="job-btn job-btn-danger"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </SettingsSub>
  )
}

export default DeleteAcc
