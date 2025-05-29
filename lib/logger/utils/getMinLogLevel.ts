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

  const loggerLevel = env?.LOGGER_LEVEL
  const logLevel = env?.LOG_LEVEL
  const raw = loggerLevel || logLevel || ''
  const level = raw.toLowerCase() as LogLevel

  return LOG_LEVELS.includes(level) ? level : 'trace'
}
