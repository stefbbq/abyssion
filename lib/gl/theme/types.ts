/**
 * GL theme type definitions
 * Re-exports shared types and GL-specific extensions
 */

import type { BaseTheme, HexColor, RGBColor } from '@libtheme/types.ts'

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
