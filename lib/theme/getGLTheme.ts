import type { GLTheme } from './types.ts'
import { currentBaseTheme } from './state.ts'
import { createGLTheme } from './createGLTheme.ts'

/**
 * Returns the current GLTheme object, derived from the current base theme.
 * Use for all theme-aware 3D/GL rendering logic.
 */
export const getGLTheme = (): GLTheme => createGLTheme(currentBaseTheme.value)
