import type { AnimationContext, AnimationOrchestrator } from '../core/types.ts'
import { calculateStaticLayerPosition } from '../calculations/calculateStaticLayerPosition.ts'

/**
 * Portfolio page animation orchestrator
 * Example of how to create a new page with different animations
 */
export const createPortfolioPageOrchestrator = (): AnimationOrchestrator => {
  // Page-specific state
  let portfolioMeshes: any[] = []
  let isInitialized = false

  const update = (context: AnimationContext) => {
    const { time } = context

    // Initialize portfolio elements if needed
    if (!isInitialized) {
      // TODO: Create portfolio-specific Three.js objects
      // portfolioMeshes = createPortfolioElements(state.scene)
      isInitialized = true
    }

    // Update portfolio-specific animations
    portfolioMeshes.forEach((mesh, i) => {
      // Different animation pattern than logo page
      const position = calculateStaticLayerPosition(time * 0.5, i, -2, false)
      mesh.position.set(position.x * 2, position.y, position.z)

      // Add portfolio-specific rotation
      mesh.rotation.y = time * 0.1
    })
  }

  const dispose = () => {
    // Clean up portfolio-specific resources
    portfolioMeshes.forEach((mesh) => {
      // Remove from scene, dispose geometry/materials
    })
    portfolioMeshes = []
    isInitialized = false
  }

  return {
    name: 'portfolio-page',
    update,
    dispose,
  }
}
