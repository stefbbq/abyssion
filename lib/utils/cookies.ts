/**
 * Generalized cookie utilities for browser storage
 */

/**
 * Set a cookie with optional expiration
 *
 * @param name - cookie name
 * @param value - cookie value
 * @param daysToExpire - number of days until expiration (default 30)
 * @param path - cookie path (default '/')
 */
export const setCookie = (
  name: string,
  value: string,
  daysToExpire = 30,
  path = '/',
): void => {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + (daysToExpire * 24 * 60 * 60 * 1000))

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=${path}`
}

/**
 * Get a cookie value by name
 *
 * @param name - cookie name to retrieve
 * @returns cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  const targetCookie = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`))

  if (!targetCookie) return null

  return targetCookie.split('=')[1]?.trim() || null
}

/**
 * Delete a cookie by setting it to expire immediately
 *
 * @param name - cookie name to delete
 * @param path - cookie path (default '/')
 */
export const deleteCookie = (name: string, path = '/'): void => {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
}

/**
 * Check if a cookie exists
 *
 * @param name - cookie name to check
 * @returns true if cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null
}

/**
 * Get a boolean value from a cookie
 *
 * @param name - cookie name
 * @param defaultValue - default value if cookie doesn't exist
 * @returns boolean value
 */
export const getBooleanCookie = (name: string, defaultValue = false): boolean => {
  const value = getCookie(name)
  if (value === null) return defaultValue
  return value === 'true'
}

/**
 * Set a boolean value as a cookie
 *
 * @param name - cookie name
 * @param value - boolean value to store
 * @param daysToExpire - number of days until expiration (default 30)
 * @param path - cookie path (default '/')
 */
export const setBooleanCookie = (
  name: string,
  value: boolean,
  daysToExpire = 30,
  path = '/',
): void => {
  setCookie(name, value ? 'true' : 'false', daysToExpire, path)
}
