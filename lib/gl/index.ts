import type { InitOptions, RendererState } from './types.ts'
import { lc, log } from '../logger/index.ts'
import type { ConfigScene, RendererConfig } from './configScene.types.ts'
import configScene from './configScene.json' with { type: 'json' }
import animationConfig from './configAnimation.json' with { type: 'json' }
import controlsConfig from './configControls.json' with { type: 'json' }
import { createPostProcessing } from './scene/createPostProcessing.ts'
import { addLensFlares } from './scene/addLensFlares.ts'
import { addVideoBackground } from './scene/addVideoBackground.ts'
import { createControlsSystem } from './controls/index.ts'
import { createUILayer } from './layers/UILayer.ts'
import { createContentPageOrchestrator, createLogoPageOrchestrator, createSceneOrchestrator } from './animation/index.ts'
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

let glState: (RendererState & { sceneOrchestrator?: ReturnType<typeof createSceneOrchestrator> }) | null = null

/**
 * Initialize the GL scene using composable setup functions
 */
export const initGL = async (options: InitOptions) => {
  const { rendererConfig, postProcessingConfig } = configScene as ConfigScene
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

  // Add video background
  const videoBackground = await addVideoBackground(THREE, scene) as VideoBackgroundManager
  log(lc.GL, 'Added video background')

  // Set up post-processing effects
  let composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass, pixelationPass
  if (configScene.postProcessingEnabled) {
    ;({ composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass, pixelationPass } = await createPostProcessing(
      THREE,
      scene,
      camera,
      renderer,
      width,
      height,
      postProcessingConfig,
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
    bloomPass,
    finalPass,
    ditheringPass,
    sharpeningPass,
    pixelationPass,
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
    'logo-page': () => createLogoPageOrchestrator(logoController),
    'content-page': createContentPageOrchestrator,
  }

  // Create the scene orchestrator
  const sceneOrchestrator = createSceneOrchestrator(state, orchestratorRegistry)

  // Register the initial orchestrator (e.g., for the home page)
  sceneOrchestrator.registerOrchestrator('logo-page')

  // Store the orchestrator on the glState
  glState = { ...state, sceneOrchestrator }

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

export { type InitOptions, type RendererState }
