import type { BaseTheme, UITheme } from './types.ts'
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
    text: {
      primary: hexToCSS(resolveColorReference('foreground.500', fullPalette)),
      secondary: hexToCSS(resolveColorReference('foreground.300', fullPalette)),
      tertiary: hexToCSS(resolveColorReference('foreground.200', fullPalette)),
    },
    semantic: {
      success: hexToCSS(resolveColorReference('semantic.success', fullPalette)),
      warning: hexToCSS(resolveColorReference('semantic.warning', fullPalette)),
      error: hexToCSS(resolveColorReference('semantic.error', fullPalette)),
      info: hexToCSS(resolveColorReference('semantic.info', fullPalette)),
    },
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
  const uiSurfaces = createUISurfaces(surfaces || createDefaultSurfaces(), fullPalette)

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
        shows: {
          date: typography?.fontFamily?.shows?.date || typography?.fontFamily?.heading || undefined,
          venue: typography?.fontFamily?.shows?.venue || typography?.fontFamily?.heading || undefined,
          meta: typography?.fontFamily?.shows?.meta || typography?.fontFamily?.body || undefined,
        },
      },
      fontUrls: typography?.fontUrls,
      fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      fontSizes: {
        xs: typography?.fontSizes?.xs || '0.75rem',
        sm: typography?.fontSizes?.sm || '0.875rem',
        base: typography?.fontSizes?.base || '1rem',
        lg: typography?.fontSizes?.lg || '1.125rem',
        xl: typography?.fontSizes?.xl || '1.25rem',
        '2xl': typography?.fontSizes?.['2xl'] || '1.5rem',
        '3xl': typography?.fontSizes?.['3xl'] || '1.875rem',
        '4xl': typography?.fontSizes?.['4xl'] || '2.25rem',
        '5xl': typography?.fontSizes?.['5xl'] || '3rem',
        '6xl': typography?.fontSizes?.['6xl'] || '3.75rem',
      },
    },
  }
}
