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
      heading: {
        fontFamily: typography?.heading?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: typography?.heading?.fontSize || '2.5rem',
        fontWeight: typography?.heading?.fontWeight || 700,
        lineHeight: typography?.heading?.lineHeight || 1.2,
        letterSpacing: typography?.heading?.letterSpacing || 'normal',
        fontStyle: typography?.heading?.fontStyle || 'normal',
      },
      body: {
        fontFamily: typography?.body?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: typography?.body?.fontSize || '1rem',
        fontWeight: typography?.body?.fontWeight || 400,
        lineHeight: typography?.body?.lineHeight || 1.6,
        letterSpacing: typography?.body?.letterSpacing || 'normal',
        fontStyle: typography?.body?.fontStyle || 'normal',
      },
      quote: {
        fontFamily: typography?.quote?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: typography?.quote?.fontSize || '1.125rem',
        fontWeight: typography?.quote?.fontWeight || 400,
        lineHeight: typography?.quote?.lineHeight || 1.7,
        letterSpacing: typography?.quote?.letterSpacing || 'normal',
        fontStyle: typography?.quote?.fontStyle || 'italic',
      },
      logo: {
        fontFamily: typography?.logo?.fontFamily || typography?.heading?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: typography?.logo?.fontSize || '1.5rem',
        fontWeight: typography?.logo?.fontWeight || 600,
        lineHeight: typography?.logo?.lineHeight || 1,
        letterSpacing: typography?.logo?.letterSpacing || 'normal',
        fontStyle: typography?.logo?.fontStyle || 'normal',
      },
      shows: {
        date: {
          fontFamily: typography?.shows?.date?.fontFamily || typography?.heading?.fontFamily ||
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: typography?.shows?.date?.fontSize || '0.875rem',
          fontWeight: typography?.shows?.date?.fontWeight ?? 700,
          lineHeight: typography?.shows?.date?.lineHeight ?? 1.2,
          letterSpacing: typography?.shows?.date?.letterSpacing || 'normal',
          fontStyle: typography?.shows?.date?.fontStyle || 'normal',
        } as const,
        venue: {
          fontFamily: typography?.shows?.venue?.fontFamily || typography?.heading?.fontFamily ||
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: typography?.shows?.venue?.fontSize || '1rem',
          fontWeight: typography?.shows?.venue?.fontWeight ?? 600,
          lineHeight: typography?.shows?.venue?.lineHeight ?? 1.3,
          letterSpacing: typography?.shows?.venue?.letterSpacing || 'normal',
          fontStyle: typography?.shows?.venue?.fontStyle || 'normal',
        } as const,
        meta: {
          fontFamily: typography?.shows?.meta?.fontFamily || typography?.body?.fontFamily ||
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: typography?.shows?.meta?.fontSize || '0.875rem',
          fontWeight: typography?.shows?.meta?.fontWeight ?? 400,
          lineHeight: typography?.shows?.meta?.lineHeight ?? 1.5,
          letterSpacing: typography?.shows?.meta?.letterSpacing || 'normal',
          fontStyle: typography?.shows?.meta?.fontStyle || 'normal',
        } as const,
      },
      fontUrls: typography?.fontUrls,
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
    },
  }
}
