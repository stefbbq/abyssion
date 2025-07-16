/**
 * Shades of a color, inluding the middle neutral
 */
export type Shades = {
  50: number
  100: number
  200: number
  300: number
  400: number
  500: number
  neutral: number
  600: number
  700: number
  800: number
  900: number
  950: number
  1000: number
}

/**
 * Surface configuration for UI rendering
 */
export type UISurface = {
  background: string
  backgroundColor: string
  borderColor: string
  borderRadius: string
  border: {
    width: string
    style: string
    color: string
    opacity: number
  }

  /**
   * Flattened effect properties for Tailwind variable compatibility
   */
  blur?: string
  backdropBlur?: string
  filter?: string
  boxShadow?: string
  transform?: string
}

/**
 * Surface system for UI components
 */
export type UISurfaces = {
  // Main container
  main: UISurface
  // Shells (content section containers)
  shell: UISurface
  // Header
  header: UISurface
}

/**
 * UI-specific theme extensions
 */
export type UITheme = {
  colors: ColorPalette
  surfaces: UISurfaces
  backgroundOpacity: {
    light: number
    dark: number
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
    shellCollapsed: string
    shellExpanded: string
  }
  typography: {
    fontFamily: {
      heading: string
      body: string
      quote: string
    }
    fontUrls?: string[]
    fontWeights: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
}

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
 * GL-specific theme extension for GL visualization
 * Extends base theme with rendering layer specific colors
 */
export type GLTheme = {
  primary: RGBColor
  secondary: RGBColor
  accent: RGBColor
  stencilColor: RGBColor
  baseLayerColor: RGBColor
  outlineColor: RGBColor
  background: HexColor | RGBColor
  ghostingColors: {
    cyan: RGBColor
    magenta: RGBColor
  }
  ui: {
    accentColor1: HexColor
    accentColor2: HexColor
    hexagonColor: HexColor
    centralCircleColor: HexColor
    centerCrosshairColor: HexColor
    gridColor: HexColor
  }
  geometric: {
    primaryColor: HexColor
    secondaryColor: HexColor
  }
  lensFlare: {
    mainFlareColor: HexColor
    secondaryFlareColor: HexColor
    tertiaryFlareColor: HexColor
  }
}

export type BaseColorPalette = {
  primary: HexColor | Shades
  secondary: HexColor | Shades
  tertiary: HexColor | Shades
  foreground: HexColor | Shades
  background: HexColor | Shades
  surface: HexColor | Shades
}

export type BaseColorSemantic = {
  success: HexColor | Shades
  warning: HexColor | Shades
  error: HexColor | Shades
  info: HexColor | Shades
}

/**
 * Primitive color palette - the raw color values
 */
export type ColorPalette = BaseColorPalette & {
  semantic: BaseColorSemantic
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
  /** Border opacity (0-1) */
  opacity?: number
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
 * Surface opacity configuration
 */
export type BaseSurfaceOpacity = number

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
  main: BaseSurface
  shell: BaseSurface
  header: BaseSurface
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
  /** Surface system configuration */
  surfaces: BaseSurfaces
  /** Optional typography settings (font families, weights, urls) */
  typography?: Partial<BaseTypography>
  /** Optional spacing scale (xs-xl) */
  spacing?: Partial<BaseSpacing>
  /** Optional border radius scale */
  borderRadius?: Partial<BaseBorderRadius>
  /** Optional themed background opacity overrides */
  backgroundOpacity?: Partial<BaseBackgroundOpacity>
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

/**
 * Border radius scale for a theme
 */
export type BaseBorderRadius = {
  sm: string
  md: string
  lg: string
  xl: string
  full: string
  shellCollapsed: string
  shellExpanded: string
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
