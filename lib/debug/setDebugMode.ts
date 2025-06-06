import { setBooleanCookie } from '@lib/utils/cookies.ts'
import { DEBUG_COOKIE_NAME } from './constants.ts'

/**
 * Enable or disable debug mode and update cookie
 *
 * This affects the entire application's debug mode, including:
 * - Logger debug level
 * - GL debug features
 * - Any other debug-related functionality
 *
 * @param enabled - whether to enable debug mode
 */
export const setDebugMode = (enabled: boolean): void => {
  setBooleanCookie(DEBUG_COOKIE_NAME, enabled)
}
