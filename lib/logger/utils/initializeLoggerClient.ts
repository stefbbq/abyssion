import { refreshColors } from '../colors.ts'
import { setMinLogLevel } from '../index.ts'
import { getMinLogLevel } from './getMinLogLevel.ts'
import { LogLevel } from '../constants.ts'

/**
 * Client-side logger initialization (for browser)
 *
 * Sets up:
 * - Log level from parameter or environment variables
 * - Theme-adaptive colors and listeners.
 * Call this from a client-side component/island.
 *
 * @param logLevel - Optional log level to use (overrides environment detection)
 * @example
 * initializeLoggerClient() // Call this in an island
 * initializeLoggerClient('debug') // Override with specific level
 */
export const initializeLoggerClient = (logLevel?: LogLevel): void => {
  if (typeof globalThis.window === 'undefined') return

  // Use provided log level or fallback to environment detection
  const effectiveLogLevel = logLevel || getMinLogLevel()
  setMinLogLevel(effectiveLogLevel)

  // Initial color setup
  refreshColors()

  // Listen for theme changes
  globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    refreshColors()
  })

  console.log(`🌐 Client logger initialized with level: ${effectiveLogLevel}`)
}
