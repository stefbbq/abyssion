/**
 * @module GL
 * @description
 * - Builds GL scene
 * - Creates a cleanup function to dispose of all GL resources
 * - Manages initialization readiness state for scene and video components
 */

import * as THREE from 'three'
import { effect } from '@preact/signals'

// types
import type { InitOptions } from './types.ts'
import type { PostProcessingConfig } from './configPostProcessing.types.ts'
import type { VideoBackgroundManager } from './textures/VideoCycle/types.ts'

// utilities
import { lc, log } from '../logger/index.ts'
import { isDebugModeEnabled } from '../debug/index.ts'
import { isMobileDevice } from '@lib/utils/isMobileDevice.ts'

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

// layers and controls
import { createUILayer } from './layers/UILayer.ts'
import { createControlsSystem } from './controls/index.ts'

// animation and orchestration
import { createSceneOrchestrator } from './animation/index.ts'
import { createHomePageOrchestrator } from './animation/orchestrators/homePage/createHomePageOrchestrator.ts'
import { createContentPageOrchestrator } from './animation/orchestrators/contentPage/createContentPageOrchestrator.ts'
import type { AnimationOrchestrator } from './animation/core/types.ts'

// updaters
import { updateScrollCorruption, updateScrollMetrics } from './updaters/index.ts'
import { scrollState, updateScrollState } from './animation/state/scrollState.ts'
import { getScrollCorruptionProgress } from './scene/utils/getScrollCorruptionProgress.ts'
import { setBackgroundIntensity } from '@lib/ui/state.ts'
import {
  currentPath,
  getCurrentPostProcessingConfig,
  getGLState,
  getSceneOrchestrator as _getSceneOrchestrator,
  isGLInitialized,
  scrollY,
  setCurrentPostProcessingConfig,
  setGLState,
  viewportSize,
} from './state.ts'

// cached orchestrator instances to avoid re-creating on every switch
let homeOrchestratorInstance: AnimationOrchestrator | null = null
let contentOrchestratorInstance: AnimationOrchestrator | null = null

const getOrchestrator = (name: 'home-page' | 'content-page'): AnimationOrchestrator | null => {
  const state = getGLState()
  if (!state) return null
  if (name === 'home-page') {
    if (!homeOrchestratorInstance) homeOrchestratorInstance = createHomePageOrchestrator(state)
    return homeOrchestratorInstance
  }
  if (!contentOrchestratorInstance) contentOrchestratorInstance = createContentPageOrchestrator(state)
  return contentOrchestratorInstance
}

export const switchOrchestratorForPath = (path: string) => {
  const state = getGLState()
  if (!state?.sceneOrchestrator) return
  const target = path === '/' ? getOrchestrator('home-page') : getOrchestrator('content-page')
  if (target) state.sceneOrchestrator.switchToOrchestrator(target)
}

/**
 * Receive scroll telemetry from the app shell and fan it into GL subsystems.
 * - updates shared scroll state
 * - updates camera/effects
 * - updates background intensity signal
 */
// react to scroll signal
effect(() => {
  const y = scrollY.value
  updateScrollState(y)
  const state = getGLState()
  if (state) {
    try {
      updateScrollCorruption(y, state)
      updateScrollMetrics(0, state)
    } catch {
      // ignore update timing errors
    }
  }
  try {
    const cfg = getCurrentPostProcessingConfig()
    const crtCfg = cfg?.crtScrollCorruption
    if (crtCfg && crtCfg.enabled) {
      const { intensity } = getScrollCorruptionProgress(y, crtCfg)
      setBackgroundIntensity(intensity)
    } else setBackgroundIntensity(0)
  } catch {
    // ignore if config unavailable
  }
})

// react to viewport size signal
effect(() => {
  const _size = viewportSize.value
  const state = getGLState()
  if (!state) return
  try {
    updateScrollMetrics(scrollState.velocity, state)
  } catch {
    // ignore resize timing errors
  }
})

// react to route path signal
effect(() => {
  const path = currentPath.value
  try {
    switchOrchestratorForPath(path)
  } catch {
    // ignore switch errors
  }
  const y = typeof globalThis !== 'undefined' ? (globalThis.scrollY || 0) : 0
  updateScrollState(y)
  const state = getGLState()
  if (state) {
    try {
      updateScrollCorruption(y, state)
    } catch {
      // ignore update timing errors
    }
  }
})

/**
 * Creates a cleanup function to dispose of all GL resources
 * @returns A cleanup function
 */
const createCleanupFunction = () => {
  return () => {
    const state = getGLState()
    if (!state) return
    log(lc.GL, 'Cleanup function called')

    // dispose orchestrator and controls
    state.sceneOrchestrator?.dispose()
    state.responsiveCleanup?.()
    state.videoBackground?.dispose()
    state.controls?.dispose()

    // dispose logo system
    if (state.logoController && state.scene && state.logoPlanes) {
      state.logoController.dispose(state.scene, state.logoPlanes)
    }

    // remove scene objects
    if (state.scene) {
      state.shapeLayer && state.scene.remove(state.shapeLayer)
      state.shadowLayer?.mesh && state.scene.remove(state.shadowLayer.mesh)
      state.uiOverlay?.scene && state.scene.remove(state.uiOverlay.scene)
    }

    // dispose rendering pipeline
    state.composer?.dispose()
    state.renderer?.dispose()

    // clear state
    setGLState(null)
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

    const state = getGLState()
    if (!state?.sceneOrchestrator || !state?.logoController) {
      log.error(lc.GL, 'Cannot start - orchestrator or logoController not ready')
      return false
    }

    log(lc.GL, 'Both scene and video ready, starting animation loop and selecting initial orchestrator')
    state.sceneOrchestrator.start()
    // choose initial orchestrator based on current route (cached instances)
    const path = typeof globalThis !== 'undefined' ? (globalThis.location?.pathname || '/') : '/'
    const initial = path === '/' ? getOrchestrator('home-page') : getOrchestrator('content-page')
    if (initial) state.sceneOrchestrator.switchToOrchestrator(initial)
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
    const state = getGLState()
    if (!state) return

    const { scene, camera, renderer } = state
    const { innerWidth: width, innerHeight: height } = globalThis

    if (postProcessingConfigEffective.enabled) {
      log(lc.GL, 'Creating post-processing...')
      const postProcessing = await createPostProcessing(THREE, scene, camera, renderer, width, height, postProcessingConfigEffective)
      Object.assign(state, postProcessing)
      log(lc.GL, 'Post-processing created, composer available:', !!state.composer)
    } else {
      log.warn(lc.GL, 'Post-processing disabled in config')
    }
  }

  /**
   * Setup UI and responsive systems
   */
  const setupUIAndResponsive = () => {
    const state = getGLState()
    if (!state) return

    const { camera } = state
    const { innerWidth: width, innerHeight: height } = globalThis

    // create the UI layer
    state.uiOverlay = createUILayer(THREE, width, height)

    // setup responsive handling
    state.responsiveCleanup = setupResponsiveHandling({
      camera,
      composer: state.composer,
      uiLayer: state.uiOverlay,
      videoBackground: state.videoBackground as VideoBackgroundManager,
      rendererConfig,
    })
  }

  /**
   * Setup debug mode features
   */
  const setupDebugMode = async () => {
    const state = getGLState()
    if (!isDebugModeEnabled() || !state?.logoController) return

    const { scene, camera, renderer } = state
    const { debugMobileResponsiveness } = await import('./scene/utils/debugMobileResponsiveness.ts')
    debugMobileResponsiveness()

    // setup the debug system
    const debug = await setupDebugSystem({
      canvas,
      camera,
      scene,
      bokehPass: state.bokehPass,
      logoController: state.logoController,
      state,
      THREE,
    })

    // setup the controls system
    const controls = await createControlsSystem(camera, renderer.domElement, {
      keyboardConfig: controlsConfig.inputKeys,
      mouseCoefficient: animationConfig.userReactivity.mouseCoefficient,
      onToggleRotation: () => log(lc.GL, 'Rotation toggled'),
      onRegenerateLayers: debug.handleRegenerateRandomLayers,
    })
    state.controls = controls.orbitControls

    // override composer render for debug UI
    const origRender = state.composer?.render || (() => renderer.render(scene, camera))
    if (state.composer) {
      const currentState = state // capture reference
      const composer = state.composer

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
    const state = getGLState()
    if (!state?.scene || !state?.camera || !state?.renderer) {
      log.error(lc.GL, 'Scene, camera, or renderer not available when setting up scene')
      return
    }

    const { scene } = state

    // setup post-processing
    await setupPostProcessingEffects()

    // setup UI and responsive handling
    setupUIAndResponsive()

    // load textures
    const textures = await setupTextureLoading(THREE, stencilTexturePath, effectiveOutlineTexturePath)
    Object.assign(state, textures)

    // setup layer system
    log(lc.GL, 'Setting up layer system...')
    const layerSystem = await setupLayerSystem(THREE, scene, textures.outlineTexture, textures.stencilTexture)
    Object.assign(state, layerSystem)
    log(lc.GL, 'Layer system setup complete, logoController available:', !!state.logoController)

    // setup debug mode if enabled
    await setupDebugMode()

    // update the orchestrator with the fully initialized state
    state.sceneOrchestrator?.setRenderState(state)

    // mark scene as ready
    readiness.setSceneReady()
  }

  /**
   * Setup video background
   * This plays a single video or cycles through a sequence of videos on loop
   */
  const setupVideo = async () => {
    // on mobile, skip video background and mark as ready so the scene starts
    if (isMobileDevice()) {
      readiness.setVideoReady()
      return
    }

    try {
      const videoBackground = await addVideoBackground(THREE, core.scene, readiness.setVideoReady)
      const state = getGLState()
      if (state) state.videoBackground = videoBackground
      log(lc.GL, 'Video background added, waiting for video ready callback...')
    } catch (error) {
      log.error(lc.GL, 'Failed to load video background:', error)
      readiness.setVideoReady() // continue without video
    }
  }

  // main initialization logic
  const { canvas, stencilTexturePath, outlineTexturePath } = options
  const effectiveOutlineTexturePath = isMobileDevice() ? '/media/images/abyssion_logo_outline_mobile-transparent.webp' : outlineTexturePath

  // load configuration files
  const [rendererConfig, basePostProcessingConfig, controlsConfig, animationConfig] = await Promise.all([
    import('./configScene.json').then((m) => m.default.rendererConfig),
    import('./configPostProcessing.json').then((m) => m.default as PostProcessingConfig),
    import('./configControls.json').then((m) => m.default),
    import('./configAnimation.json').then((m) => m.default),
  ])

  // create lighter post-processing on mobile/iOS to improve perf
  const postProcessingConfigEffective: PostProcessingConfig = (() => {
    const config = JSON.parse(JSON.stringify(basePostProcessingConfig)) as PostProcessingConfig

    // on mobile, disable post-processing entirely to preserve canvas transparency
    if (!isMobileDevice()) return config

    config.enabled = false
    if (config.film) config.film.scanlineCount = Math.min(config.film.scanlineCount ?? 2048, 800)
    if (config.bloom) {
      config.bloom.bloomStrength = Math.min(config.bloom.bloomStrength ?? 0.2, 0.15)
      config.bloom.bloomStrengthMultiplier = Math.min(config.bloom.bloomStrengthMultiplier ?? 1, 2)
    }
    if (config.sharpening) config.sharpening.enabled = false
    if (config.pixelate) config.pixelate.enabled = false
    if (config.crtScrollCorruption) {
      config.crtScrollCorruption.enabled = false
      if (config.crtScrollCorruption.debugOverlay) config.crtScrollCorruption.debugOverlay.enabled = false
    }

    return config
  })()

  // initialize core rendering
  const core = await setupCoreRendering(THREE, options)

  // create and populate initial GL state
  const initialState = createInitialGLState(THREE)
  Object.assign(initialState, {
    scene: core.scene,
    camera: core.camera,
    renderer: core.renderer,
  })

  // scene orchestrator depends on state reference
  initialState.sceneOrchestrator = createSceneOrchestrator(initialState)
  setGLState(initialState)

  // expose effective PP config to telemetry helpers
  setCurrentPostProcessingConfig(postProcessingConfigEffective)

  // setup scene and video
  await Promise.all([setupScene(), setupVideo()])

  // mark as initialized
  isGLInitialized.value = true

  // ensure initial camera position reflects current scroll on first load
  try {
    const currentScrollY = typeof globalThis !== 'undefined' ? globalThis.scrollY : 0
    const state = getGLState()
    if (state) updateScrollCorruption(currentScrollY, state)
  } catch (error) {
    log.warn(lc.GL, 'Failed to apply initial scroll-based camera update:', error)
  }

  // return cleanup function
  return createCleanupFunction()
}

export { type InitOptions, updateScrollCorruption, updateScrollMetrics }
export { getGLState, getSceneOrchestrator, isGLInitialized } from './state.ts'
