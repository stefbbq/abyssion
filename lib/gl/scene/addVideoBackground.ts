import { VIDEO_BACKGROUND_CONFIG } from './config.ts'
import { createVideoCycle } from '@libgl/textures/VideoCycle/index.ts'

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (
  THREE: typeof import('three'),
  scene: import('three').Scene,
  renderer: import('three').WebGLRenderer,
  camera: import('three').Camera,
): Promise<unknown> => {
  if (!VIDEO_BACKGROUND_CONFIG.enabled) return undefined

  return await createVideoCycle(THREE, scene, renderer, camera)
}
