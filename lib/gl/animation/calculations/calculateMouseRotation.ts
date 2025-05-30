/**
 * Calculates target rotation from normalized mouse position
 * Pure function - no side effects, deterministic output
 */
export const calculateMouseRotation = (
  mouseX: number,
  mouseY: number,
  mouseCoefficient: number,
): { targetRotationX: number; targetRotationY: number } => ({
  targetRotationX: mouseY * mouseCoefficient,
  targetRotationY: mouseX * mouseCoefficient,
})
