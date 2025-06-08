import type { RendererState } from '../types.ts'
import type { AnimationContext, AnimationOrchestrator, SceneState } from './core/types.ts'
import { createSharedBehaviors } from './core/createSharedBehaviors.ts'
import animationConfig from '@lib/configAnimation.json' with { type: 'json' }

const { animationConfig: animation } = animationConfig

type OrchestratorRegistry = Record<string, () => AnimationOrchestrator>

/**
 * Scene orchestrator that manages multiple animation systems
 * Handles shared behaviors, orchestrator lifecycle, and transitions
 */
export const createSceneOrchestrator = (state: RendererState, orchestratorRegistry: OrchestratorRegistry) => {
  let time = 0
  let lastTime = 0
  let animationId: number

  // Create shared behaviors that persist across page changes
  const shared = createSharedBehaviors()

  // Scene state
  const sceneState: SceneState = {
    activeOrchestrators: new Map(),
    transition: {
      isTransitioning: false,
      progress: 0,
      fromPage: null,
      toPage: null,
    },
  }

  /**
   * Register a new animation orchestrator by name
   */
  const registerOrchestrator = (name: string) => {
    const orchestratorFactory = orchestratorRegistry[name]
    if (orchestratorFactory) {
      const orchestrator = orchestratorFactory()
      sceneState.activeOrchestrators.set(orchestrator.name, orchestrator)
    } else {
      console.warn(`Orchestrator with name "${name}" not found in registry.`)
    }
  }

  /**
   * Remove an animation orchestrator
   */
  const unregisterOrchestrator = (name: string) => {
    const orchestrator = sceneState.activeOrchestrators.get(name)
    if (orchestrator) {
      const context: AnimationContext = {
        state,
        shared,
        time,
        deltaTime: 0, // Delta time is not relevant for disposal
      }
      orchestrator.dispose(context)
      sceneState.activeOrchestrators.delete(name)
    }
  }

  /**
   * Switch to a different page orchestrator
   */
  const switchToPage = (pageName: string) => {
    // 1. Dispose and unregister all current orchestrators
    sceneState.activeOrchestrators.forEach((_, name) => {
      unregisterOrchestrator(name)
    })

    // 2. Register the new orchestrator
    // Fallback to 'empty-page' if the requested page is not in the registry
    const targetPage = orchestratorRegistry[pageName] ? pageName : 'empty-page'
    registerOrchestrator(targetPage)
  }

  /**
   * Main animation loop
   */
  const animate = (timestamp: number) => {
    // Align focus plane if present
    if (typeof window !== 'undefined' && typeof (window as any).alignFocusPlane === 'function') {
      ;(window as any).alignFocusPlane()
    }

    animationId = requestAnimationFrame(animate)

    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    time += animation.timeIncrement

    // Update orbit controls
    state.controls?.update()

    // Apply shared behaviors
    shared.applyMouseRotation(state.scene)
    shared.updateVideoBackground(state.videoBackground, animation.timeIncrement)

    // Create context for orchestrators
    const context: AnimationContext = {
      state,
      shared,
      time,
      deltaTime,
    }

    // Update all active orchestrators
    sceneState.activeOrchestrators.forEach((orchestrator) => {
      orchestrator.update(context)
    })

    // Render
    state.composer.render()
  }

  // Start animation loop
  animate(0)

  return {
    registerOrchestrator,
    unregisterOrchestrator,
    switchToPage,
    getActiveOrchestrators: () => Array.from(sceneState.activeOrchestrators.keys()),
    dispose: () => {
      cancelAnimationFrame(animationId)
      shared.mouseTracking.cleanup()
      const context: AnimationContext = {
        state,
        shared,
        time,
        deltaTime: 0,
      }
      sceneState.activeOrchestrators.forEach((orchestrator) => {
        orchestrator.dispose(context)
      })
      sceneState.activeOrchestrators.clear()
    },
  }
}
