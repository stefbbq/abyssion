/**
 * @module Logger
 *
 * Utility for structured, color-coded console output with context and log level support.
 *
 * Usage:
 *   import { log, lc } from '@logger/Log';
 *   log(lc.GL, 'Hello GL!');
 *   log.warn(lc.PREACT, 'Warning from preact!');
 *   logDeno(lc.GL, 'Hello GL! (Deno)');
 *
 * Log levels are available as static methods: log.trace, log.debug, log.info, log.warn, log.error, log.critical
 * Contexts are defined in LogContext (imported as lc).
 */
import { LOG_LEVELS, LogContext, type LogLevel } from './constants.ts'
import { CONTEXT_COLORS, LOG_LEVEL_STYLES } from './colors.ts'
import { getMinLogLevel } from './utils/getMinLogLevel.ts'
import { shouldLog } from './utils/shouldLog.ts'

let minLogLevel: LogLevel = getMinLogLevel()

/**
 * Set the minimum log level at runtime (for tests or dynamic changes).
 * @param level LogLevel string
 */
export function setMinLogLevel(level: LogLevel) {
  if (LOG_LEVELS.includes(level)) minLogLevel = level
  else console.warn(`[logger] Invalid log level: ${level}`)
}

/**
 * Log a message at the 'info' level with a given context.
 * @param ctx The log context (e.g., lc.GL, lc.PREACT).
 * @param args Arguments to log. First argument is usually a string message.
 */
const log = (ctx: LogContext, ...args: unknown[]): void => _log('info', ctx, ...args)

/**
 * Log a message at the 'trace' level (mapped to console.debug).
 * @param ctx The log context.
 * @param args Arguments to log.
 */
log.trace = (ctx: LogContext, ...args: unknown[]): void => _log('trace', ctx, ...args)

/**
 * Log a message at the 'debug' level.
 * @param ctx The log context.
 * @param args Arguments to log.
 */
log.debug = (ctx: LogContext, ...args: unknown[]): void => _log('debug', ctx, ...args)

/**
 * Log a message at the 'info' level.
 * @param ctx The log context.
 * @param args Arguments to log.
 */
log.info = (ctx: LogContext, ...args: unknown[]): void => _log('info', ctx, ...args)

/**
 * Log a message at the 'warn' level.
 * @param ctx The log context.
 * @param args Arguments to log.
 */
log.warn = (ctx: LogContext, ...args: unknown[]): void => _log('warn', ctx, ...args)

/**
 * Log a message at the 'error' level.
 * @param ctx The log context.
 * @param args Arguments to log.
 */
log.error = (ctx: LogContext, ...args: unknown[]): void => _log('error', ctx, ...args)

/**
 * Log a message at the 'critical' level (mapped to console.error, styled strongly).
 * @param ctx The log context.
 * @param args Arguments to log.
 */
log.critical = (ctx: LogContext, ...args: unknown[]): void => _log('critical', ctx, ...args)

/**
 * Internal log implementation. Handles color, context, and log level mapping.
 * @param level Log level string.
 * @param ctx Log context (prefix).
 * @param args Arguments to log.
 */
function _log(level: LogLevel, ctx: LogContext, ...args: unknown[]): void {
  // Filter by env-configured log level
  if (!shouldLog(level, minLogLevel)) return

  const con = globalThis.console

  // Define the appropriate console level
  let method: keyof Console
  if (level === 'critical') method = 'error'
  else if (level === 'info') method = 'log'
  else method = level as keyof Console
  if (typeof con[method] !== 'function') method = 'log'

  const cStyle = CONTEXT_COLORS[ctx] || ''
  const lStyle = LOG_LEVEL_STYLES[level] || 'color: inherit;'
  const prefix = `%c[${ctx}]%c`

  // Output to console
  if (args[0] && typeof args[0] === 'string') con[method](`${prefix} ${args[0]}`, cStyle, lStyle, ...args.slice(1))
  else con[method](prefix, cStyle, 'color: inherit;', ...args)
}

/**
 * Deno-idiomatic log variant that outputs without color/styles.
 * @param ctx The log context.
 * @param args Arguments to log.
 */
const logDeno = (ctx: LogContext, ...args: any[]): void => {
  const prefix = `[${ctx}]`
  if (args[0] && typeof args[0] === 'string') globalThis.console.log(`${prefix} ${args[0]}`, ...args.slice(1))
  else globalThis.console.log(prefix, ...args)
}

/**
 * Exported log function and log context enum (aliased as lc for brevity).
 */
export { log, LogContext as lc, logDeno }
