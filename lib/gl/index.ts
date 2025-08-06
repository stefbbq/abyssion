import * as THREE from 'three'

import type { InitOptions, RendererState } from './types.ts'
import { lc, log } from '../logger/index.ts'
import { isDebugModeEnabled } from '../debug/index.ts'
import { isGLInitialized } from './state.ts'
import {
  createCleanupFunction,
  setupCoreRendering,
  setupDebugSystem,
  setupLayerSystem,
  setupResponsiveHandling,
  setupTextureLoading,
} from './setup/index.ts'
import { createPostProcessing } from './scene/createPostProcessing.ts'
import { addVideoBackground } from './scene/addVideoBackground.ts'
import { createUILayer } from './layers/UILayer.ts'
import { addLensFlares } from './scene/addLensFlares.ts'
import { createControlsSystem } from './controls/index.ts'
import { createInitialGLState } from './setup/setupState.ts'
import { setupOrchestrators } from './setup/setupOrchestrators.ts'
import { updateScrollCorruption, updateScrollMetrics } from './updaters/index.ts'
import type { PostProcessingConfig } from './configPostProcessing.types.ts'
import type { VideoBackgroundManager } from './textures/VideoCycle/types.ts'

let glState: RendererState | null = null

/**
 * This is the entry point for the GL scene
 * It will initialize the GL context, create the scene, and return a cleanup function
 *
 * @param options - The initialization options
 * @returns A cleanup function
 */
export const initGL = async (options: InitOptions) => {
  const { canvas, stencilTexturePath, outlineTexturePath } = options
  const rendererConfig = (await import('./configScene.json')).default.rendererConfig
  const postProcessingConfig = (await import('./configPostProcessing.json')).default as PostProcessingConfig
  const controlsConfig = (await import('./configControls.json')).default
  const animationConfig = (await import('./configAnimation.json')).default

  /**
   * Debug the mobile responsiveness such as camera position, composer size, and UI layer size
   */
  if (isDebugModeEnabled()) {
    const { debugMobileResponsiveness } = await import('./scene/utils/debugMobileResponsiveness.ts')
    debugMobileResponsiveness()
  }

  /**
   * Create the initial GL state with default values
   */
  glState = createInitialGLState(THREE)

  /**
   * Callback function for when the video is ready
   * This will setup the scene and log a message
   */
  const onVideoReady = async () => {
    await setupScene()
    log(lc.GL, 'Video and scene setup complete')
  }

  /**
   * Setup the scene
   * This will create the scene, add the video background, and add the lens flares
   * It will also create the post processing, layer system, and debug system
   * It will also create the orchestrator
   */
  const setupScene = async () => {
    // if the glState is not initialized, return
    if (!glState?.scene || !glState?.camera || !glState?.renderer) return

    const { scene, camera, renderer } = glState
    const { innerWidth: width, innerHeight: height } = globalThis

    // if the post processing is enabled, create the post processing
    if (postProcessingConfig.enabled) {
      Object.assign(glState, await createPostProcessing(THREE, scene, camera, renderer, width, height, postProcessingConfig))
    }

    // create the UI layer
    glState.uiOverlay = createUILayer(THREE, width, height)

    // setup responsive handling
    glState.responsiveCleanup = setupResponsiveHandling({
      camera,
      composer: glState.composer,
      uiLayer: glState.uiOverlay,
      videoBackground: glState.videoBackground as VideoBackgroundManager,
      rendererConfig,
    })

    // add the lens flares
    await addLensFlares(THREE, scene)

    // load the textures
    const textures = await setupTextureLoading(THREE, stencilTexturePath, outlineTexturePath)
    Object.assign(glState, textures)

    // setup the layer system
    const layerSystem = setupLayerSystem(THREE, scene, textures.outlineTexture, textures.stencilTexture)
    Object.assign(glState, layerSystem)

    // setup the debug system
    if (glState?.logoController) {
      const debug = await setupDebugSystem({
        canvas,
        camera,
        scene,
        bokehPass: glState.bokehPass,
        logoController: glState.logoController,
        state: glState,
        THREE,
      })

      // setup the controls system
      if (isDebugModeEnabled()) {
        const controls = await createControlsSystem(camera, renderer.domElement, {
          keyboardConfig: controlsConfig.inputKeys,
          mouseCoefficient: animationConfig.userReactivity.mouseCoefficient,
          onToggleRotation: () => log(lc.GL, 'Rotation toggled'),
          onRegenerateLayers: debug.handleRegenerateRandomLayers,
        })
        if (glState) glState.controls = controls.orbitControls
      }

      // setup the composer
      const origRender = glState.composer?.render || (() => renderer.render(scene, camera))
      if (glState?.composer) {
        glState.composer.render = () => {
          debug.updateDebugInfo()
          const autoClear = {
            autoClear: renderer.autoClear,
            autoClearColor: renderer.autoClearColor,
            autoClearDepth: renderer.autoClearDepth,
            autoClearStencil: renderer.autoClearStencil,
          }

          origRender.apply(glState?.composer)
          if (glState?.uiOverlay?.scene && glState.uiOverlay?.camera) {
            renderer.autoClear = false
            renderer.autoClearColor = false
            renderer.autoClearDepth = false
            renderer.autoClearStencil = false
            renderer.render(glState.uiOverlay.scene, glState.uiOverlay.camera)
            Object.assign(renderer, autoClear)
          }
        }
      }
    }

    // update the orchestrator with the fully initialized state
    if (glState?.sceneOrchestrator) {
      glState.sceneOrchestrator.setRenderState(glState)
    }
  }

  // setup the core renderingn and assign the scene, camera, and renderer to glState
  const core = await setupCoreRendering(THREE, options)
  glState.scene = core.scene
  glState.camera = core.camera
  glState.renderer = core.renderer

  // add the video background
  try {
    glState.videoBackground = await addVideoBackground(THREE, core.scene, onVideoReady)
  } catch (error) {
    log.error(lc.GL, 'Failed to load video background:', error)
  }

  // setup the orchestrator
  glState.sceneOrchestrator = setupOrchestrators(glState)

  // set the GL initialized flag
  isGLInitialized.value = true

  if (glState.logoController && glState.uiOverlay && glState.videoBackground) {
    return createCleanupFunction({
      animationCleanup: glState.sceneOrchestrator.dispose,
      responsiveCleanup: glState.responsiveCleanup || (() => {}),
      controlsSystem: glState.controls ? { orbitControls: glState.controls, dispose: () => {} } : null,
      videoBackground: glState.videoBackground,
      logoController: glState.logoController,
      scene: glState.scene,
      logoPlanes: glState.logoPlanes,
      shapeLayer: glState.shapeLayer,
      shadowLayer: glState.shadowLayer,
      uiLayer: glState.uiOverlay,
      controls: glState.controls,
      renderer: glState.renderer,
      composer: glState.composer,
    })
  }

  log.error(lc.GL, 'GL cleanup function failed due to missing dependencies')
  return () => {}
}

export const getSceneOrchestrator = () => glState?.sceneOrchestrator
export const getGLState = () => glState

export { type InitOptions, updateScrollCorruption, updateScrollMetrics }
