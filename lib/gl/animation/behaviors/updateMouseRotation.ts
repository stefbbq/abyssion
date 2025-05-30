import type { AnimationBehavior, AnimationFrame, LogoAnimationState } from '../types.ts'
import { smoothRotationInterpolation } from '../utils/smoothRotationInterpolation.ts'

/**
 * Updates scene rotation based on mouse state
 * Pure function - no side effects, returns new state
 */
export const updateMouseRotation: AnimationBehavior<LogoAnimationState> = (
  state: LogoAnimationState,
  _frame: AnimationFrame,
): LogoAnimationState => ({
  ...state,
  mouse: {
    ...state.mouse,
    // Note: Scene mutation happens outside this pure function
    // This function only updates the state
  },
})
