import type { AnimationContext, AnimationOrchestrator } from '@libgl/animation/core/types.ts'
import { calculateStaticLayerPosition } from '@libgl/animation/calculations/calculateStaticLayerPosition.ts'
import { calculateRandomLayerPosition } from '@libgl/animation/calculations/calculateRandomLayerPosition.ts'
import { calculateShaderTime } from '@libgl/animation/calculations/calculateShaderTime.ts'
import { calculateRegenerationTiming } from '@libgl/animation/calculations/calculateRegenerationTiming.ts'
import { calculateBloomEffect } from '../calculations/calculateBloomEffect.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import ms from 'ms'
import * as Three from 'three'
import type { RendererState } from '@libgl/types.ts'
const { animationConfig: animation } = animationConfig
const { postProcessingConfig } = configScene as ConfigScene

/**
 * Logo page animation orchestrator
 * Manages logo layers, regeneration, and post-processing effects
 */
export const createLogoPageOrchestrator = (logoController: LogoController): AnimationOrchestrator => {
  let lastRegenerateTime = 0
  let nextRegenerateInterval = ms('1s') + Math.random() * ms('3s')
  let bloomOverrideActive = false
  let bloomOverrideTimeout: ReturnType<typeof setTimeout> | null = null

  /**
   * Calculate fade-out effect based on scroll position
   */
  const calculateFadeOpacity = (state: RendererState, layerIndex: number, originalOpacity: number): number => {
    const fadeStartThreshold = 0.65 // Start fading at 65% scroll
    const fadeEndThreshold = 0.80 // Fully faded at 80% scroll

    // Calculate current scroll progress based on window height
    const scrollY = globalThis.scrollY || 0
    const scrollProgress = Math.min(scrollY / globalThis.innerHeight, 1.0)

    // Not in fade zone - return original opacity
    if (scrollProgress < fadeStartThreshold) {
      // Reset fade order when scrolling back up
      if (state.layerFadeOrder) {
        delete state.layerFadeOrder
      }
      return originalOpacity
    }

    // In fade zone - create fade order if needed
    if (!state.layerFadeOrder) {
      const allLayers = state.logoPlanes.map((plane, index) => ({
        index,
        isStencil: state.logoLayers[index]?.isStencil,
        layer: state.logoLayers[index],
      }))

      const nonStencilIndices = allLayers
        .filter((item) => !item.isStencil)
        .map((item) => item.index)

      // Shuffle the indices for random fade order
      state.layerFadeOrder = [...nonStencilIndices].sort(() => Math.random() - 0.5)
    }

    // Calculate fade progress (0 to 1 between 65% and 80%)
    const fadeProgress = Math.min((scrollProgress - fadeStartThreshold) / (fadeEndThreshold - fadeStartThreshold), 1.0)

    // Find this layer's position in the fade order
    const fadeOrderIndex = state.layerFadeOrder.indexOf(layerIndex)
    if (fadeOrderIndex === -1) return originalOpacity // Not in fade order

    // Calculate how many layers should be faded based on progress
    const totalFadeLayers = state.layerFadeOrder.length
    const layersToFade = Math.floor(fadeProgress * totalFadeLayers)

    if (fadeOrderIndex < layersToFade) {
      // This layer should be completely faded
      console.log(`🎭 Layer ${layerIndex} completely faded (${fadeOrderIndex}/${layersToFade})`)
      return 0
    } else if (fadeOrderIndex === layersToFade && fadeProgress < 1.0) {
      // This layer is currently fading (sputter effect)
      const layerFadeProgress = (fadeProgress * totalFadeLayers) - layersToFade

      // Add sputter effect - random fluctuation during fade
      const sputterIntensity = Math.sin(performance.now() * 0.01 + layerIndex) * 0.3 + 0.7
      const fadeOpacity = originalOpacity * (1 - layerFadeProgress) * sputterIntensity
      console.log(`🎭 Layer ${layerIndex} sputtering: ${fadeOpacity.toFixed(3)} (progress: ${layerFadeProgress.toFixed(3)})`)
      return Math.max(0, fadeOpacity)
    }

    // This layer hasn't started fading yet
    return originalOpacity
  }

  const update = (context: AnimationContext) => {
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

    // Update each plane
    state.logoPlanes.forEach((plane: Three.Mesh, i: number) => {
      const layer = state.logoLayers[i]

      // Update shader time
      const shaderResult = calculateShaderTime(
        time,
        plane.lastUpdateTime || 0,
        layer.fps,
        layer.noiseRate,
        layer.fps <= 2 && layer.noiseRate > 48,
      )

      if (shaderResult.shouldUpdate && plane.material?.uniforms?.time) {
        plane.material.uniforms.time.value = shaderResult.newTime
        plane.lastUpdateTime = time
      }

      // Calculate and apply position
      const position = layer.isRandom
        ? calculateRandomLayerPosition(time, i, layer.zPos, state.logoLayers.length)
        : calculateStaticLayerPosition(time, i, layer.zPos, layer.isStencil)

      plane.position.set(position.x, position.y, position.z)
      plane.rotation.x = position.rotationX
      plane.rotation.y = position.rotationY

      // Handle random layer burst effects
      if (layer.isRandom && Math.random() < 0.004 && !layer.isStencil) {
        const randomFactor = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7
        const burstIntensity = 0.2 * randomFactor * (i + 1) / state.logoLayers.length

        plane.position.x += (Math.random() - 0.5) * burstIntensity
        plane.position.y += (Math.random() - 0.5) * burstIntensity

        setTimeout(() => {
          if (plane) {
            const resetPosition = calculateRandomLayerPosition(time, i, layer.zPos, state.logoLayers.length)
            plane.position.x = resetPosition.x
            plane.position.y = resetPosition.y
          }
        }, ms('0.05s') + Math.random() * ms('0.1s'))
      }

      // Handle opacity for all layers
      if (plane.material?.uniforms?.opacity) {
        const baseOpacity = layer.opacity // Original layer opacity

        // Stencil layers: always maintain their original opacity
        if (layer.isStencil) {
          plane.material.uniforms.opacity.value = baseOpacity
        } // Random layers: apply fade + occasional flicker
        else if (layer.isRandom) {
          const fadeOpacity = calculateFadeOpacity(state, i, baseOpacity)

          // Occasional flicker (only if not completely faded out)
          if (Math.random() < 0.003 && fadeOpacity > 0) {
            const flickerOpacity = fadeOpacity * (Math.random() * 1.5 + 0.5)
            plane.material.uniforms.opacity.value = flickerOpacity

            setTimeout(() => {
              if (plane?.material?.uniforms?.opacity) {
                // Restore to current fade-adjusted opacity
                const currentFadeOpacity = calculateFadeOpacity(state, i, baseOpacity)
                plane.material.uniforms.opacity.value = currentFadeOpacity
              }
            }, ms('0.05s') + Math.random() * ms('0.15s'))
          } else {
            // Normal fade-adjusted opacity
            plane.material.uniforms.opacity.value = fadeOpacity
          }
        } // Static layers: apply fade only
        else {
          const fadeOpacity = calculateFadeOpacity(state, i, baseOpacity)
          plane.material.uniforms.opacity.value = fadeOpacity
        }
      }
    })

    // Update post-processing effects
    updatePostProcessing(state, time)
  }

  const updatePostProcessing = (state: RendererState, currentTime: number) => {
    // Final pass chromatic aberration glitch
    if (state.finalPass?.uniforms) {
      state.finalPass.uniforms.time.value = currentTime % ms('1000ms')

      if (Math.random() < animation.chromaGlitchProbability) {
        const currentChroma = state.finalPass.uniforms.chromaStrength.value
        const defaultChroma = postProcessingConfig.finalPass.chromaStrength

        if (currentChroma <= defaultChroma * 2) {
          const intensityMultiplier = animation.chromaGlitchIntensityMin +
            Math.random() * (animation.chromaGlitchIntensityMax - animation.chromaGlitchIntensityMin)

          state.finalPass.uniforms.chromaStrength.value = Math.min(
            defaultChroma * intensityMultiplier,
            defaultChroma * 5,
          )

          setTimeout(() => {
            if (state.finalPass?.uniforms) {
              state.finalPass.uniforms.chromaStrength.value = defaultChroma
            }
          }, animation.chromaGlitchResetDelay)
        }
      }
    }

    // Bloom effect with override logic
    if (state.bloomPass) {
      const bloomConfig = postProcessingConfig.bloom
      const swellConfig = bloomConfig.bloomSwell || { enabled: false }

      if (swellConfig.enabled) {
        // Handle bloom override activation
        if (!bloomOverrideActive && Math.random() < swellConfig.overrideProbability) {
          bloomOverrideActive = true
          if (bloomOverrideTimeout) clearTimeout(bloomOverrideTimeout)

          const duration = swellConfig.overrideDurationMin +
            Math.random() * (swellConfig.overrideDurationMax - swellConfig.overrideDurationMin)

          bloomOverrideTimeout = setTimeout(() => {
            bloomOverrideActive = false
          }, duration)
        }

        // Apply animated bloom effect
        state.bloomPass.strength = calculateBloomEffect(
          currentTime,
          bloomConfig.bloomStrength,
          swellConfig.pulseFrequency,
          swellConfig.pulseIntensity,
          bloomOverrideActive,
          swellConfig.overrideIntensity,
        )
      } else state.bloomPass.strength = bloomConfig.bloomStrength
    }

    // Dithering pass
    if (state.ditheringPass?.uniforms) {
      state.ditheringPass.uniforms.time.value = currentTime
    }

    // Sharpening pass
    if (state.sharpeningPass?.uniforms?.resolution) {
      state.sharpeningPass.uniforms.resolution.value.set(
        state.renderer.domElement.width,
        state.renderer.domElement.height,
      )
    }
  }

  const dispose = (context: AnimationContext) => {
    const { state } = context

    // Use the dedicated dispose method from the logoLayer instance
    logoController.dispose(state.scene, state.logoPlanes)

    // Don't remove shape/shadow layers - they should persist across page changes
    // if (state.shapeLayer?.parent) state.shapeLayer.parent.remove(state.shapeLayer)
    // if (state.shadowLayer?.parent) state.shadowLayer.parent.remove(state.shadowLayer)

    // Dispose of their resources if they have a dispose method
    // if (typeof state.shapeLayer?.dispose === 'function') state.shapeLayer.dispose()
    // if (typeof state.shadowLayer?.dispose === 'function') state.shadowLayer.dispose()

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
  }

  return {
    name: 'logo-page',
    update,
    dispose,
  }
}
