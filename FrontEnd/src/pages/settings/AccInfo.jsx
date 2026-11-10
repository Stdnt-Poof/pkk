import { useEffect, useState } from "react"
import SettingsSub from "../../components/settings/SettingsSub"
import { SkeletonSettingsRows } from "../../components/skeleton"
import api from "../../lib/api"
import { useAuth } from "../../lib/auth"

/* Account details for the logged in user — first paint comes from the session
   (already fetched by AuthProvider), then GET /api/users/me refreshes the
   values the server actually holds. */

function formatJoined(createdAt) {
  if (!createdAt) return "—"

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function roleLabel(role) {
  return role === "admin" ? "Administrator" : "Member"
}

function AccInfo() {
  const { user } = useAuth()
  const [account, setAccount] = useState(user)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    api("/users/me")
      .then((payload) => {
        if (active) {
          setAccount(payload.data)
          setError("")
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message)
        }
      })

    return () => {
      active = false
    }
  }, [])

  if (!account) {
    return (
      <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Account Info">
        {error ? (
          <p className="job-form-error">{error}</p>
        ) : (
          <SkeletonSettingsRows />
        )}
      </SettingsSub>
    )
  }

  const rows = [
    { label: "Username", value: `@${account.username}` },
    { label: "Email", value: account.email },
    { label: "Role", value: roleLabel(account.role) },
    { label: "Joined", value: formatJoined(account.created_at) },
  ]

  return (
    <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Account Info">
      <p className="settings-note">Your Account Details</p>
      <ul className="settings-rows">
        {rows.map((row) => (
          <li key={row.label}>
            <span className="settings-row-label">{row.label}</span>
            <span>{row.value}</span>
          </li>
        ))}
      </ul>
      {error ? <p className="job-form-error">{error}</p> : null}
    </SettingsSub>
  )
}

export default AccInfo
