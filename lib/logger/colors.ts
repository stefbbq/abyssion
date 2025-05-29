import { LogContext, LogLevel } from './constants.ts'
import { getContextColors, getLogLevelStyles } from './utils/getAdaptiveColors.ts'

/**
 * Maps each LogContext to a CSS style string for console prefix coloring.
 * Colors adapt automatically based on user's light/dark mode preference.
 */
export const CONTEXT_COLORS: Record<LogContext, string> = getContextColors()

/**
 * Maps each LogLevel to a CSS style string for message coloring.
 * Colors adapt automatically based on user's light/dark mode preference.
 */
export const LOG_LEVEL_STYLES: Record<LogLevel, string> = getLogLevelStyles()

/**
 * Refreshes colors based on current theme preference
 * Call this if you want to update colors after theme change
 *
 * @example
 * refreshColors() // Updates global color objects
 */
export const refreshColors = (): void => {
  const newContextColors = getContextColors()
  const newLevelStyles = getLogLevelStyles()

  // Update the exported objects
  Object.assign(CONTEXT_COLORS, newContextColors)
  Object.assign(LOG_LEVEL_STYLES, newLevelStyles)
}
