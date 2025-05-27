import { createVideoBackground } from './createVideoBackground.ts'

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (
  THREE: typeof import('three'),
  scene: import('three').Scene,
  camera: import('three').Camera,
): Promise<unknown> => {
  return await createVideoBackground(THREE, scene, camera as import('three').PerspectiveCamera)
}
