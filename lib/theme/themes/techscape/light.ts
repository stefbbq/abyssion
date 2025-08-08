import type { BaseTheme } from '../../index.types.ts'
import { techscapeLightPalette, techscapeSemanticPalette } from './palette.ts'

/**
 * techscape light theme using the neon grid base theme shape
 */
export const techscapeLightTheme: BaseTheme = {
  name: 'techscape-light',
  mode: 'light',
  palette: {
    ...techscapeLightPalette,
    semantic: techscapeSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'brightness(1.01) contrast(1.02)',
      },
    },
    shell: {
      color: 'surface.500',
      opacity: 0.9,
      borderRadius: '14px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.18 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 8px rgba(0,0,0,.12)',
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
      opacity: 0.95,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.2 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
      },
    },
  },
  backgroundOpacity: 0.9,
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
