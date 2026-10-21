/**
 * Small fetch wrapper for the Laravel API.
 *
 * Every endpoint answers with JSON. Failures throw an ApiError that carries the
 * HTTP status, the Laravel message and the field errors, so forms can show them.
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

export default async function api(path, { method = 'GET', body, token = getToken() } = {}) {
  const headers = { Accept: 'application/json' }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const firstFieldError = payload?.errors
      ? Object.values(payload.errors)[0]?.[0]
      : undefined

    throw new ApiError(
      firstFieldError || payload?.message || 'Something went wrong.',
      response.status,
      payload?.errors || {},
    )
  }

  return payload
}
