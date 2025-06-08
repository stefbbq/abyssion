import type { InitOptions, RendererState } from './types.ts'
import { lc, log } from '../logger/index.ts'
import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }
import animationConfig from '@lib/configAnimation.json' with { type: 'json' }
import controlsConfig from '../configControls.json' with { type: 'json' }
import { createPostProcessing } from './scene/createPostProcessing.ts'
import { addLensFlares } from './scene/addLensFlares.ts'
import { addVideoBackground } from './scene/addVideoBackground.ts'
import { createControlsSystem } from './controls/index.ts'
import { createUILayer } from './layers/UILayer.ts'
import { startAnimationLoop } from './animation/index.ts'
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

/**
 * Initialize the GL scene using composable setup functions
 */
export const initGL = async (options: InitOptions) => {
  const { rendererConfig, postProcessingConfig } = sceneConfig
  const { width, height, outlineTexturePath, stencilTexturePath, container } = options
  const THREE = await import('three')

  // Debug mobile responsiveness
  debugMobileResponsiveness()

  // Set up core rendering components
  const { scene, camera, renderer } = await setupCoreRendering(THREE, options)

  // Add video background
  const videoBackground = await addVideoBackground(THREE, scene) as any

  // Set up post-processing effects
  const { composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass } = await createPostProcessing(
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
    rendererConfig,
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
  const { logoLayer, planes, layers, shapeLayer, shadowLayer, planeGeometry } = await setupLayerSystem(
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
    controls: null as any, // Will be set after controls creation
    bloomPass,
    finalPass,
    ditheringPass,
    sharpeningPass,
    planes,
    layers,
    time: 0,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    THREE,
    uiOverlay: uiLayer,
    shapeLayer,
    videoBackground,
  }

  // Setup debug system to get the regeneration handler
  const { updateDebugInfo, handleRegenerateRandomLayers } = await setupDebugSystem({
    container,
    camera,
    scene,
    bokehPass,
    logoLayer,
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

  // Start animation loop
  const animationCleanup = startAnimationLoop(state)

  // Create and return cleanup function
  return createCleanupFunction({
    animationCleanup,
    responsiveCleanup,
    controlsSystem,
    videoBackground,
    logoLayer,
    scene,
    planes,
    shapeLayer,
    shadowLayer,
    uiLayer,
    controls: controlsSystem?.orbitControls || null,
    renderer,
    composer,
  })
}

export { type InitOptions, type RendererState }
