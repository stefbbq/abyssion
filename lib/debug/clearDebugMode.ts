import { setDebugMode } from './setDebugMode.ts'

/**
 * Clear debug mode from cookie
 *
 * Note: cannot remove query parameter, but clears cookie state.
 * If ?debug is in URL, debug mode will still be active until page reload.
 */
export const clearDebugMode = (): void => {
  setDebugMode(false)
}
