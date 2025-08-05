import type { AnimationContext, AnimationOrchestrator } from '@libgl/animation/core/types.ts'
import type { VideoBackgroundManager } from '@libgl/textures/VideoCycle/types.ts'
import { calculateLoadingProgress } from './calculations/calculateLoadingProgress.ts'
import { calculateLoadingEffects } from './calculations/calculateLoadingEffects.ts'
import { lc, log } from '@lib/logger/index.ts'
import * as Three from 'three'

/**
 * Loading state animation orchestrator
 * Manages the loading screen and video preparation state
 */
type VideoStatus = {
  videoBackground: VideoBackgroundManager | undefined
  isReadyToStream: boolean
}

export const createLoadingStateOrchestrator = (
  onLoadingComplete: () => void,
  getVideoStatus: () => VideoStatus,
): AnimationOrchestrator => {
  let isVideoReady = false
  const loadingStartTime = Date.now()
  let hasTransitioned = false
  let loadingGeometry: Three.Mesh | null = null

  log.debug(lc.GL_VIDEO, 'Loading state orchestrator started')

  // Create simple loading geometry immediately
  const createLoadingGeometry = (context: AnimationContext) => {
    const { state } = context
    if (!loadingGeometry && state.THREE) {
      const geometry = new state.THREE.PlaneGeometry(4, 4) // Bigger
      const material = new state.THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8, // More visible
        side: state.THREE.DoubleSide, // Visible from both sides
      })
      loadingGeometry = new state.THREE.Mesh(geometry, material)
      loadingGeometry.position.set(0, 0, -5) // Further back, centered
      state.scene.add(loadingGeometry)
      log.debug(lc.GL_VIDEO, 'Loading geometry created and added to scene at', loadingGeometry.position)
      log.debug(lc.GL_VIDEO, 'Camera position:', state.camera.position)
      log.debug(lc.GL_VIDEO, 'Scene children count:', state.scene.children.length)
    }
  }

  const update = (context: AnimationContext) => {
    const { time } = context
    const currentTime = Date.now()

    // Create loading geometry if it doesn't exist
    createLoadingGeometry(context)

    // Check video status
    const { isReadyToStream } = getVideoStatus()

    if (!isVideoReady && isReadyToStream) {
      isVideoReady = true
      log(lc.GL_VIDEO, 'Video is ready to stream!')
    }

    // Calculate loading progress
    const loadingProgress = calculateLoadingProgress({
      startTime: loadingStartTime,
      currentTime,
      isVideoReady,
      minimumLoadingTime: 500, // At least 0.5 seconds of loading for UX
    })

    // Minimal logging for debugging
    if (currentTime % 2000 < 50) { // Log every 2 seconds
      log.debug(
        lc.GL_VIDEO,
        `Loading... videoReady=${isVideoReady}, sceneReady=${isReadyToStream}, elapsed=${loadingProgress.elapsedTime}ms, progress=${
          Math.round(loadingProgress.progress * 100)
        }%`,
      )
    }

    // Apply loading effects to scene elements
    const effects = calculateLoadingEffects({
      progress: loadingProgress.progress,
      time,
      isComplete: loadingProgress.isComplete,
    })

    // Animate loading geometry
    if (loadingGeometry) {
      // Spinning animation
      loadingGeometry.rotation.z = time * 0.001

      // Pulsing opacity based on progress
      if (loadingGeometry.material && 'opacity' in loadingGeometry.material) {
        loadingGeometry.material.opacity = effects.pulseIntensity * 0.8
        loadingGeometry.material.needsUpdate = true
      }

      // Scale based on progress
      const scale = 0.5 + effects.pulseIntensity * 0.5
      loadingGeometry.scale.setScalar(scale)
    }

    // Transition to main scene when loading is complete
    if (loadingProgress.isComplete && !hasTransitioned) {
      hasTransitioned = true
      log(
        lc.GL_VIDEO,
        `Loading complete! Video ready: ${isVideoReady}, scene ready: ${isReadyToStream}, elapsed: ${loadingProgress.elapsedTime}ms - transitioning to main scene`,
      )
      onLoadingComplete()
    }
  }

  const dispose = (context: AnimationContext) => {
    // Cleanup loading geometry
    if (loadingGeometry && context.state.scene) {
      context.state.scene.remove(loadingGeometry)
      loadingGeometry.geometry.dispose()
      if (loadingGeometry.material && 'dispose' in loadingGeometry.material) {
        loadingGeometry.material.dispose()
      }
      loadingGeometry = null
      log.debug(lc.GL_VIDEO, 'Loading geometry disposed')
    }
    log.debug(lc.GL_VIDEO, 'Loading state orchestrator disposed')
  }

  return {
    name: 'loading-state',
    update,
    dispose,
  }
}
