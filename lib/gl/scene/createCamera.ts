import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'

/**
 * Creates and configures a perspective camera optimized for logo visualization.
 *
 * Sets up a THREE.PerspectiveCamera with responsive field of view and positioning
 * calculated to ensure consistent logo framing across different screen aspect ratios.
 * The camera is positioned along the Z-axis at a distance that maintains proper
 * logo scale regardless of viewport dimensions, with FOV and position automatically
 * adjusted based on the baseline dimensions system for optimal viewing.
 */
export const createCamera = (
  THREE: typeof import('three'),
): Promise<import('three').PerspectiveCamera> => {
  const responsiveDimensions = getBaselineDimensions()

  const camera = new THREE.PerspectiveCamera(
    responsiveDimensions.fov,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    6000,
  )

  camera.position.z = responsiveDimensions.cameraZ
  camera.position.x = 0
  camera.position.y = 0

  return camera
}
