/**
 * Theme state and mode management for the theme system.
 * Provides reactive signals and toggles for theme mode and base theme.
 */
import { computed, signal } from '@preact/signals'
import type { BaseTheme } from './types.ts'
import { deepSpaceHUDLightTheme, deepSpaceHUDTheme } from './themes/index.ts'

/**
 * Reactive signal for the current theme mode ('light' | 'dark').
 * Use to read or set the active mode.
 */
export const currentThemeMode = signal<'light' | 'dark'>('dark')

/**
 * Computed signal for the current BaseTheme object.
 * Automatically updates with mode.
 */
export const currentBaseTheme = computed<BaseTheme>(() => currentThemeMode.value === 'dark' ? deepSpaceHUDTheme : deepSpaceHUDLightTheme)

/**
 * Switches between light and dark theme modes.
 * Returns the new mode.
 */
export const toggleThemeMode = (): 'light' | 'dark' => {
  currentThemeMode.value = currentThemeMode.value === 'dark' ? 'light' : 'dark'
  return currentThemeMode.value
}

/**
 * Sets the theme mode explicitly to 'light' or 'dark'.
 */
export const setThemeMode = (mode: 'light' | 'dark'): void => {
  currentThemeMode.value = mode
}
