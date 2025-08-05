import { randomLayerConfig } from '@libgl/layers/config.ts'
import { createRandomLogoLayer } from './createLogoLayer.ts'
import { LogoLayer } from '@libgl/layers/LogoLayer.ts'

/**
 * generate a set of random layers
 */
export const createRandomLogoLayers = (): LogoLayer[] => {
  const { minLayers, maxAdditionalLayers } = randomLayerConfig
  const numRandomLayers = minLayers + Math.floor(Math.random() * maxAdditionalLayers)

  return Array.from({ length: numRandomLayers }, () => createRandomLogoLayer())
}
