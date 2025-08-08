import type { BufferObject, VideoBackgroundManager } from './types.ts'

/**
 * @module VideoCycle
 * @description Creates a null video manager for when video is disabled
 * @example
 * Usage:
 *   import { createNullVideoManager } from '@libgl/textures/VideoCycle/createNullVideoManager.ts'
 *   const nullVideoManager = createNullVideoManager(frontBuffer)
 */
export const createNullVideoManager = (frontBuffer: BufferObject): VideoBackgroundManager => {
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
