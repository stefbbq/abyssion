import type { BaseSurface, BaseSurfaces, ColorPalette, UISurface, UISurfaces } from '../types.ts'
import { hexToCSS } from '../colorUtils/hexToCSS.ts'
import { rgbToCSS } from '../colorUtils/rgbToCSS.ts'
import { hexStringToRGB } from '../colorUtils/hexStringToRGB.ts'
import { resolveColorReference } from '../utils/resolveColorReference.ts'
import { pipe } from '@lib/utils/pipe.ts'

const numberToHexString = (num: number) => `#${num.toString(16).padStart(6, '0')}`

/**
 * Default surface configurations using palette references
 */
export const createDefaultSurfaces = (): BaseSurfaces => ({
  main: {
    color: 'surface.500',
    opacity: 0.5,
    borderRadius: '0.375rem',
    border: {
      width: '1px',
      style: 'solid',
      color: 'surface.700',
    },
    effects: {
      backdropBlur: '16px',
    },
  },
  shell: {
    color: 'surface.200',
    opacity: 0.85,
    borderRadius: '0.5rem',
    border: {
      width: '1px',
      style: 'solid',
      color: 'surface.700',
    },
    effects: {
      backdropBlur: '20px',
    },
  },
  header: {
    color: 'surface.100',
    opacity: 0.9,
    borderRadius: '0.5rem',
    border: {
      width: '1px',
      style: 'solid',
      color: 'surface.700',
    },
    effects: {
      backdropBlur: '24px',
    },
  },
  title: {
    color: 'surface.100',
    opacity: 1,
    borderRadius: '0.375rem',
    border: {
      width: '1px',
      style: 'solid',
      color: 'surface.700',
    },
    effects: {},
  },
})

// Utility: replace palette references in a string with resolved CSS color
const replacePaletteRefs = (value: string, palette: ColorPalette): string => {
  // Match palette references like 'primary.400', 'background.900', etc.
  return value.replace(/([a-zA-Z]+\.[0-9]+)/g, (match) => {
    const color = resolveColorReference(match, palette)
    return hexToCSS(color)
  })
}

/**
 * Converts a BaseSurface to a UISurface with proper CSS values
 */
const convertToUISurface = (
  surface: BaseSurface,
  palette: ColorPalette,
): UISurface => {
  // Resolve color reference to actual hex color
  const resolvedColor = resolveColorReference(surface.color, palette)

  // Resolve border color if specified
  const borderColor = surface.border?.color ? resolveColorReference(surface.border.color, palette) : resolveColorReference('surface.700', palette)

  // Handle border opacity by converting to rgba if needed
  const borderOpacity = surface.border?.opacity || 1
  const borderColorCSS = borderOpacity < 1
    ? pipe(
      borderColor,
      numberToHexString,
      hexStringToRGB,
      (rgb) => rgbToCSS(rgb, borderOpacity),
    )
    : hexToCSS(borderColor)

  // Get opacity value
  const currentOpacity = surface.opacity || 0.5

  // Helper to parse and replace palette refs in a string
  const parse = (val: string | undefined) => val ? replacePaletteRefs(val, palette) : undefined

  // Helper to wrap backdrop blur values in blur() function
  const parseBackdropBlur = (val: string | undefined) => {
    if (!val) return undefined
    const parsed = replacePaletteRefs(val, palette)
    return parsed.includes('blur(') ? parsed : `blur(${parsed})`
  }

  return {
    background: pipe(
      resolvedColor,
      numberToHexString,
      hexStringToRGB,
      (rgb) => rgbToCSS(rgb, currentOpacity),
    ),
    backgroundColor: hexToCSS(resolvedColor),
    borderColor: borderColorCSS,
    borderRadius: surface.borderRadius || '0.375rem',
    border: {
      width: surface.border?.width || '1px',
      style: surface.border?.style || 'solid',
      color: borderColorCSS,
      opacity: surface.border?.opacity || 1,
    },
    blur: parse(surface.effects?.blur),
    backdropBlur: parseBackdropBlur(surface.effects?.backdropBlur),
    filter: parse(surface.effects?.filter),
    boxShadow: parse(surface.effects?.boxShadow),
    transform: parse(surface.effects?.transform),
  }
}

/**
 * Creates a full UISurfaces configuration from BaseSurfaces
 */
export const createUISurfaces = (
  baseSurfaces: BaseSurfaces,
  palette: ColorPalette,
): UISurfaces => {
  return {
    main: convertToUISurface(baseSurfaces.main, palette),
    shell: convertToUISurface(baseSurfaces.shell, palette),
    header: convertToUISurface(baseSurfaces.header, palette),
    elevated: baseSurfaces.elevated ? convertToUISurface(baseSurfaces.elevated, palette) : undefined,
    title: baseSurfaces.title ? convertToUISurface(baseSurfaces.title, palette) : undefined,
  }
}
