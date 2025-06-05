import { getBooleanCookie, setBooleanCookie } from '@lib/utils/cookies.ts'
import { DEBUG_COOKIE_NAME, DEBUG_QUERY_PARAM } from './constants.ts'

/**
 * Check if debug mode is enabled via query parameter or cookie
 * Query parameter takes precedence and updates the cookie when present
 *
 * This is the main debug mode detection for the entire application.
 * Both logger and GL debug systems use this.
 *
 * @returns true if debug mode should be enabled
 */
export const isDebugModeEnabled = (): boolean => {
  if (typeof window === 'undefined') return false

  // Check query parameter first (takes precedence)
  const urlParams = new URLSearchParams(globalThis.window.location.search)
  const debugParam = urlParams.get(DEBUG_QUERY_PARAM)

  if (debugParam !== null) {
    const isEnabled = debugParam === 'true' || debugParam === '1' || debugParam === ''
    // Store in cookie when query param is present
    setBooleanCookie(DEBUG_COOKIE_NAME, isEnabled)
    return isEnabled
  }

  // Fall back to cookie
  return getBooleanCookie(DEBUG_COOKIE_NAME, false)
}
