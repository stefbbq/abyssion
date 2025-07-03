import type { BaseSurfaces, BaseTheme } from './themes/types.ts'

/**
 * Surface configuration for UI rendering
 */
export type UISurface = {
  /** Background color as CSS value with opacity */
  background: string
  /** Base background color without opacity for Tailwind variables */
  backgroundColor: string
  /** Border color for Tailwind variables */
  borderColor: string
  /** Border radius as CSS value */
  borderRadius: string
  /** Opacity for light/dark modes */
  opacity: {
    light: number
    dark: number
  }
  /** Border configuration */
  border: {
    width: string
    style: string
    color: string
  }

  // Flattened effect properties for Tailwind variable compatibility
  /** CSS blur filter */
  blur?: string
  /** CSS backdrop-blur filter */
  backdropBlur?: string
  /** CSS filter effects */
  filter?: string
  /** Box shadow effects */
  boxShadow?: string
  /** CSS transform effects */
  transform?: string

  /** Legacy effects object for backward compatibility */
  effects: {
    blur?: string
    backdropBlur?: string
    filter?: string
    boxShadow?: string
    transform?: string
  }
}

/**
 * Surface system for UI components
 */
export type UISurfaces = {
  /** Main content surface */
  main: UISurface
  /** Alternative surface for secondary content */
  alt: UISurface
  /** Header surface */
  header: UISurface
  /** Navigation/action zone surface */
  nav: UISurface
  /** Card surface */
  card: UISurface
  /** Input/form surface */
  input: UISurface
  /** Button surface */
  button: UISurface
  /** Dropdown/modal surface */
  dropdown: UISurface
}

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
  // Surface system configuration
  surfaces: UISurfaces
  // Themed background opacity controls
  backgroundOpacity: {
    light: number
    dark: number
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

  // Legacy support (deprecated)
  /** @deprecated Use surfaces instead */
  surface?: {
    primary: string
    secondary: string
    elevated: string
  }
  /** @deprecated Use surfaces instead */
  glass?: {
    background: string
    backdrop: string
    border: string
    opacity: {
      light: number
      dark: number
    }
  }
  /** @deprecated Use surfaces instead */
  frost?: {
    background: string
    backdrop: string
    border: string
    opacity: {
      light: number
      dark: number
    }
  }
  /** @deprecated Use surfaces instead */
  borderRadius?: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  /** @deprecated Use surfaces instead */
  filters?: {
    main?: string
    header?: string
    nav?: string
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
 * GL-specific theme extension for GL visualization
 * Extends base theme with rendering layer specific colors
 */
export type GLTheme = BaseTheme & {
  /** Base stencil mask color for logo rendering */
  stencilColor: RGBColor
  /** Solid base layer underneath logo outlines */
  baseLayerColor: RGBColor
  /** Main logo outline color */
  outlineColor: RGBColor
  /** Ghosting effect colors for depth and dimension */
  ghostingColors: {
    /** Cyan ghosting layer for cool highlights */
    cyan: RGBColor
    /** Magenta ghosting layer for warm highlights */
    magenta: RGBColor
  }

  /** UI overlay element colors for HUD and interface */
  ui: {
    /** Primary UI accent color for interactive elements */
    accentColor1: HexColor
    /** Secondary UI accent color for state changes */
    accentColor2: HexColor
    /** Hexagonal grid overlay color */
    hexagonColor: HexColor
    /** Central targeting circle color */
    centralCircleColor: HexColor
    /** Crosshair reticle color */
    centerCrosshairColor: HexColor
    /** Background grid line color */
    gridColor: HexColor
  }

  /** Geometric decoration layer colors for 3D shapes */
  geometric: {
    /** Primary color for orbital rings and paths */
    primaryColor: HexColor
    /** Secondary color for particles and markers */
    secondaryColor: HexColor
  }

  /** Lens flare effect colors for atmospheric lighting */
  lensFlare: {
    /** Main bright flare color at light source */
    mainFlareColor: HexColor
    /** Secondary flare rings and halos */
    secondaryFlareColor: HexColor
    /** Outer atmospheric glow color */
    tertiaryFlareColor: HexColor
  }
}

export type {
  BaseBackgroundOpacity,
  BaseBorderRadius,
  BaseFilters,
  BaseFrostOpacity,
  BaseGlassOpacity,
  BaseSpacing,
  BaseTheme,
  BaseTypography,
  ThemeFamily,
} from './themes/types.ts'
