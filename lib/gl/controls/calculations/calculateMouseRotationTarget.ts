import type { MousePosition, MouseRotationTarget } from '../types.ts'

/**
 * Calculate target rotation from normalized mouse position
 * Pure function that transforms mouse position to rotation targets
 */
export const calculateMouseRotationTarget = (
  position: MousePosition,
  mouseCoefficient: number,
): MouseRotationTarget => ({
  targetRotationX: position.y * mouseCoefficient,
  targetRotationY: position.x * mouseCoefficient,
})
