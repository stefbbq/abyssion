/**
 * GL theme system exports
 * Provides 3D rendering specific theme functionality
 */

import { getCurrentBaseTheme } from '@libtheme/index.ts'
import { createGLTheme } from './createGLTheme.ts'
import type { GLTheme } from './types.ts'

/**
 * Get current GL theme based on current theme mode
 */
export const getGLTheme = (): GLTheme => createGLTheme(getCurrentBaseTheme())

/**
 * Create GL theme from specific base theme
 */
export { createGLTheme } from './createGLTheme.ts'

/**
 * GL theme types
 */
export type { GLTheme } from './types.ts'
