import type { HexColor, RGBColor } from '../types.ts'

/**
 * Border radius scale for consistent rounded corners
 */
export type BaseBorderRadius = {
  /** No radius - sharp corners */
  none: string
  /** Small radius for subtle rounding */
  sm: string
  /** Medium radius for standard rounding */
  md: string
  /** Large radius for prominent rounding */
  lg: string
  /** Extra large radius for very round elements */
  xl: string
  /** Full radius for circular elements */
  full: string
}

/**
 * Opacity overrides for glass morphism effects
 */
export type BaseGlassOpacity = {
  /** Glass opacity in light mode */
  light: number
  /** Glass opacity in dark mode */
  dark: number
}

/**
 * Opacity overrides for frost morphism effects
 */
export type BaseFrostOpacity = {
  /** Frost opacity in light mode */
  light: number
  /** Frost opacity in dark mode */
  dark: number
}

/**
 * Filter effects for different UI elements
 */
export type BaseFilters = {
  /** Filter effects for main content area */
  main?: string
  /** Filter effects for header element */
  header?: string
  /** Filter effects for navigation/action zone */
  nav?: string
}

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
  /** Optional border radius scale (none-full) */
  borderRadius?: Partial<BaseBorderRadius>
  /** Optional glass morphism opacity overrides */
  glassOpacity?: Partial<BaseGlassOpacity>
  /** Optional frost morphism opacity overrides */
  frostOpacity?: Partial<BaseFrostOpacity>
  /** Optional filter effects for UI elements */
  filters?: BaseFilters
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

/**
 * Theme family definition containing both light and dark variants
 */
export type ThemeFamily = {
  /** Theme family name */
  name: string
  /** Light theme variant */
  light: BaseTheme
  /** Dark theme variant */
  dark: BaseTheme
}
