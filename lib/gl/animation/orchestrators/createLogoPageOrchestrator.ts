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

      // Handle opacity flickers for random layers
      if (layer.isRandom && Math.random() < 0.003 && plane.material?.uniforms?.opacity) {
        const originalOpacity = plane.material.uniforms.opacity.value
        plane.material.uniforms.opacity.value *= Math.random() * 1.5 + 0.5

        setTimeout(() => {
          if (plane?.material?.uniforms?.opacity) plane.material.uniforms.opacity.value = originalOpacity
        }, ms('0.05s') + Math.random() * ms('0.15s'))
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
