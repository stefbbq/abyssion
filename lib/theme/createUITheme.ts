import type { BaseTheme, UITheme } from './index.types.ts'
import { createShades } from './colorUtils/createShades.ts'
import { createDefaultSurfaces, createUISurfaces } from './utils/createUISurfaces.ts'
import { hexToCSS } from './colorUtils/hexToCSS.ts'
import { resolveColorReference } from './utils/resolveColorReference.ts'

/**
 * creates a UITheme from a BaseTheme, exposing the full palette (with shades),
 * a minimal colors object, and surfaces that reference palette keys/shades directly.
 */
export const createUITheme = (baseTheme: BaseTheme): UITheme => {
  const { mode, palette, surfaces, typography, backgroundOpacity, spacing, borderRadius } = baseTheme

  // generate full palette with shades
  const fullPalette = {
    primary: createShades(palette.primary as number),
    secondary: createShades(palette.secondary as number),
    tertiary: createShades(palette.tertiary as number),
    foreground: createShades(palette.foreground as number),
    background: createShades(palette.background as number),
    surface: createShades(palette.surface as number),
    semantic: palette.semantic,
  }

  // minimal direct color references
  const colors = {
    primary: hexToCSS(resolveColorReference('primary.500', fullPalette)),
    secondary: hexToCSS(resolveColorReference('secondary.500', fullPalette)),
    tertiary: hexToCSS(resolveColorReference('tertiary.500', fullPalette)),
    foreground: hexToCSS(resolveColorReference('foreground.500', fullPalette)),
    background: hexToCSS(resolveColorReference('background.500', fullPalette)),
    surface: hexToCSS(resolveColorReference('surface.500', fullPalette)),
    border: {
      primary: hexToCSS(resolveColorReference('surface.500', fullPalette)),
      hover: hexToCSS(resolveColorReference('primary.400', fullPalette)),
    },
    interactive: {
      primary: hexToCSS(resolveColorReference('primary.500', fullPalette)),
      focus: hexToCSS(resolveColorReference('primary.600', fullPalette)),
      hover: hexToCSS(resolveColorReference('primary.400', fullPalette)),
      active: hexToCSS(resolveColorReference('primary.700', fullPalette)),
      disabled: hexToCSS(resolveColorReference('surface.200', fullPalette)),
    },
  }

  // generate UI surfaces (allowing direct palette references)
  const uiSurfaces = createUISurfaces(surfaces || createDefaultSurfaces(), fullPalette, undefined, mode)

  return {
    colors,
    surfaces: uiSurfaces,
    backgroundOpacity: typeof backgroundOpacity === 'number' ? backgroundOpacity : mode === 'light' ? 0.85 : 0.88,
    spacing: {
      xs: spacing?.xs ?? '0.25rem',
      sm: spacing?.sm ?? '0.5rem',
      md: spacing?.md ?? '1rem',
      lg: spacing?.lg ?? '1.5rem',
      xl: spacing?.xl ?? '2rem',
    },
    borderRadius: {
      sm: borderRadius?.sm ?? '0.25rem',
      md: borderRadius?.md ?? '0.5rem',
      lg: borderRadius?.lg ?? '0.75rem',
      xl: borderRadius?.xl ?? '1rem',
      full: borderRadius?.full ?? '9999px',
      shellCollapsed: borderRadius?.shellCollapsed ?? '32px',
      shellExpanded: borderRadius?.shellExpanded ?? '20px',
    },
    typography: {
      fontFamily: {
        heading: typography?.fontFamily?.heading || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body: typography?.fontFamily?.body || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        quote: typography?.fontFamily?.quote || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      fontUrls: typography?.fontUrls,
      fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
  }
}
