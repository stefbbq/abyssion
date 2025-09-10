import type { BaseTheme } from '../../types.ts'
import { synthwaveLightPalette, synthwaveSemanticPalette } from './palette.ts'

/**
 * synthwave light theme using the neon grid base theme shape
 */
export const synthwaveLightTheme: BaseTheme = {
  name: 'synthwave-light',
  mode: 'light',
  palette: {
    ...synthwaveLightPalette,
    semantic: synthwaveSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'brightness(1.01) contrast(1.02) saturate(1.03)',
      },
    },
    shell: {
      color: 'surface.500',
      opacity: 0.88,
      borderRadius: '14px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.16 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 10px rgba(0,0,0,.14)',
      },
    },
    header: {
      color: 'surface.100',
      opacity: 0.92,
      borderRadius: '12px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 10px 18px rgba(0,0,0,.35)',
      },
    },
    elevated: {
      color: 'surface.700',
      opacity: 0.96,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.18 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
      },
    },
  },
  backgroundOpacity: 0.88,
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
    shellCollapsed: '30px',
    shellExpanded: '18px',
  },
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
}
