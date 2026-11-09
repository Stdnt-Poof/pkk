/**
 * Relative timestamps for the feed (matches the mock's "now / 45m / 2h").
 * Anything older than a week falls back to a readable date.
 */
export function timeAgo(value) {
  if (!value) return ""

  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ""

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))

  if (seconds < 60) return "now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`

  return new Date(then).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: new Date(then).getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  })
}
