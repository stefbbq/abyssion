import { setDebugMode } from './setDebugMode.ts'

/**
 * Clear debug mode from cookie
 * Note: cannot remove query parameter, but clears cookie state
 */
export const clearDebugMode = (): void => {
  setDebugMode(false)
}
