import type { RendererState } from '../types.ts'
import animationConfig from '../../configAnimation.json' with { type: 'json' }
import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }
import { createLogoLayer } from '../layers/index.ts'
import ms from 'ms'

const { animationConfig: animation, userReactivity } = animationConfig
const { postProcessingConfig } = sceneConfig

// Get random interval between 1-4 seconds
const getRandomInterval = () => 1000 + Math.random() * 3000

// Tracking variables
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0
let lastRegenerateTime = 0
let nextRegenerateInterval = getRandomInterval()

// Setup mouse tracking
export const setupMouseTracking = () => {
  const { mouseCoefficient } = userReactivity

  const handleMouseMove = (event: MouseEvent) => {
    // Calculate normalized mouse position (-1 to 1)
    mouseX = (event.clientX / globalThis.innerWidth) * 2 - 1
    mouseY = (event.clientY / globalThis.innerHeight) * 2 - 1

    // Calculate target rotation based on mouse position
    targetRotationX = mouseY * mouseCoefficient
    targetRotationY = mouseX * mouseCoefficient
  }

  // Add mouse move listener
  globalThis.addEventListener('mousemove', handleMouseMove)

  // Return cleanup function
  return () => globalThis.removeEventListener('mousemove', handleMouseMove)
}

/**
 * Updates a static layer's position with subtle breathing motion
 */
export const animateStaticLayer = (plane: any, layer: any, time: number, index: number) => {
  if (plane.material instanceof Object) {
    // Subtle breathing motion
    const breatheAmount = 0.02

    // Apply different animation based on whether it's a stencil layer or not
    if (layer.isStencil) {
      plane.rotation.x = Math.sin(time * 0.1) * 0.03
      plane.rotation.y = Math.cos(time * 0.15) * 0.03
      plane.position.z = layer.zPos + Math.sin(time * 0.2) * breatheAmount
    } else {
      // No X/Y on the base
      plane.position.z = layer.zPos + Math.sin(time * 0.2 + index * 0.05) * breatheAmount
    }
  }
}

/**
 * Updates a random layer's position with more chaotic movements
 */
export const animateRandomLayer = (plane: any, layer: any, time: number, index: number, totalLayers: number) => {
  if (plane.material instanceof Object) {
    // More chaotic movement for random layers
    const randomFactor = Math.sin(time * 2 + index * 0.5) * 0.3 + 0.7

    // Dynamic z-position with wider range
    const breathingDepth = 0.08 * randomFactor * (index + 1) / totalLayers
    plane.position.z = layer.zPos + Math.sin(time * 0.5 + index * 0.4) * breathingDepth

    // More pronounced x/y movement
    const movementScale = 0.02 * randomFactor * (index + 1) / totalLayers
    plane.position.x = Math.sin(time * 0.4 + index * 0.7) * movementScale
    plane.position.y = Math.cos(time * 0.3 + index * 0.9) * movementScale * 0.8

    // Occasional rapid displacement bursts
    if (Math.random() < 0.004) {
      const burstIntensity = 0.2 * randomFactor * (index + 1) / totalLayers
      plane.position.x += (Math.random() - 0.5) * burstIntensity
      plane.position.y += (Math.random() - 0.5) * burstIntensity

      // Reset position after a short, random delay
      setTimeout(() => {
        if (plane) {
          plane.position.x = Math.sin(time * 0.4 + index * 0.7) * movementScale
          plane.position.y = Math.cos(time * 0.3 + index * 0.9) * movementScale * 0.8
        }
      }, ms('50ms') + Math.random() * ms('100ms'))
    }

    // Occasional opacity flickers for random layers
    if (Math.random() < 0.003 && plane.material.uniforms) {
      const originalOpacity = plane.material.uniforms.opacity.value
      plane.material.uniforms.opacity.value *= Math.random() * 1.5 + 0.5

      // Reset opacity after short delay
      setTimeout(() => {
        if (plane && plane.material.uniforms) {
          plane.material.uniforms.opacity.value = originalOpacity
        }
      }, ms('50ms') + Math.random() * ms('150ms'))
    }
  }
}

/**
 * Update shader time uniform for layer based on fps setting
 */
export const updateLayerShaderTime = (plane: any, layer: any, time: number) => {
  if (plane.material instanceof Object && plane.material.uniforms) {
    // Initialize last update time if not set
    if (plane.lastUpdateTime === undefined) plane.lastUpdateTime = 0

    // Calculate time since last update and required interval based on fps
    const timeSinceLastUpdate = time - plane.lastUpdateTime
    const updateInterval = 1 / layer.fps // Convert fps to seconds per frame

    // Check if enough time has passed to update this layer
    if (timeSinceLastUpdate >= updateInterval) {
      // For glitchy layers, make the effect more dramatic with randomization
      if (layer.fps <= 2 && layer.noiseRate > 48) {
        // Create dramatically different value each time with randomization
        plane.material.uniforms.time.value = time * layer.noiseRate * (Math.random() + 0.5)
      } else {
        // Normal layer updates
        plane.material.uniforms.time.value = time * layer.noiseRate
      }

      // Reset timer for next update
      plane.lastUpdateTime = time
    }
  }
}

/**
 * Update glitch effects in the final shader pass
 */
export const updateFinalPassEffects = (finalPass: any, time: number) => {
  if (finalPass.uniforms) {
    // Make sure we use modulated time to prevent accumulation
    finalPass.uniforms.time.value = time % ms('1000ms')

    // Basic protection to prevent time from growing too large
    if (time > ms('100s')) time = 0

    const {
      chromaGlitchProbability,
      chromaGlitchIntensityMin,
      chromaGlitchIntensityMax,
      chromaGlitchResetDelay,
    } = animation

    const { finalPass: { chromaStrength: defaultChromaStrength } } = postProcessingConfig

    // Occasionally increase chromatic aberration for a glitch effect
    if (Math.random() < chromaGlitchProbability) {
      // Store original value for reference
      const currentChromaStrength = finalPass.uniforms.chromaStrength.value

      // If the current value is already significantly higher than default,
      // don't increase it further to prevent accumulated growth
      if (currentChromaStrength > defaultChromaStrength * 2) return

      const intensityMultiplier = chromaGlitchIntensityMin + Math.random() * (chromaGlitchIntensityMax - chromaGlitchIntensityMin)

      // Apply the effect but with a maximum cap
      const newValue = defaultChromaStrength * intensityMultiplier
      finalPass.uniforms.chromaStrength.value = Math.min(newValue, defaultChromaStrength * 5)

      // Reset after a short delay
      setTimeout(() => {
        if (finalPass.uniforms) finalPass.uniforms.chromaStrength.value = defaultChromaStrength
      }, chromaGlitchResetDelay)
    } else if (Math.random() < 0.001) {
      // Occasionally reset to default value even without a glitch
      // This provides recovery from any accumulated aberration
      finalPass.uniforms.chromaStrength.value = defaultChromaStrength
    }
  }
}

/**
 * Update bloom effect parameters for subtle pulsing
 */
let bloomOverrideActive = false
let bloomOverrideTimeout: ReturnType<typeof setTimeout> | null = null

export const updateBloomEffect = (bloomPass: any, _bloomParams: any, time: number) => {
  if (!bloomPass) return
  const {
    bloomPulseFrequency,
    bloomPulseIntensity,
    bloomStrength,
    bloomOverrideProbability,
    bloomOverrideIntensity,
    bloomOverrideDurationMin,
    bloomOverrideDurationMax,
  } = animation

  // Handle override
  if (!bloomOverrideActive && Math.random() < bloomOverrideProbability) {
    bloomOverrideActive = true
    bloomPass.strength = bloomStrength * bloomOverrideIntensity
    if (bloomOverrideTimeout) clearTimeout(bloomOverrideTimeout)

    // Pick a random duration between min and max
    const duration = bloomOverrideDurationMin + Math.random() * (bloomOverrideDurationMax - bloomOverrideDurationMin)
    bloomOverrideTimeout = setTimeout(() => {
      bloomOverrideActive = false
    }, duration)

    return
  }

  if (bloomOverrideActive) bloomPass.strength = bloomStrength * bloomOverrideIntensity
  else bloomPass.strength = bloomStrength + Math.sin(time * bloomPulseFrequency) * bloomPulseIntensity
}

/**
 * Update the dithering shader pass
 */
export const updateDitheringPass = (ditheringPass: any, time: number) => {
  if (ditheringPass.uniforms) ditheringPass.uniforms.time.value = time
}

/**
 * Update the sharpening pass if needed
 */
export const updateSharpeningPass = (sharpeningPass: any, width: number, height: number) => {
  if (sharpeningPass.uniforms && sharpeningPass.uniforms.resolution) sharpeningPass.uniforms.resolution.value.set(width, height)
}

/**
 * Main animation loop that handles updating all elements
 */
export const startAnimationLoop = (state: RendererState) => {
  let time = 0
  const { timeIncrement } = animation
  let animationId: number

  // Set up mouse tracking
  const cleanupMouseTracking = setupMouseTracking()

  // Create logo layer manager
  const logoLayer = createLogoLayer(state.THREE)

  const animate = () => {
    // Align the focus plane to the camera if present
    if (typeof window !== 'undefined' && typeof (window as any).alignFocusPlane === 'function') {
      ;(window as any).alignFocusPlane()
    }
    // Request next frame first and store the ID
    animationId = requestAnimationFrame(animate)
    time += timeIncrement

    // Update orbit controls
    state.controls.update()

    // Apply mouse-based rotation to the entire scene
    // Smoothly interpolate current rotation to target rotation
    state.scene.rotation.x += (targetRotationX - state.scene.rotation.x) * 0.05
    state.scene.rotation.y += (targetRotationY - state.scene.rotation.y) * 0.05

    // Update video background if present
    if (state.videoBackground) state.videoBackground.update(timeIncrement)

    // Check if it's time to regenerate logo layers
    const currentTime = Date.now()
    if (currentTime - lastRegenerateTime > nextRegenerateInterval) {
      // Regenerate layers
      const { planes, layers } = logoLayer.regenerate(
        state.scene,
        state.planes,
        state.layers,
        state.planeGeometry,
        state.outlineTexture,
        state.stencilTexture,
      )

      // Update state
      state.planes = planes
      state.layers = layers

      // Reset timer and get new interval
      lastRegenerateTime = currentTime
      nextRegenerateInterval = getRandomInterval()
    }

    // Update each plane's position and shader
    state.planes.forEach((plane, i) => {
      const layer = state.layers[i]

      // Update shader time
      updateLayerShaderTime(plane, layer, time)

      // Different movement patterns for static vs random layers
      if (layer.isRandom) animateRandomLayer(plane, layer, time, i, state.layers.length)
      else animateStaticLayer(plane, layer, time, i)
    })

    // Update post-processing effects
    updateFinalPassEffects(state.finalPass, time)
    updateBloomEffect(state.bloomPass, sceneConfig.postProcessingConfig.bloom, time)
    updateDitheringPass(state.ditheringPass, time)
    updateSharpeningPass(state.sharpeningPass, state.renderer.domElement.width, state.renderer.domElement.height)

    // Render with post-processing
    state.composer.render()
  }

  // Start animation
  animate()

  // Return a function to stop the animation
  return () => {
    cancelAnimationFrame(animationId)
    cleanupMouseTracking()
  }
}
