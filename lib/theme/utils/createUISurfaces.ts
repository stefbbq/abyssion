import type { BaseSurface, BaseSurfaces, ColorPalette, ColorRoles } from '../themes/types.ts'
import type { UISurface, UISurfaces } from '../types.ts'
import { hexToCSS } from '../colorUtils/hexToCSS.ts'
import { rgbToCSS } from '../colorUtils/rgbToCSS.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { resolveColorReference } from '../utils/resolveColorReference.ts'
import { pipe } from '@lib/utils/pipe.ts'

const numberToHexString = (num: number) => `#${num.toString(16).padStart(6, '0')}`

/**
 * Default surface configurations using semantic color references
 */
export const createDefaultSurfaces = (): BaseSurfaces => ({
  main: {
    color: 'surface.primary',
    opacity: {
      light: 0.4,
      dark: 0.5,
    },
    borderRadius: '0.375rem',
    border: {
      width: '1px',
      style: 'solid',
      color: 'border.primary',
    },
    effects: {
      backdropBlur: '16px',
    },
  },
  alt: {
    color: 'surface.secondary',
    opacity: {
      light: 0.9,
      dark: 0.85,
    },
    borderRadius: '0.5rem',
    border: {
      width: '1px',
      style: 'solid',
      color: 'border.primary',
    },
    effects: {
      backdropBlur: '20px',
    },
  },
})

/**
 * Converts a BaseSurface to a UISurface with proper CSS values
 */
const convertToUISurface = (
  surface: BaseSurface,
  palette: ColorPalette,
  colorRoles: ColorRoles,
  mode: 'light' | 'dark',
): UISurface => {
  // Resolve color reference to actual hex color
  const resolvedColor = resolveColorReference(surface.color, palette, colorRoles)

  // Resolve border color if specified
  const borderColor = surface.border?.color
    ? resolveColorReference(surface.border.color, palette, colorRoles)
    : resolveColorReference('border.primary', palette, colorRoles)

  // Get opacity for current mode
  const currentOpacity = mode === 'dark' ? (surface.opacity?.dark || 0.5) : (surface.opacity?.light || 0.4)

  return {
    // Background colors for Tailwind compatibility
    background: pipe(
      resolvedColor,
      numberToHexString,
      hexStringToRGB,
      (rgb) => rgbToCSS(rgb, currentOpacity),
    ),
    backgroundColor: hexToCSS(resolvedColor),
    borderColor: hexToCSS(borderColor),
    borderRadius: surface.borderRadius || '0.375rem',
    opacity: surface.opacity || { light: 0.4, dark: 0.5 },

    // Border configuration (kept for legacy compatibility)
    border: {
      width: surface.border?.width || '1px',
      style: surface.border?.style || 'solid',
      color: hexToCSS(borderColor),
    },

    // Effects flattened to top level for Tailwind variable compatibility
    blur: surface.effects?.blur,
    backdropBlur: surface.effects?.backdropBlur ? `blur(${surface.effects.backdropBlur})` : undefined,
    filter: surface.effects?.filter,
    boxShadow: surface.effects?.boxShadow,
    transform: surface.effects?.transform,

    // Legacy effects object for backward compatibility
    effects: {
      blur: surface.effects?.blur,
      backdropBlur: surface.effects?.backdropBlur ? `blur(${surface.effects.backdropBlur})` : undefined,
      filter: surface.effects?.filter,
      boxShadow: surface.effects?.boxShadow,
      transform: surface.effects?.transform,
    },
  }
}

/**
 * Creates a full UISurfaces configuration from BaseSurfaces
 */
export const createUISurfaces = (
  baseSurfaces: BaseSurfaces,
  palette: ColorPalette,
  colorRoles: ColorRoles,
  mode: 'light' | 'dark',
): UISurfaces => {
  const main = convertToUISurface(baseSurfaces.main, palette, colorRoles, mode)
  const alt = convertToUISurface(baseSurfaces.alt, palette, colorRoles, mode)

  return {
    main,
    alt,
    header: baseSurfaces.header ? convertToUISurface(baseSurfaces.header, palette, colorRoles, mode) : main,
    nav: baseSurfaces.nav ? convertToUISurface(baseSurfaces.nav, palette, colorRoles, mode) : main,
    card: baseSurfaces.card ? convertToUISurface(baseSurfaces.card, palette, colorRoles, mode) : alt,
    input: baseSurfaces.input ? convertToUISurface(baseSurfaces.input, palette, colorRoles, mode) : alt,
    button: baseSurfaces.button ? convertToUISurface(baseSurfaces.button, palette, colorRoles, mode) : main,
    dropdown: baseSurfaces.dropdown ? convertToUISurface(baseSurfaces.dropdown, palette, colorRoles, mode) : alt,
  }
}
