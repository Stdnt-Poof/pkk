import { useEffect, useRef, useState } from "react"
import api from "../lib/api"
import defaultPfp from "../assets/Default.jpg"
import { useAuth } from "../lib/auth"
import { IconX } from "./icons"

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]
const COVER_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]
const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const MAX_COVER_BYTES = 50 * 1024 * 1024

/**
 * Overlay used to edit the profile: bio, profile picture and background.
 *
 * Uploading a new file replaces the stored one; Remove deletes it so the
 * page falls back to the defaults (Default.jpg / gray).
 */
function EditProfileModal({ onClose }) {
  const { user, refreshUser } = useAuth()

  const [bio, setBio] = useState(user?.bio || "")
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [coverFile, setCoverFile] = useState(null)
  const [coverUrl, setCoverUrl] = useState("")
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [removeCover, setRemoveCover] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const avatarUrlRef = useRef(null)
  const coverUrlRef = useRef(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    return () => {
      if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current)
      if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current)
    }
  }, [])

  const hasAvatar = Boolean(user?.avatar_url) && !removeAvatar
  const hasCover = Boolean(user?.cover_url) && !removeCover

  const avatarPreview = avatarFile
    ? avatarUrl
    : removeAvatar
      ? defaultPfp
      : (user?.avatar_url || defaultPfp)

  function pickAvatar(e) {
    const file = (e.target.files || [])[0]
    if (!file) return

    if (!AVATAR_TYPES.includes(file.type)) {
      setError("The profile picture must be a JPG, PNG or WebP image.")
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError("The profile picture must be 2 MB or smaller.")
      return
    }

    setError("")

    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current)
    avatarUrlRef.current = URL.createObjectURL(file)

    setAvatarFile(file)
    setAvatarUrl(avatarUrlRef.current)
    setRemoveAvatar(false)
  }

  function pickCover(e) {
    const file = (e.target.files || [])[0]
    if (!file) return

    if (!COVER_TYPES.includes(file.type)) {
      setError("The background must be a JPG, PNG, WebP, MP4 or WebM file.")
      return
    }
    if (file.size > MAX_COVER_BYTES) {
      setError("The background must be 50 MB or smaller.")
      return
    }

    setError("")

    if (coverUrlRef.current) URL.revokeObjectURL(coverUrlRef.current)
    coverUrlRef.current = URL.createObjectURL(file)

    setCoverFile(file)
    setCoverUrl(coverUrlRef.current)
    setRemoveCover(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError("")
    setSaving(true)

    try {
      const form = new FormData()
      form.append("bio", bio.trim())

      if (avatarFile) {
        form.append("avatar", avatarFile)
      } else if (removeAvatar) {
        form.append("remove_avatar", "true")
      }

      if (coverFile) {
        form.append("cover", coverFile)
      } else if (removeCover) {
        form.append("remove_cover", "true")
      }

      await api("/profile", { method: "POST", form })
      await refreshUser()
      onClose()
    } catch (saveError) {
      setError(saveError.message || "Could not save your profile.")
      setSaving(false)
    }
  }

  return (
    <div className="pf-add-backdrop" onClick={onClose}>
      <div
        className="pf-add-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pf-add-header">
          <button type="button" className="pf-add-x" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
          <h2>Edit profile</h2>
        </header>

        <form className="pf-add-body" onSubmit={handleSubmit}>
          <label className="job-field">
            <span>Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people something about you"
              maxLength={500}
              rows={3}
            />
            <small className="pf-add-file-name">{bio.length}/500</small>
          </label>

          <div className="pf-add-field">
            <span className="pf-add-label">Profile picture</span>
            <div className="ep-row">
              <img className="ep-avatar" src={avatarPreview} alt="" />
              <div className="ep-row-actions">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickAvatar} />
                {hasAvatar && !avatarFile ? (
                  <button
                    type="button"
                    className="job-btn"
                    onClick={() => {
                      setError("")
                      setRemoveAvatar(true)
                    }}
                  >
                    Remove
                  </button>
                ) : null}
                {removeAvatar ? <small className="pf-add-file-name">Removed on save</small> : null}
              </div>
            </div>
            <small className="pf-add-file-name">JPG, PNG or WebP · max 2 MB</small>
          </div>

          <div className="pf-add-field">
            <span className="pf-add-label">Background</span>
            <div className="pf-add-preview">
              {coverFile ? (
                coverFile.type.startsWith("video/") ? (
                  <video className="ep-video" src={coverUrl} muted playsInline />
                ) : (
                  <img src={coverUrl} alt="Selected background" />
                )
              ) : removeCover || !user?.cover_url ? null : user.cover_type === "video" ? (
                <video className="ep-video" src={user.cover_url} muted playsInline />
              ) : (
                <img src={user.cover_url} alt="Current background" />
              )}
            </div>
            <div className="ep-row">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                onChange={pickCover}
              />
              {hasCover && !coverFile ? (
                <button
                  type="button"
                  className="job-btn"
                  onClick={() => {
                    setError("")
                    setRemoveCover(true)
                  }}
                >
                  Remove
                </button>
              ) : null}
              {removeCover ? <small className="pf-add-file-name">Removed on save</small> : null}
            </div>
            <small className="pf-add-file-name">JPG, PNG, WebP, MP4 or WebM (max 50 MB)</small>
          </div>

          {error ? <p className="job-form-error">{error}</p> : null}

          <div className="pf-add-actions">
            <button type="button" className="job-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pf-add-save" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
