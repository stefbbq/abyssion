import type { RendererState } from '../types.ts'
import type { AnimationContext, AnimationOrchestrator, SceneState } from './core/types.ts'
import { createSharedBehaviors } from './core/createSharedBehaviors.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import { lc, log } from '@lib/logger/index.ts'
import { registerOrchestrator } from './orchestrators/registerOrchestrator.ts'
import { unregisterOrchestrator } from './orchestrators/unregisterOrchestrator.ts'
import { switchToPage } from './orchestrators/switchToPage.ts'
import { stepOrchestrators } from './orchestrators/stepOrchestrators.ts'
import { isMobileDevice } from '../scene/utils/isMobileDevice.ts'
import { debugPanelsAPI } from '@islands/DebugPanels.tsx'
import type { SceneOrchestrator } from './types.ts'

const { animationConfig: animation } = animationConfig

type OrchestratorRegistry = Record<string, () => AnimationOrchestrator>

/**
 * Scene orchestrator runner: manages animation systems, shared behaviors, and transitions
 * All state transitions are pure; only side effects (DOM, listeners, RAF) are here
 */
export const createSceneOrchestrator = (
  state: RendererState,
  orchestratorRegistry: OrchestratorRegistry,
): SceneOrchestrator => {
  let time = 0
  let lastTime = 0
  let lastRenderTime = 0
  let animationId: number
  let isPaused = false

  // 24 FPS = 1000ms / 24 = ~41.67ms between frames
  const TARGET_FPS = 60
  const FRAME_INTERVAL = 1000 / TARGET_FPS

  // Create shared behaviors that persist across page changes
  const shared = createSharedBehaviors()

  // Scene state (immutable, but held in closure for runner)
  let sceneState: SceneState = {
    activeOrchestrators: new Map(),
    transition: {
      isTransitioning: false,
      progress: 0,
      fromPage: null,
      toPage: null,
    },
  }

  /**
   * Main animation loop (side effect)
   */
  const animate = (timestamp: number) => {
    // Align focus plane if present
    // deno-lint-ignore no-explicit-any
    if (typeof window !== 'undefined' && typeof (window as any).alignFocusPlane === 'function') {
      // deno-lint-ignore no-explicit-any
      ;(window as any).alignFocusPlane()
    }

    animationId = requestAnimationFrame(animate)

    // FPS limiting - only render if enough time has passed
    const timeSinceLastRender = timestamp - lastRenderTime
    if (timeSinceLastRender < FRAME_INTERVAL) {
      return // Skip this frame
    }

    lastRenderTime = timestamp
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    time += animation.timeIncrement
    state.controls?.update()
    if (!isMobileDevice()) shared.applyMouseRotation(state.scene)

    // dynamically set bokeh focus to always focus on logo at z=0
    if (state.bokehPass && state.camera) {
      // logo is at (0,0,0) in world space
      const logoWorldPosition = new state.THREE.Vector3(0, 0, 0)
      const cameraPosition = state.camera.position
      const focusDistance = cameraPosition.distanceTo(logoWorldPosition)
      if (state.bokehPass.materialBokeh && state.bokehPass.materialBokeh.uniforms.focus) {
        state.bokehPass.materialBokeh.uniforms.focus.value = focusDistance
        // update debug panels with live focus distance
        debugPanelsAPI.updateDOFParams({
          focus: state.bokehPass.materialBokeh.uniforms.focus.value,
          aperture: state.bokehPass.materialBokeh.uniforms.aperture.value,
          maxblur: state.bokehPass.materialBokeh.uniforms.maxblur.value,
          liveFocusDistance: focusDistance,
        })
      }
    }

    if (state.videoBackground) shared.updateVideoBackground(state.videoBackground, deltaTime)
    const context: AnimationContext = { state, shared, time, deltaTime }
    sceneState = stepOrchestrators(sceneState, context)
    state.composer.render()
  }

  // Start animation loop
  animate(0)

  // Pause/resume logic
  const pause = () => {
    log(lc.GL_ANIMATION, 'pause() called, isPaused:', isPaused)

    if (!isPaused) {
      cancelAnimationFrame(animationId)
      isPaused = true
      log(lc.GL_ANIMATION, 'Paused animation loop (window not focused)')
    }
  }

  const resume = () => {
    log(lc.GL_ANIMATION, 'resume() called, isPaused:', isPaused)
    console
    if (isPaused) {
      isPaused = false
      lastTime = performance.now()
      animate(lastTime)
      log(lc.GL_ANIMATION, 'Resumed animation loop (window focused)')
    }
  }

  const handleVisibilityChange = () => {
    log(lc.GL_ANIMATION, 'handleVisibilityChange() called, document.hidden:', document.hidden)
    if (document.hidden) pause()
    else resume()
  }

  const handleWindowBlur = () => {
    log(lc.GL_ANIMATION, 'handleWindowBlur() called')
    pause()
  }

  const handleWindowFocus = () => {
    log(lc.GL_ANIMATION, 'handleWindowFocus() called')
    resume()
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  if (typeof window !== 'undefined') {
    globalThis.addEventListener('blur', handleWindowBlur)
    globalThis.addEventListener('focus', handleWindowFocus)
  }

  return {
    registerOrchestrator: (name: string) => {
      sceneState = registerOrchestrator(sceneState, orchestratorRegistry, name)
    },
    unregisterOrchestrator: (name: string) => {
      const context: AnimationContext = { state, shared, time, deltaTime: 0 }
      sceneState = unregisterOrchestrator(sceneState, name, context)
    },
    switchToPage: (pageName: string) => {
      const context: AnimationContext = { state, shared, time, deltaTime: 0 }
      sceneState = switchToPage(sceneState, orchestratorRegistry, pageName, context)
    },
    getActiveOrchestrators: () => Array.from(sceneState.activeOrchestrators.keys()),
    dispose: () => {
      cancelAnimationFrame(animationId)
      shared.mouseTracking.cleanup()
      const context: AnimationContext = { state, shared, time, deltaTime: 0 }
      sceneState.activeOrchestrators.forEach((orchestrator) => orchestrator.dispose(context))
      sceneState.activeOrchestrators.clear()

      // remove event listeners
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
      if (typeof window !== 'undefined') {
        globalThis.removeEventListener('blur', handleWindowBlur)
        globalThis.removeEventListener('focus', handleWindowFocus)
      }
    },
  }
}
