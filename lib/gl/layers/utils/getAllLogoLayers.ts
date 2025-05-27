import { STATIC_LOGO_LAYERS } from '../config.ts'
import { LogoLayer } from '../LogoLayer.ts'
import { createRandomLogoLayers } from './createRandomLogoLayers.ts'

/**
 * Get all logo layers (static + random), sorted by z-position
 */
export const getAllLogoLayers = (THREE: typeof import('three')): LogoLayer[] => {
  // Always keep the stencil layer from STATIC_LAYERS
  const stencilLayer = STATIC_LOGO_LAYERS.find((layer) => layer.isStencil)

  // Get non-stencil static layers
  const staticLayers = STATIC_LOGO_LAYERS.filter((layer) => !layer.isStencil)

  // Generate new random layers
  const randomLayers = createRandomLogoLayers(THREE)

  // Combine and sort all non-stencil layers by z-position
  const sortedNonStencilLayers = [...staticLayers, ...randomLayers]
    .sort((a, b) => a.zPos - b.zPos)

  // Always put stencil layer first, regardless of z-position
  return stencilLayer ? [stencilLayer, ...sortedNonStencilLayers] : sortedNonStencilLayers
}
