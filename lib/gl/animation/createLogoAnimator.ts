import type { RendererState } from '../types.ts'
import { calculateMouseRotation } from './calculations/calculateMouseRotation.ts'
import { calculateStaticLayerPosition } from './calculations/calculateStaticLayerPosition.ts'
import { calculateRandomLayerPosition } from './calculations/calculateRandomLayerPosition.ts'
import { calculateShaderTime } from './calculations/calculateShaderTime.ts'
import { calculateChromaGlitchEffect } from './calculations/calculateChromaGlitchEffect.ts'
import { calculateBloomEffect } from './calculations/calculateBloomEffect.ts'
import { calculateRegenerationTiming } from './calculations/calculateRegenerationTiming.ts'
import { smoothRotationInterpolation } from './utils/smoothRotationInterpolation.ts'
import { getRandomInterval } from './utils/getRandomInterval.ts'
import { createLogoLayer } from '../layers/index.ts'
import animationConfig from '@lib/configAnimation.json' with { type: 'json' }
import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }
import ms from 'ms'

const { animationConfig: animation, userReactivity } = animationConfig
const { postProcessingConfig } = sceneConfig

/**
 * Creates a logo animator with functional approach
 * Separates pure calculations from necessary side effects
 */
export const createLogoAnimator = (dependencies: RendererState) => {
  let animationId: number | null = null
  let frameCount = 0
  let lastTime = 0
  let mouseState = { x: 0, y: 0, targetRotationX: 0, targetRotationY: 0 }
  let lastRegenerateTime = Date.now()
  let nextRegenerateInterval = getRandomInterval()
  let bloomOverrideActive = false
  let bloomOverrideTimeout: ReturnType<typeof setTimeout> | null = null

  // Create logo layer manager for regeneration
  const logoLayer = createLogoLayer(dependencies.THREE)

  const handleMouseMove = (event: MouseEvent) => {
    const mouseX = (event.clientX / globalThis.innerWidth) * 2 - 1
    const mouseY = (event.clientY / globalThis.innerHeight) * 2 - 1

    const rotation = calculateMouseRotation(mouseX, mouseY, userReactivity.mouseCoefficient)

    mouseState = {
      x: mouseX,
      y: mouseY,
      targetRotationX: rotation.targetRotationX,
      targetRotationY: rotation.targetRotationY,
    }
  }

  const tick = (timestamp: number) => {
    const totalTime = timestamp
    lastTime = timestamp
    frameCount++

    // Apply pure mouse rotation calculations
    dependencies.scene.rotation.x = smoothRotationInterpolation(
      dependencies.scene.rotation.x,
      mouseState.targetRotationX,
    )
    dependencies.scene.rotation.y = smoothRotationInterpolation(
      dependencies.scene.rotation.y,
      mouseState.targetRotationY,
    )

    // Check for layer regeneration
    const currentTime = Date.now()
    const regenerationResult = calculateRegenerationTiming(
      currentTime,
      lastRegenerateTime,
      nextRegenerateInterval,
    )

    // Regenerate layers
    if (regenerationResult.shouldRegenerate) {
      const { planes, layers } = logoLayer.regenerate(
        dependencies.scene,
        dependencies.planes,
        dependencies.planeGeometry,
        dependencies.outlineTexture,
        dependencies.stencilTexture,
      )

      // Update dependencies
      dependencies.planes = planes
      dependencies.logoLayers = layers

      // Update timing
      lastRegenerateTime = currentTime
      nextRegenerateInterval = regenerationResult.newInterval
    }

    // Apply pure layer calculations and shader updates
    dependencies.planes.forEach((plane: any, index: number) => {
      const layer = dependencies.logoLayers[index]
      if (!layer) return

      if (plane.material?.uniforms?.time) {
        // Initialize last update time if not set
        if (plane.lastUpdateTime === undefined) plane.lastUpdateTime = 0

        const updateInterval = 1 / layer.fps // Convert fps to seconds per frame
        const shaderTimeResult = calculateShaderTime(
          totalTime * 0.001, // Convert to seconds
          plane.lastUpdateTime,
          layer,
          updateInterval,
        )

        if (shaderTimeResult.shouldUpdate) {
          plane.material.uniforms.time.value = shaderTimeResult.newTime
          plane.lastUpdateTime = shaderTimeResult.newTime
        }
      }

      if (layer.isRandom) {
        const position = calculateRandomLayerPosition(
          totalTime,
          index,
          dependencies.logoLayers.length,
          layer.zPos,
        )

        plane.position.x = position.positionX
        plane.position.y = position.positionY
        plane.position.z = position.positionZ
      } else {
        const position = calculateStaticLayerPosition(
          totalTime,
          index,
          layer.zPos,
          layer.isStencil,
        )

        plane.rotation.x = position.rotationX
        plane.rotation.y = position.rotationY
        plane.position.z = position.positionZ
      }
    })

    // Update post-processing effects
    if (dependencies.finalPass?.uniforms) {
      // Update time uniform
      dependencies.finalPass.uniforms.time.value = totalTime % ms('1000ms')

      // Apply chroma glitch effects
      const chromaGlitchResult = calculateChromaGlitchEffect(
        dependencies.finalPass.uniforms.chromaStrength.value,
        postProcessingConfig.finalPass.chromaStrength,
        {
          chromaGlitchProbability: animation.chromaGlitchProbability,
          chromaGlitchIntensityMin: animation.chromaGlitchIntensityMin,
          chromaGlitchIntensityMax: animation.chromaGlitchIntensityMax,
        },
      )

      if (chromaGlitchResult.shouldApplyGlitch) {
        dependencies.finalPass.uniforms.chromaStrength.value = chromaGlitchResult.newChromaStrength

        // Reset after a short delay
        setTimeout(() => {
          if (dependencies.finalPass?.uniforms) {
            dependencies.finalPass.uniforms.chromaStrength.value = postProcessingConfig.finalPass.chromaStrength
          }
        }, animation.chromaGlitchResetDelay)
      } else if (chromaGlitchResult.shouldReset) {
        dependencies.finalPass.uniforms.chromaStrength.value = chromaGlitchResult.newChromaStrength
      }
    }

    // Update bloom effect
    if (dependencies.bloomPass) {
      const bloomResult = calculateBloomEffect(
        totalTime * 0.001, // Convert to seconds
        bloomOverrideActive,
        {
          bloomPulseFrequency: animation.bloomPulseFrequency,
          bloomPulseIntensity: animation.bloomPulseIntensity,
          bloomStrength: animation.bloomStrength,
          bloomOverrideProbability: animation.bloomOverrideProbability,
          bloomOverrideIntensity: animation.bloomOverrideIntensity,
          bloomOverrideDurationMin: animation.bloomOverrideDurationMin,
          bloomOverrideDurationMax: animation.bloomOverrideDurationMax,
        },
      )

      if (bloomResult.shouldActivateOverride) {
        bloomOverrideActive = true
        if (bloomOverrideTimeout) clearTimeout(bloomOverrideTimeout)

        bloomOverrideTimeout = setTimeout(() => {
          bloomOverrideActive = false
        }, bloomResult.overrideDuration)
      }

      dependencies.bloomPass.strength = bloomResult.bloomStrength
    }

    // Update dithering pass
    if (dependencies.ditheringPass?.uniforms) {
      dependencies.ditheringPass.uniforms.time.value = totalTime * 0.001
    }

    // Update sharpening pass
    if (dependencies.sharpeningPass?.uniforms?.resolution) {
      dependencies.sharpeningPass.uniforms.resolution.value.set(
        dependencies.renderer.domElement.width,
        dependencies.renderer.domElement.height,
      )
    }

    // Update controls and render
    dependencies.controls?.update()
    if (dependencies.videoBackground) dependencies.videoBackground.update(animation.timeIncrement)
    dependencies.composer.render()

    animationId = requestAnimationFrame(tick)
  }

  const start = () => {
    if (animationId !== null) return () => {}

    globalThis.addEventListener('mousemove', handleMouseMove)
    lastTime = performance.now()
    animationId = requestAnimationFrame(tick)

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
      globalThis.removeEventListener('mousemove', handleMouseMove)

      // Clean up timeouts
      if (bloomOverrideTimeout) {
        clearTimeout(bloomOverrideTimeout)
        bloomOverrideTimeout = null
      }
    }
  }

  return { start }
}
