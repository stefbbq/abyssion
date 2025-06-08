import type { BaseTheme, UITheme } from './types.ts'
import { deepSpaceHUDLightTheme, deepSpaceHUDTheme } from './themes/index.ts'
import { hexToCSS } from './utils/hexToCSS.ts'
import { rgbToCSS } from './utils/rgbToCSS.ts'

/**
 * Current theme mode - can be toggled
 */
let currentThemeMode: 'light' | 'dark' = 'dark'

/**
 * Create UI theme from base theme with mode-aware contrast
 */
export const createTheme = (baseTheme: BaseTheme = deepSpaceHUDTheme): UITheme => {
  const isDarkMode = baseTheme.mode === 'dark'

  return {
    colors: {
      background: {
        primary: hexToCSS(baseTheme.background),
        secondary: hexToCSS(baseTheme.backgroundAlt),
        tertiary: hexToCSS(baseTheme.backgroundDark),
      },
      surface: {
        primary: hexToCSS(baseTheme.surface),
        secondary: hexToCSS(baseTheme.backgroundAlt),
        elevated: hexToCSS(baseTheme.backgroundDark),
      },
      text: {
        primary: rgbToCSS(baseTheme.foreground),
        secondary: rgbToCSS(baseTheme.foregroundAlt),
        tertiary: rgbToCSS(baseTheme.foregroundLight),
        inverse: hexToCSS(isDarkMode ? 0xffffff : baseTheme.background),
      },
      border: {
        primary: hexToCSS(baseTheme.border),
        secondary: rgbToCSS(baseTheme.foregroundLight, isDarkMode ? 0.3 : 0.2),
        focus: rgbToCSS(baseTheme.primary),
      },
      interactive: {
        primary: rgbToCSS(baseTheme.primary),
        primaryHover: rgbToCSS(baseTheme.primaryAlt),
        secondary: rgbToCSS(baseTheme.secondary),
        secondaryHover: rgbToCSS(baseTheme.secondaryAlt),
        ghost: 'transparent',
        ghostHover: rgbToCSS(baseTheme.foreground, isDarkMode ? 0.1 : 0.05),
        ghostActive: rgbToCSS(baseTheme.foreground, isDarkMode ? 0.15 : 0.1),
      },
    },
    glass: {
      background: rgbToCSS(
        isDarkMode
          ? { r: 0, g: 0, b: 0 } // Pure black base for dark mode
          : baseTheme.foreground, // Use foreground for light mode
        isDarkMode ? 0.8 : 0.05, // Much more opaque in dark mode
      ),
      backdrop: 'blur(12px)',
      border: rgbToCSS(baseTheme.foreground, isDarkMode ? 0.3 : 0.15), // Brighter glass border in dark mode
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
  }
}

/**
 * Get current base theme based on mode
 */
export const getCurrentBaseTheme = (): BaseTheme => currentThemeMode === 'dark' ? deepSpaceHUDTheme : deepSpaceHUDLightTheme

/**
 * Get current UI theme instance
 */
export const getTheme = (): UITheme => createTheme(getCurrentBaseTheme())

/**
 * Toggle between light and dark themes
 */
export const toggleThemeMode = (): 'light' | 'dark' => {
  currentThemeMode = currentThemeMode === 'dark' ? 'light' : 'dark'
  return currentThemeMode
}

/**
 * Set specific theme mode
 */
export const setThemeMode = (mode: 'light' | 'dark'): void => {
  currentThemeMode = mode
}

/**
 * Get current theme mode
 */
export const getThemeMode = (): 'light' | 'dark' => currentThemeMode

export { createBaseTheme } from '@libtheme/utils/createBaseTheme.ts'
export { createRGB } from '@libtheme/utils/createRGB.ts'
export * from '@libtheme/themes/index.ts'
