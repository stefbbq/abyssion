/**
 * @module GL
 * @description
 * - Builds GL scene
 * - Creates a cleanup function to dispose of all GL resources
 * - Manages initialization readiness state for scene and video components
 */

import * as THREE from 'three'
import { signal } from '@preact/signals'

// types
import type { InitOptions, RendererState } from './types.ts'
import type { PostProcessingConfig } from './configPostProcessing.types.ts'
import type { VideoBackgroundManager } from './textures/VideoCycle/types.ts'

// utilities
import { lc, log } from '../logger/index.ts'
import { isDebugModeEnabled } from '../debug/index.ts'

// setup functions
import { setupCoreRendering } from './setup/setupCoreRendering.ts'
import { setupDebugSystem } from './setup/setupDebugSystem.ts'
import { setupLayerSystem } from './setup/setupLayerSystem.ts'
import { setupResponsiveHandling } from './setup/setupResponsiveHandling.ts'
import { setupTextureLoading } from './setup/setupTextureLoading.ts'
import { createInitialGLState } from './setup/setupState.ts'

// scene components
import { createPostProcessing } from './scene/createPostProcessing.ts'
import { addVideoBackground } from './scene/addVideoBackground.ts'
import { addLensFlares } from './scene/addLensFlares.ts'

// layers and controls
import { createUILayer } from './layers/UILayer.ts'
import { createControlsSystem } from './controls/index.ts'

// animation and orchestration
import { createSceneOrchestrator } from './animation/index.ts'
import { createHomePageOrchestrator } from './animation/orchestrators/homePage/createHomePageOrchestrator.ts'

// updaters
import { updateScrollCorruption, updateScrollMetrics } from './updaters/index.ts'

/**
 * A signal that indicates whether the GL context has been initialized.
 */
export const isGLInitialized = signal(false)

let glState: RendererState | null = null

/**
 * Creates a cleanup function to dispose of all GL resources
 * @returns A cleanup function
 */
const createCleanupFunction = () => {
  return () => {
    if (!glState) return
    log(lc.GL, 'Cleanup function called')

    // dispose orchestrator and controls
    glState.sceneOrchestrator?.dispose()
    glState.responsiveCleanup?.()
    glState.videoBackground?.dispose()
    glState.controls?.dispose()

    // dispose logo system
    if (glState.logoController && glState.scene && glState.logoPlanes) {
      glState.logoController.dispose(glState.scene, glState.logoPlanes)
    }

    // remove scene objects
    if (glState.scene) {
      glState.shapeLayer && glState.scene.remove(glState.shapeLayer)
      glState.shadowLayer?.mesh && glState.scene.remove(glState.shadowLayer.mesh)
      glState.uiOverlay?.scene && glState.scene.remove(glState.uiOverlay.scene)
    }

    // dispose rendering pipeline
    glState.composer?.dispose()
    glState.renderer?.dispose()

    // clear state
    glState = null
  }
}

/**
 * Manages initialization readiness state for scene and video components
 * @returns A readiness manager object
 */
const createReadinessManager = () => {
  let sceneReady = false
  let videoReady = false

  const checkAndStart = () => {
    if (!sceneReady || !videoReady) return false

    if (!glState?.sceneOrchestrator || !glState?.logoController) {
      log.error(lc.GL, 'Cannot start - orchestrator or logoController not ready')
      return false
    }

    log(lc.GL, 'Both scene and video ready, starting animation loop and home orchestrator')
    glState.sceneOrchestrator.start()
    const homeOrchestrator = createHomePageOrchestrator(glState)
    glState.sceneOrchestrator.switchToOrchestrator(homeOrchestrator)
    return true
  }

  return {
    setSceneReady: () => {
      sceneReady = true
      log(lc.GL, 'Scene ready, checking if video is also ready...')
      checkAndStart()
    },
    setVideoReady: () => {
      videoReady = true
      log(lc.GL, 'Video ready, checking if scene is also ready...')
      checkAndStart()
    },
  }
}

/**
 * This is the entry point for the GL scene
 * It will initialize the GL context, create the scene, and return a cleanup function
 *
 * @param options - The initialization options
 * @returns A cleanup function
 */
export const initGL = async (options: InitOptions) => {
  const readiness = createReadinessManager()

  /**
   * Setup post-processing effects
   */
  const setupPostProcessingEffects = async () => {
    if (!glState) return

    const { scene, camera, renderer } = glState
    const { innerWidth: width, innerHeight: height } = globalThis

    if (postProcessingConfig.enabled) {
      log(lc.GL, 'Creating post-processing...')
      const postProcessing = await createPostProcessing(THREE, scene, camera, renderer, width, height, postProcessingConfig)
      Object.assign(glState, postProcessing)
      log(lc.GL, 'Post-processing created, composer available:', !!glState.composer)
    } else {
      log.warn(lc.GL, 'Post-processing disabled in config')
    }
  }

  /**
   * Setup UI and responsive systems
   */
  const setupUIAndResponsive = () => {
    if (!glState) return

    const { camera } = glState
    const { innerWidth: width, innerHeight: height } = globalThis

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
  }

  /**
   * Setup debug mode features
   */
  const setupDebugMode = async () => {
    if (!isDebugModeEnabled() || !glState?.logoController) return

    const { scene, camera, renderer } = glState
    const { debugMobileResponsiveness } = await import('./scene/utils/debugMobileResponsiveness.ts')
    debugMobileResponsiveness()

    // setup the debug system
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
    const controls = await createControlsSystem(camera, renderer.domElement, {
      keyboardConfig: controlsConfig.inputKeys,
      mouseCoefficient: animationConfig.userReactivity.mouseCoefficient,
      onToggleRotation: () => log(lc.GL, 'Rotation toggled'),
      onRegenerateLayers: debug.handleRegenerateRandomLayers,
    })
    glState.controls = controls.orbitControls

    // override composer render for debug UI
    const origRender = glState.composer?.render || (() => renderer.render(scene, camera))
    if (glState.composer) {
      const currentState = glState // capture reference
      const composer = glState.composer

      composer.render = () => {
        debug.updateDebugInfo()
        const autoClear = {
          autoClear: renderer.autoClear,
          autoClearColor: renderer.autoClearColor,
          autoClearDepth: renderer.autoClearDepth,
          autoClearStencil: renderer.autoClearStencil,
        }

        origRender.apply(composer)
        if (currentState.uiOverlay?.scene && currentState.uiOverlay?.camera) {
          renderer.autoClear = false
          renderer.autoClearColor = false
          renderer.autoClearDepth = false
          renderer.autoClearStencil = false
          renderer.render(currentState.uiOverlay.scene, currentState.uiOverlay.camera)
          Object.assign(renderer, autoClear)
        }
      }
    }
  }

  /**
   * Setup the scene
   * This orchestrates all scene setup operations
   */
  const setupScene = async () => {
    if (!glState?.scene || !glState?.camera || !glState?.renderer) {
      log.error(lc.GL, 'Scene, camera, or renderer not available when setting up scene')
      return
    }

    const { scene } = glState

    // setup post-processing
    await setupPostProcessingEffects()

    // setup UI and responsive handling
    setupUIAndResponsive()

    // add visual effects
    await addLensFlares(THREE, scene)

    // load textures
    const textures = await setupTextureLoading(THREE, stencilTexturePath, outlineTexturePath)
    Object.assign(glState, textures)

    // setup layer system
    log(lc.GL, 'Setting up layer system...')
    const layerSystem = setupLayerSystem(THREE, scene, textures.outlineTexture, textures.stencilTexture)
    Object.assign(glState, layerSystem)
    log(lc.GL, 'Layer system setup complete, logoController available:', !!glState.logoController)

    // setup debug mode if enabled
    await setupDebugMode()

    // update the orchestrator with the fully initialized state
    glState.sceneOrchestrator?.setRenderState(glState)

    // mark scene as ready
    readiness.setSceneReady()
  }

  // main initialization logic
  const { canvas, stencilTexturePath, outlineTexturePath } = options

  // load configuration files
  const [rendererConfig, postProcessingConfig, controlsConfig, animationConfig] = await Promise.all([
    import('./configScene.json').then((m) => m.default.rendererConfig),
    import('./configPostProcessing.json').then((m) => m.default as PostProcessingConfig),
    import('./configControls.json').then((m) => m.default),
    import('./configAnimation.json').then((m) => m.default),
  ])

  // initialize core rendering
  const core = await setupCoreRendering(THREE, options)

  // create and populate initial GL state
  glState = createInitialGLState(THREE)
  Object.assign(glState, {
    scene: core.scene,
    camera: core.camera,
    renderer: core.renderer,
    sceneOrchestrator: createSceneOrchestrator(glState),
  })

  // start parallel initialization
  const initPromises = [
    setupScene(),
    addVideoBackground(THREE, core.scene, readiness.setVideoReady)
      .then((videoBackground) => {
        glState!.videoBackground = videoBackground
        log(lc.GL, 'Video background added, waiting for video ready callback...')
      })
      .catch((error) => {
        log.error(lc.GL, 'Failed to load video background:', error)
        readiness.setVideoReady() // continue without video
      }),
  ]

  await Promise.all(initPromises)

  // mark as initialized
  isGLInitialized.value = true

  // return cleanup function
  return createCleanupFunction()
}

export const getSceneOrchestrator = () => glState?.sceneOrchestrator
export const getGLState = () => glState

export { type InitOptions, updateScrollCorruption, updateScrollMetrics }
