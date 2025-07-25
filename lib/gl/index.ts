import type { InitOptions, RendererState } from './types.ts'
import { lc, log } from '../logger/index.ts'
import type { ConfigScene, RendererConfig } from './configScene.types.ts'
import type { PostProcessingConfig } from './configPostProcessing.types.ts'
import { type CorruptionParams, updateCRTShaderUniforms } from './shaders/CRTShader.ts'
import configScene from './configScene.json' with { type: 'json' }
import configPostProcessingJson from './configPostProcessing.json' with { type: 'json' }
import animationConfig from './configAnimation.json' with { type: 'json' }
import controlsConfig from './configControls.json' with { type: 'json' }
import { createPostProcessing } from './scene/createPostProcessing.ts'
import { addLensFlares } from './scene/addLensFlares.ts'

import { createControlsSystem } from './controls/index.ts'
import { createUILayer } from './layers/UILayer.ts'
import { createContentPageOrchestrator, createHomePageOrchestrator, createSceneOrchestrator } from './animation/index.ts'
import { debugMobileResponsiveness } from './scene/utils/mobileDebugHelper.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import {
  createCleanupFunction,
  setupCoreRendering,
  setupDebugSystem,
  setupLayerSystem,
  setupResponsiveHandling,
  setupTextureLoading,
} from './setup/index.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'
import { isGLInitialized } from '@lib/gl/state.ts'
import { getScrollCorruptionProgress } from './scene/utils/getScrollCorruptionProgress.ts'
import { ShaderMaterial } from 'three'

// Type the config properly
const configPostProcessing = configPostProcessingJson as PostProcessingConfig

let glState: (RendererState & { sceneOrchestrator?: ReturnType<typeof createSceneOrchestrator> }) | null = null

/**
 * Initialize the GL scene using composable setup functions
 */
export const initGL = async (options: InitOptions) => {
  const { rendererConfig } = configScene as ConfigScene
  const { outlineTexturePath, stencilTexturePath, canvas } = options
  const THREE = await import('three')
  const width = globalThis.innerWidth
  const height = globalThis.innerHeight

  // Debug mobile responsiveness
  debugMobileResponsiveness()

  // Set up core rendering components
  const { scene, camera, renderer } = await setupCoreRendering(THREE, options)

  // Debug: Test if renderer works at all
  const testScene = new THREE.Scene()
  const testGeometry = new THREE.BoxGeometry(1, 1, 1)
  const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const testMesh = new THREE.Mesh(testGeometry, testMaterial)
  testScene.add(testMesh)

  const testLineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1, -1, 0),
    new THREE.Vector3(1, 1, 0),
  ])
  const testLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
  const testLine = new THREE.Line(testLineGeometry, testLineMaterial)
  testScene.add(testLine)

  renderer.render(testScene, camera)
  log(lc.GL, 'Test render complete - you should see a red cube and green line')

  // Wait a bit before continuing
  await new Promise((resolve) => setTimeout(resolve, 1000))

  log(lc.GL, 'Continuing initialization after test render...')

  // Add video background using new manager system
  const { addVideoBackgroundWithManager } = await import('./scene/addVideoBackgroundWithManager.ts')
  let videoBackground: VideoBackgroundManager | undefined

  try {
    videoBackground = await addVideoBackgroundWithManager(THREE, scene)
    log(lc.GL, 'Added video background with new manager:', videoBackground)
    log(lc.GL, 'Video background has getDebugInfo:', videoBackground && typeof videoBackground.getDebugInfo === 'function')
  } catch (error) {
    log.error(lc.GL, 'Failed to initialize new video background manager, falling back to legacy system:', error)
    // Fallback to legacy system
    const { addVideoBackground } = await import('./scene/addVideoBackground.ts')
    videoBackground = await addVideoBackground(THREE, scene) as VideoBackgroundManager
    log(lc.GL, 'Fallback: Added legacy video background:', videoBackground)
  }

  // Set up post-processing effects
  let composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass, pixelationPass, pixelBleedPass, crtPass
  if (configScene.postProcessingEnabled) {
    ; ({ composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass, pixelationPass, pixelBleedPass, crtPass } =
      await createPostProcessing(
        THREE,
        scene,
        camera,
        renderer,
        width,
        height,
        configPostProcessing as PostProcessingConfig,
      ))
  } else {
    // Minimal composer-like object for compatibility
    composer = {
      render: () => renderer.render(scene, camera),
    }

    bokehPass = null
    bloomPass = null
    finalPass = null
    ditheringPass = null
    sharpeningPass = null
    pixelationPass = null
    pixelBleedPass = null
    crtPass = null
  }

  // Create the 2D UI overlay
  const uiLayer = createUILayer(THREE, width, height)

  // Set up responsive handling
  const responsiveCleanup = setupResponsiveHandling({
    camera,
    composer,
    uiLayer,
    videoBackground,
    rendererConfig: rendererConfig as RendererConfig,
  })

  // Add lens flares
  await addLensFlares(THREE, scene)

  // Load textures
  const { stencilTexture, outlineTexture } = await setupTextureLoading(
    THREE,
    stencilTexturePath,
    outlineTexturePath,
  )

  // Setup layer system
  const { logoController, logoPlanes, logoLayers, shapeLayer, shadowLayer, planeGeometry } = setupLayerSystem(
    THREE,
    scene,
    outlineTexture,
    stencilTexture,
  )

  // Initialize renderer state (needed for debug system)
  const state: RendererState = {
    scene,
    camera,
    renderer,
    composer,
    bokehPass,
    bloomPass,
    finalPass,
    ditheringPass,
    sharpeningPass,
    pixelationPass,
    pixelBleedPass,
    crtPass,
    logoController,
    logoPlanes,
    logoLayers,
    time: 0,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    THREE,
    uiOverlay: uiLayer,
    shapeLayer,
    shadowLayer,
    videoBackground,
  }

  // Setup debug system to get the regeneration handler
  const { updateDebugInfo, handleRegenerateRandomLayers } = await setupDebugSystem({
    canvas,
    camera,
    scene,
    bokehPass,
    logoController,
    state,
    THREE,
  })

  // Create the controls system only if debug mode is enabled
  const controlsSystem = isDebugModeEnabled()
    ? await createControlsSystem(camera, renderer.domElement, {
      keyboardConfig: controlsConfig.inputKeys,
      mouseCoefficient: animationConfig.userReactivity.mouseCoefficient,
      onToggleRotation: () => {
        log(lc.GL, 'Rotation toggled via keyboard')
      },
      onRegenerateLayers: handleRegenerateRandomLayers,
    })
    : null

  // Update state with the controls (null if debug mode disabled)
  state.controls = controlsSystem?.orbitControls || null

  // Override the render method to include our overlay
  const origRender = composer.render
  log(lc.GL, 'Setting up composer render override. Post-processing enabled:', configScene.postProcessingEnabled)
  composer.render = function () {
    updateDebugInfo()

    // Save original autoClear settings
    const originalAutoClear = renderer.autoClear
    const originalAutoClearColor = renderer.autoClearColor
    const originalAutoClearDepth = renderer.autoClearDepth
    const originalAutoClearStencil = renderer.autoClearStencil

    // Render main scene with original settings
    origRender.apply(this, arguments)

    // Defensive check and debug logging for overlay rendering
    if (!uiLayer || !uiLayer.scene || !uiLayer.camera) {
      log.warn(lc.GL, 'uiLayer, scene, or camera is undefined:', {
        uiLayer,
        scene: uiLayer?.scene,
        camera: uiLayer?.camera,
      })

      return
    }

    // Don't clear the color buffer when rendering UI overlay, but keep depth/stencil clearing
    renderer.autoClear = false
    renderer.autoClearColor = false
    renderer.autoClearDepth = false
    renderer.autoClearStencil = false

    try {
      renderer.render(uiLayer.scene, uiLayer.camera)
    } catch (e) {
      log.error(lc.GL, 'error rendering UI overlay:', e, { uiLayer, scene: uiLayer.scene, camera: uiLayer.camera })
    }

    // Restore original autoClear settings
    renderer.autoClear = originalAutoClear
    renderer.autoClearColor = originalAutoClearColor
    renderer.autoClearDepth = originalAutoClearDepth
    renderer.autoClearStencil = originalAutoClearStencil
  }

  // Define the registry of page orchestrators
  const orchestratorRegistry = {
    'home-page': () => createHomePageOrchestrator(logoController),
    'content-page': createContentPageOrchestrator,
  }

  // Create the scene orchestrator
  const sceneOrchestrator = createSceneOrchestrator(state, orchestratorRegistry)

  // Register the initial orchestrator (e.g., for the home page)
  sceneOrchestrator.registerOrchestrator('home-page')

  // Store the orchestrator on the glState
  glState = { ...state, sceneOrchestrator }

  // Expose GL state globally for debugging and E2E testing
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).glState = glState
  }

  // Signal that GL initialization is complete
  isGLInitialized.value = true

  // Create and return cleanup function
  const cleanup = createCleanupFunction({
    animationCleanup: sceneOrchestrator.dispose,
    responsiveCleanup,
    controlsSystem,
    videoBackground,
    logoController,
    scene,
    logoPlanes,
    shapeLayer,
    shadowLayer,
    uiLayer,
    controls: controlsSystem?.orbitControls || null,
    renderer,
    composer,
  })

  return cleanup
}

export const getSceneOrchestrator = () => {
  return glState?.sceneOrchestrator
}

export const getGLState = () => {
  return glState
}

/**
 * Calculate responsive scroll speed based on screen width
 * Ensures logo stays centered between header and content across different screen sizes
 */
const getResponsiveScrollSpeed = (width: number): number => {
  const breakpoints = [
    { width: 800, speed: -0.003 },
    { width: 1200, speed: -0.0020 },
    { width: 1440, speed: -0.0022 },
    { width: 1920, speed: -0.0023 },
    { width: 2560, speed: -0.0024 },
  ]

  // Find the appropriate speed range for interpolation
  let lowerBound = breakpoints[0]
  let upperBound = breakpoints[breakpoints.length - 1]

  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (width >= breakpoints[i].width && width <= breakpoints[i + 1].width) {
      lowerBound = breakpoints[i]
      upperBound = breakpoints[i + 1]
      break
    }
  }

  // Handle edge cases
  if (width <= breakpoints[0].width) {
    return breakpoints[0].speed
  }
  if (width >= breakpoints[breakpoints.length - 1].width) {
    return breakpoints[breakpoints.length - 1].speed
  }

  // Linear interpolation between breakpoints
  const widthRange = upperBound.width - lowerBound.width
  const speedRange = upperBound.speed - lowerBound.speed
  const widthFactor = (width - lowerBound.width) / widthRange

  return lowerBound.speed + (speedRange * widthFactor)
}

export const updateScrollCorruption = (scrollY: number, state: RendererState) => {
  if (!state) return

  // Get CRT scroll corruption configuration
  const crtConfig = configPostProcessing.crtScrollCorruption

  // If CRT scroll corruption is disabled, skip all effects
  if (!crtConfig?.enabled) {
    return
  }

  // Move camera down with responsive speed based on screen width
  if (state.camera) {
    const currentWidth = globalThis.innerWidth
    const scrollSpeed = getResponsiveScrollSpeed(currentWidth)
    const cameraYOffset = scrollY * scrollSpeed

    state.camera.position.y = cameraYOffset

    // Also move the lookAt target down by the same amount to maintain view direction
    const lookAtTarget = cameraYOffset // Look at point moves down with camera
    state.camera.lookAt(0, lookAtTarget, 0)

    // Update orbit controls target if they exist (debug mode only)
    if (state.controls && state.controls.target) {
      state.controls.target.set(0, lookAtTarget, 0)
    }

    state.camera.updateProjectionMatrix()
  }

  // Use the new utility for progress/intensity
  const { progress: scrollProgress, intensity: corruptionIntensity } = getScrollCorruptionProgress(scrollY, crtConfig ?? {})

  log.debug(lc.GL, '📊 updateScrollCorruption:', {
    scrollY,
    cameraY: state.camera.position.y,
    scrollSpeed: getResponsiveScrollSpeed(globalThis.innerWidth),
    screenWidth: globalThis.innerWidth,
    scrollProgress: scrollProgress.toFixed(3),
    corruptionIntensity: corruptionIntensity.toFixed(3),
    documentHeight: document.body.scrollHeight,
    windowHeight: globalThis.innerHeight,
    scrollPercentage: (scrollProgress * 100).toFixed(1) + '%',
  })

  // Update CRT corruption pass uniforms using proper shader function
  if (state.crtPass && state.crtPass.material) {
    const material = state.crtPass.material as ShaderMaterial

    // Build corruption parameters from config and scroll intensity
    const corruptionParams: CorruptionParams = {
      enabled: corruptionIntensity > 0.0,
      intensity: corruptionIntensity,
      timeEnabled: true,

      // RGB distortion
      rgbDistortionEnabled: crtConfig.rgbDistortion.enabled,
      rgbDistortionIntensity: crtConfig.rgbDistortion.enabled
        ? crtConfig.rgbDistortion.minIntensity +
        (corruptionIntensity * (crtConfig.rgbDistortion.maxIntensity - crtConfig.rgbDistortion.minIntensity))
        : 0,

      // Block corruption
      blockCorruptionEnabled: crtConfig.blockCorruption.enabled,
      blockCorruptionRate: crtConfig.blockCorruption.enabled
        ? crtConfig.blockCorruption.minRate +
        (corruptionIntensity * (crtConfig.blockCorruption.maxRate - crtConfig.blockCorruption.minRate))
        : 0,

      // White noise
      whiteNoiseEnabled: crtConfig.whiteNoise.enabled,
      whiteNoiseIntensity: crtConfig.whiteNoise.enabled
        ? crtConfig.whiteNoise.minIntensity +
        (corruptionIntensity * (crtConfig.whiteNoise.maxIntensity - crtConfig.whiteNoise.minIntensity))
        : 0,

      // Wave noise
      waveNoiseEnabled: crtConfig.waveNoise.enabled,
      waveNoiseIntensity: crtConfig.waveNoise.enabled
        ? crtConfig.waveNoise.minIntensity + (corruptionIntensity * (crtConfig.waveNoise.maxIntensity - crtConfig.waveNoise.minIntensity))
        : 0,

      // Static intensity
      staticIntensity: crtConfig.staticIntensity.enabled
        ? crtConfig.staticIntensity.minIntensity +
        (corruptionIntensity * (crtConfig.staticIntensity.maxIntensity - crtConfig.staticIntensity.minIntensity))
        : 0,

      // Large block corruption (only activate after threshold)
      largeBlockEnabled: crtConfig.largeBlockCorruption.enabled && corruptionIntensity > crtConfig.largeBlockCorruption.startThreshold,
      largeBlockIntensity: crtConfig.largeBlockCorruption.enabled && corruptionIntensity > crtConfig.largeBlockCorruption.startThreshold
        ? ((corruptionIntensity - crtConfig.largeBlockCorruption.startThreshold) / (1.0 - crtConfig.largeBlockCorruption.startThreshold)) *
        crtConfig.largeBlockCorruption.maxIntensity
        : 0,

      // Artifact noise (only activate after threshold)
      artifactNoiseEnabled: crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold,
      artifactNoiseIntensity: crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold
        ? ((corruptionIntensity - crtConfig.artifactNoise.startThreshold) / (1.0 - crtConfig.artifactNoise.startThreshold)) *
        crtConfig.artifactNoise.maxIntensity
        : 0,
      artifactBlockDensity: crtConfig.artifactNoise.enabled && corruptionIntensity > crtConfig.artifactNoise.startThreshold
        ? ((corruptionIntensity - crtConfig.artifactNoise.startThreshold) / (1.0 - crtConfig.artifactNoise.startThreshold)) *
        (crtConfig.artifactNoise.artifactBlockDensity ?? 0.7)
        : 0,
      artifactHeightJitter: crtConfig.artifactNoise.artifactHeightJitter,
      artifactHeightJitterMin: crtConfig.artifactNoise.artifactHeightJitterMin,
      artifactHeightJitterMax: crtConfig.artifactNoise.artifactHeightJitterMax,
      artifactNoiseFPS: crtConfig.artifactNoise.artifactNoiseFPS,

      // Screen shake - not used in scroll corruption
      shakeEnabled: false,
    }

    // Use the proper shader function to update all uniforms
    updateCRTShaderUniforms(material, corruptionParams)

    log.debug(lc.GL, '🎯 CRT Pass uniforms updated:', {
      corruptionIntensity: material.uniforms.corruptionIntensity.value,
      time: material.uniforms.time.value,
      rgbDistortionEnabled: material.uniforms.rgbDistortionEnabled.value,
      rgbDistortionIntensity: material.uniforms.rgbDistortionIntensity.value,
      blockCorruptionEnabled: material.uniforms.blockCorruptionEnabled.value,
      blockCorruptionRate: material.uniforms.blockCorruptionRate.value,
      whiteNoiseEnabled: material.uniforms.whiteNoiseEnabled.value,
      whiteNoiseIntensity: material.uniforms.whiteNoiseIntensity.value,
      resolution: material.uniforms.resolution?.value,
    })
  }

  // Update pixel bleed pass uniforms
  if (state.pixelBleedPass && state.pixelBleedPass.material) {
    const material = state.pixelBleedPass.material as ShaderMaterial

    if (material.uniforms) {
      // Update time if the pass is enabled (controlled by debug controls)
      if (state.pixelBleedPass.enabled) {
        material.uniforms.time.value = performance.now() / 1000
        log.debug(lc.GL, '🎯 Pixel Bleed Pass time updated:', material.uniforms.time.value)
      }
    }
  }

  // Keep existing effects for compatibility
  if (state.pixelationPass) {
    // Increase pixelation based on corruption level
    const basePixelSize = 16
    const maxPixelSize = 64
    const pixelSize = basePixelSize + (corruptionIntensity * (maxPixelSize - basePixelSize))
    if (state.pixelationPass.uniforms.pixelSize) state.pixelationPass.uniforms.pixelSize.value = pixelSize
  }

  if (state.finalPass?.uniforms) {
    // Increase chromatic aberration based on corruption
    const baseChroma = 0.002
    const maxChroma = 0.02
    const chromaStrength = baseChroma + (corruptionIntensity * (maxChroma - baseChroma))
    state.finalPass.uniforms.chromaStrength.value = chromaStrength
  }
}

export const updateScrollMetrics = (scrollVelocity: number) => {
  if (!glState) return

  // Update scroll-based metrics for the scene
  // This could affect various visual elements based on scroll position
  if (glState.ditheringPass?.uniforms) {
    // Modify dithering based on scroll velocity
    const baseIntensity = 0.8
    const velocityMultiplier = Math.min(Math.abs(scrollVelocity) * 0.1, 2.0)
    glState.ditheringPass.uniforms.intensity.value = baseIntensity + velocityMultiplier
  }
}

export { type InitOptions }
