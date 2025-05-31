/**
 * Comprehensive theme system for abyssion
 * Extends the 3D theme for UI components
 */

import type { Logo3DTheme } from '../gl/theme/theme.d.ts'
import { getCurrentTheme } from '../gl/theme/theme.ts'

/**
 * UI-specific theme extensions
 */
export type UITheme = {
  colors: {
    // Background colors
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    // Surface colors
    surface: {
      primary: string
      secondary: string
      elevated: string
    }
    // Text colors
    text: {
      primary: string
      secondary: string
      tertiary: string
      inverse: string
    }
    // Border colors
    border: {
      primary: string
      secondary: string
      focus: string
    }
    // Interactive colors
    interactive: {
      primary: string
      primaryHover: string
      secondary: string
      secondaryHover: string
      ghost: string
      ghostHover: string
    }
  }
  // Glass morphism effects
  glass: {
    background: string
    backdrop: string
    border: string
  }
  // Spacing and sizing
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  // Typography
  typography: {
    fontFamily: string
    fontWeights: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
}

/**
 * Convert RGB color to CSS rgba string
 */
const rgbToCSS = (rgb: { r: number; g: number; b: number }, alpha = 1) =>
  `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, ${alpha})`

/**
 * Convert hex number to CSS hex string
 */
const hexToCSS = (hex: number) => `#${hex.toString(16).padStart(6, '0')}`

/**
 * Create UI theme from 3D theme
 */
export const createUITheme = (): UITheme => {
  const theme3D = getCurrentTheme()

  return {
    colors: {
      background: {
        primary: hexToCSS(theme3D.background),
        secondary: 'rgb(17, 17, 17)',
        tertiary: 'rgb(23, 23, 23)',
      },
      surface: {
        primary: 'rgb(32, 32, 32)',
        secondary: 'rgb(41, 41, 41)',
        elevated: 'rgb(48, 48, 48)',
      },
      text: {
        primary: rgbToCSS(theme3D.primary),
        secondary: 'rgb(163, 163, 163)',
        tertiary: 'rgb(115, 115, 115)',
        inverse: 'rgb(23, 23, 23)',
      },
      border: {
        primary: 'rgb(64, 64, 64)',
        secondary: 'rgb(82, 82, 82)',
        focus: rgbToCSS(theme3D.secondary),
      },
      interactive: {
        primary: rgbToCSS(theme3D.primary),
        primaryHover: rgbToCSS(theme3D.primary, 0.8),
        secondary: rgbToCSS(theme3D.secondary),
        secondaryHover: rgbToCSS(theme3D.secondary, 0.8),
        ghost: 'transparent',
        ghostHover: 'rgba(255, 255, 255, 0.05)',
      },
    },
    glass: {
      background: 'rgba(0, 0, 0, 0.7)',
      backdrop: 'blur(12px)',
      border: 'rgba(255, 255, 255, 0.1)',
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
 * Get current UI theme instance
 */
export const getUITheme = (): UITheme => createUITheme()

// Re-export 3D theme utilities for convenience
export { getCurrentTheme, setTheme } from '../gl/theme/theme.ts'
export type { Logo3DTheme } from '../gl/theme/theme.d.ts'
