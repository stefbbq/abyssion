/// <reference lib="deno.ns" />

import { LOG_LEVELS, LogLevel } from '../constants.ts'

export const getMinLogLevel = (): LogLevel => {
  let env: Record<string, string> | undefined

  // Server-side (Deno) environment
  if (typeof Deno !== 'undefined' && Deno.env?.toObject) {
    env = Deno.env.toObject()
  } // Browser environment - check for injected env
  else if (typeof globalThis !== 'undefined' && (globalThis as any).ENV) {
    env = (globalThis as any).ENV as Record<string, string>
  }

  // Check debug mode via existing debug system (browser only)
  if (typeof window !== 'undefined') {
    try {
      // Check for ?debug query parameter (using existing debug constants)
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('debug')) {
        return 'trace' // Enable maximum debugging when ?debug is present
      }

      // Check debug cookie if available
      const debugCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('gl_debug_mode='))
        ?.split('=')[1]

      if (debugCookie === 'true') {
        return 'trace' // Enable maximum debugging when debug cookie is set
      }
    } catch {
      // Continue without debug system if it fails
    }
  }

  // Check for explicit DEBUG environment variable
  const debugEnv = env?.DEBUG
  if (debugEnv && (debugEnv === 'true' || debugEnv === '1')) {
    return 'debug' // Enable debug mode
  }

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
