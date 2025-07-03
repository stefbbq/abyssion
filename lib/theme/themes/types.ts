import type { HexColor, RGBColor } from '../types.ts'

/**
 * Primitive color palette - the raw color values
 */
export type ColorPalette = {
  /** Primary brand colors */
  primary: {
    50: HexColor
    100: HexColor
    200: HexColor
    300: HexColor
    400: HexColor
    500: HexColor // Main primary color
    600: HexColor
    700: HexColor
    800: HexColor
    900: HexColor
  }
  /** Secondary brand colors */
  secondary: {
    50: HexColor
    100: HexColor
    200: HexColor
    300: HexColor
    400: HexColor
    500: HexColor // Main secondary color
    600: HexColor
    700: HexColor
    800: HexColor
    900: HexColor
  }
  /** Accent colors */
  accent: {
    50: HexColor
    100: HexColor
    200: HexColor
    300: HexColor
    400: HexColor
    500: HexColor // Main accent color
    600: HexColor
    700: HexColor
    800: HexColor
    900: HexColor
  }
  /** Neutral/grayscale colors */
  neutral: {
    0: HexColor // Pure white
    50: HexColor
    100: HexColor
    200: HexColor
    300: HexColor
    400: HexColor
    500: HexColor // Mid gray
    600: HexColor
    700: HexColor
    800: HexColor
    900: HexColor
    950: HexColor // Almost black
    1000: HexColor // Pure black
  }
  /** Semantic colors */
  semantic: {
    success: HexColor
    warning: HexColor
    error: HexColor
    info: HexColor
  }
}

/**
 * Semantic color roles - references to palette colors
 */
export type ColorRoles = {
  /** Surface color roles */
  surface: {
    primary: string // e.g., 'primary.500'
    secondary: string // e.g., 'secondary.500'
    tertiary: string // e.g., 'accent.500'
    neutral: string // e.g., 'neutral.50'
    elevated: string // e.g., 'neutral.100'
  }
  /** Background color roles */
  background: {
    primary: string // e.g., 'neutral.0'
    secondary: string // e.g., 'neutral.50'
    tertiary: string // e.g., 'neutral.100'
  }
  /** Border color roles */
  border: {
    primary: string // e.g., 'neutral.200'
    secondary: string // e.g., 'neutral.300'
    focus: string // e.g., 'primary.500'
  }
  /** Text color roles */
  text: {
    primary: string // e.g., 'neutral.900'
    secondary: string // e.g., 'neutral.700'
    tertiary: string // e.g., 'neutral.500'
    inverse: string // e.g., 'neutral.0'
  }
  /** Interactive element roles */
  interactive: {
    primary: string // e.g., 'primary.500'
    secondary: string // e.g., 'secondary.500'
    tertiary: string // e.g., 'accent.500'
  }
}

/**
 * Border configuration for surfaces
 */
export type BaseBorder = {
  /** Border width (e.g., '1px', '2px', 'none') */
  width: string
  /** Border style (e.g., 'solid', 'dashed', 'dotted', 'none') */
  style: string
  /** Border color role (e.g., 'border.primary', 'primary.500') */
  color?: string
}

/**
 * Visual effects for surfaces
 */
export type BaseSurfaceEffects = {
  /** CSS blur filter (e.g., 'blur(4px)') */
  blur?: string
  /** CSS backdrop-blur filter (e.g., 'backdrop-blur(8px)') */
  backdropBlur?: string
  /** Custom CSS filter effects (e.g., 'brightness(1.1) contrast(1.05)') */
  filter?: string
  /** Box shadow effects (e.g., '0 4px 6px rgba(0, 0, 0, 0.1)') */
  boxShadow?: string
  /** CSS transform effects (e.g., 'scale(1.02) perspective(1000px)') */
  transform?: string
}

/**
 * Opacity configuration for light/dark modes
 */
export type BaseSurfaceOpacity = {
  /** Opacity in light mode */
  light: number
  /** Opacity in dark mode */
  dark: number
}

/**
 * Complete surface configuration
 */
export type BaseSurface = {
  /** Surface color role (e.g., 'surface.primary', 'primary.500') */
  color: string
  /** Surface opacity for light/dark modes */
  opacity?: BaseSurfaceOpacity
  /** Border radius (e.g., '0.5rem', '8px', 'none') */
  borderRadius?: string
  /** Border configuration */
  border?: BaseBorder
  /** Visual effects for the surface */
  effects?: BaseSurfaceEffects
}

/**
 * Surface system configuration
 */
export type BaseSurfaces = {
  /** Main content surface */
  main: BaseSurface
  /** Alternative surface for secondary content */
  alt: BaseSurface
  /** Header surface (optional - falls back to main) */
  header?: BaseSurface
  /** Navigation/action zone surface (optional - falls back to main) */
  nav?: BaseSurface
  /** Card surface (optional - falls back to alt) */
  card?: BaseSurface
  /** Input/form surface (optional - falls back to alt) */
  input?: BaseSurface
  /** Button surface (optional - falls back to main) */
  button?: BaseSurface
  /** Dropdown/modal surface (optional - falls back to alt) */
  dropdown?: BaseSurface
}

/**
 * Canonical theme definition for all theme systems (UI and GL).
 * Contains color palette, semantic roles, and surface configurations.
 * Used as the source for UITheme and GLTheme generation.
 */
export type BaseTheme = {
  /** Theme name (unique string) */
  name: string
  /** Theme mode: 'light' or 'dark' */
  mode: 'light' | 'dark'
  /** Color palette - primitive color values */
  palette: ColorPalette
  /** Semantic color roles - references to palette colors */
  colorRoles: ColorRoles
  /** Surface system configuration */
  surfaces: BaseSurfaces
  /** Optional typography settings (font families, weights, urls) */
  typography?: Partial<BaseTypography>
  /** Optional spacing scale (xs-xl) */
  spacing?: Partial<BaseSpacing>
  /** Optional themed background opacity overrides */
  backgroundOpacity?: Partial<BaseBackgroundOpacity>

  // Legacy properties for backward compatibility (computed from palette/colorRoles)
  /** @deprecated Use palette and colorRoles instead */
  primary?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  primaryAlt?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  primaryDark?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  secondary?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  secondaryAlt?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  secondaryDark?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  accent?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  accentAlt?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  accentDark?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  background?: HexColor
  /** @deprecated Use palette and colorRoles instead */
  backgroundAlt?: HexColor
  /** @deprecated Use palette and colorRoles instead */
  backgroundDark?: HexColor
  /** @deprecated Use palette and colorRoles instead */
  foreground?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  foregroundAlt?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  foregroundLight?: RGBColor
  /** @deprecated Use palette and colorRoles instead */
  border?: HexColor
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
 * Opacity overrides for themed background overlay
 */
export type BaseBackgroundOpacity = {
  /** Background overlay opacity in light mode */
  light: number
  /** Background overlay opacity in dark mode */
  dark: number
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

// Legacy types for backward compatibility (deprecated)
/**
 * @deprecated Use BaseSurfaces instead
 */
export type BaseBorderRadius = {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

/**
 * @deprecated Use BaseSurfaces instead
 */
export type BaseGlassOpacity = {
  light: number
  dark: number
}

/**
 * @deprecated Use BaseSurfaces instead
 */
export type BaseFrostOpacity = {
  light: number
  dark: number
}

/**
 * @deprecated Use BaseSurfaces instead
 */
export type BaseFilters = {
  main?: string
  header?: string
  nav?: string
}
