/**
 * GL theme system for 3D logo visualization
 * Uses shared base themes with GL-specific extensions
 */

import type { GLTheme } from './types.ts'
import { techscapeTheme } from '@libtheme/themes/index.ts'
import { createGLTheme } from './createGLTheme.ts'

// current active theme
let currentTheme = createGLTheme(techscapeTheme)

/**
 * Get the current active GL theme
 */
export const getCurrentTheme = (): GLTheme => currentTheme

/**
 * Set the active GL theme from base theme
 */
export const setTheme = (theme: GLTheme): void => {
  currentTheme = theme
}
