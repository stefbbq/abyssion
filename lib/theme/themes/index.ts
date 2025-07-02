/**
 * Comprehensive theme definitions for both Preact and GL usage
 * All themes include both light and dark mode variants
 * Contains the full color palette for each theme family
 */

// export themes
export { neonGridOSDarkTheme, neonGridOSTheme } from './neonGridOS.ts'
export { deepSpaceHUDLightTheme, deepSpaceHUDTheme } from './deepSpaceHUD.ts'
export { glitchCoreLightTheme, glitchCoreTheme } from './glitchCore.ts'
export { geomodAtlasLightTheme, geomodAtlasTheme } from './geomodAtlas.ts'
export { hypertagLightTheme, hypertagTheme } from './hypertag.ts'
export { synthDriftDarkTheme, synthDriftTheme } from './synthDrift.ts'
export { techscapeLightTheme, techscapeTheme } from './techscape.ts'
export { synthwaveLightTheme, synthwaveTheme } from './synthwave.ts'
export { monochromeLightTheme, monochromeTheme } from './monochrome.ts'
export { cyberpunkLightTheme, cyberpunkTheme } from './cyberpunk.ts'

// import for theme families constant
import type { ThemeFamily } from './types.ts'
import { neonGridOSDarkTheme, neonGridOSTheme } from './neonGridOS.ts'
import { deepSpaceHUDLightTheme, deepSpaceHUDTheme } from './deepSpaceHUD.ts'
import { glitchCoreLightTheme, glitchCoreTheme } from './glitchCore.ts'
import { geomodAtlasLightTheme, geomodAtlasTheme } from './geomodAtlas.ts'
import { hypertagLightTheme, hypertagTheme } from './hypertag.ts'
import { synthDriftDarkTheme, synthDriftTheme } from './synthDrift.ts'
import { techscapeLightTheme, techscapeTheme } from './techscape.ts'
import { synthwaveLightTheme, synthwaveTheme } from './synthwave.ts'
import { monochromeLightTheme, monochromeTheme } from './monochrome.ts'
import { cyberpunkLightTheme, cyberpunkTheme } from './cyberpunk.ts'

/**
 * All available theme families in order
 */
export const themeFamilies: ThemeFamily[] = [
  {
    name: 'deep-space-hud',
    light: deepSpaceHUDLightTheme,
    dark: deepSpaceHUDTheme,
  },
  {
    name: 'neon-grid-os',
    light: neonGridOSTheme,
    dark: neonGridOSDarkTheme,
  },
  {
    name: 'glitch-core',
    light: glitchCoreLightTheme,
    dark: glitchCoreTheme,
  },
  {
    name: 'geomod-atlas',
    light: geomodAtlasLightTheme,
    dark: geomodAtlasTheme,
  },
  {
    name: 'hypertag',
    light: hypertagLightTheme,
    dark: hypertagTheme,
  },
  {
    name: 'synth-drift',
    light: synthDriftTheme,
    dark: synthDriftDarkTheme,
  },
  {
    name: 'techscape',
    light: techscapeLightTheme,
    dark: techscapeTheme,
  },
  {
    name: 'synthwave',
    light: synthwaveLightTheme,
    dark: synthwaveTheme,
  },
  {
    name: 'monochrome',
    light: monochromeLightTheme,
    dark: monochromeTheme,
  },
  {
    name: 'cyberpunk',
    light: cyberpunkLightTheme,
    dark: cyberpunkTheme,
  },
]

// type exports
export type { BackgroundColors, BaseTheme, ColorVariant, ForegroundColors, ThemeFamily } from '../types.ts'
