export function isValidExternalUrl(raw) {
  if (!raw || typeof raw !== "string") return false
  const value = raw.trim()
  let url
  try {
    url = new URL(value)
  } catch {
    return false
  }
  if (url.protocol !== "https:") return false
  const host = url.hostname.toLowerCase()
  if (!host || host === "localhost") return false
  if (!host.includes(".")) return false
  if (/^(127\.)|^0\.0\.0\.0$/.test(host)) return false
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return false
  return true
}

const PROJECT_HOSTS = ["github.com", "www.github.com", "gitlab.com", "www.gitlab.com"]

// Projects only accept GitHub or GitLab repository links.
export function isValidProjectUrl(raw) {
  if (!isValidExternalUrl(raw)) return false
  const url = new URL(raw.trim())
  if (!PROJECT_HOSTS.includes(url.hostname.toLowerCase())) return false
  return url.pathname.trim() !== ""
}

export function ensurePdfFilename(name, fallback = "cv.pdf") {
  const base = (name || "").trim() || fallback
  const withoutExt = base.replace(/\.[a-z0-9]+$/i, "")
  const safe = withoutExt.replace(/[^\w\- ]+/g, "").trim() || "cv"
  return `${safe}.pdf`
}

// Minimal one-page placeholder PDF so the mock CV download is a real .pdf file.
export function makePlaceholderPdfBlob(title = "CV") {
  const safe = String(title).replace(/[()\\]/g, "")
  const content = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 90>>stream
BT /F1 24 Tf 72 720 Td (${safe || "CV"}) Tj ET
BT /F1 12 Tf 72 690 Td (Placeholder CV exported from portfolio.) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
`
  return new Blob([content], { type: "application/pdf" })
}

export function downloadUrl(url, filename) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}
