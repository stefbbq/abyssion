import { refreshColors } from '../colors.ts'
import { focusContext, type lc, setMinLogLevel } from '../index.ts'
import type { LogLevel } from '../constants.ts'
import { getMinLogLevel } from './getMinLogLevel.ts'

/**
 * Client-side logger initialization (for browser)
 *
 * Sets up:
 * - Log level from parameter or environment variables
 * - Theme-adaptive colors and listeners.
 * Call this from a client-side component/island.
 *
 * @example
 * initializeClientLogger() // Call this in an island
 * initializeClientLogger('debug') // Override with specific level
 */
export const initializeClientLogger = (focus?: lc, level?: LogLevel): void => {
  if (typeof globalThis.window === 'undefined') return

  // Use provided log level or fallback to environment detection
  const logLevel = getMinLogLevel()
  setMinLogLevel(level || logLevel)

  if (focus) {
    focusContext(focus)
  }

  // Initial color setup & listen for theme changes
  refreshColors()
  globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshColors)

  // Use console directly since logger isn't ready yet
  if (logLevel !== 'off') console.log(`🌐 Client logger initialized with level: ${logLevel}`)
  if (focus) console.log(`🌐 Client logger initialized with focus: ${focus}`)
}
