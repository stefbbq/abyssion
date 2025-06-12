import * as Three from 'three'
import { createVideoBackground } from './createVideoBackground.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'

/**
 * Create video background for the scene
 */
export const addVideoBackground = (
  THREE: typeof Three,
  scene: Three.Scene,
): VideoBackgroundManager | undefined => {
  return createVideoBackground(THREE, scene)
}
