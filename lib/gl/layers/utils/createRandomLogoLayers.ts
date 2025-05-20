import { RANDOM_LAYER_CONFIG } from '../config.ts'
import { createLogoLayer } from './createLogoLayer.ts'
import { LogoLayer } from '../LogoLayer.ts'

/**
 * Generate a set of random layers
 */
export const createRandomLogoLayers = (THREE: any): LogoLayer[] => {
  const { MIN_LAYERS, MAX_ADDITIONAL_LAYERS } = RANDOM_LAYER_CONFIG
  const numRandomLayers = MIN_LAYERS + Math.floor(Math.random() * MAX_ADDITIONAL_LAYERS)

  return Array.from({ length: numRandomLayers }, (_, i) => createLogoLayer(i, numRandomLayers, THREE))
}
