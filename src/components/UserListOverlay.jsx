import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"
import { IconX } from "./icons"

/**
 * The Followers/Following list behind the profile stats — the shared
 * backdrop/dialog shell, with rows that open the member's profile
 * (same row style as the home search dropdown).
 *
 * Contract: `path` is the list endpoint (…/followers or …/following);
 * picking a row closes the overlay and navigates to that profile.
 */
function UserListOverlay({ title, path, onClose }) {
  const navigate = useNavigate()
  const [members, setMembers] = useState(null) // null = still loading
  const [error, setError] = useState("")

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    api(path)
      .then((payload) => {
        if (!cancelled) {
          setMembers(payload?.data ?? [])
          setError("")
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Could not load members.")
        }
      })
    return () => {
      cancelled = true
    }
  }, [path])

  function openProfile(username) {
    onClose()
    navigate(`/Profile/${username}`)
  }

  return (
    <div className="pf-add-backdrop" onClick={onClose}>
      <div
        className="pf-add-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pf-add-header">
          <button type="button" className="pf-add-x" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
          <h2>{title}</h2>
        </header>

        <div className="pf-add-body">
          {error ? <p className="job-form-error">{error}</p> : null}
          {members === null && !error ? (
            <p className="settings-note">Loading…</p>
          ) : members.length === 0 && !error ? (
            <p className="settings-note">No members yet.</p>
          ) : (
            members.map((member) => (
              <button
                key={member.id}
                type="button"
                className="search-result"
                onClick={() => openProfile(member.username)}
              >
                {member.avatar_url ? (
                  <img className="search-result-avatar" src={member.avatar_url} alt="" />
                ) : (
                  <span className="search-result-avatar search-result-initial" aria-hidden="true">
                    {member.username?.charAt(0)?.toUpperCase()}
                  </span>
                )}
                <span className="search-result-name">{member.username}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default UserListOverlay
