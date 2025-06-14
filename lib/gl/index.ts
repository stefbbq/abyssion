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

let glState: (RendererState & { sceneOrchestrator?: ReturnType<typeof createSceneOrchestrator> }) | null = null

/**
 * Initialize the GL scene using composable setup functions
 */
export const initGL = async (options: InitOptions) => {
  const { rendererConfig, postProcessingConfig } = configScene as ConfigScene
  const { width, height, outlineTexturePath, stencilTexturePath, container } = options
  const THREE = await import('three')

  // Debug mobile responsiveness
  debugMobileResponsiveness()

  // Set up core rendering components
  const { scene, camera, renderer } = await setupCoreRendering(THREE, options)

  // Add video background
  const videoBackground = await addVideoBackground(THREE, scene) as VideoBackgroundManager

  // Set up post-processing effects
  const { composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass, pixelationPass } = await createPostProcessing(
    THREE,
    scene,
    camera,
    renderer,
    width,
    height,
    postProcessingConfig,
  )

  // Create the 2D UI overlay
  const uiLayer = createUILayer(THREE, width, height)

  // Set up responsive handling
  const responsiveCleanup = setupResponsiveHandling({
    container,
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
    container,
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
  composer.render = function () {
    // Update debug info each frame
    updateDebugInfo()
    // First render the 3D scene with post-processing
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
    renderer.autoClear = false // Don't clear what we've rendered
    try {
      renderer.render(uiLayer.scene, uiLayer.camera)
    } catch (e) {
      log.error(lc.GL, 'Error rendering UI overlay:', e, { uiLayer, scene: uiLayer.scene, camera: uiLayer.camera })
    }
    renderer.autoClear = true // Restore default
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
