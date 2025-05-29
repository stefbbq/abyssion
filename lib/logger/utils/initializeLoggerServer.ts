import { setMinLogLevel } from '../index.ts'
import { getMinLogLevel } from './getMinLogLevel.ts'

/**
 * Server-side logger initialization (for main.ts)
 *
 * Only sets up log level from environment variables.
 * Theme setup must be done client-side.
 *
 * @example
 * initializeLoggerServer() // Call this in main.ts
 */
export const initializeLoggerServer = (): void => {
  const envLogLevel = getMinLogLevel()
  setMinLogLevel(envLogLevel)

  console.log(`🖥️  Server logger initialized with level: ${envLogLevel}`)
}
