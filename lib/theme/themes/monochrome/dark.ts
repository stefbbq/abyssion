import type { BaseTheme } from '../../types.ts'
import { monochromeDarkPalette, monochromeSemanticPalette } from './palette.ts'

/**
 * monochrome dark theme using the neon grid base theme shape
 */
export const monochromeDarkTheme: BaseTheme = {
  name: 'monochrome-dark',
  mode: 'dark',
  palette: {
    ...monochromeDarkPalette,
    semantic: monochromeSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      effects: {
        filter: 'brightness(1.02) contrast(1.08)',
      },
    },
    shell: {
      color: 'surface.950',
      opacity: 0.8,
      borderRadius: '14px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.22 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 10px rgba(0,0,0,.2)',
      },
    },
    header: {
      color: 'surface.1000',
      opacity: 0.92,
      borderRadius: '12px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 10px 20px rgba(0,0,0,.5)',
      },
    },
    elevated: {
      color: 'surface.600',
      opacity: 1,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.25 },
      effects: {},
    },
  },
  backgroundOpacity: 0.8,
}
