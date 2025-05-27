/**
 * Layers module index file
 *
 * Re-exports all public elements from the layers folder files
 * to provide a single import point for consumers
 */

// constants
export { FPS_OPTIONS } from './constants.ts'
export { getOrbitalParticlesConfig, getShapeLayerConfig, getStaticLogoLayers, getUIOverlayConfig, randomLayerConfig } from './config.ts'

// types
export type { LogoLayer } from './LogoLayer.ts'

// Layer creators
export { createLogoLayer } from './LogoLayer.ts'
export { createUILayer } from './UILayer.ts'
export { createGeometricLayer } from './GeometricLayer.ts'
