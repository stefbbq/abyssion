import { debugPanelsAPI } from '@islands/DebugPanels.tsx'

/**
 * updates bokeh depth of field focus distance and debug panels
 */
export const updateBokehFocus = (
  // deno-lint-ignore no-explicit-any
  bokehPass: any,
  focusDistance: number,
): void => {
  if (!bokehPass?.materialBokeh?.uniforms.focus) return

  bokehPass.materialBokeh.uniforms.focus.value = focusDistance

  // update debug panels with live focus distance
  debugPanelsAPI.updateDOFParams({
    focus: bokehPass.materialBokeh.uniforms.focus.value,
    aperture: bokehPass.materialBokeh.uniforms.aperture.value,
    maxblur: bokehPass.materialBokeh.uniforms.maxblur.value,
    liveFocusDistance: focusDistance,
  })
}
