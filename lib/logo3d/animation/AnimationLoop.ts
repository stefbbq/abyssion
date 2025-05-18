import type { RendererState } from '../types.ts'
import { ANIMATION_CONFIG } from './config.ts'
import { DEFAULT_BLOOM_PARAMS, POST_PROCESSING_CONFIG } from '../scene/config.ts'
import { createLogoLayer } from '../layers/index.ts'

// Add mouse tracking variables
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0

// Add auto-regeneration variables
let lastRegenerateTime = 0
let nextRegenerateInterval = getRandomInterval()

// Get random interval between 1-4 seconds
function getRandomInterval() {
  return 1000 + Math.random() * 3000 // 1-4 seconds in milliseconds
}

// Setup mouse tracking
export const setupMouseTracking = (container: HTMLElement) => {
  const handleMouseMove = (event: MouseEvent) => {
    // Calculate normalized mouse position (-1 to 1)
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = (event.clientY / window.innerHeight) * 2 - 1

    // Calculate target rotation based on mouse position
    targetRotationX = mouseY * 0.1 // Limit rotation amount
    targetRotationY = mouseX * 0.1
  }

  // Add mouse move listener
  window.addEventListener('mousemove', handleMouseMove)

  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
}

/**
 * Updates a static layer's position with subtle breathing motion
 */
export const animateStaticLayer = (
  plane: any,
  layer: any,
  time: number,
  index: number,
) => {
  if (plane.material instanceof Object) {
    // Subtle breathing motion
    const breatheAmount = 0.02

    // Apply different animation based on whether it's a stencil layer or not
    if (layer.isStencil) {
      // For extruded stencil, add subtle rotation
      plane.rotation.x = Math.sin(time * 0.1) * 0.03
      plane.rotation.y = Math.cos(time * 0.15) * 0.03

      // Small position adjustments
      plane.position.z = layer.zPos + Math.sin(time * 0.2) * breatheAmount
    } else {
      // For normal layers, just adjust z position
      plane.position.z = layer.zPos + Math.sin(time * 0.2 + index * 0.05) * breatheAmount
    }

    // Note: Shader time uniforms are now handled exclusively by updateLayerShaderTime
  }
}

/**
 * Updates a random layer's position with more chaotic movements
 */
export const animateRandomLayer = (
  plane: any,
  layer: any,
  time: number,
  index: number,
  totalLayers: number,
) => {
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
      }, 50 + Math.random() * 100)
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
      }, 50 + Math.random() * 150)
    }
  }
}

/**
 * Update shader time uniform for layer based on fps setting
 */
export const updateLayerShaderTime = (
  plane: any,
  layer: any,
  time: number,
) => {
  if (plane.material instanceof Object && plane.material.uniforms) {
    // Initialize last update time if not set
    if (plane.lastUpdateTime === undefined) plane.lastUpdateTime = 0

    // Calculate time since last update and required interval based on fps
    const timeSinceLastUpdate = time - plane.lastUpdateTime
    const updateInterval = 1 / layer.fps // Convert fps to seconds per frame

    // Check if enough time has passed to update this layer
    if (timeSinceLastUpdate >= updateInterval) {
      // For glitchy layers, make the effect more dramatic with randomization
      if (layer.fps <= 2 && layer.noiseRate > 50) {
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
    finalPass.uniforms.time.value = time % 1000

    // Basic protection to prevent time from growing too large
    if (time > 100000) {
      time = 0
    }

    const {
      CHROMA_GLITCH_PROBABILITY,
      CHROMA_GLITCH_INTENSITY_MIN,
      CHROMA_GLITCH_INTENSITY_MAX,
      CHROMA_GLITCH_RESET_DELAY,
    } = ANIMATION_CONFIG

    // Occasionally increase chromatic aberration for a glitch effect
    if (Math.random() < CHROMA_GLITCH_PROBABILITY) {
      // Store original value for reference
      const defaultChromaStrength = POST_PROCESSING_CONFIG.finalPass.chromaStrength
      const currentChromaStrength = finalPass.uniforms.chromaStrength.value

      // If the current value is already significantly higher than default,
      // don't increase it further to prevent accumulated growth
      if (currentChromaStrength > defaultChromaStrength * 2) {
        return
      }

      const intensityMultiplier = CHROMA_GLITCH_INTENSITY_MIN +
        Math.random() * (CHROMA_GLITCH_INTENSITY_MAX - CHROMA_GLITCH_INTENSITY_MIN)

      // Apply the effect but with a maximum cap
      const newValue = defaultChromaStrength * intensityMultiplier
      finalPass.uniforms.chromaStrength.value = Math.min(newValue, defaultChromaStrength * 5)

      // Reset after a short delay
      setTimeout(() => {
        if (finalPass.uniforms) {
          // Reset to the default value, not the original which might already be elevated
          finalPass.uniforms.chromaStrength.value = defaultChromaStrength
        }
      }, CHROMA_GLITCH_RESET_DELAY)
    } else if (Math.random() < 0.001) {
      // Occasionally reset to default value even without a glitch
      // This provides recovery from any accumulated aberration
      finalPass.uniforms.chromaStrength.value = POST_PROCESSING_CONFIG.finalPass.chromaStrength
    }
  }
}

/**
 * Update bloom effect parameters for subtle pulsing
 */
export const updateBloomEffect = (bloomPass: any, bloomParams: any, time: number) => {
  if (bloomPass) {
    const { BLOOM_PULSE_FREQUENCY, BLOOM_PULSE_INTENSITY } = ANIMATION_CONFIG
    const baseBrightness = bloomParams.bloomStrength
    bloomPass.strength = baseBrightness + Math.sin(time * BLOOM_PULSE_FREQUENCY) * BLOOM_PULSE_INTENSITY
  }
}

/**
 * Update the dithering shader pass
 */
export const updateDitheringPass = (ditheringPass: any, time: number) => {
  if (ditheringPass.uniforms) {
    // Update time uniform for animated noise pattern
    ditheringPass.uniforms.time.value = time
  }
}

/**
 * Update the sharpening pass if needed
 */
export const updateSharpeningPass = (sharpeningPass: any, width: number, height: number) => {
  if (sharpeningPass.uniforms && sharpeningPass.uniforms.resolution) {
    // Update resolution if window size has changed
    sharpeningPass.uniforms.resolution.value.set(width, height)
  }
}

/**
 * Main animation loop that handles updating all elements
 */
export const startAnimationLoop = (state: RendererState) => {
  let time = 0
  const { TIME_INCREMENT } = ANIMATION_CONFIG
  let animationId: number

  // Set up mouse tracking
  const cleanupMouseTracking = setupMouseTracking(state.renderer.domElement)

  // Create logo layer manager
  const logoLayer = createLogoLayer(state.THREE)

  const animate = () => {
    // Request next frame first and store the ID
    animationId = requestAnimationFrame(animate)
    time += TIME_INCREMENT

    // Update orbit controls
    state.controls.update()

    // Apply mouse-based rotation to the entire scene
    // Smoothly interpolate current rotation to target rotation
    state.scene.rotation.x += (targetRotationX - state.scene.rotation.x) * 0.05
    state.scene.rotation.y += (targetRotationY - state.scene.rotation.y) * 0.05

    // Update video background if present
    if (state.videoBackground) {
      state.videoBackground.update(TIME_INCREMENT)
    }

    // Check if it's time to regenerate layers
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
      if (layer.isRandom) {
        animateRandomLayer(plane, layer, time, i, state.layers.length)
      } else {
        animateStaticLayer(plane, layer, time, i)
      }
    })

    // Update post-processing effects
    updateFinalPassEffects(state.finalPass, time)
    updateBloomEffect(state.bloomPass, DEFAULT_BLOOM_PARAMS, time)
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
