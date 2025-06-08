import type { LogoLayer } from '@libgl/layers/LogoLayer.ts'
import { getGLTheme } from '@libgl/theme/index.ts'
import type { GeometricOptions } from './GeometricLayer.ts'
import layersConfig from '@lib/configLayers.json' with { type: 'json' }

const { geometricOptions, staticLogoLayers, randomLayerConfig, uiOverlayConfig, shapeLayerConfig } = layersConfig

/**
 * Custom configs for each geometry utility
 */
export function getDashedOrbitsConfig(): GeometricOptions {
  const theme = getGLTheme()
  const config = geometricOptions.dashedOrbits
  return {
    ...config,
    color: theme.ui.accentColor1 || 0x00ffff,
    secondaryColor: theme.ui.accentColor2 || 0xff00ff,
  }
}

export function getConcentricRingsConfig(): GeometricOptions {
  const theme = getGLTheme()
  const config = geometricOptions.concentricRings
  return {
    ...config,
    color: theme.ui.accentColor1 || 0x00ffff,
    secondaryColor: theme.ui.accentColor2 || 0xff00ff,
  }
}

export function getCelestialBodiesConfig(): GeometricOptions {
  const theme = getGLTheme()
  const config = geometricOptions.celestialBodies
  return {
    ...config,
    color: theme.ui.accentColor1 || 0x00ffff,
    secondaryColor: theme.ui.accentColor2 || 0xff00ff,
  }
}

export function getOrbitalGridsConfig(): GeometricOptions {
  const theme = getGLTheme()
  const config = geometricOptions.orbitalGrids
  return {
    ...config,
    color: theme.ui.accentColor1 || 0x00ffff,
    secondaryColor: theme.ui.accentColor2 || 0xff00ff,
  }
}

export function getOrbitalMarkersConfig(): GeometricOptions {
  const theme = getGLTheme()
  const config = geometricOptions.orbitalMarkers
  return {
    ...config,
    color: theme.ui.accentColor1 || 0x00ffff,
    secondaryColor: theme.ui.accentColor2 || 0xff00ff,
  }
}

export const getOrbitalParticlesConfig = (): GeometricOptions => {
  const theme = getGLTheme()
  const config = geometricOptions.orbitalParticles
  return {
    ...config,
    color: theme.ui.accentColor1 || 0x00ffff,
    secondaryColor: theme.ui.accentColor2 || 0xff00ff,
  }
}

// helper function to get theme-based layers
const getThemeBasedLayers = (): LogoLayer[] => {
  const theme = getGLTheme()

  return staticLogoLayers.map((layer, index) => {
    const colorMap = [
      theme.stencilColor, // base layer - solid stencil
      theme.baseLayerColor, // base layer - solid white
      theme.outlineColor, // outline layer - clean white
      theme.ghostingColors.cyan, // second outline - cyan ghosting
      theme.ghostingColors.magenta, // third outline - magenta ghosting
    ]

    return {
      ...layer,
      color: colorMap[index],
    }
  })
}

/**
 * predefined logo layer configurations used as the base for logo rendering
 * this is now a getter function that pulls from the current theme
 */
export const getStaticLogoLayers = () => getThemeBasedLayers()

/**
 * parameters controlling the generation of random logo layers
 */
export { randomLayerConfig }

// helper function to get theme-based ui config
const getThemeBasedUIConfig = () => {
  const theme = getGLTheme()

  return {
    ...uiOverlayConfig,
    // colors from theme
    accentColor1: theme.ui.accentColor1,
    accentColor2: theme.ui.accentColor2,
    hexagonColor: theme.ui.hexagonColor,
    centralCircleColor: theme.ui.centralCircleColor,
    centerCrosshairColor: theme.ui.centerCrosshairColor,
    gridColor: theme.ui.gridColor,
  }
}

/**
 * configuration for ui overlay elements including colors, sizes, and positions
 */
export const getUIOverlayConfig = () => getThemeBasedUIConfig()

// helper function to get theme-based shape layer config
const getThemeBasedShapeLayerConfig = () => {
  const theme = getGLTheme()

  return {
    ...shapeLayerConfig,
    primaryColor: theme.geometric.primaryColor,
    secondaryColor: theme.geometric.secondaryColor,
  }
}

/**
 * parameters for decorative geometric shapes in the 3d scene
 */
export const getShapeLayerConfig = () => getThemeBasedShapeLayerConfig()
