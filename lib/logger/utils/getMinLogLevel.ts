import { LOG_LEVELS, LogLevel } from '../constants.ts'

export const getMinLogLevel = (): LogLevel => {
  const env = typeof Deno !== 'undefined'
    ? Deno.env.toObject?.()
    : (typeof process !== 'undefined' ? process.env : (globalThis.ENV as Record<string, string> | undefined))
  const raw = env?.LOGGER_LEVEL || env?.LOG_LEVEL || ''
  const level = raw.toLowerCase() as LogLevel
  return LOG_LEVELS.includes(level) ? level : 'trace'
}
