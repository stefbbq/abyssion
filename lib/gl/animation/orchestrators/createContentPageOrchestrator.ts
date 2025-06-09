import type { AnimationContext, AnimationOrchestrator } from '../core/types.ts'

/**
 * An orchestrator for pages with no special GL animations.
 * When active, enables a strong pixelation post-process effect.
 * Disables the effect on dispose.
 */
export const createContentPageOrchestrator = (): AnimationOrchestrator => {
  return {
    name: 'content-page',
    update: (context: AnimationContext) => {
      // enable pixelation effect
      const { pixelationPass, renderer } = context.state
      if (pixelationPass && !pixelationPass.enabled) {
        pixelationPass.enabled = true
        if (pixelationPass.uniforms.pixelSize) pixelationPass.uniforms.pixelSize.value = 16
        if (pixelationPass.uniforms.resolution) {
          pixelationPass.uniforms.resolution.value.set(
            renderer.domElement.width,
            renderer.domElement.height,
          )
        }
      }
    },
    dispose: (context: AnimationContext) => {
      // disable pixelation effect
      const { pixelationPass } = context.state
      if (pixelationPass) pixelationPass.enabled = false
    },
  }
}
