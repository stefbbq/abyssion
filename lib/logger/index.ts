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
 * Context filtering:
 *   disableContext(lc.GL_VIDEO) - disable specific context
 *   enableContext(lc.GL_VIDEO) - re-enable specific context
 *   focusContext(lc.GL) - only show logs from this context
 *   clearFocus() - show all contexts (except disabled ones)
 *   resetContexts() - clear all filters
 *
 * Log levels are available as static methods: log.trace, log.debug, log.info, log.warn, log.error, log.critical
 * Contexts are defined in LogContext (imported as lc).
 */
import { LOG_LEVELS, LogContext, type LogLevel } from './constants.ts'
import { type ContextFilter, createContextFilter } from './utils/createContextFilter.ts'
import { createServerLogger } from './utils/createServerLogger.ts'
import { createClientLogger, type LogFunction } from './utils/createClientLogger.ts'

let minLogLevel: LogLevel = 'warn'
const contextFilter: ContextFilter = createContextFilter()
const getMinLogLevelFn = () => minLogLevel

/**
 * Set the minimum log level at runtime (for tests or dynamic changes).
 * @param level LogLevel string
 */
export const setMinLogLevel = (level: LogLevel) => {
  if (LOG_LEVELS.includes(level)) minLogLevel = level
  else globalThis.console.warn(`[logger] Invalid log level: ${level}`)
}

// Context Filter
const { disable: disableContext, enable: enableContext, focus: focusContext, clearFocus, reset: resetContexts, shouldLog } = contextFilter
disableContext(LogContext.GL_TEXTURES)

/**
 * Main log function with all level methods attached
 */
const log: LogFunction = createClientLogger(getMinLogLevelFn, contextFilter)

/**
 * Deno-idiomatic logger initilize
 */
createServerLogger()

/**
 * Exported log function and log context enum (aliased as lc for brevity).
 */
export { clearFocus, disableContext, enableContext, focusContext, log, LogContext as lc, resetContexts }
