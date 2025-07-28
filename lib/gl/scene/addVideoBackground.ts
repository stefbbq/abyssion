import * as Three from 'three'
import { createVideoBackground } from './createVideoBackground.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (
  THREE: typeof Three,
  scene: Three.Scene,
): Promise<VideoBackgroundManager | undefined> => {
  return await createVideoBackground(THREE, scene)
}
