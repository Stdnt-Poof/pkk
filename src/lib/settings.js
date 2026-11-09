import { useCallback, useState } from "react"
import api from "./api"
import { useAuth } from "./auth"

/**
 * The logged-in account's saved settings. Values live on the session's
 * user (AuthProvider refreshes it after every save), so pages read
 * `settings` and call `save(partial)` — a PATCH the server merges.
 */
export function useSettings() {
  const { user, refreshUser } = useAuth()
  const [error, setError] = useState("")

  const save = useCallback(
    (partial) =>
      api("/users/me/settings", { method: "PATCH", body: partial })
        .then(() => refreshUser())
        .catch((requestError) =>
          setError(requestError.message || "Could not save your settings."),
        ),
    [refreshUser],
  )

  return { settings: user?.settings ?? {}, error, save }
}
