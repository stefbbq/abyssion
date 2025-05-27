import { CAMERA_CONFIG } from './config.ts'
import { getResponsiveDimensions } from './utils/getResponsiveDimensions.ts'

/**
 * Create and initialize the camera with responsive settings
 */
export const createCamera = (
  THREE: typeof import('three'),
  width: number,
  height: number,
): Promise<import('three').PerspectiveCamera> => {
  const responsiveDimensions = getResponsiveDimensions()

  const camera = new THREE.PerspectiveCamera(
    responsiveDimensions.fov,
    globalThis.innerWidth / globalThis.innerHeight, // Use actual screen dimensions
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far,
  )

  camera.position.z = responsiveDimensions.cameraZ
  camera.position.x = CAMERA_CONFIG.position.x
  camera.position.y = CAMERA_CONFIG.position.y

  return camera
}
