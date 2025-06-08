import { refreshColors } from '../colors.ts'
import { disableContext, setMinLogLevel } from '../index.ts'
import { getMinLogLevel } from './getMinLogLevel.ts'
import { LogContext } from '../constants.ts'

/**
 * Client-side logger initialization (for browser)
 *
 * Sets up:
 * - Log level from parameter or environment variables
 * - Theme-adaptive colors and listeners.
 * Call this from a client-side component/island.
 *
 * @example
 * initializeLoggerClient() // Call this in an island
 * initializeLoggerClient('debug') // Override with specific level
 */
export const initializeLoggerClient = (): void => {
  if (typeof globalThis.window === 'undefined') return

  // Use provided log level or fallback to environment detection
  const logLevel = getMinLogLevel()
  setMinLogLevel(logLevel)

  // Initial color setup
  refreshColors()

  // Listen for theme changes
  globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    refreshColors()
  })

  // Use globalThis.console directly since logger isn't ready yet
  if (logLevel !== 'off') {
    globalThis.console.log(`🌐 Client logger initialized with level: ${logLevel}`)
  }
}
