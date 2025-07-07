/**
 * Theme state and mode management for the theme system
 * Manages theme families where each family has both light and dark variants
 * Includes cookie persistence for user preferences
 */
import { computed, effect, signal } from '@preact/signals'
import type { BaseTheme, ThemeFamily } from './index.types.ts'
import { themeFamilies } from './themes/index.ts'
import { getNextThemeFamily } from './utils/themeFamilyUtils.ts'
import { getCookie, setCookie } from '@lib/utils/cookies.ts'

const THEME_FAMILY_COOKIE = 'abyssion-theme-family'
const THEME_MODE_COOKIE = 'abyssion-theme-mode'

/**
 * Get initial theme family from cookie or default
 */
const getInitialThemeFamily = (): string => {
  if (typeof document === 'undefined') return 'deep-space-hud'

  const cookieValue = getCookie(THEME_FAMILY_COOKIE)
  if (cookieValue && themeFamilies.some((family) => family.name === cookieValue)) {
    return cookieValue
  }
  return 'Neon Grid OS'
}

/**
 * Get initial theme mode from cookie or default
 */
const getInitialThemeMode = (): 'light' | 'dark' => {
  if (typeof document === 'undefined') return 'dark'

  const cookieValue = getCookie(THEME_MODE_COOKIE)
  if (cookieValue === 'light' || cookieValue === 'dark') {
    return cookieValue
  }
  return 'dark'
}

/**
 * Reactive signal for the current theme mode ('light' | 'dark')
 * Use to read or set the active mode
 */
export const currentThemeMode = signal<'light' | 'dark'>(getInitialThemeMode())

/**
 * Reactive signal for the current theme family name
 * Used to switch between different theme families
 */
export const currentThemeFamilyName = signal<string>(getInitialThemeFamily())

/**
 * Computed signal for the current BaseTheme object
 * Automatically updates with theme family and mode changes
 */
export const currentBaseTheme = computed<BaseTheme>(() => {
  const family = themeFamilies.find((f) => f.name === currentThemeFamilyName.value) || themeFamilies[0]
  return currentThemeMode.value === 'dark' ? family.dark : family.light
})

/**
 * Set up cookie persistence effects
 */
if (typeof document !== 'undefined') {
  // Save theme family to cookie when it changes
  effect(() => {
    setCookie(THEME_FAMILY_COOKIE, currentThemeFamilyName.value, 365) // 1 year expiration
  })

  // Save theme mode to cookie when it changes
  effect(() => {
    setCookie(THEME_MODE_COOKIE, currentThemeMode.value, 365) // 1 year expiration
  })
}

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
