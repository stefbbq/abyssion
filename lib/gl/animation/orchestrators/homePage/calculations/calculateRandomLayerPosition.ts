import type { LayerPosition } from './calculateStaticLayerPosition.ts'

/**
 * Calculate position for a random layer with chaotic movements
 */
export const calculateRandomLayerPosition = (
  time: number,
  index: number,
  baseZPos: number,
  totalLayers: number,
): LayerPosition => {
  const randomFactor = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7
  const breathingDepth = 0.08 * randomFactor * (index + 1) / totalLayers
  const z = baseZPos + Math.sin(time * 0.5 + index * 0.4) * breathingDepth

  const movementScale = 0.02 * randomFactor * (index + 1) / totalLayers
  const x = Math.sin(time * 0.4 + index * 0.7) * movementScale
  const y = Math.cos(time * 0.3 + index * 0.9) * movementScale * 0.8

  return {
    x,
    y,
    z,
    rotationX: 0,
    rotationY: 0,
  }
}
