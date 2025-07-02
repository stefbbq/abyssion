/**
 * Theme state and mode management for the theme system
 * Manages theme families where each family has both light and dark variants
 */
import { computed, signal } from '@preact/signals'
import type { BaseTheme, ThemeFamily } from './types.ts'
import { themeFamilies } from './themes/index.ts'
import { getNextThemeFamily } from './utils/themeFamilyUtils.ts'

/**
 * Reactive signal for the current theme mode ('light' | 'dark')
 * Use to read or set the active mode
 */
export const currentThemeMode = signal<'light' | 'dark'>('dark')

/**
 * Reactive signal for the current theme family name
 * Used to switch between different theme families
 */
export const currentThemeFamilyName = signal<string>('deep-space-hud')

/**
 * Computed signal for the current BaseTheme object
 * Automatically updates with theme family and mode changes
 */
export const currentBaseTheme = computed<BaseTheme>(() => {
  const family = themeFamilies.find((f) => f.name === currentThemeFamilyName.value) || themeFamilies[0]
  return currentThemeMode.value === 'dark' ? family.dark : family.light
})

/**
 * Switches to the next theme family in the cycle
 * Maintains the current light/dark mode
 *
 * @returns {BaseTheme} The new theme
 */
export const switchToNextThemeFamily = (): BaseTheme => {
  const nextFamily = getNextThemeFamily(currentThemeFamilyName.value)
  currentThemeFamilyName.value = nextFamily.name
  return currentBaseTheme.value
}

/**
 * Sets the theme family explicitly by name.
 */
export const setThemeFamily = (familyName: string): void => {
  const family = themeFamilies.find((f) => f.name === familyName)
  if (family) {
    currentThemeFamilyName.value = familyName
  }
}

/**
 * Switches between light and dark theme modes within the current family
 *
 * @returns {string} The new mode
 */
export const toggleThemeMode = (): 'light' | 'dark' => {
  currentThemeMode.value = currentThemeMode.value === 'dark' ? 'light' : 'dark'
  return currentThemeMode.value
}

/**
 * Sets the theme mode explicitly to 'light' or 'dark'
 */
export const setThemeMode = (mode: 'light' | 'dark'): void => {
  currentThemeMode.value = mode
}

/**
 * Gets all available theme families
 */
export const getAllThemeFamilies = (): ThemeFamily[] => themeFamilies

/**
 * Gets the next theme family without switching to it
 *
 * @returns {BaseTheme} The next theme family preview
 */
export const getNextThemeFamilyPreview = (): BaseTheme => {
  const nextFamily = getNextThemeFamily(currentThemeFamilyName.value)
  return currentThemeMode.value === 'dark' ? nextFamily.dark : nextFamily.light
}
