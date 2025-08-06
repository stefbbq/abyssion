import type { AnimationContext, AnimationOrchestrator } from '@libgl/animation/core/types.ts'
import { calculateRegenerationTiming } from './calculations/calculateRegenerationTiming.ts'
import { calculatePlaneUpdate } from './calculations/calculatePlaneUpdate.ts'
import { calculatePostProcessingUpdate } from './calculations/calculatePostProcessingUpdate.ts'
import { calculateRandomLayerPosition } from './calculations/calculateRandomLayerPosition.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import ms from 'ms'
import { calculateFadeOpacity } from './calculations/calculateFadeOpacity.ts'
import * as Three from 'three'
import { scrollState } from '@libgl/animation/state/scrollState.ts'

/**
 * Home page animation orchestrator (formerly logo page)
 * Manages logo layers, regeneration, and post-processing effects
 */
export const createHomePageOrchestrator = (logoController: LogoController): AnimationOrchestrator => {
  if (!logoController) {
    throw new Error('logoController not available when creating home page orchestrator')
  }

  let lastRegenerateTime = 0
  let nextRegenerateInterval = ms('1s') + Math.random() * ms('3s')
  let bloomOverrideActive = false
  let bloomOverrideTimeout: ReturnType<typeof setTimeout> | null = null

  /**
   * Updates dashed orbit rotations for slow random rotation
   */
  const updateDashedOrbitRotations = (scene: Three.Scene) => {
    scene.traverse((child: Three.Object3D) => {
      // if the child is not a group, return
      if (child.type !== 'Group') return

      // Look for dashed orbit groups
      if (child.type === 'Group' && child.children) {
        child.children.forEach((orbitHolder: Three.Object3D) => {
          if (orbitHolder.userData && orbitHolder.userData.rotationSpeed) {
            const { rotationSpeed, rotationAxis } = orbitHolder.userData

            // Apply rotation based on the stored axis and speed
            if (rotationAxis === 'x') {
              orbitHolder.rotation.x += rotationSpeed
            } else if (rotationAxis === 'y') {
              orbitHolder.rotation.y += rotationSpeed
            } else if (rotationAxis === 'z') {
              orbitHolder.rotation.z += rotationSpeed
            }
          }
        })
      }
    })
  }

  const update = (context: AnimationContext) => {
    console.log('update', context)
    const { state, time } = context

    // Check layer regeneration timing
    const currentTime = Date.now()
    const regenerationResult = calculateRegenerationTiming(
      currentTime,
      lastRegenerateTime,
      nextRegenerateInterval,
    )

    if (regenerationResult.shouldRegenerate) {
      const { planes, layers } = logoController.regenerate(
        state.scene,
        state.logoPlanes,
        state.planeGeometry,
        state.outlineTexture,
        state.stencilTexture,
      )

      state.logoPlanes = planes
      state.logoLayers = layers
      lastRegenerateTime = currentTime
      nextRegenerateInterval = regenerationResult.newInterval
    }

    // Update each plane using pure calculation functions
    state.logoPlanes.forEach((plane, i) => {
      const layer = state.logoLayers[i]
      if (!layer) return

      // Calculate fade multiplier (0..1) for this layer
      const scrollY = scrollState.y
      const scrollProgress = Math.min(scrollY / globalThis.innerHeight, 1.0)
      const fadeResult = calculateFadeOpacity({
        scrollProgress,
        fadeStartThreshold: 0.65,
        fadeEndThreshold: 0.80,
        layerIndex: i,
        totalLayers: state.logoLayers.length,
      })

      // Get base plane update (animation, flicker, etc.)
      const updateResult = calculatePlaneUpdate({
        time,
        planeIndex: i,
        layer: {
          opacity: layer.opacity,
          zPos: layer.zPos,
          fps: layer.fps,
          noiseRate: layer.noiseRate,
          isRandom: layer.isRandom,
          isStencil: layer.isStencil,
        },
        totalLayers: state.logoLayers.length,
        state,
        lastUpdateTime: plane.lastUpdateTime || 0,
      })

      // Apply shader time update
      if (updateResult.shaderTime.shouldUpdate && plane.material?.uniforms?.time) {
        plane.material.uniforms.time.value = updateResult.shaderTime.newTime
        plane.lastUpdateTime = updateResult.shaderTime.lastUpdateTime
      }

      // Apply position and rotation
      plane.position.set(
        updateResult.position.x,
        updateResult.position.y,
        updateResult.position.z,
      )
      plane.rotation.x = updateResult.position.rotationX
      plane.rotation.y = updateResult.position.rotationY

      // Apply burst effect if needed
      if (updateResult.burstEffect.shouldApply) {
        plane.position.x += updateResult.burstEffect.offsetX
        plane.position.y += updateResult.burstEffect.offsetY

        // Schedule burst reset
        setTimeout(() => {
          if (plane) {
            const resetPosition = calculateRandomLayerPosition(
              time,
              i,
              layer.zPos,
              state.logoLayers.length,
            )
            plane.position.x = resetPosition.x
            plane.position.y = resetPosition.y
          }
        }, updateResult.burstEffect.duration)
      }

      // Apply opacity (base opacity * fade multiplier)
      if (plane.material?.uniforms?.opacity) {
        plane.material.uniforms.opacity.value = updateResult.opacity * fadeResult.fadeMultiplier
      }
    })

    // Update post-processing effects using pure calculation functions
    const postProcessingResult = calculatePostProcessingUpdate({
      currentTime: time,
      bloomOverrideActive,
      bloomOverrideTimeout,
      currentChromaStrength: state.finalPass?.uniforms?.chromaStrength?.value || 0,
      rendererWidth: state.renderer.domElement.width,
      rendererHeight: state.renderer.domElement.height,
    })

    // Apply final pass updates
    if (state.finalPass?.uniforms) {
      state.finalPass.uniforms.time.value = postProcessingResult.finalPass.timeValue
      state.finalPass.uniforms.chromaStrength.value = postProcessingResult.finalPass.chromaStrength

      // Schedule chroma reset if needed
      if (postProcessingResult.finalPass.scheduleChromaReset) {
        setTimeout(() => {
          if (state.finalPass?.uniforms) {
            state.finalPass.uniforms.chromaStrength.value = postProcessingResult.finalPass.chromaResetValue
          }
        }, postProcessingResult.finalPass.chromaResetDelay)
      }
    }

    // Apply bloom pass updates
    if (state.bloomPass) {
      state.bloomPass.strength = postProcessingResult.bloomPass.strength

      // Activate bloom override if needed
      if (postProcessingResult.bloomPass.activateOverride) {
        bloomOverrideActive = true
        if (bloomOverrideTimeout) clearTimeout(bloomOverrideTimeout)

        bloomOverrideTimeout = setTimeout(() => {
          bloomOverrideActive = false
        }, postProcessingResult.bloomPass.overrideDuration)
      }
    }

    // Apply dithering pass updates
    if (state.ditheringPass?.uniforms) {
      state.ditheringPass.uniforms.time.value = postProcessingResult.ditheringPass.timeValue
    }

    // Apply CRT pass time updates (for continuous animation)
    if (state.crtPass?.material?.uniforms?.time) {
      state.crtPass.material.uniforms.time.value = performance.now() / 1000
    }

    // Apply sharpening pass updates
    if (state.sharpeningPass?.uniforms?.resolution) {
      state.sharpeningPass.uniforms.resolution.value.set(
        postProcessingResult.sharpeningPass.resolutionWidth,
        postProcessingResult.sharpeningPass.resolutionHeight,
      )
    }

    // Update dashed orbit rotations
    updateDashedOrbitRotations(state.scene)
  }

  const dispose = (context: AnimationContext) => {
    const { state } = context

    // Use the dedicated dispose method from the logoController
    logoController.dispose(state.scene, state.logoPlanes)

    // Clear arrays from state to prevent artifacts on re-navigation
    state.logoPlanes = []
    state.logoLayers = []

    // Clean up timeouts
    if (bloomOverrideTimeout) {
      clearTimeout(bloomOverrideTimeout)
      bloomOverrideTimeout = null
    }

    // Reset local state of the orchestrator
    lastRegenerateTime = 0
    bloomOverrideActive = false
  }

  return {
    name: 'home-page',
    update,
    dispose,
  }
}
