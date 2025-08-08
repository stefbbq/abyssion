import * as Three from 'three'
import { scheduleBurstReset } from './scheduleBurstReset.ts'

type LayerInfo = {
  opacity: number
  zPos: number
  fps: number
  noiseRate: number
  isRandom: boolean
  isStencil: boolean
}

type ShaderTimeUpdate = {
  shouldUpdate: boolean
  newTime: number
  lastUpdateTime: number
}

type BurstEffect = {
  shouldApply: boolean
  offsetX: number
  offsetY: number
  duration: number
}

type PositionUpdate = {
  x: number
  y: number
  z: number
  rotationX: number
  rotationY: number
}

export type PlaneUpdateResult = {
  shaderTime: ShaderTimeUpdate
  position: PositionUpdate
  burstEffect: BurstEffect
  opacity: number
}

type CalculateRandomLayerPosition = (
  time: number,
  planeIndex: number,
  zPos: number,
  totalLayers: number,
) => { x: number; y: number }

/**
 * applies plane updates (shader time, transform, opacity, and optional burst)
 */
export const applyPlaneUpdate = (
  plane: Three.Mesh & { material?: { uniforms?: { time?: { value: number }; opacity?: { value: number } } } } & { lastUpdateTime?: number },
  planeIndex: number,
  layer: LayerInfo,
  totalLayers: number,
  time: number,
  updateResult: PlaneUpdateResult,
  fadeMultiplier: number,
  calcRandomPosition: CalculateRandomLayerPosition,
) => {
  // shader time update
  if (updateResult.shaderTime.shouldUpdate && plane.material?.uniforms?.time) {
    plane.material.uniforms.time.value = updateResult.shaderTime.newTime
    plane.lastUpdateTime = updateResult.shaderTime.lastUpdateTime
  }

  // transform updates
  plane.position.set(
    updateResult.position.x,
    updateResult.position.y,
    updateResult.position.z,
  )
  plane.rotation.x = updateResult.position.rotationX
  plane.rotation.y = updateResult.position.rotationY

  // burst effect
  if (updateResult.burstEffect.shouldApply) {
    plane.position.x += updateResult.burstEffect.offsetX
    plane.position.y += updateResult.burstEffect.offsetY

    scheduleBurstReset(
      plane,
      time,
      planeIndex,
      layer.zPos,
      totalLayers,
      updateResult.burstEffect.duration,
      calcRandomPosition,
    )
  }

  // opacity
  if (plane.material?.uniforms?.opacity) {
    plane.material.uniforms.opacity.value = updateResult.opacity * fadeMultiplier
  }
}
