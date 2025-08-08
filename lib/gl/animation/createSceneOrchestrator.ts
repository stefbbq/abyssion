import type { RendererState } from '../types.ts'
import type { AnimationContext, AnimationOrchestrator, SceneState } from './core/types.ts'
import { createSharedBehaviors } from './core/createSharedBehaviors.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import { lc, log } from '@lib/logger/index.ts'
import { registerOrchestrator } from './orchestrators/registerOrchestrator.ts'
import { unregisterOrchestrator } from './orchestrators/unregisterOrchestrator.ts'
import { switchToOrchestrator } from './orchestrators/switchToOrchestrator.ts'
import { stepOrchestrators } from './orchestrators/stepOrchestrators.ts'
import { createAnimationLoop } from './loop/createAnimationLoop.ts'
import { createVisibilityHandler } from './events/createVisibilityHandler.ts'
import { createFocusHandlers } from './events/createFocusHandlers.ts'
import { attachEventListeners } from './events/attachEventListeners.ts'
import { createFrameEffects } from './effects/createFrameEffects.ts'
import type { SceneOrchestrator } from './types.ts'

const { animationConfig: animation } = animationConfig

/**
 * Scene orchestrator runner: manages animation systems, shared behaviors, and transitions
 * All state transitions are pure; only side effects (DOM, listeners, RAF) are here
 */
export const createSceneOrchestrator = (
  state: RendererState,
): SceneOrchestrator => {
  let currentState = state

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

  // Deferred orchestrator switch to avoid modifying state during iteration
  let pendingOrchestrator: AnimationOrchestrator | null = null

  // Create animation loop
  const loop = createAnimationLoop(
    60, // TARGET_FPS
    animation.timeIncrement,
    {
      onFrame: (loopContext) => {
        // Check if we have basic rendering capability
        if (!currentState.renderer || !currentState.scene || !currentState.camera) {
          log.warn(lc.GL_ANIMATION, 'Skipping frame - basic rendering not ready')
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

        // Handle deferred orchestrator switch after orchestrator updates
        if (pendingOrchestrator) {
          log(lc.GL_ANIMATION, `Executing deferred orchestrator switch to: ${pendingOrchestrator.name}`)
          sceneState = switchToOrchestrator(sceneState, pendingOrchestrator, context)
          pendingOrchestrator = null
        }

        // Render using composer if available, otherwise use basic renderer
        if (currentState.composer) {
          currentState.composer.render()
        } else {
          // Basic rendering for loading state
          currentState.renderer.render(currentState.scene, currentState.camera)
        }
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
    registerOrchestrator: (orchestrator: AnimationOrchestrator) => {
      sceneState = registerOrchestrator(sceneState, orchestrator)
    },
    unregisterOrchestrator: (name: string) => {
      const context: AnimationContext = { state: currentState, shared, time: loop.getTime(), deltaTime: 0 }
      sceneState = unregisterOrchestrator(sceneState, name, context)
    },
    switchToOrchestrator: (orchestrator: AnimationOrchestrator) => {
      log.debug(lc.GL_ANIMATION, `Queueing orchestrator switch to: ${orchestrator.name}`)
      pendingOrchestrator = orchestrator
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
