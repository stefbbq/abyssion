/**
 * Layers module index file
 *
 * Re-exports all public elements from the layers folder files
 * to provide a single import point for consumers
 */

// Constants
export { FPS_OPTIONS } from './constants.ts'
export { RANDOM_LAYER_CONFIG, SHAPE_LAYER_CONFIG, STATIC_LOGO_LAYERS, UI_OVERLAY_CONFIG } from './config.ts'

// Types
export type { LogoLayer } from './types.ts'

// Layer creators
export { createLogoLayer } from './LogoLayer.ts'
export { createUILayer } from './UILayer.ts'
export { createGeometricLayer } from './GeometricLayer.ts'
