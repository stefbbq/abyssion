import { LOG_LEVELS, LogLevel } from '../constants.ts'

export const shouldLog = (logLevel: LogLevel, minLogLevel: LogLevel): boolean => {
  return LOG_LEVELS.indexOf(logLevel) >= LOG_LEVELS.indexOf(minLogLevel) && minLogLevel !== 'off'
}
