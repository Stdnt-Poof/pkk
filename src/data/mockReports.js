/* ============================================================================
   BACKEND NEEDED — FE-only mock, replace with real API (wrapped section START)
   ----------------------------------------------------------------------------
   Admin report queue. A user reports a post/comment/user with a reason; the
   admin must see the reason + a short reporter note, then act on it.
   - GET    /api/admin/reports            -> replaces MOCK_REPORTS
   - POST   /api/admin/reports/:id/dismiss|warn|remove  -> replaces act()
   Reason set is fixed: spam, harassment, sexual content, scam, impersonation,
   copyright, other.
   ============================================================================ */
export const REPORT_REASONS = [
  "Spam",
  "Harassment",
  "Sexual content",
  "Scam",
  "Impersonation",
  "Copyright",
  "Other",
]

export const MOCK_REPORTS = [
  { id: "rep-1", type: "User", target: "@john", reason: "Sexual content", details: "Sent explicit DMs after a job intro.", reporter: "@kate", time: "2m", status: "Pending" },
  { id: "rep-2", type: "Post", target: "@alex — UI redesign thread", reason: "Spam", details: "Same promo link posted 6 times in a row.", reporter: "@mika", time: "12m", status: "Pending" },
  { id: "rep-3", type: "User", target: "@john", reason: "Harassment", details: "Insults and threats in the comments section.", reporter: "@kate", time: "26m", status: "Pending" },
  { id: "rep-4", type: "Comment", target: "#18392", reason: "Sexual content", details: "NSFW image in comment thread.", reporter: "@sam", time: "40m", status: "Reviewing" },
  { id: "rep-5", type: "Post", target: "@mika — Free Figma kit", reason: "Copyright", details: "Reupload of a paid kit without credit.", reporter: "@alex", time: "1h", status: "Pending" },
  { id: "rep-6", type: "User", target: "@scam_bot", reason: "Scam", details: "Asks for payment outside the platform.", reporter: "@rio", time: "3h", status: "Pending" },
  { id: "rep-7", type: "User", target: "@fake_nadia", reason: "Impersonation", details: "Copies Nadia's profile and links a scam page.", reporter: "@nadia_builds", time: "5h", status: "Pending" },
  { id: "rep-8", type: "Comment", target: "#18221", reason: "Harassment", details: "Targeting a freelancer over their portfolio.", reporter: "@sasa", time: "2d", status: "Pending" },
]
