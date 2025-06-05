import { LOG_LEVELS, LogContext, type LogLevel } from '../constants.ts'
import { CONTEXT_COLORS, LOG_LEVEL_STYLES } from '../colors.ts'
import { type ContextFilter } from './createContextFilter.ts'

/**
 * Check if a log level should be logged based on minimum level
 * @param logLevel The log level to check
 * @param minLogLevel The minimum log level configured
 * @returns true if the message should be logged
 */
export const shouldLog = (logLevel: LogLevel, minLogLevel: LogLevel): boolean => {
  return LOG_LEVELS.indexOf(logLevel) >= LOG_LEVELS.indexOf(minLogLevel) && minLogLevel !== 'off'
}

/**
 * Enhanced shouldLog function that respects debug mode based on log level
 * If minLogLevel is 'debug' or 'trace', debug mode is enabled and all logs at that level and above will show
 * @param level The log level to check
 * @param minLogLevel The minimum log level configured
 * @returns true if the message should be logged
 */
export const shouldLogWithDebugMode = (level: LogLevel, minLogLevel: LogLevel): boolean => {
  return shouldLog(level, minLogLevel)
}

/**
 * Log function with level methods
 */
export type LogFunction = {
  (ctx: LogContext, ...args: unknown[]): void
  trace: (ctx: LogContext, ...args: unknown[]) => void
  debug: (ctx: LogContext, ...args: unknown[]) => void
  info: (ctx: LogContext, ...args: unknown[]) => void
  warn: (ctx: LogContext, ...args: unknown[]) => void
  error: (ctx: LogContext, ...args: unknown[]) => void
  critical: (ctx: LogContext, ...args: unknown[]) => void
}

/**
 * Creates the main log function with all level methods
 * @param minLogLevel Current minimum log level
 * @param contextFilter Context filtering instance
 * @returns LogFunction with all methods attached
 */
export const createClientLogger = (
  getMinLogLevel: () => LogLevel,
  contextFilter: ContextFilter,
): LogFunction => {
  /**
   * Internal log implementation. Handles color, context, and log level mapping.
   * @param level Log level string
   * @param ctx Log context (prefix)
   * @param args Arguments to log
   */
  const _log = (level: LogLevel, ctx: LogContext, ...args: unknown[]): void => {
    // Filter by env-configured log level and debug mode
    if (!shouldLogWithDebugMode(level, getMinLogLevel())) return

    // Filter by context
    if (!contextFilter.shouldLog(ctx)) return

    const con = globalThis.console

    // Define the appropriate console level
    let method: keyof Console
    if (level === 'critical') method = 'error'
    else if (level === 'info') method = 'log'
    else if (level === 'trace') method = 'log'
    else method = level as keyof Console
    if (typeof con[method] !== 'function') method = 'log'

    // Define style
    const cStyle = CONTEXT_COLORS[ctx] || ''
    const lStyle = LOG_LEVEL_STYLES[level] || 'color: inherit;'
    const prefix = `%c[${ctx}]%c`

    // Output to console with proper typing
    const consoleMethod = con[method] as (...args: any[]) => void
    if (args[0] && typeof args[0] === 'string') {
      consoleMethod(`${prefix} ${args[0]}`, cStyle, lStyle, ...args.slice(1))
    } else {
      consoleMethod(prefix, cStyle, 'color: inherit;', ...args)
    }
  }

  /**
   * Log a message at the 'info' level with a given context
   */
  const log = (ctx: LogContext, ...args: unknown[]): void => _log('info', ctx, ...args)

  // Attach level methods
  log.trace = (ctx: LogContext, ...args: unknown[]): void => _log('trace', ctx, ...args)
  log.debug = (ctx: LogContext, ...args: unknown[]): void => _log('debug', ctx, ...args)
  log.info = (ctx: LogContext, ...args: unknown[]): void => _log('info', ctx, ...args)
  log.warn = (ctx: LogContext, ...args: unknown[]): void => _log('warn', ctx, ...args)
  log.error = (ctx: LogContext, ...args: unknown[]): void => _log('error', ctx, ...args)
  log.critical = (ctx: LogContext, ...args: unknown[]): void => _log('critical', ctx, ...args)

  return log as LogFunction
}
