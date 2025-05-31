/**
 * RGB color with normalized values (0-1)
 * Used for precise color calculations and Three.js compatibility
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
 * Hex color as a number (e.g., 0xff0000 for red)
 * Efficient format for shader uniforms and CSS conversions
 */
export type HexColor = number

/**
 * Complete theme definition for the 3D logo visualization system
 * Provides all color values needed across different rendering layers
 */
export type Logo3DTheme = {
  /** Primary brand color - main logo identity */
  primary: RGBColor
  /** Secondary accent color - used for highlights and effects */
  secondary: RGBColor
  /** Tertiary accent color - used for complementary effects */
  accent: RGBColor
  /** Scene background color */
  background: HexColor

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
