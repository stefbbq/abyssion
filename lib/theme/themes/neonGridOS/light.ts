import type { BaseTheme } from '../../index.types.ts'
import { neonGridLightPalette, neonGridSemanticPalette } from './palette.ts'

export const neonGridOSLightTheme: BaseTheme = {
  name: 'neon-grid-os',
  mode: 'light',
  palette: {
    ...neonGridLightPalette,
    semantic: neonGridSemanticPalette,
  },
  surfaces: {
    main: {
      color: 'surface.500',
      opacity: { light: 0.85, dark: 0.88 },
      borderRadius: '2px',
      border: { width: '2px', style: 'solid', color: 'foreground.500' },
      // effects: {
      //   backdropBlur: '10px',
      //   filter: 'perspective(800px) rotateX(0.8deg) scale(1.003, 0.997) brightness(1.05) contrast(1.08) hue-rotate(1deg)',
      //   boxShadow: '0 0 8px rgba(255, 69, 110, 0.4)',
      // },
    },
    shell: {
      color: 'surface.500',
      opacity: { light: 0.85, dark: 0.88 },
      borderRadius: '2px',
      border: { width: '2px', style: 'solid', color: 'foreground.500' },
      // effects: {
      //   backdropBlur: '10px',
      //   filter: 'perspective(800px) rotateX(0.8deg) scale(1.003, 0.997) brightness(1.05) contrast(1.08) hue-rotate(1deg)',
      //   boxShadow: '0 0 8px rgba(255, 69, 110, 0.4)',
      // },
    },
    header: {
      color: 'surface.200',
      opacity: { light: 0.9, dark: 0.9 },
      borderRadius: '0px',
      border: { width: '0px', style: 'none' },
      // effects: {
      //   filter: 'brightness(1.02) saturate(1.05) drop-shadow(0 0 1px rgba(255, 69, 110, 0.4))',
      //   boxShadow: '0 2px 8px rgba(255, 69, 110, 0.2)',
      // },
    },
  },
  backgroundOpacity: { light: 0, dark: 0.75 },
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      quote: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
}
