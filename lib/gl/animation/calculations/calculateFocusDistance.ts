import type { Camera, Vector3 } from 'three'

/**
 * calculates the focus distance from camera to logo position for depth of field effects
 */
export const calculateFocusDistance = (
  camera: Camera,
  logoWorldPosition: Vector3,
  Vector3Constructor: typeof Vector3,
): number => {
  const logoPosition = new Vector3Constructor(0, 0, 0)
  return camera.position.distanceTo(logoPosition)
}
