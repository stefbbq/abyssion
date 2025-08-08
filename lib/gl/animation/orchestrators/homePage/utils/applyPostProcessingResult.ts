import type { RendererState } from '@libgl/types.ts'
import type { PostProcessingResult } from '../calculations/calculatePostProcessingUpdate.ts'

/**
 * applies post-processing updates to the renderer state and returns updated bloom override state
 */
export const applyPostProcessingResult = (
  state: RendererState,
  result: PostProcessingResult,
  bloomOverrideActive: boolean,
  bloomOverrideTimeout: ReturnType<typeof setTimeout> | null,
) => {
  // final pass
  if (state.finalPass?.uniforms) {
    state.finalPass.uniforms.time.value = result.finalPass.timeValue
    state.finalPass.uniforms.chromaStrength.value = result.finalPass.chromaStrength

    if (result.finalPass.scheduleChromaReset) {
      setTimeout(() => {
        if (state.finalPass?.uniforms) {
          state.finalPass.uniforms.chromaStrength.value = result.finalPass.chromaResetValue
        }
      }, result.finalPass.chromaResetDelay)
    }
  }

  // bloom pass
  let newBloomOverrideActive = bloomOverrideActive
  let newBloomOverrideTimeout = bloomOverrideTimeout
  if (state.bloomPass) {
    state.bloomPass.strength = result.bloomPass.strength

    if (result.bloomPass.activateOverride) {
      newBloomOverrideActive = true
      if (newBloomOverrideTimeout) clearTimeout(newBloomOverrideTimeout)
      newBloomOverrideTimeout = setTimeout(() => {
        newBloomOverrideActive = false
      }, result.bloomPass.overrideDuration)
    }
  }

  // dithering pass
  if (state.ditheringPass?.uniforms) {
    state.ditheringPass.uniforms.time.value = result.ditheringPass.timeValue
  }

  // crt time update (continuous animation)
  if (state.crtPass?.material?.uniforms?.time) {
    state.crtPass.material.uniforms.time.value = performance.now() / 1000
  }

  // sharpening pass
  if (state.sharpeningPass?.uniforms?.resolution) {
    state.sharpeningPass.uniforms.resolution.value.set(
      result.sharpeningPass.resolutionWidth,
      result.sharpeningPass.resolutionHeight,
    )
  }

  return { bloomOverrideActive: newBloomOverrideActive, bloomOverrideTimeout: newBloomOverrideTimeout }
}
