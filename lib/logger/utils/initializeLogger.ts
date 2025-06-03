import { setMinLogLevel } from '../index.ts'
import { refreshColors } from '../colors.ts'
import { getMinLogLevel } from './getMinLogLevel.ts'

/**
 * Initializes the logger system with environment-based configuration
 *
 * Sets up:
 * - Log level from LOG_LEVEL or LOGGER_LEVEL environment variables
 * - Theme-based color refresh on system theme changes
 *
 * @example
 * initializeLogger() // Call this at app startup
 */
export const initializeLogger = (): void => {
  // Set log level from environment
  const envLogLevel = getMinLogLevel()
  setMinLogLevel(envLogLevel)

  // Set up theme change listener for adaptive colors
  if (typeof window !== 'undefined') {
    refreshColors()
    globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => refreshColors())
  }

  // Use globalThis.console directly since logger isn't ready yet
  if (envLogLevel !== 'off') {
    globalThis.console.log(`Logger initialized with level: ${envLogLevel}`)
  }
}
