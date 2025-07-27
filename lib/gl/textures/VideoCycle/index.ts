import ms from 'ms'

import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoBackgroundManager } from '@libgl/types.ts'
import type { BufferObject, PlaybackState, VideoDebugInfo } from './types.ts'
import { selectNextVideoIndex } from './utils/calculateNextVideoSource.ts'
// import { calculateBufferState, calculatePreparationTiming } from './utils/calculateBufferState.ts'
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { updateVideoPool, type VideoPool } from './utils/updateVideoPool.ts'
import { getManifest } from './utils/getManifest.ts'

/**
 * Creates an efficient video cycle system with 2-3 video elements maximum
 *
 * Uses pure utility functions for calculations and keeps Three.js mutations isolated
 */
export const createVideoCycle = (frontBuffer: BufferObject, backBuffer: BufferObject): Promise<VideoBackgroundManager> => {
  const {
    enabled,
    cycling: { minSegmentLength, maxSegmentLength, antiRepeat, videoSwapTimeoutMS, videoLoadTimeoutMS },
    appearance: { opacity },
    videos: { path: manifestPath },
  } = videoCycleConfig

  /**
   * @description
   * Plays a video with timeout protection
   *
   * @param video the video element to play
   * @param timeout the timeout for the play
   * @returns true if the play was successful, false otherwise
   */
  const playVideoSafely = async (
    video: HTMLVideoElement,
    timeout: number = videoSwapTimeoutMS,
  ): Promise<boolean> => {
    try {
      await Promise.race([
        video.play(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Video play timeout')), timeout)),
      ])
      return true
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Failed to play video:', error)
      return false
    }
  }

  /**
   * @description
   * Seeks a video to a specific time
   *
   * @param video the video element to seek
   * @param targetTime the time to seek to
   * @param timeout the timeout for the seek
   * @returns true if the seek was successful, false otherwise
   */
  const seekVideoSafely = async (
    video: HTMLVideoElement,
    targetTime: number,
    timeout: number = 2000,
  ): Promise<boolean> => {
    try {
      log.debug(
        lc.GL_VIDEO,
        `Seeking to ${targetTime.toFixed(2)}s (current: ${video.currentTime.toFixed(2)}s) with timeout: ${timeout}ms`,
      )

      // If already at target time (within 0.1s), no need to seek
      if (Math.abs(video.currentTime - targetTime) < 0.1) {
        log.trace(lc.GL_VIDEO, `Already at target time ${targetTime.toFixed(2)}s`)
        return true
      }

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup()
          reject(new Error('Video seek timeout'))
        }, timeout)

        const handleSeeked = () => {
          cleanup()
          log.trace(lc.GL_VIDEO, `Seek completed to ${video.currentTime.toFixed(2)}s`)
          resolve()
        }

        const handleError = (event: Event) => {
          cleanup()
          reject(new Error(`Video seek error: ${event.type}`))
        }

        const cleanup = () => {
          clearTimeout(timeoutId)
          video.removeEventListener('seeked', handleSeeked)
          video.removeEventListener('error', handleError)
        }

        video.addEventListener('seeked', handleSeeked)
        video.addEventListener('error', handleError)

        // Perform the seek
        video.currentTime = targetTime
      })

      return true
    } catch (error) {
      log.error(
        lc.GL_VIDEO,
        `Failed to seek video to ${targetTime.toFixed(2)}s:`,
        error,
        {
          currentTime: video.currentTime,
          readyState: video.readyState,
          networkState: video.networkState,
          error: video.error,
          timeout,
          type: error?.type,
          message: error?.message,
        },
      )
      return false
    }
  }

  // Initialize state
  let videoPool: VideoPool = { videos: [], textures: [], manifest: [] }
  let playbackState: PlaybackState = {
    videoPool,
    currentManifestIndex: -1,
    recentIndices: [],
    timeSinceSwitch: 0,
    currentDuration: 0,
    currentStartTime: 0,
    isPlaying: false,
    isNextVideoPrepared: false,
  }
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer
  let nextVideoStartTime = new Date().getTime()
  let bufferSwapTime = new Date().getTime() + 100
  let isLoading = false
  let initalized = false

  // Initialize the system
  const initialize = async (): Promise<void> => {
    // Load manifest
    videoPool.manifest = await getManifest(manifestPath)
    log.debug(lc.GL_VIDEO, 'Manifest loaded:', videoPool.manifest)

    if (videoPool.manifest.length === 0) {
      log.error(lc.GL_VIDEO, 'No videos found in manifest')
      return
    }

    // Create initial video pool
    videoPool = await updateVideoPool(videoPool)
    log.debug(lc.GL_VIDEO, 'Video pool created:', videoPool)

    // Initialize playback state
    playbackState = {
      videoPool,
      currentManifestIndex: -1,
      recentIndices: [],
      timeSinceSwitch: 0,
      currentDuration: 0,
      currentStartTime: 0,
      isPlaying: false,
      isNextVideoPrepared: false,
    }

    log(lc.GL_TEXTURES, `Video cycle initialized with ${videoPool.manifest.length} videos`)

    // Wait for videos to load
    initalized = true
  }

  // Start playback with first video
  const selectNextVideoAndPlay = async (buffer: BufferObject): Promise<void> => {
    // Check if playback has already started or no videos were found
    if (videoPool.videos.length === 0) {
      log.warn(lc.GL_VIDEO, 'No videos were found')
      return
    }

    try {
      // Select a video to play
      const index = selectNextVideoIndex(videoPool.videos.map((_, index) => index), [])
      const activeVideo = videoPool.videos[index]
      const activeTexture = videoPool.textures[index]

      // Calculate segment timing
      const timing = getNewStartTimeAndDuration(activeVideo, minSegmentLength, maxSegmentLength)
      nextVideoStartTime = new Date().getTime() + timing.duration * 1000 - 100

      // Seek to start time
      const timeUntilNextVideo = Math.max(0, nextVideoStartTime - Date.now())
      const seekSuccess = await seekVideoSafely(activeVideo, timing.startTime, timeUntilNextVideo)
      if (!seekSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to seek to start time')
        return
      }

      // Start playing
      const playSuccess = await playVideoSafely(activeVideo)
      if (!playSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to start video playback')
        return
      }

      // Update buffer material
      buffer.material.uniforms.videoTexture.value = activeTexture
      buffer.material.needsUpdate = true

      // Update playback state
      playbackState = {
        ...playbackState,
        currentManifestIndex: index,
        recentIndices: [index],
        currentDuration: timing.duration,
        currentStartTime: timing.startTime,
        isPlaying: true,
        timeSinceSwitch: 0,
      }

      log.trace(lc.GL_TEXTURES, `Started playback with video ${index}`)
    } catch (error) {
      log.error(lc.GL_TEXTURES, 'Error starting playback:', error)
    }
  }

  // Main update loop
  const update = async (_delta: number): Promise<void> => {
    // load more videos until all are exhaused
    if (!isLoading && videoPool.manifest.length > 0) {
      isLoading = true
      videoPool = await updateVideoPool(videoPool, 1)
      log.trace(lc.GL_VIDEO, `Video pool updated with %c${videoPool.videos.length}%c videos`, 'font-weight: bold', 'font-weight: normal')
      isLoading = false
    }

    // start next video in hidden buffer
    if (new Date().getTime() > nextVideoStartTime) {
      log.debug(
        lc.GL_VIDEO,
        `Starting next video in hidden buffer at %c${new Date().getTime().toString().slice(-5)}%c`,
        'font-weight: bold',
        'font-weight: normal',
      )
      await selectNextVideoAndPlay(hiddenBuffer)
    }

    // switch buffers
    if (new Date().getTime() > bufferSwapTime) {
      log.debug(
        lc.GL_VIDEO,
        `Switching buffers at %c${new Date().getTime().toString().slice(-5)}%c`,
        'font-weight: bold',
        'font-weight: normal',
      )
      const tempBuffer: BufferObject = activeBuffer
      activeBuffer = hiddenBuffer
      hiddenBuffer = tempBuffer

      activeBuffer.material.uniforms.opacity.value = opacity
      hiddenBuffer.material.uniforms.opacity.value = 0

      activeBuffer.material.needsUpdate = true
      hiddenBuffer.material.needsUpdate = false

      bufferSwapTime = nextVideoStartTime + 200
    }
  }

  /**
   * @description
   * This function disposes of the video pool and it's texture resources
   *
   * @returns {void}
   */
  const dispose = (): void => {
    if (!videoPool) {
      log.warn(lc.GL_VIDEO, 'No video pool found in dispose')
      return
    }

    videoPool.videos.forEach((video) => {
      video.pause()
      video.src = ''
      video.load()
    })

    videoPool.textures.forEach((texture) => texture.dispose())
  }

  /**
   * @description
   * This function returns debug info for the video cycle
   *
   * @returns {VideoDebugInfo}
   */
  const getDebugInfo = (): VideoDebugInfo => {
    const activeVideo = playbackState.currentManifestIndex !== -1 ? videoPool.videos[playbackState.currentManifestIndex] : null
    const currentVideoName = activeVideo?.src?.split('/').pop() || 'Unknown'

    return {
      isPlaying: playbackState?.isPlaying || false,
      currentVideoIndex: playbackState?.currentManifestIndex || -1,
      currentVideoName,
      currentVideoSrc: activeVideo?.src || '',
      timeSinceSwitch: playbackState?.timeSinceSwitch || 0,
      currentDuration: playbackState?.currentDuration || 0,
      fullVideoDuration: activeVideo?.duration || 0,
      videoStartTime: playbackState?.currentStartTime || 0,
      totalVideos: videoPool.manifest.length || 0,
      recentIndices: playbackState?.recentIndices || [],
      // nextPreparedIndex: playbackState?.isNextVideoPrepared ? videoPool?.nextIndex : null,
      // nextPreparedVideoName: playbackState?.isNextVideoPrepared
      //   ? videoPool?.videos[videoPool.nextIndex]?.src?.split('/').pop() || null
      //   : null,
      loadingProgress: {
        loaded: 3, // Always 3 video elements in pool
        total: videoPool.manifest.length || 0,
        hasMoreToLoad: false,
      },
    }
  } //
   // Initialize and start
  ;(async () => {
    await initialize()

    if (initalized) {
      log.debug(lc.GL_VIDEO, 'Video cycle initialized with videos preloaded: ', videoPool.videos)
      await selectNextVideoAndPlay(activeBuffer)
    } else {
      log.error(lc.GL_VIDEO, 'Video cycle not initialized or preloaded')
      throw new Error('Video cycle cannot proceed without initialization')
    }
  })()

  return {
    update,
    dispose,
    mesh: activeBuffer.mesh,
    handleResize: () => {},
    getDebugInfo,
  }
}
