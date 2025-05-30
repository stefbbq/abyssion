import type { RendererState } from '../types.ts'
import type { AnimationContext, AnimationOrchestrator, SceneState } from './core/types.ts'
import { createSharedBehaviors } from './core/createSharedBehaviors.ts'
import animationConfig from '@lib/configAnimation.json' with { type: 'json' }

const { animationConfig: animation } = animationConfig

/**
 * Scene orchestrator that manages multiple animation systems
 * Handles shared behaviors, orchestrator lifecycle, and transitions
 */
export const createSceneOrchestrator = (state: RendererState) => {
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
   * Register a new animation orchestrator
   */
  const registerOrchestrator = (orchestrator: AnimationOrchestrator) => {
    sceneState.activeOrchestrators.set(orchestrator.name, orchestrator)
  }

  /**
   * Remove an animation orchestrator
   */
  const unregisterOrchestrator = (name: string) => {
    const orchestrator = sceneState.activeOrchestrators.get(name)
    if (orchestrator) {
      orchestrator.dispose()
      sceneState.activeOrchestrators.delete(name)
    }
  }

  /**
   * Switch to a different page orchestrator with optional transition
   */
  const switchToPage = (pageName: string, withTransition: boolean = true) => {
    // TODO: Handle transitions in future iteration
    // For now, just switch directly

    // Clear current orchestrators
    sceneState.activeOrchestrators.forEach((orchestrator, name) => {
      unregisterOrchestrator(name)
    })
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
    state.controls.update()

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
      sceneState.activeOrchestrators.forEach((orchestrator) => {
        orchestrator.dispose()
      })
      sceneState.activeOrchestrators.clear()
    },
  }
}
