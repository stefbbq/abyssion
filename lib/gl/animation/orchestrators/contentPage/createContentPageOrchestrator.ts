import type { AnimationContext, AnimationOrchestrator } from '../../core/types.ts'
import type { RendererState } from '@libgl/types.ts'
import { setBackgroundIntensityOverride } from '@lib/ui/state.ts'

/**
 * An orchestrator for pages with no special GL animations.
 * When active, enables a strong pixelation post-process effect.
 * Disables the effect on dispose.
 */
export const createContentPageOrchestrator = (glState: RendererState): AnimationOrchestrator => {
  let initialized = false

  const initializeOnce = () => {
    if (initialized) return
    initialized = true
    // hide logo-related meshes to keep only the backdrop
    try {
      if (glState.logoPlanes) glState.logoPlanes.forEach((p) => (p.visible = false))
      if (glState.shadowLayer?.mesh) glState.shadowLayer.mesh.visible = false
      if (glState.shapeLayer) glState.shapeLayer.visible = false
    } catch {
      // ignore if GL elements are not available
    }
    // force background visible for content pages
    setBackgroundIntensityOverride(1)
  }

  return {
    name: 'content-page',
    update: (context: AnimationContext) => {
      initializeOnce()
      // enable pixelation effect
      const { pixelationPass, renderer, crtPass } = context.state
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

      // Apply CRT pass time updates (for continuous animation)
      if (crtPass?.material?.uniforms?.time) {
        crtPass.material.uniforms.time.value = performance.now() / 1000
      }
    },
    dispose: (context: AnimationContext) => {
      // disable pixelation effect
      const { pixelationPass } = context.state
      if (pixelationPass) pixelationPass.enabled = false
      // clear override and restore logo-related visibility
      try {
        setBackgroundIntensityOverride(null)
        if (glState.logoPlanes) glState.logoPlanes.forEach((p) => (p.visible = true))
        if (glState.shadowLayer?.mesh) glState.shadowLayer.mesh.visible = true
        if (glState.shapeLayer) glState.shapeLayer.visible = true
      } catch {
        // ignore if background override or GL elements are not available
      }
    },
  }
}
