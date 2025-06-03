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
      ghostActive: string
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
 * Base color types for shared theme system
 */

/**
 * RGB color with normalized values for precise calculations
 */
export type RGBColor = {
  /** Red component (0.0 - 1.0) */
  r: number
  /** Green component (0.0 - 1.0) */
  g: number
  /** Blue component (0.0 - 1.0) */
  b: number
}

/**
 * Hex color as number for efficient operations
 */
export type HexColor = number

/**
 * Color variant group with main color and variations
 */
export type ColorVariant = {
  /** Main color */
  main: RGBColor
  /** Alternative/hover color */
  alt: RGBColor
  /** Dark variant */
  dark: RGBColor
}

/**
 * Background color variations
 */
export type BackgroundColors = {
  /** Primary background */
  main: HexColor
  /** Alternative background */
  alt: HexColor
  /** Dark background variant */
  dark: HexColor
}

/**
 * Foreground text color variations
 */
export type ForegroundColors = {
  /** Primary text color */
  main: RGBColor
  /** Alternative text color */
  alt: RGBColor
  /** Light text variant */
  light: RGBColor
}

/**
 * Simple base theme with original properties plus variants
 * Backward compatible with all existing code
 */
export type BaseTheme = {
  name: string
  mode: 'light' | 'dark'
  primary: RGBColor
  primaryAlt: RGBColor
  primaryDark: RGBColor
  secondary: RGBColor
  secondaryAlt: RGBColor
  secondaryDark: RGBColor
  accent: RGBColor
  accentAlt: RGBColor
  accentDark: RGBColor
  background: HexColor
  backgroundAlt: HexColor
  backgroundDark: HexColor
  foreground: RGBColor
  foregroundAlt: RGBColor
  foregroundLight: RGBColor
  border: HexColor
  surface: HexColor
}
