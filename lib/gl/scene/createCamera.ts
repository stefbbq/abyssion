import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }
import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'

/**
 * Create and initialize the camera with responsive settings
 */
export const createCamera = (
  THREE: typeof import('three'),
): Promise<import('three').PerspectiveCamera> => {
  const { cameraConfig } = sceneConfig
  const responsiveDimensions = getBaselineDimensions()

  const camera = new THREE.PerspectiveCamera(
    responsiveDimensions.fov,
    globalThis.innerWidth / globalThis.innerHeight, // Use actual screen dimensions
    cameraConfig.near,
    cameraConfig.far,
  )

  camera.position.z = responsiveDimensions.cameraZ
  camera.position.x = cameraConfig.position.x
  camera.position.y = cameraConfig.position.y

  return camera
}
