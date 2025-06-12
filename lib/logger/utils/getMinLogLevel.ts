import { LOG_LEVELS, LogLevel } from '../constants.ts'
import { isDebugModeEnabled } from '../../debug/index.ts'

// Type declaration for Deno global when available
declare const Deno: {
  env: {
    toObject(): Record<string, string>
  }
} | undefined

export const getMinLogLevel = (): LogLevel => {
  let env: Record<string, string> | undefined

  if (typeof Deno !== 'undefined' && Deno.env?.toObject) {
    // Server-side (Deno) environment
    env = Deno.env.toObject()
    // deno-lint-ignore no-explicit-any
  } else if (typeof globalThis !== 'undefined' && (globalThis as any).ENV) {
    // Browser environment - check for injected env
    // deno-lint-ignore no-explicit-any
    env = (globalThis as any).ENV as Record<string, string>
  }

  // Check debug mode via centralized debug system (browser only)
  if (typeof window !== 'undefined') {
    try {
      if (isDebugModeEnabled()) {
        return 'trace' // Enable maximum debugging when debug mode is on
      }
    } catch {
      // Continue without debug system if it fails
    }
  }

  // Check for explicit DEBUG environment variable
  const debugEnv = env?.DEBUG
  if (debugEnv && (debugEnv === 'true' || debugEnv === '1')) return 'debug'

  // Check for explicit log level setting
  const loggerLevel = env?.LOGGER_LEVEL
  const logLevel = env?.LOG_LEVEL
  const raw = loggerLevel || logLevel || ''
  const level = raw.toLowerCase() as LogLevel

  // If a valid log level is explicitly set, use it
  if (LOG_LEVELS.includes(level)) return level

  // Default to 'warn' for production security (no debug logs by default)
  return 'warn'
}
