import { LogContext } from '../constants.ts'

/**
 * Context filter state and methods
 */
export type ContextFilter = {
  shouldLog: (context: LogContext) => boolean
  disable: (context: LogContext) => void
  enable: (context: LogContext) => void
  focus: (context: LogContext) => void
  clearFocus: () => void
  reset: () => void
}

/**
 * Creates a context filter with encapsulated state management
 * @returns ContextFilter object with methods for filtering log contexts
 */
export const createContextFilter = (): ContextFilter => {
  let disabledContexts: Set<LogContext> = new Set()
  let focusedContext: LogContext | null = null

  return {
    shouldLog: (context: LogContext): boolean => {
      // if context is disabled, don't log
      if (disabledContexts.has(context)) return false

      // if we're in focus mode, only log the focused context
      if (focusedContext !== null) return context === focusedContext

      // otherwise, log it
      return true
    },

    disable: (context: LogContext): void => {
      disabledContexts.add(context)
    },

    enable: (context: LogContext): void => {
      disabledContexts.delete(context)
    },

    focus: (context: LogContext): void => {
      focusedContext = context
    },

    clearFocus: (): void => {
      focusedContext = null
    },

    reset: (): void => {
      disabledContexts.clear()
      focusedContext = null
    },
  }
}
