import type { RendererState } from '../../types.ts'
import type { AnimationContext } from '../core/types.ts'
import type { SharedBehaviors } from '../core/createSharedBehaviors.ts'
import { alignFocusPlane } from './alignFocusPlane.ts'
import { updateBokehFocus } from './updateBokehFocus.ts'
import { calculateFocusDistance } from '../calculations/calculateFocusDistance.ts'
import { isMobileDevice } from '../../scene/utils/isMobileDevice.ts'

/**
 * creates a function that applies all frame-based side effects
 */
export const createFrameEffects = (
  state: RendererState,
  shared: SharedBehaviors,
) =>
(context: AnimationContext): void => {
  // align focus plane if available
  alignFocusPlane()

  // update controls
  state.controls?.update()

  // apply mouse rotation on non-mobile devices
  if (!isMobileDevice()) {
    shared.applyMouseRotation(state.scene)
  }

  // update bokeh focus distance
  if (state.bokehPass && state.camera && state.THREE) {
    const focusDistance = calculateFocusDistance(
      state.camera,
      state.THREE.Vector3,
      state.THREE.Vector3,
    )
    updateBokehFocus(state.bokehPass, focusDistance)
  }

  // update video background
  if (state.videoBackground) {
    shared.updateVideoBackground(state.videoBackground, context.deltaTime)
  }
}
