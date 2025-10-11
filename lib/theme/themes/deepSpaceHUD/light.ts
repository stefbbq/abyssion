import type { BaseTheme } from '../../types.ts'
import { deepSpaceHUDLightPalette, deepSpaceHUDSemanticPalette } from './palette.ts'

/**
 * deep space hud light theme using the neon grid base theme shape
 */
export const deepSpaceHUDLightTheme: BaseTheme = {
  name: 'deep-space-hud-light',
  mode: 'light',
  palette: {
    ...deepSpaceHUDLightPalette,
    semantic: deepSpaceHUDSemanticPalette,
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
      opacity: 0.86,
      borderRadius: '14px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.18 },
      effects: {
        backdropBlur: '6px',
        boxShadow: '0 0 10px rgba(0,0,0,.12)',
      },
    },
    header: {
      color: 'surface.100',
      opacity: 0.92,
      borderRadius: '14px',
      border: { width: '0px', style: 'none' },
      effects: {
        backdropBlur: '10px',
        boxShadow: '0 10px 20px rgba(0,0,0,.35)',
      },
    },
    elevated: {
      color: 'surface.700',
      opacity: 0.95,
      borderRadius: '10px',
      border: { width: '1px', style: 'solid', color: 'foreground.500', opacity: 0.22 },
      effects: {
        backdropBlur: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
      },
    },
  },
  backgroundOpacity: 0.86,
}
