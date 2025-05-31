/**
 * theme.ts - Color theming system for logo3d
 *
 * Provides a centralized theme system to manage all colors across the visualization
 */

import type { Logo3DTheme } from './theme.d.ts'
import { TECHSCAPE_THEME } from './themes/techscape.ts'

// current active theme
let currentTheme = TECHSCAPE_THEME

/**
 * Get the current active theme
 */
export const getCurrentTheme = (): Logo3DTheme => currentTheme

/**
 * Set the active theme
 */
export const setTheme = (theme: Logo3DTheme): void => {
  currentTheme = theme
}

export { rgbToHex } from './utils/rgbToHex.ts'
export { hexToRGB } from './utils/hexToRGB.ts'
export { colorToRGB } from './utils/colorToRGB.ts'
export { darkenHex } from './utils/darkenHex.ts'
export { lightenHex } from './utils/lightenHex.ts'
export { createRGB } from './utils/createRGB.ts'
export { mixRGB } from './utils/mixRGB.ts'
export { mergeTheme } from './utils/mergeTheme.ts'
export { createTheme } from './utils/createTheme.ts'
