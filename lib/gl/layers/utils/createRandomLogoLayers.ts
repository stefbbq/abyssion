import { randomLayerConfig } from '../config.ts'
import { createLogoLayer } from './createLogoLayer.ts'
import { LogoLayer } from '../LogoLayer.ts'

/**
 * generate a set of random layers
 */
export const createRandomLogoLayers = (THREE: typeof import('three')): LogoLayer[] => {
  const { minLayers, maxAdditionalLayers } = randomLayerConfig
  const numRandomLayers = minLayers + Math.floor(Math.random() * maxAdditionalLayers)

  return Array.from({ length: numRandomLayers }, (_, i) => createLogoLayer(THREE))
}
