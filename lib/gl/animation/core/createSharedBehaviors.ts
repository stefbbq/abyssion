import { createMouseTracking } from '@libgl/controls/index.ts'
import { calculateRotationInterpolation } from '../calculations/calculateRotationInterpolation.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import * as Three from 'three'
import type { VideoBackgroundManager } from '@libgl/types.ts'

/**
 * Shared behaviors available to all animation orchestrators
 */
export type SharedBehaviors = {
  readonly mouseTracking: ReturnType<typeof createMouseTracking>
  readonly applyMouseRotation: (scene: Three.Scene) => void
  readonly updateVideoBackground: (videoBackground: VideoBackgroundManager, deltaTime: number) => void
}

/**
 * Create shared behaviors that persist across page changes
 */
export const createSharedBehaviors = (): SharedBehaviors => {
  const mouseTracking = createMouseTracking(animationConfig.userReactivity.mouseCoefficient)

  const applyMouseRotation = (scene: Three.Scene) => {
    const mouseTarget = mouseTracking.getCurrentTarget()
    scene.rotation.x = calculateRotationInterpolation(
      scene.rotation.x,
      mouseTarget.targetRotationX,
    )
    scene.rotation.y = calculateRotationInterpolation(
      scene.rotation.y,
      mouseTarget.targetRotationY,
    )
  }

  const updateVideoBackground = (videoBackground: VideoBackgroundManager, deltaTime: number) => {
    if (videoBackground) videoBackground.update(deltaTime)
  }

  return {
    mouseTracking,
    applyMouseRotation,
    updateVideoBackground,
  }
}
