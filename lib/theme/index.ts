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
import { computed } from '@preact/signals'
import { currentBaseTheme } from './state.ts'
import { createUITheme } from './createUITheme.ts'
import { createGLTheme } from './createGLTheme.ts'

/**
 * Computed signal for the current UITheme
 * Automatically updates when the base theme changes
 */
export const currentUITheme = computed<ReturnType<typeof createUITheme>>(() => createUITheme(currentBaseTheme.value))

/**
 * Computed signal for the current GLTheme
 * Automatically updates when the base theme changes
 * Use for all theme-aware 3D/GL rendering logic
 */
export const currentGLTheme = computed<ReturnType<typeof createGLTheme>>(() => createGLTheme(currentBaseTheme.value))

export * from './createUITheme.ts'
export * from './createGLTheme.ts'
export * from './state.ts'
