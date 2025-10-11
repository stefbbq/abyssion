import type { BaseTheme } from '../../types.ts'
import { monochromeLightPalette, monochromeSemanticPalette } from './palette.ts'

/**
 * monochrome light theme using the neon grid base theme shape
 */
export const monochromeLightTheme: BaseTheme = {
  name: 'monochrome-light',
  mode: 'light',
  palette: {
    ...monochromeLightPalette,
    semantic: monochromeSemanticPalette,
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
      borderRadius: '12px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.18 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 8px rgba(0,0,0,.15)',
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
      borderRadius: '9px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.2 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
      },
    },
  },
  backgroundOpacity: 0.9,
}
