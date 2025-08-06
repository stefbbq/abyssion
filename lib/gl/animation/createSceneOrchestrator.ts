import type { RendererState } from '../types.ts'
import type { AnimationContext, AnimationOrchestrator, SceneState } from './core/types.ts'
import { createSharedBehaviors } from './core/createSharedBehaviors.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import { lc, log } from '@lib/logger/index.ts'
import { registerOrchestrator } from './orchestrators/registerOrchestrator.ts'
import { unregisterOrchestrator } from './orchestrators/unregisterOrchestrator.ts'
import { switchToPage } from './orchestrators/switchToPage.ts'
import { stepOrchestrators } from './orchestrators/stepOrchestrators.ts'
import { createAnimationLoop } from './loop/createAnimationLoop.ts'
import { createVisibilityHandler } from './events/createVisibilityHandler.ts'
import { createFocusHandlers } from './events/createFocusHandlers.ts'
import { attachEventListeners } from './events/attachEventListeners.ts'
import { createFrameEffects } from './effects/createFrameEffects.ts'
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
  // Mutable reference to renderer state
  let currentState = state

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

  // Create animation loop
  const loop = createAnimationLoop(
    60, // TARGET_FPS
    animation.timeIncrement,
    {
      onFrame: (loopContext) => {
        // Skip frame if composer not ready
        if (!currentState.composer) return

        // Update state time
        currentState.time = loopContext.time

        // Create frame effects handler dynamically to use current state
        const applyFrameEffects = createFrameEffects(currentState, shared)

        // Apply all frame effects
        const context: AnimationContext = {
          state: currentState,
          shared,
          time: loopContext.time,
          deltaTime: loopContext.deltaTime,
        }
        applyFrameEffects(context)

        // Step orchestrators
        sceneState = stepOrchestrators(sceneState, context)

        // Render if composer is available
        currentState.composer.render()
      },
    },
  )

  // Pause/resume handlers with logging
  const pause = () => {
    log(lc.GL_ANIMATION, 'Pausing animation loop')
    loop.pause()
  }

  const resume = () => {
    log(lc.GL_ANIMATION, 'Resuming animation loop')
    loop.resume()
  }

  // Create event handlers
  const visibilityHandler = createVisibilityHandler(pause, resume)
  const { handleBlur, handleFocus } = createFocusHandlers(pause, resume)

  // Attach event listeners and get cleanup function
  const cleanupListeners = attachEventListeners(
    visibilityHandler,
    handleBlur,
    handleFocus,
  )

  // Start animation loop
  loop.start()

  /**
   * Return the orchestrator
   */
  return {
    registerOrchestrator: (name: string) => {
      sceneState = registerOrchestrator(sceneState, orchestratorRegistry, name)
    },
    unregisterOrchestrator: (name: string) => {
      const context: AnimationContext = { state: currentState, shared, time: loop.getTime(), deltaTime: 0 }
      sceneState = unregisterOrchestrator(sceneState, name, context)
    },
    switchToPage: (pageName: string) => {
      const context: AnimationContext = { state: currentState, shared, time: loop.getTime(), deltaTime: 0 }
      sceneState = switchToPage(sceneState, orchestratorRegistry, pageName, context)
    },
    setRenderState: (newState: RendererState) => {
      currentState = newState
    },
    getActiveOrchestrators: () => Array.from(sceneState.activeOrchestrators.keys()) as string[],
    dispose: () => {
      loop.dispose()
      shared.mouseTracking.cleanup()
      const context: AnimationContext = { state: currentState, shared, time: loop.getTime(), deltaTime: 0 }
      sceneState.activeOrchestrators.forEach((orchestrator) => orchestrator.dispose(context))
      sceneState.activeOrchestrators.clear()
      cleanupListeners()
    },
  }
}
