import * as Three from 'three'
import { createVideoBackground } from './createVideoBackground.ts'

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (
  THREE: typeof Three,
  scene: Three.Scene,
): Promise<unknown> => {
  return await createVideoBackground(THREE, scene)
}
