import type { BaseTheme, ColorPalette, ColorRoles } from './themes/types.ts'
import type { UITheme } from './types.ts'
import { hexToCSS } from './colorUtils/hexToCSS.ts'
import { createPaletteWithShades, resolveColorReference } from './utils/resolveColorReference.ts'
import { createUITheme } from './createUITheme.ts'

/**
 * Extended BaseTheme type for backward compatibility during transition
 */
type LegacyBaseTheme = BaseTheme & {
  surface?: number
  surfaceAlt?: number
  borderRadius?: any
  glassOpacity?: any
  frostOpacity?: any
  filters?: any
}

/**
 * Creates a palette and color roles from legacy theme properties
 * Used for backward compatibility with existing themes
 */
const createLegacyPaletteAndRoles = (baseTheme: any): { palette: ColorPalette; colorRoles: ColorRoles } => {
  // Helper to convert RGB to hex number
  const rgbToHex = (rgb: { r: number; g: number; b: number }) => {
    const r = Math.round(rgb.r * 255)
    const g = Math.round(rgb.g * 255)
    const b = Math.round(rgb.b * 255)
    return (r << 16) | (g << 8) | b
  }

  // Create palette from legacy colors
  const palette = createPaletteWithShades({
    primary: baseTheme.primary ? rgbToHex(baseTheme.primary) : 0xff2d55,
    secondary: baseTheme.secondary ? rgbToHex(baseTheme.secondary) : 0x2EC2FF,
    accent: baseTheme.accent ? rgbToHex(baseTheme.accent) : 0xFFF42E,
    neutral: baseTheme.background || 0xf8f8f8,
  })

  // Create color roles mapping
  const colorRoles: ColorRoles = {
    surface: {
      primary: 'primary.500',
      secondary: 'secondary.500',
      tertiary: 'accent.500',
      neutral: baseTheme.mode === 'light' ? 'neutral.50' : 'neutral.800',
      elevated: baseTheme.mode === 'light' ? 'neutral.100' : 'neutral.700',
    },
    background: {
      primary: baseTheme.mode === 'light' ? 'neutral.0' : 'neutral.950',
      secondary: baseTheme.mode === 'light' ? 'neutral.50' : 'neutral.900',
      tertiary: baseTheme.mode === 'light' ? 'neutral.100' : 'neutral.800',
    },
    border: {
      primary: baseTheme.mode === 'light' ? 'neutral.200' : 'neutral.700',
      secondary: baseTheme.mode === 'light' ? 'neutral.300' : 'neutral.600',
      focus: 'primary.500',
    },
    text: {
      primary: baseTheme.mode === 'light' ? 'neutral.900' : 'neutral.100',
      secondary: baseTheme.mode === 'light' ? 'neutral.700' : 'neutral.300',
      tertiary: baseTheme.mode === 'light' ? 'neutral.500' : 'neutral.500',
      inverse: baseTheme.mode === 'light' ? 'neutral.0' : 'neutral.900',
    },
    interactive: {
      primary: 'primary.500',
      secondary: 'secondary.500',
      tertiary: 'accent.500',
    },
  }

  return { palette, colorRoles }
}

/**
 * Creates a UITheme from a legacy BaseTheme structure
 * Converts old theme properties to new semantic structure internally
 */
export const createLegacyUITheme = (baseTheme: BaseTheme): UITheme => {
  const legacyTheme = baseTheme as LegacyBaseTheme

  // Create palette and color roles from legacy structure
  const { palette, colorRoles } = createLegacyPaletteAndRoles(legacyTheme)

  // Create the UITheme using the semantic structure
  const uiTheme = createUITheme({
    ...baseTheme,
    palette,
    colorRoles,
  })

  // Add legacy support for backward compatibility
  if (legacyTheme.surface !== undefined || legacyTheme.surfaceAlt !== undefined) {
    uiTheme.surface = {
      primary: hexToCSS(legacyTheme.surface || resolveColorReference('surface.neutral', palette, colorRoles)),
      secondary: hexToCSS(legacyTheme.surfaceAlt || resolveColorReference('surface.elevated', palette, colorRoles)),
      elevated: uiTheme.colors.background.tertiary,
    }
  }

  // Legacy glass/frost support
  if (legacyTheme.glassOpacity) {
    uiTheme.glass = {
      background: uiTheme.surfaces.main.background,
      backdrop: uiTheme.surfaces.main.effects.backdropBlur || '16px',
      border: uiTheme.surfaces.main.border.width === '0px' ? '0px' : uiTheme.surfaces.main.border.color,
      opacity: uiTheme.surfaces.main.opacity,
    }
  }

  if (legacyTheme.frostOpacity) {
    uiTheme.frost = {
      background: uiTheme.surfaces.alt.background,
      backdrop: uiTheme.surfaces.alt.effects.backdropBlur || '20px',
      border: uiTheme.surfaces.alt.border.width === '0px' ? '0px' : uiTheme.surfaces.alt.border.color,
      opacity: uiTheme.surfaces.alt.opacity,
    }
  }

  // Legacy border radius and filters
  if (legacyTheme.borderRadius) {
    uiTheme.borderRadius = { ...legacyTheme.borderRadius }
  }

  if (legacyTheme.filters) {
    uiTheme.filters = { ...legacyTheme.filters }
  }

  return uiTheme
}
