import * as Three from 'three'
import { getStaticLogoLayers } from '../config.ts'
import { LogoLayer } from '@libgl/layers/LogoLayer.ts'
import { createRandomLogoLayers } from './createRandomLogoLayers.ts'

/**
 * Get all logo layers (static + random), sorted by z-position
 */
export const getAllLogoLayers = (THREE: typeof Three): LogoLayer[] => {
  const staticLogoLayers = getStaticLogoLayers()

  // always keep the stencil layer from static layers
  const stencilLayer = staticLogoLayers.find((layer: LogoLayer) => layer.isStencil)

  // get non-stencil static layers
  const staticLayers = staticLogoLayers.filter((layer: LogoLayer) => !layer.isStencil)

  // Generate new random layers
  const randomLayers = createRandomLogoLayers(THREE)

  // Combine and sort all non-stencil layers by z-position
  const sortedNonStencilLayers = [...staticLayers, ...randomLayers]
    .sort((a, b) => a.zPos - b.zPos)

  // Always put stencil layer first, regardless of z-position
  return stencilLayer ? [stencilLayer, ...sortedNonStencilLayers] : sortedNonStencilLayers
}
