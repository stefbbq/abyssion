import type { RendererState } from '@libgl/types.ts'
import { calculateStaticLayerPosition } from './calculateStaticLayerPosition.ts'
import { calculateRandomLayerPosition } from './calculateRandomLayerPosition.ts'
import { calculateShaderTime } from '@libgl/animation/calculations/calculateShaderTime.ts'

// layer configuration for plane update
type LayerConfig = {
  // layer opacity
  opacity: number
  // layer z position
  zPos: number
  // layer frame rate
  fps: number
  // layer noise rate
  noiseRate: number
  // whether layer is random
  isRandom: boolean
  // whether layer is stencil
  isStencil: boolean
}

// configuration for plane update calculation
type PlaneUpdateConfig = {
  // current animation time
  time: number
  // plane index in the array
  planeIndex: number
  // layer configuration
  layer: LayerConfig
  // total number of layers
  totalLayers: number
  // renderer state for fade calculations
  state: RendererState
  // plane's last update time
  lastUpdateTime: number
}

// result of plane update calculation
type PlaneUpdateResult = {
  // shader time update
  shaderTime: {
    // whether shader time should be updated
    shouldUpdate: boolean
    // new shader time value
    newTime: number
    // new last update time
    lastUpdateTime: number
  }
  // position and rotation
  position: {
    x: number
    y: number
    z: number
    rotationX: number
    rotationY: number
  }
  // opacity value
  opacity: number
  // burst effect if applicable
  burstEffect: {
    // whether burst should be applied
    shouldApply: boolean
    // burst position offset
    offsetX: number
    offsetY: number
    // burst duration in ms
    duration: number
  }
  // updated fade order for state
  fadeOrder?: number[]
  // whether to clear fade order
  clearFadeOrder: boolean
}

/**
 * Calculate all updates needed for a plane without side effects
 * Returns data that the orchestrator can apply
 */
export const calculatePlaneUpdate = (config: PlaneUpdateConfig): PlaneUpdateResult => {
  const { time, planeIndex, layer, totalLayers, lastUpdateTime } = config

  // Calculate shader time
  const shaderResult = calculateShaderTime(
    time,
    lastUpdateTime,
    layer.fps,
    layer.noiseRate,
    layer.fps <= 2 && layer.noiseRate > 48,
  )

  // Calculate position
  const position = layer.isRandom
    ? calculateRandomLayerPosition(time, planeIndex, layer.zPos, totalLayers)
    : calculateStaticLayerPosition(time, planeIndex, layer.zPos, layer.isStencil)

  // Calculate burst effect for random layers
  const burstEffect = {
    shouldApply: layer.isRandom && Math.random() < 0.004 && !layer.isStencil,
    offsetX: 0,
    offsetY: 0,
    duration: 0,
  }

  // if (burstEffect.shouldApply) {
  //   const randomFactor = Math.sin(time * 2 + planeIndex * 0.5) * 0.3 + 0.7
  //   const burstIntensity = 0.2 * randomFactor * (planeIndex + 1) / totalLayers

  //   burstEffect.offsetX = (Math.random() - 0.5) * burstIntensity
  //   burstEffect.offsetY = (Math.random() - 0.5) * burstIntensity
  //   burstEffect.duration = 50 + Math.random() * 100
  // }

  // Add flicker effect for random layers
  let opacity = layer.opacity

  if (!layer.isStencil && layer.isRandom && Math.random() < 0.003 && opacity > 0) {
    opacity = opacity * (Math.random() * 1.5 + 0.5)
  }

  return {
    shaderTime: {
      shouldUpdate: shaderResult.shouldUpdate,
      newTime: shaderResult.newTime,
      lastUpdateTime: time,
    },
    position,
    opacity,
    burstEffect,
    fadeOrder: undefined, // No fade order to return
    clearFadeOrder: false, // No fade order to clear
  }
}
