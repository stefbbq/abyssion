import type { RendererState } from '../types.ts'
import type { AnimationContext, AnimationOrchestrator, SceneState } from './core/types.ts'
import { createSharedBehaviors } from './core/createSharedBehaviors.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import { lc, log } from '@lib/logger/index.ts'
import { registerOrchestrator } from './orchestrator/registerOrchestrator.ts'
import { unregisterOrchestrator } from './orchestrator/unregisterOrchestrator.ts'
import { switchToPage } from './orchestrator/switchToPage.ts'
import { stepOrchestrators } from './orchestrator/stepOrchestrators.ts'

const { animationConfig: animation } = animationConfig

type OrchestratorRegistry = Record<string, () => AnimationOrchestrator>

/**
 * Scene orchestrator runner: manages animation systems, shared behaviors, and transitions
 * All state transitions are pure; only side effects (DOM, listeners, RAF) are here
 */
export const createSceneOrchestrator = (state: RendererState, orchestratorRegistry: OrchestratorRegistry) => {
  let time = 0
  let lastTime = 0
  let animationId: number

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
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    time += animation.timeIncrement
    state.controls?.update()
    shared.applyMouseRotation(state.scene)
    if (state.videoBackground) shared.updateVideoBackground(state.videoBackground, animation.timeIncrement)
    const context: AnimationContext = { state, shared, time, deltaTime }
    sceneState = stepOrchestrators(sceneState, context)
    state.composer.render()
  }

  // Start animation loop
  animate(0)

  // Pause/resume logic
  let isPaused = false
  const pause = () => {
    if (!isPaused) {
      cancelAnimationFrame(animationId)
      isPaused = true
      log(lc.GL_ANIMATION, 'Paused animation loop (window not focused)')
    }
  }
  const resume = () => {
    if (isPaused) {
      isPaused = false
      lastTime = performance.now()
      animate(lastTime)
      log(lc.GL_ANIMATION, 'Resumed animation loop (window focused)')
    }
  }
  const handleVisibilityChange = () => {
    if (document.hidden) pause()
    else resume()
  }
  const handleWindowBlur = pause
  const handleWindowFocus = resume
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
  if (typeof window !== 'undefined') {
    globalThis.addEventListener('blur', handleWindowBlur)
    globalThis.addEventListener('focus', handleWindowFocus)
  }

  // Exposed API: all state transitions are pure
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
