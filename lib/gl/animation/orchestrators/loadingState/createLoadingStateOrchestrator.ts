import type { AnimationContext, AnimationOrchestrator } from '@libgl/animation/core/types.ts'
import type { RendererState } from '@libgl/types.ts'
import { calculateLoadingEffects } from './calculations/calculateLoadingEffects.ts'
import { lc, log } from '@lib/logger/index.ts'
import * as Three from 'three'

/**
 * Loading state animation orchestrator
 * Manages the loading screen animation
 * Displays loading indicator until switched to another orchestrator
 */
export const createLoadingStateOrchestrator = (
  _glState: RendererState,
): AnimationOrchestrator => {
  log(lc.GL_ANIMATION, 'Creating loading state orchestrator')

  let loadingStartTime: number | null = null
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

    // Simple loading progress based on time
    const elapsedTime = currentTime - loadingStartTime
    const loadingProgress = Math.min(elapsedTime / 3000, 1) // 3 second loading animation

    // Log every 2 seconds
    if (currentTime % 2000 < 50) {
      log.debug(lc.GL_ANIMATION, `Loading animation... elapsed: ${elapsedTime}ms`)
    }

    // Apply loading effects to scene elements
    const effects = calculateLoadingEffects({
      progress: loadingProgress,
      time,
      isComplete: false, // Never complete, just keep animating
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
