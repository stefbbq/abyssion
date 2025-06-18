/**
 * Reusable animation/layout functions and easing presets for ActionZone
 * Used by config-driven animation/layout system
 */

/**
 * Returns the collapsed nav height (in px)
 */
export const getCollapsedHeight = () => 80

/**
 * Returns the collapsed nav border radius (in px)
 */
export const getCollapsedBorderRadius = () => 40

/**
 * Returns the expanded menu height (auto for full expansion)
 */
export const getExpandedHeight = () => 'auto'

/**
 * Returns the expanded menu border radius (in px)
 */
export const getExpandedBorderRadius = () => 24

// Easing presets
export const springEasing = [0.22, 1, 0.36, 1]
export const easeInOutEasing = [0.4, 0, 0.2, 1]
export const easeOutEasing = [0, 0, 0.2, 1]
export const easeInEasing = [0.4, 0, 1, 1]

export const easingPresets: { [key: string]: number[] } = {
  spring: springEasing,
  easeInOut: easeInOutEasing,
  easeOut: easeOutEasing,
  easeIn: easeInEasing,
}

/**
 * Mapping of function names to implementations for config resolution
 */
export const animationStyleFunctions: { [key: string]: () => string | number } = {
  getCollapsedHeight,
  getCollapsedBorderRadius,
  getExpandedHeight,
  getExpandedBorderRadius,
}
