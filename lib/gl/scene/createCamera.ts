import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }
import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'

/**
 * Create and initialize the camera with responsive settings
 */
export const createCamera = (
  THREE: typeof import('three'),
): Promise<import('three').PerspectiveCamera> => {
  const responsiveDimensions = getBaselineDimensions()

  const camera = new THREE.PerspectiveCamera(
    responsiveDimensions.fov,
    globalThis.innerWidth / globalThis.innerHeight, // Use actual screen dimensions
    0.1,
    6000,
  )

  camera.position.z = responsiveDimensions.cameraZ
  camera.position.x = 0
  camera.position.y = 0

  return camera
}
