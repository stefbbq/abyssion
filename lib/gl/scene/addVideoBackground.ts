import { createVideoBackground } from './createVideoBackground.ts'

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (
  THREE: typeof import('three'),
  scene: import('three').Scene,
): Promise<unknown> => {
  return await createVideoBackground(THREE, scene)
}
