import * as THREE from 'three'

/**
 * calculates the focus distance from camera to logo position for depth of field effects
 */
export const calculateFocusDistance = (
  camera: THREE.Camera,
): number => {
  const logoPosition = new THREE.Vector3(0, 0, 0)
  return camera.position.distanceTo(logoPosition)
}
