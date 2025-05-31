import type { HexColor, Logo3DTheme, RGBColor } from '../theme.d.ts'
import { rgbToHex } from './rgbToHex.ts'
import { darkenHex } from './darkenHex.ts'

/**
 * Base theme builder type for creating themes with required core values
 */
type ThemeBuilder = {
  readonly primary: RGBColor
  readonly secondary: RGBColor
  readonly accent: RGBColor
  readonly background: HexColor
}

/**
 * Creates a complete theme from core color values using sensible defaults
 * Pure function that builds a theme object without side effects
 */
export const createTheme = (builder: ThemeBuilder): Logo3DTheme => ({
  primary: builder.primary,
  secondary: builder.secondary,
  accent: builder.accent,
  background: builder.background,

  // logo layers default to white stencil system
  stencilColor: { r: 1, g: 1, b: 1 },
  baseLayerColor: { r: 1, g: 1, b: 1 },
  outlineColor: { r: 1, g: 1, b: 1 },
  ghostingColors: {
    cyan: builder.secondary,
    magenta: builder.accent,
  },

  // ui defaults derived from core colors
  ui: {
    accentColor1: rgbToHex(builder.secondary),
    accentColor2: rgbToHex(builder.accent),
    hexagonColor: 0xffffff,
    centralCircleColor: rgbToHex(builder.secondary),
    centerCrosshairColor: 0xffffff,
    gridColor: 0x999999,
  },

  // geometric defaults
  geometric: {
    primaryColor: rgbToHex(builder.secondary),
    secondaryColor: rgbToHex(builder.accent),
  },

  // lens flare defaults
  lensFlare: {
    mainFlareColor: rgbToHex(builder.secondary),
    secondaryFlareColor: darkenHex(rgbToHex(builder.secondary))(0.8),
    tertiaryFlareColor: rgbToHex(builder.accent),
  },
})
