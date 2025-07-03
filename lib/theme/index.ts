/**
 * @module Theme System
 * Unified theme API for UI and GL layers.
 *
 * Exports:
 * - Theme state and signals (mode, base theme, toggles)
 * - Theme creation utilities (UITheme, GLTheme)
 * - Computed theme signals (currentUITheme, currentGLTheme)
 * - All theme types and theme definitions
 * - All theme utility functions
 *
 * Import from this module for all theme-related needs.
 */
import type { GLTheme, UITheme } from './types.ts'
import { computed } from '@preact/signals'
import { currentBaseTheme } from './state.ts'
import { createTheme } from './createTheme.ts'
import { createGLTheme } from './createGLTheme.ts'

/**
 * Computed signal for the current UITheme
 * Automatically updates when the base theme changes
 */
export const currentUITheme = computed<UITheme>(() => createTheme(currentBaseTheme.value))

/**
 * Computed signal for the current GLTheme
 * Automatically updates when the base theme changes
 * Use for all theme-aware 3D/GL rendering logic
 */
export const currentGLTheme = computed<GLTheme>(() => createGLTheme(currentBaseTheme.value))

/**
 * Get the current UI theme
 * @returns Current UITheme object
 */
export const getUITheme = (): UITheme => currentUITheme.value

/**
 * Get the current GL theme
 * @returns Current GLTheme object
 */
export const getGLTheme = (): GLTheme => currentGLTheme.value

export * from './state.ts'
export * from './createTheme.ts'
export * from './createUITheme.ts'
export * from './createLegacyUITheme.ts'
export * from './createGLTheme.ts'
export * from './types.ts'
export * from './themes/index.ts'
