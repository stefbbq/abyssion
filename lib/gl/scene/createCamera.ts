import { CAMERA_CONFIG } from './config.ts'

/**
 * Create and initialize the camera
 */
export const createCamera = (
  THREE: typeof import('three'),
  width: number,
  height: number,
): Promise<import('three').PerspectiveCamera> => {
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    width / height,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far,
  )
  camera.position.z = CAMERA_CONFIG.position.z
  return camera
}
