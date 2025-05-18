/**
 * Layer constants
 */

import type { LogoLayer } from '../layers/LogoLayer.ts'
import { getCurrentTheme } from '../theme.ts'

// Helper function to get theme-based layers
const getThemeBasedLayers = (): LogoLayer[] => {
  const theme = getCurrentTheme()

  return [
    // Base layer - solid stencil
    {
      isStencil: true,
      color: theme.stencilColor,
      opacity: 1.0,
      zPos: 0,
      noiseScale: .4,
      noiseOffset: 1,
      noiseRate: 50,
      fps: 6,
      isRandom: false,
    },
    // Base layer - solid white
    {
      isStencil: false,
      color: theme.baseLayerColor,
      opacity: 1.0,
      zPos: -0.1,
      noiseScale: 0.2,
      noiseOffset: 0.01,
      noiseRate: 0.1,
      fps: 12,
      isRandom: true,
    },
    // Outline layer - clean white
    {
      isStencil: false,
      color: theme.outlineColor,
      opacity: 0.8,
      zPos: 0.1,
      noiseScale: 4.0,
      noiseOffset: 0.2,
      noiseRate: 0.7,
      fps: 8,
      isRandom: true,
    },
    // Second outline - cyan ghosting
    {
      isStencil: false,
      color: theme.ghostingColors.cyan,
      opacity: 0.25,
      zPos: -0.4,
      noiseScale: 5.0,
      noiseOffset: 0.3,
      noiseRate: 1.3,
      fps: 2,
      isRandom: true,
    },
    // Third outline - magenta ghosting
    {
      isStencil: false,
      color: theme.ghostingColors.magenta,
      opacity: .3,
      zPos: .5,
      noiseScale: 1,
      noiseOffset: .5,
      noiseRate: 100,
      fps: 4,
      isRandom: true,
    },
  ]
}

/**
 * Predefined logo layer configurations used as the base for logo rendering
 * This is now a getter function that pulls from the current theme
 */
export const STATIC_LOGO_LAYERS = getThemeBasedLayers()

/**
 * Parameters controlling the generation of random logo layers
 */
export const RANDOM_LAYER_CONFIG = {
  MIN_LAYERS: 5,
  MAX_ADDITIONAL_LAYERS: 6,
  CYAN_PROBABILITY: 0.4,
  MAGENTA_PROBABILITY: 0.4,
  OPACITY_BASE: 0.05,
  Z_BASE_RANGE: 0.15,
  Z_VARIANCE_BASE: 0.1,
  FRONT_BIAS: 0.7,
  NOISE_SCALE_BASE: 1,
}

// Helper function to get theme-based UI config
const getThemeBasedUIConfig = () => {
  const theme = getCurrentTheme()

  return {
    // Colors
    ACCENT_COLOR_1: theme.ui.accentColor1,
    ACCENT_COLOR_2: theme.ui.accentColor2,
    HEXAGON_COLOR_3: theme.ui.hexagonColor,
    CENTRAL_CIRCLE_COLOR: theme.ui.centralCircleColor,
    CENTER_CROSSHAIR_COLOR: theme.ui.centerCrosshairColor,
    GRID_COLOR: theme.ui.gridColor,

    // Corner elements
    CORNER_MARGIN: 60,
    CROSSHAIR_SIZE: 20,
    CROSSHAIR_LINE_THICKNESS: 1,
    CROSSHAIR_CENTER_RADIUS: 5,
    CROSSHAIR_OPACITY: 0.8,

    // Triangle indicators
    TRIANGLE_OFFSET: 30,
    TRIANGLE_SIZE: 10,
    TRIANGLE_THICKNESS: 1,
    TRIANGLE_OPACITY: 0.7,

    // Central HUD elements
    CENTRAL_CIRCLE_RADIUS: 40,
    CENTRAL_CIRCLE_SEGMENTS: 12,
    CENTRAL_CIRCLE_GAP: 0.1,
    CENTRAL_CIRCLE_THICKNESS: 2,
    CENTRAL_CIRCLE_OPACITY: 0.6,

    // Center crosshair
    CENTER_CROSSHAIR_SIZE: 15,
    CENTER_CROSSHAIR_THICKNESS: 0.5,
    CENTER_CROSSHAIR_RADIUS: 2,
    CENTER_CROSSHAIR_OPACITY: 0.8,

    // Arc elements
    ARC_RADIUS: 60,
    ARC_SEGMENTS: 16,
    ARC_THICKNESS: 1,
    ARC_START_OFFSET: 0.4,
    ARC_LENGTH: 0.8,
    ARC_OPACITY: 0.4,

    // Info panels
    INFO_PANEL_BORDER_THICKNESS: 2,
    INFO_PANEL_CORNER_RADIUS: 10,
    GRID_SCALE_FACTOR: 0.9,
    GRID_OPACITY: 0.2,

    // Info panel positions and sizes
    INFO_PANEL_CONFIG: [
      { xPosition: 'center', yPosition: 'top', margin: 50, width: 200, height: 60, opacity: 0.3 },
      { xPosition: 'left', yPosition: 'center', margin: 90, width: 120, height: 200, opacity: 0.3 },
      { xPosition: 'right', yPosition: 'center', margin: 90, width: 120, height: 200, opacity: 0.3 },
      { xPosition: 'center', yPosition: 'bottom', margin: 50, width: 200, height: 60, opacity: 0.3 },
    ],

    // Hexagon decorations
    HEXAGON_CONFIG: {
      COUNT: 6,
      RADIUS: 15,
      THICKNESS: 1,
      OPACITY: 0.3,
      DISTANCE_FACTOR: 0.4,
    },
  }
}

/**
 * Configuration for UI overlay elements including colors, sizes, and positions
 */
export const UI_OVERLAY_CONFIG = getThemeBasedUIConfig()

// Helper function to get theme-based shape layer config
const getThemeBasedShapeLayerConfig = () => {
  const theme = getCurrentTheme()

  return {
    RADIUS: 1,
    HEIGHT: 1,
    TECH_SHAPES_COUNT: 12,
    MIN_DISTANCE: .5,
    MAX_DISTANCE: 2,
    ROTATION_SPEED: 0.002,
    PRIMARY_COLOR: theme.geometric.primaryColor,
    SECONDARY_COLOR: theme.geometric.secondaryColor,
    OPACITY: 0.08,
  }
}

/**
 * Parameters for decorative geometric shapes in the 3D scene
 */
export const SHAPE_LAYER_CONFIG = getThemeBasedShapeLayerConfig()
