/**
 * @module VideoCycle
 * @description Creates a video background manager based on the configured mode
 * @example
 * Usage:
 *   import { createVideoCycle } from '@libgl/textures/VideoCycle/index.ts'
 *   const videoCycle = createVideoCycle(frontBuffer, backBuffer)
 */

import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfigRaw from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoCycleConfig } from '@libgl/configVideoCycle.types.ts'
import type { BufferObject, VideoBackgroundManager } from './types.ts'
import { createSingleVideoManager } from './createSingleVideoManager.ts'
import { createCycleVideoManager } from './createCycleVideoManager.ts'
import { createNullVideoManager } from './createNullVideoManager.ts'

const videoCycleConfig = videoCycleConfigRaw as unknown as VideoCycleConfig

/**
 * Creates a video background manager based on the configured mode
 *
 * This is a factory function that delegates to the appropriate implementation:
 * - 'off': Returns a null manager that does nothing
 * - 'single': Creates a single video loop manager
 * - 'cycle': Creates a cycling video manager
 */
export const createVideoCycle = async (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
  onReadyToStream?: () => void,
): Promise<VideoBackgroundManager> => {
  const { mode } = videoCycleConfig

  switch (mode) {
    case 'off':
      log.warn(lc.GL_VIDEO, 'Video cycle is disabled')
      return createNullVideoManager(frontBuffer)

    case 'single':
      log.debug(lc.GL_VIDEO, 'Creating single video manager')
      return await createSingleVideoManager(frontBuffer, backBuffer, onReadyToStream)

    case 'cycle':
      log.debug(lc.GL_VIDEO, 'Creating cycling video manager')
      return await createCycleVideoManager(frontBuffer, backBuffer, onReadyToStream)

    default:
      log.error(lc.GL_VIDEO, `Unknown video cycle mode: ${mode}`)
      return createNullVideoManager(frontBuffer)
  }
}
