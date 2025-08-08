import * as THREE from 'three'

import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfigRaw from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoCycleConfig } from '@libgl/configVideoCycle.types.ts'
import type { BufferObject, PlaybackState, VideoBackgroundManager } from './types.ts'
import { selectNextVideoIndex } from './utils/calculateNextVideoSource.ts'
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { updateVideoPool, type VideoPool } from './utils/updateVideoPool.ts'
import { getManifest } from './utils/getManifest.ts'
import { getDebugInfo } from './utils/getDebugInfo.ts'

const videoCycleConfig = videoCycleConfigRaw as unknown as VideoCycleConfig

/**
 * Creates a cycling video system that switches between multiple videos
 * @example
 * Usage:
 *   import { createCycleVideoManager } from '@libgl/textures/VideoCycle/createCycleVideoManager.ts'
 *   const cycleVideoManager = createCycleVideoManager(frontBuffer, backBuffer)
 *   cycleVideoManager.update()
 *   cycleVideoManager.dispose()
 *   cycleVideoManager.getDebugInfo()
 *   cycleVideoManager.handleResize()
 *   cycleVideoManager.getDebugInfo()
 */
export const createCycleVideoManager = async (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
  onReadyToStream?: () => void,
): Promise<VideoBackgroundManager> => {
  const {
    cycling: { minSegmentLength, maxSegmentLength, antiRepeat, videoSwapTimeoutMS, path: manifestPath },
    appearance: { opacity },
  } = videoCycleConfig

  // Initialize global vars
  let videoPool: VideoPool = { videos: [], textures: [], manifest: [] }
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer
  let activeVideo: HTMLVideoElement
  let nextVideoIndex: number
  let activeTexture: THREE.Texture
  let nextVideoStartTime = new Date().getTime()
  let bufferSwapTime = new Date().getTime() + 200
  let isLoading = false
  let isInitialized = false
  let lastVideoSwitchTime = new Date().getTime()
  let activeVideoEndTime = 0

  // Initialize state
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

  /**
   * Plays a video with timeout protection
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
   * Seeks a video to a specific time
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

      // Increase tolerance and add bounds checking
      const tolerance = 0.2
      const safeTargetTime = Math.max(0, Math.min(targetTime, video.duration - 0.1))

      if (Math.abs(video.currentTime - safeTargetTime) < tolerance) {
        log.trace(lc.GL_VIDEO, `Already at target time ${safeTargetTime.toFixed(2)}s`)
        return true
      }

      // Ensure video is ready for seeking
      if (video.readyState < 2) {
        log.warn(lc.GL_VIDEO, 'Video not ready for seeking, readyState:', video.readyState)
        return false
      }

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup()
          reject(new Error('Video seek timeout'))
        }, timeout)

        const handleSeeked = () => {
          const actualTime = video.currentTime
          const timeDiff = Math.abs(actualTime - safeTargetTime)

          if (timeDiff > tolerance) {
            log.warn(lc.GL_VIDEO, `Seek inaccurate: wanted ${safeTargetTime.toFixed(2)}s, got ${actualTime.toFixed(2)}s`)
          }

          cleanup()
          log.trace(lc.GL_VIDEO, `Seek completed to ${actualTime.toFixed(2)}s`)
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
        video.currentTime = safeTargetTime
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
          type: error instanceof Error ? error.name : 'unknown',
          message: error instanceof Error ? error.message : String(error),
        },
      )
      return false
    }
  }

  /**
   * Initializes the cycling video system
   */
  const initialize = async (): Promise<void> => {
    // load manifest
    videoPool.manifest = await getManifest(manifestPath)
    log.debug(lc.GL_VIDEO, 'Manifest loaded:', videoPool.manifest)

    if (videoPool.manifest.length === 0) {
      log.error(lc.GL_VIDEO, 'No videos found in manifest')
      return
    }

    // create initial video pool
    videoPool = await updateVideoPool(videoPool)
    log.debug(lc.GL_VIDEO, 'Video pool created:', videoPool)

    // update playback state
    playbackState = { ...playbackState, videoPool }

    log(lc.GL_TEXTURES, `Video cycle initialized with ${videoPool.manifest.length} videos`)

    isInitialized = true
  }

  /**
   * Selects the next video and seeks to the start time
   */
  const selectNextVideoAndSeek = async (): Promise<boolean> => {
    // check if playback has already started or no videos were found
    if (videoPool.videos.length === 0) {
      log.warn(lc.GL_VIDEO, 'No videos were found')
      return false
    }

    // select a video to play
    const index = selectNextVideoIndex(videoPool.videos.map((_, index) => index), [])
    nextVideoIndex = index

    // calculate segment timing
    const timing = getNewStartTimeAndDuration(videoPool.videos[nextVideoIndex], minSegmentLength, maxSegmentLength)
    nextVideoStartTime = new Date().getTime() + timing.duration * 1000 - 100

    // update playback state for next video preparation
    playbackState = {
      ...playbackState,
      isNextVideoPrepared: true,
      currentDuration: timing.duration,
      currentStartTime: timing.startTime,
    }

    // seek to start time
    const timeUntilNextVideo = Math.max(0, nextVideoStartTime - Date.now())
    const seekSuccess = await seekVideoSafely(videoPool.videos[nextVideoIndex], timing.startTime, timeUntilNextVideo)
    if (!seekSuccess) {
      log.error(lc.GL_VIDEO, 'Failed to seek to start time')
      return false
    }

    return true
  }

  /**
   * Stops a video at the calculated end time to prevent looping
   */
  const stopVideoAtEndTime = (video: HTMLVideoElement, endTime: number): void => {
    const checkTime = () => {
      if (video.currentTime >= endTime) {
        video.pause()
        log.trace(lc.GL_VIDEO, `Video stopped at ${video.currentTime.toFixed(2)}s (target: ${endTime.toFixed(2)}s)`)
        return
      }
      requestAnimationFrame(checkTime)
    }
    checkTime()
  }

  /**
   * Plays the next video in the buffer and updates the buffer material
   */
  const playNextVideo = async (buffer: BufferObject): Promise<boolean> => {
    if (!nextVideoIndex) {
      log.warn(lc.GL_VIDEO, 'No next video found')
      return false
    }

    try {
      activeVideo = videoPool.videos[nextVideoIndex]
      activeTexture = videoPool.textures[nextVideoIndex]

      // Calculate video end time to prevent looping
      activeVideoEndTime = playbackState.currentStartTime + playbackState.currentDuration

      // start playing
      const playSuccess = await playVideoSafely(activeVideo)
      if (!playSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to start video playback')
        return false
      }

      // Set up auto-stop to prevent looping
      stopVideoAtEndTime(activeVideo, activeVideoEndTime)

      // update buffer material
      buffer.material.uniforms.videoTexture.value = activeTexture
      buffer.material.needsUpdate = true

      // update playback state when video starts playing
      const newRecentIndices = [...playbackState.recentIndices, nextVideoIndex].slice(-antiRepeat)
      playbackState = {
        ...playbackState,
        currentManifestIndex: nextVideoIndex,
        isPlaying: true,
        timeSinceSwitch: 0,
        recentIndices: newRecentIndices,
        isNextVideoPrepared: false,
      }

      log.trace(lc.GL_TEXTURES, `Started playback with video ${activeVideo.src}`)
    } catch (error) {
      log.error(lc.GL_TEXTURES, 'Error starting playback:', error)
      return false
    }

    return true
  }

  /**
   * Main update loop for cycling videos
   */
  const update = async (_delta: number): Promise<void> => {
    if (!isInitialized) return

    // maintain state
    if (playbackState.isPlaying) {
      const currentTime = new Date().getTime()
      const timeSinceLastSwitch = currentTime - lastVideoSwitchTime
      playbackState = {
        ...playbackState,
        timeSinceSwitch: Math.max(0, timeSinceLastSwitch),
      }
    }

    // load more videos until all are exhausted
    if (!isLoading && videoPool.manifest.length > 0) {
      isLoading = true
      videoPool = await updateVideoPool(videoPool, 1)
      log.trace(lc.GL_VIDEO, `Video pool updated with %c${videoPool.videos.length}%c videos`, 'font-weight: bold', 'font-weight: normal')
      isLoading = false
    }

    // start next video in hidden buffer
    if (new Date().getTime() > nextVideoStartTime) {
      await playNextVideo(hiddenBuffer)
      await selectNextVideoAndSeek()
    }

    // switch buffers
    if (new Date().getTime() > bufferSwapTime) {
      log.debug(
        lc.GL_VIDEO,
        `Switching buffers at %c${new Date().getTime().toString().slice(-5)}%c`,
        'font-weight: bold',
        'font-weight: normal; color: #aaa',
      )
      const tempBuffer: BufferObject = activeBuffer

      activeBuffer = hiddenBuffer
      activeBuffer.material.uniforms.opacity.value = opacity
      activeBuffer.material.needsUpdate = true

      hiddenBuffer = tempBuffer
      hiddenBuffer.material.uniforms.opacity.value = 0
      hiddenBuffer.material.needsUpdate = false

      bufferSwapTime = nextVideoStartTime + 200

      // update timing for buffer switch
      lastVideoSwitchTime = new Date().getTime()
      playbackState = {
        ...playbackState,
        timeSinceSwitch: 0,
      }
    }
  }

  /**
   * Disposes of the video pool and texture resources
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

  // Initialize the cycling video system
  await initialize()

  if (!isInitialized) {
    log.error(lc.GL_VIDEO, 'Cycling video mode not initialized or preloaded')
    throw new Error('Cycling video mode cannot proceed without initialization')
  }

  log.debug(lc.GL_VIDEO, 'Cycling video mode initialized with videos preloaded: ', videoPool.videos)

  // Prepare the first video
  await selectNextVideoAndSeek()

  // Call ready callback when first video is ready to stream (with flag to prevent duplicate calls)
  if (onReadyToStream && videoPool.videos.length > 0) {
    let hasCalledReady = false
    const firstVideo = videoPool.videos[0]

    const callReadyOnce = () => {
      if (hasCalledReady) return
      hasCalledReady = true
      onReadyToStream()
      log.debug(lc.GL_VIDEO, 'Cycle mode ready to stream callback fired!')
    }

    if (firstVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      callReadyOnce()
    } else {
      firstVideo.addEventListener('loadeddata', callReadyOnce, { once: true })
    }
  }

  return {
    update,
    dispose,
    mesh: activeBuffer.mesh,
    handleResize: () => {},
    getDebugInfo: () =>
      getDebugInfo(
        playbackState,
        videoPool,
        nextVideoIndex,
        nextVideoStartTime,
        bufferSwapTime,
        activeBuffer,
        hiddenBuffer,
        frontBuffer,
        backBuffer,
        antiRepeat,
      ),
  }
}
