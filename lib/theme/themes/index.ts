/**
 * @module themes
 * @description Comprehensive theme definitions for both Preact and GL usage
 */

import type { ThemeFamily } from '../types.ts'
import { neonGridOSDarkTheme } from './neonGridOS/dark.ts'
import { neonGridOSLightTheme } from './neonGridOS/light.ts'
import { neonGridOSTypography } from './neonGridOS/typography.ts'
import { neonGridOSSizing } from './neonGridOS/sizing.ts'
import { deepSpaceHUDDarkTheme } from './deepSpaceHUD/dark.ts'
import { deepSpaceHUDLightTheme } from './deepSpaceHUD/light.ts'
import { deepSpaceHUDTypography } from './deepSpaceHUD/typography.ts'
import { deepSpaceHUDSizing } from './deepSpaceHUD/sizing.ts'
// import { geomodAtlasDarkTheme } from './geomodAtlas/dark.ts'
// import { geomodAtlasLightTheme } from './geomodAtlas/light.ts'
// import { geomodAtlasTypography } from './geomodAtlas/typography.ts'
// import { geomodAtlasSizing } from './geomodAtlas/sizing.ts'
import { techscapeDarkTheme } from './techscape/dark.ts'
import { techscapeLightTheme } from './techscape/light.ts'
import { techscapeTypography } from './techscape/typography.ts'
import { techscapeSizing } from './techscape/sizing.ts'
import { synthwaveDarkTheme } from './synthwave/dark.ts'
import { synthwaveLightTheme } from './synthwave/light.ts'
import { synthwaveTypography } from './synthwave/typography.ts'
import { synthwaveSizing } from './synthwave/sizing.ts'
import { monochromeDarkTheme } from './monochrome/dark.ts'
import { monochromeLightTheme } from './monochrome/light.ts'
import { monochromeTypography } from './monochrome/typography.ts'
import { monochromeSizing } from './monochrome/sizing.ts'

/**
 * All available theme families in order
 */
export const themeFamilies: ThemeFamily[] = [
  {
    name: 'Neon Grid OS',
    light: { ...neonGridOSLightTheme, ...neonGridOSSizing, typography: neonGridOSTypography },
    dark: { ...neonGridOSDarkTheme, ...neonGridOSSizing, typography: neonGridOSTypography },
  },
  {
    name: 'Deep Space HUD',
    light: { ...deepSpaceHUDLightTheme, ...deepSpaceHUDSizing, typography: deepSpaceHUDTypography },
    dark: { ...deepSpaceHUDDarkTheme, ...deepSpaceHUDSizing, typography: deepSpaceHUDTypography },
  },
  // {
  //   name: 'GeoMod Atlas',
  //   light: { ...geomodAtlasLightTheme, ...geomodAtlasSizing, typography: geomodAtlasTypography },
  //   dark: { ...geomodAtlasDarkTheme, ...geomodAtlasSizing, typography: geomodAtlasTypography },
  // },
  {
    name: 'Techscape',
    light: { ...techscapeLightTheme, ...techscapeSizing, typography: techscapeTypography },
    dark: { ...techscapeDarkTheme, ...techscapeSizing, typography: techscapeTypography },
  },
  {
    name: 'Synthwave',
    light: { ...synthwaveLightTheme, ...synthwaveSizing, typography: synthwaveTypography },
    dark: { ...synthwaveDarkTheme, ...synthwaveSizing, typography: synthwaveTypography },
  },
  {
    name: 'Monochrome',
    light: { ...monochromeLightTheme, ...monochromeSizing, typography: monochromeTypography },
    dark: { ...monochromeDarkTheme, ...monochromeSizing, typography: monochromeTypography },
  },
]
