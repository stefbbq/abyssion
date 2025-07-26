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
      log.debug(lc.GL_VIDEO, `Seeking to ${targetTime.toFixed(2)}s (current: ${video.currentTime.toFixed(2)}s)`)

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
      log.error(lc.GL_VIDEO, `Failed to seek video to ${targetTime.toFixed(2)}s:`, error)
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
  let nextVideoInterval
  let isTransitioning = false
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

    // Set initial buffer opacity
    activeBuffer.material.opacity = opacity
    activeBuffer.material.needsUpdate = true
    log(lc.GL_TEXTURES, `Video cycle initialized with ${videoPool.manifest.length} videos`)

    // Wait for videos to load
    initalized = true
  }

  // Start playback with first video
  const selectNextVideoAndPlay = async (): Promise<void> => {
    // Check if playback has already started or no videos were found
    if (videoPool.videos.length === 0) {
      log.warn(lc.GL_VIDEO, 'No videos were found')
      return
    }

    try {
      log.debug(lc.GL_VIDEO, `Starting video playback`)
      isTransitioning = true

      // Select the first video to play
      const index = selectNextVideoIndex(videoPool.videos.map((_, index) => index), [])
      log.debug(lc.GL_VIDEO, `First video source: ${index}, ${videoPool.videos[index].src}`)

      const activeVideo = videoPool.videos[index]
      const activeTexture = videoPool.textures[index]

      // Calculate segment timing
      const timing = getNewStartTimeAndDuration(activeVideo, minSegmentLength, maxSegmentLength)

      // Seek to start time
      const seekSuccess = await seekVideoSafely(activeVideo, timing.startTime)
      if (!seekSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to seek to start time')
        isTransitioning = false
        return
      }

      // Start playing
      const playSuccess = await playVideoSafely(activeVideo)
      if (!playSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to start video playback')
        isTransitioning = false
        return
      }

      // Update buffer material
      if ('uniforms' in activeBuffer.material) {
        activeBuffer.material.uniforms.videoTexture.value = activeTexture
        activeBuffer.material.uniforms.opacity.value = opacity
      } else {
        activeBuffer.material.map = activeTexture
        activeBuffer.material.opacity = opacity
      }
      activeBuffer.material.needsUpdate = true

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

      log.debug(lc.GL_TEXTURES, `Started playback with video ${index}`)
      isTransitioning = false
    } catch (error) {
      log.error(lc.GL_TEXTURES, 'Error starting playback:', error)
      isTransitioning = false
    }
  }

  // Main update loop
  const update = async (_delta: number): Promise<void> => {
    // load more videos until all are exhaused
    if (!isLoading && videoPool.manifest.length > 0) {
      isLoading = true
      videoPool = await updateVideoPool(videoPool, 1)
      isLoading = false
    }

    // log.debug(lc.GL_VIDEO, 'Updating video cycle')
    // if (!enabled || !playbackState.isPlaying || isTransitioning) return

    // const activeVideo = videoPool.videos[videoPool.activeIndex]
    // if (!activeVideo) {
    //   log.warn(lc.GL_VIDEO, 'No active video found in update loop')
    //   return
    // }

    // // Calculate buffer state
    // const bufferState = calculateBufferState({
    //   currentStartTime: playbackState.currentStartTime,
    //   currentDuration: playbackState.currentDuration,
    //   currentVideoTime: activeVideo.currentTime,
    //   transitionTriggerPoint: calculatePreparationTiming(playbackState.currentDuration),
    //   isNextVideoPrepared: playbackState.isNextVideoPrepared,
    // })

    // // Update timing
    // playbackState = {
    //   ...playbackState,
    //   timeSinceSwitch: bufferState.elapsedTime * 1000,
    // }

    // // Prepare next video if needed
    // if (bufferState.shouldPrepareNext) {
    //   log.debug(lc.GL_VIDEO, `Preparing next video at ${(bufferState.progress * 100).toFixed(1)}% progress`)
    //   await prepareNextVideo()
    // }

    // // Transition if needed
    // if (bufferState.shouldTransition) {
    //   log.debug(
    //     lc.GL_VIDEO,
    //     `Video transition triggered: ${bufferState.hasLooped ? 'looped' : 'duration exceeded'} (progress: ${
    //       (bufferState.progress * 100).toFixed(1)
    //     }%)`,
    //   )
    //   await transitionToNext()
    // }
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
      isTransitioning,
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
      await selectNextVideoAndPlay()
    } else {
      log.warn(lc.GL_VIDEO, 'Video cycle not initialized or preloaded')
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
