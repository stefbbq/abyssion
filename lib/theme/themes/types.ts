import type { HexColor, RGBColor } from '../types.ts'

/**
 * Canonical theme definition for all theme systems (UI and GL).
 * Contains all core color, background, and typography fields, plus variants for light/dark and hover states.
 * Used as the source for UITheme and GLTheme generation.
 */
export type BaseTheme = {
  /** Theme name (unique string) */
  name: string
  /** Theme mode: 'light' or 'dark' */
  mode: 'light' | 'dark'
  /** Main brand color (RGB) */
  primary: RGBColor
  /** Lighter variant of primary */
  primaryAlt: RGBColor
  /** Darker variant of primary */
  primaryDark: RGBColor
  /** Secondary brand color (RGB) */
  secondary: RGBColor
  /** Lighter variant of secondary */
  secondaryAlt: RGBColor
  /** Darker variant of secondary */
  secondaryDark: RGBColor
  /** Accent color (RGB) */
  accent: RGBColor
  /** Lighter variant of accent */
  accentAlt: RGBColor
  /** Darker variant of accent */
  accentDark: RGBColor
  /** Main background color (hex) */
  background: HexColor
  /** Alternative background color (hex) */
  backgroundAlt: HexColor
  /** Dark background variant (hex) */
  backgroundDark: HexColor
  /** Main text color (RGB) */
  foreground: RGBColor
  /** Secondary text color (RGB) */
  foregroundAlt: RGBColor
  /** Tertiary text color (RGB) */
  foregroundLight: RGBColor
  /** Border color (hex) */
  border: HexColor
  /** Surface color for cards/containers (hex) */
  surface: HexColor
  /** Alternative surface color (hex) */
  surfaceAlt: HexColor
  /** Optional typography settings (font families, weights, urls) */
  typography?: Partial<BaseTypography>
  /** Optional spacing scale (xs-xl) */
  spacing?: Partial<BaseSpacing>
}

/**
 * Typography settings for a theme
 */
export type BaseTypography = {
  fontFamily: {
    heading?: string
    body?: string
    quote?: string
  }
  fontUrls?: string[]
  fontWeights: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

/**
 * Spacing scale for a theme
 */
export type BaseSpacing = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}
