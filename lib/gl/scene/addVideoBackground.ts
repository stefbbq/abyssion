import { VIDEO_BACKGROUND_CONFIG } from './config.ts'
import { createVideoCycle } from '../textures/videoCycle/index.ts';

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (
  THREE: typeof import('three'),
  scene: import('three').Scene,
): Promise<unknown> => {
  if (!VIDEO_BACKGROUND_CONFIG.enabled) return undefined
  return createVideoCycle(THREE, scene);
}
