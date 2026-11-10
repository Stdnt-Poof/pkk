/**
 * Small fetch wrapper for the Laravel API.
 *
 * Every endpoint answers with JSON. Failures throw an ApiError that carries the
 * HTTP status, the Laravel message and the field errors, so forms can show them.
 *
 * Uploads pass `form` (a FormData) and downloads pass `raw` to receive a Blob;
 * `path` may also be an absolute API URL returned by a resource.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const TOKEN_KEY = 'auth_token'

export class ApiError extends Error {
  constructor(message, status = 0, errors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export default async function api(path, { method = 'GET', body, form, raw = false, token = getToken() } = {}) {
  const headers = { Accept: raw ? '*/*' : 'application/json' }

  if (form) {
    // Let the browser fill in the multipart boundary itself.
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}/api${path}`, {
      method,
      headers,
      body: form || (body === undefined ? undefined : JSON.stringify(body)),
    })
  } catch {
    throw new ApiError('Could not reach the server',0)
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const firstFieldError = payload?.errors
      ? Object.values(payload.errors)[0]?.[0]
      : undefined

    throw new ApiError(
      firstFieldError || payload?.message || 'Something went wrong.',
      response.status,
      payload?.errors || {},
    )
  }

  if (raw) {
    return response.blob()
  }

  return response.json().catch(() => null)
}
