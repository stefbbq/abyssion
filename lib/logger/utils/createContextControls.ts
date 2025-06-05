import { LogContext } from '../constants.ts'
import { type ContextFilter } from './createContextFilter.ts'

/**
 * Context control functions
 */
export type ContextControls = {
  disable: (context: LogContext) => void
  enable: (context: LogContext) => void
  focus: (context: LogContext) => void
  clearFocus: () => void
  reset: () => void
}

/**
 * Creates context control functions that delegate to a ContextFilter instance
 * @param contextFilter The context filter instance to control
 * @returns Object with all context control methods
 */
export const createContextControls = (contextFilter: ContextFilter): ContextControls => ({
  /**
   * Disable logging for a specific context
   * @param context The context to disable
   */
  disable: (context: LogContext): void => {
    contextFilter.disable(context)
  },

  /**
   * Re-enable logging for a specific context
   * @param context The context to enable
   */
  enable: (context: LogContext): void => {
    contextFilter.enable(context)
  },

  /**
   * Focus on only one context - all other contexts will be hidden
   * @param context The context to focus on
   */
  focus: (context: LogContext): void => {
    contextFilter.focus(context)
  },

  /**
   * Clear focus mode - show all contexts (except disabled ones)
   */
  clearFocus: (): void => {
    contextFilter.clearFocus()
  },

  /**
   * Reset all context filters - clear disabled contexts and focus
   */
  reset: (): void => {
    contextFilter.reset()
  },
})
