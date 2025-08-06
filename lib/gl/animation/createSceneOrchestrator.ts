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

  // Deferred page switch to avoid modifying state during iteration
  let pendingPageSwitch: string | null = null

  // Create animation loop
  const loop = createAnimationLoop(
    60, // TARGET_FPS
    animation.timeIncrement,
    {
      onFrame: (loopContext) => {
        // Skip frame if composer not ready
        if (!currentState.composer) {
          log.warn(lc.GL_ANIMATION, 'Skipping frame - composer not ready')
          return
        }

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

        // Handle deferred page switch after orchestrator updates
        if (pendingPageSwitch) {
          log(lc.GL_ANIMATION, `Executing deferred page switch to: ${pendingPageSwitch}`)
          sceneState = switchToPage(sceneState, orchestratorRegistry, pendingPageSwitch, context)
          pendingPageSwitch = null
        }

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

  // Track if animation has started
  let hasStarted = false

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
      log(lc.GL_ANIMATION, `Queueing page switch to: ${pageName}`)
      pendingPageSwitch = pageName
    },
    setRenderState: (newState: RendererState) => {
      currentState = newState
    },
    getActiveOrchestrators: () => Array.from(sceneState.activeOrchestrators.keys()) as string[],
    start: () => {
      if (!hasStarted) {
        hasStarted = true
        const activeNames = Array.from(sceneState.activeOrchestrators.keys())
        log(lc.GL_ANIMATION, `Starting animation loop with active orchestrators: [${activeNames.join(', ')}]`)
        loop.start()
      } else {
        log.warn(lc.GL_ANIMATION, 'Animation loop already started')
      }
    },
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
