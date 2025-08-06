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
  log(lc.GL_ANIMATION, 'Creating loading state orchestrator')

  let isVideoReady = false
  let loadingStartTime: number | null = null
  let hasTransitioned = false
  let loadingGeometry: Three.Mesh | null = null
  let frameCount = 0

  log.debug(lc.GL_VIDEO, 'Loading state orchestrator started')

  // Create simple loading geometry immediately
  const createLoadingGeometry = (context: AnimationContext) => {
    const { state } = context
    if (!loadingGeometry && state.THREE) {
      log.debug(lc.GL_ANIMATION, 'Creating loading geometry...')
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
    frameCount++

    // Initialize loading start time on first frame
    if (loadingStartTime === null) {
      loadingStartTime = currentTime
      log(lc.GL_ANIMATION, 'Loading state initialized, starting timer')
    }

    // Log first few frames to confirm update is being called
    if (time < 0.1) {
      log.debug(lc.GL_ANIMATION, `Loading state update called, time: ${time}`)
    }

    // Create loading geometry if it doesn't exist
    createLoadingGeometry(context)

    // Check video status
    const videoStatus = getVideoStatus()
    const { isReadyToStream } = videoStatus

    // Log detailed status every 2 seconds
    if (currentTime % 2000 < 50) {
      log.debug(lc.GL_ANIMATION, 'Video status:', {
        videoBackground: !!videoStatus.videoBackground,
        isReadyToStream,
        isVideoReady,
      })
    }

    if (!isVideoReady && videoStatus.videoBackground) {
      isVideoReady = true
      log(lc.GL_VIDEO, 'Video is ready to stream!')
    }

    // Calculate loading progress
    const loadingProgress = calculateLoadingProgress({
      startTime: loadingStartTime,
      currentTime,
      isVideoReady: isVideoReady && isReadyToStream, // Both video AND scene must be ready
      minimumLoadingTime: 2000, // At least 2 seconds of loading to ensure scene is ready
    })

    // Minimal logging for debugging
    if (currentTime % 2000 < 50) { // Log every 2 seconds
      log.debug(
        lc.GL_VIDEO,
        `Loading... videoReady=${isVideoReady}, fullyReady=${isReadyToStream}, elapsed=${loadingProgress.elapsedTime}ms, progress=${
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

    // Log transition state for debugging
    if (frameCount % 60 === 1) {
      log.debug(lc.GL_ANIMATION, 'Transition state:', {
        isComplete: loadingProgress.isComplete,
        hasTransitioned,
        progress: loadingProgress.progress,
        elapsedTime: loadingProgress.elapsedTime,
      })
    }

    // Transition to main scene when loading is complete
    if (loadingProgress.isComplete && !hasTransitioned) {
      hasTransitioned = true
      log(
        lc.GL_VIDEO,
        `Loading complete! Video ready: ${isVideoReady}, full scene ready: ${isReadyToStream}, elapsed: ${loadingProgress.elapsedTime}ms - transitioning to main scene`,
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

  log(lc.GL_ANIMATION, 'Loading state orchestrator created successfully')

  return {
    name: 'loading-state',
    update,
    dispose,
  }
}
