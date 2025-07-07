/**
 * @module Main debug module for the entire application
 *
 * Provides debug mode detection and control that can be used by:
 * - Logger system
 * - GL debug features
 * - Any other application debug functionality
 */

export { DEBUG_COOKIE_NAME, DEBUG_QUERY_PARAM } from './constants.ts'
export { isDebugModeEnabled } from './isDebugModeEnabled.ts'
export { isGLDisabled } from './isGLDisabled.ts'
export { setDebugMode } from './setDebugMode.ts'
export { clearDebugMode } from './clearDebugMode.ts'
export { loadDebugSettings } from './loadDebugSettings.ts'
export { saveDebugSettings } from './saveDebugSettings.ts'
export { resetDebugSettings } from './resetDebugSettings.ts'
