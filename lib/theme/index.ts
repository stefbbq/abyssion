import type { BaseTheme, UITheme } from './types.ts'
import { deepSpaceHUDTheme } from './themes/index.ts'
import { hexToCSS } from './utils/hexToCSS.ts'
import { rgbToCSS } from './utils/rgbToCSS.ts'

/**
 * Create UI theme from base theme
 */
export const createUITheme = (baseTheme: BaseTheme = deepSpaceHUDTheme): UITheme => ({
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
      inverse: hexToCSS(baseTheme.background),
    },
    border: {
      primary: hexToCSS(baseTheme.border),
      secondary: rgbToCSS(baseTheme.foregroundLight, 0.3),
      focus: rgbToCSS(baseTheme.secondary),
    },
    interactive: {
      primary: rgbToCSS(baseTheme.primary),
      primaryHover: rgbToCSS(baseTheme.primaryAlt),
      secondary: rgbToCSS(baseTheme.secondary),
      secondaryHover: rgbToCSS(baseTheme.secondaryAlt),
      ghost: 'transparent',
      ghostHover: rgbToCSS(baseTheme.foreground, 0.05),
    },
  },
  glass: {
    background: rgbToCSS(baseTheme.background === 0x000000 ? { r: 0, g: 0, b: 0 } : baseTheme.foreground, 0.1),
    backdrop: 'blur(12px)',
    border: rgbToCSS(baseTheme.foreground, 0.1),
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
})

/**
 * Get current UI theme instance
 */
export const getUITheme = (): UITheme => createUITheme()
export { createBaseTheme } from './utils/createBaseTheme.ts'
export { createRGB } from './utils/createRGB.ts'
export * from './themes/index.ts'
