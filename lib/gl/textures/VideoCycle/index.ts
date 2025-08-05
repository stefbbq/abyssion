import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfigRaw from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoCycleConfig } from '@libgl/configVideoCycle.types.ts'
import type { BufferObject, VideoBackgroundManager } from './types.ts'
import { createSingleVideoManager } from './single.ts'
import { createCycleVideoManager } from './cycle.ts'

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

/**
 * Creates a null video manager for when video is disabled
 */
const createNullVideoManager = (frontBuffer: BufferObject): VideoBackgroundManager => {
  return {
    update: () => {},
    dispose: () => {},
    mesh: frontBuffer.mesh,
    handleResize: () => {},
    getDebugInfo: () => ({
      isPlaying: false,
      isTransitioning: false,
      currentVideoIndex: -1,
      currentVideoName: 'Off',
      currentVideoSrc: '',
      currentDuration: 0,
      currentStartTime: 0,
      currentSegmentEndTime: 0,
      fullVideoDuration: 0,
      timeSinceSwitch: 0,
      segmentProgressPercent: 0,
      nextVideoTriggerTime: 0,
      timeUntilNextVideo: 0,
      bufferSwapTime: 0,
      timeUntilBufferSwap: 0,
      nextPreparedIndex: null,
      nextPreparedVideoName: null,
      nextPreparedVideoSrc: null,
      nextVideoStartTime: null,
      nextVideoDuration: null,
      nextVideoFullDuration: null,
      recentIndices: [],
      antiRepeatCount: 0,
      activeBuffer: {
        name: 'front',
        opacity: 0,
        videoIndex: null,
        videoName: null,
      },
      hiddenBuffer: {
        name: 'back',
        opacity: 0,
        videoIndex: null,
        videoName: null,
      },
      totalVideos: 0,
      poolSize: 0,
      manifestRemaining: 0,
      loadingProgress: {
        loaded: 0,
        total: 0,
        hasMoreToLoad: false,
      },
    }),
  }
}
