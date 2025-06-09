import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { createVideoLoadingStream } from './utils/createVideoLoadingStream.ts'
import { createInitialPlaybackState } from './utils/createInitialPlaybackState.ts'
import { shouldStartPlayback } from './utils/shouldStartPlayback.ts'
import { selectNextVideoIndex } from './utils/selectNextVideoIndex.ts'
import { updateRecentIndices } from './utils/updateRecentIndices.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'
import type { BufferObject, PlaybackState, VideoTexture } from './types.ts'
import ms from 'ms'

export const createVideoCycle = (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
): VideoBackgroundManager => {
  const {
    enabled,
    cycling: { minVideoLength, maxVideoLength, antiRepeat },
    appearance: { opacity },
  } = videoCycleConfig

  // Immutable state - only updated through pure functions
  let playbackState: PlaybackState = createInitialPlaybackState([])

  // Prevent concurrent transitions
  let isTransitioning = false
  let nextVideoPrepared = false
  // deno-lint-ignore no-unused-vars
  let preparedVideoIndex = -1

  // Buffers - mutable boundary
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer
  activeBuffer.material.opacity = opacity
  activeBuffer.material.needsUpdate = true

  /**
   * Updates playback state immutably with new videos
   */
  const updateStateWithNewVideos = (newVideos: VideoTexture[]): PlaybackState => {
    return {
      ...playbackState,
      videos: newVideos,
    }
  }

  /**
   * Prepares the next video in the background for smooth transitions
   */
  const prepareNextVideo = async (state: PlaybackState): Promise<void> => {
    if (nextVideoPrepared || state.videos.length < 2) return

    try {
      const nextIndex = selectNextVideoIndex(
        state.currentIndex,
        state.recentIndices,
        state.videos.length,
        antiRepeat,
      )

      const nextVideo = state.videos[nextIndex]

      // Wait for video to be ready
      if (nextVideo.video.readyState < 3) {
        await new Promise<void>((resolve, reject) => {
          let attempts = 0
          const maxAttempts = 30 // 3 seconds max

          const checkReady = () => {
            attempts++
            if (nextVideo.video.readyState >= 3) resolve()
            else if (attempts >= maxAttempts) reject(new Error('Video not ready'))
            else setTimeout(checkReady, ms('0.1s'))
          }

          checkReady()
        })
      }

      // Set up hidden buffer with next video
      hiddenBuffer.material.map = nextVideo.texture
      hiddenBuffer.material.opacity = 0 // Keep hidden initially
      hiddenBuffer.material.needsUpdate = true

      // Prepare video timing
      const result = await getNewStartTimeAndDuration(nextVideo.video, minVideoLength, maxVideoLength)
      nextVideo.video.currentTime = result.startTime
      await nextVideo.video.play()

      // Store preparation state
      nextVideoPrepared = true
      preparedVideoIndex = nextIndex

      // Store timing info in buffer for later use
      hiddenBuffer._plannedStartTime = result.startTime
      hiddenBuffer._plannedDuration = result.duration
      hiddenBuffer._plannedVideoIndex = nextIndex

      log.trace(lc.GL_TEXTURES, `Prepared video ${nextIndex} for smooth transition (duration: ${result.duration.toFixed(2)}s)`)
    } catch (error) {
      log.warn(lc.GL_TEXTURES, `Failed to prepare next video:`, error)
      nextVideoPrepared = false
    }
  }

  /**
   * Starts playback by selecting initial video and updating state
   */
  const startPlayback = async (state: PlaybackState): Promise<PlaybackState> => {
    if (state.isPlaying || state.videos.length < 2 || isTransitioning) return state

    try {
      isTransitioning = true
      log(lc.GL_TEXTURES, `🎥 Starting playback with ${state.videos.length} videos`)

      // Pick random starting video
      const currentIndex = Math.floor(Math.random() * state.videos.length)
      const recentIndices = [currentIndex]
      const current = state.videos[currentIndex]

      // Wait for video to have enough data
      if (current.video.readyState < 3) {
        log.trace(lc.GL_TEXTURES, `Video ${currentIndex} not ready (readyState=${current.video.readyState}), waiting...`)

        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (current.video.readyState >= 3) resolve()
            else setTimeout(checkReady, ms('0.1s'))
          }
          checkReady()
        })
      }

      activeBuffer.material.map = current.texture
      activeBuffer.material.needsUpdate = true

      const result = await getNewStartTimeAndDuration(current.video, minVideoLength, maxVideoLength)

      current.video.currentTime = result.startTime
      await current.video.play()

      log.debug(lc.GL_TEXTURES, `Started with video ${currentIndex}, duration: ${result.duration}s`)

      // Start preparing next video in background
      const newState = {
        ...state,
        currentIndex,
        recentIndices,
        currentDuration: result.duration,
        timeSinceSwitch: 0,
        isPlaying: true,
      }

      isTransitioning = false

      // Prepare next video when halfway through current one
      setTimeout(() => prepareNextVideo(newState), result.duration * 500) // 50% through

      return newState
    } catch (error) {
      log.error(lc.GL_TEXTURES, `Error starting playback:`, error)
      isTransitioning = false
      return state
    }
  }

  /**
   * Smoothly transitions to the prepared next video
   */
  const transitionToNextVideo = async (state: PlaybackState): Promise<PlaybackState> => {
    if (isTransitioning) return state

    isTransitioning = true

    try {
      let nextIndex: number
      let updatedRecentIndices: readonly number[]
      let duration: number

      if (nextVideoPrepared && hiddenBuffer._plannedVideoIndex !== undefined) {
        // Use pre-prepared video for smooth transition
        nextIndex = hiddenBuffer._plannedVideoIndex
        duration = hiddenBuffer._plannedDuration || 10

        const videoName = state.videos[nextIndex]?.video?.src?.split('/').pop() || '(unknown)'
        log.debug(lc.GL_TEXTURES, `Smooth transition to prepared video ${nextIndex} (${videoName})`)

        // Just swap buffers - video is already playing!
        const temp = activeBuffer
        activeBuffer = hiddenBuffer
        hiddenBuffer = temp

        activeBuffer.material.opacity = opacity
        hiddenBuffer.material.opacity = 0
        activeBuffer.material.needsUpdate = true
        hiddenBuffer.material.needsUpdate = true

        updatedRecentIndices = updateRecentIndices(state.recentIndices, nextIndex, antiRepeat)
      } else {
        // Fallback to old method if preparation failed
        log.debug(lc.GL_TEXTURES, `Fallback transition (no prepared video)`)

        nextIndex = selectNextVideoIndex(
          state.currentIndex,
          state.recentIndices,
          state.videos.length,
          antiRepeat,
        )

        updatedRecentIndices = updateRecentIndices(state.recentIndices, nextIndex, antiRepeat)

        // Swap buffers
        const temp = activeBuffer
        activeBuffer = hiddenBuffer
        hiddenBuffer = temp

        // Set up new video
        const next = state.videos[nextIndex]
        activeBuffer.material.map = next.texture
        activeBuffer.material.opacity = opacity
        hiddenBuffer.material.opacity = 0
        activeBuffer.material.needsUpdate = true
        hiddenBuffer.material.needsUpdate = true

        // Play it
        const result = await getNewStartTimeAndDuration(next.video, minVideoLength, maxVideoLength)
        next.video.currentTime = result.startTime
        await next.video.play()

        duration = result.duration
      }

      // Reset preparation state
      nextVideoPrepared = false
      preparedVideoIndex = -1

      const newState = {
        ...state,
        currentIndex: nextIndex,
        recentIndices: updatedRecentIndices,
        currentDuration: duration,
        timeSinceSwitch: 0,
      }

      log(lc.GL_TEXTURES, `Switched to video ${nextIndex}, duration: ${duration.toFixed(2)}s (recent: [${updatedRecentIndices.join(',')}])`)

      isTransitioning = false

      // Prepare next video for the following transition
      setTimeout(() => prepareNextVideo(newState), duration * ms('0.5s')) // 50% through

      return newState
    } catch (error) {
      log.error(lc.GL_TEXTURES, `Error in transition:`, error)
      isTransitioning = false
      return state
    }
  }

  // Initialize video loading stream
  const videoStream = createVideoLoadingStream() // Process video loading events
  ;(async () => {
    for await (const videos of videoStream) {
      log.trace(lc.GL_TEXTURES, `Videos loaded: ${videos.length}, currently playing: ${playbackState.isPlaying}`)

      // Check if we should start playback BEFORE updating state
      const shouldStart = shouldStartPlayback(videos.length, playbackState.isPlaying)
      log.trace(lc.GL_TEXTURES, `Should start playback: ${shouldStart}`)

      const newState = updateStateWithNewVideos(videos)

      // Start playback if conditions are met
      if (shouldStart) {
        log.trace(lc.GL_TEXTURES, `Starting playback...`)
        playbackState = await startPlayback(newState)
      } else playbackState = newState
    }
  })()

  /**
   * Updates the video cycle state and handles video transitions
   */
  const update = async (delta: number): Promise<void> => {
    if (!enabled || !playbackState.isPlaying || playbackState.videos.length < 2 || isTransitioning) return

    const newTimeSinceSwitch = playbackState.timeSinceSwitch + delta

    if (newTimeSinceSwitch >= playbackState.currentDuration) {
      playbackState = await transitionToNextVideo(playbackState)
    } else {
      playbackState = {
        ...playbackState,
        timeSinceSwitch: newTimeSinceSwitch,
      }
    }
  }

  const dispose = () => {
    playbackState.videos.forEach(({ video, texture }) => {
      texture.dispose()
      video.pause()
      video.src = ''
      video.load()
    })
  }

  return {
    update,
    dispose,
    mesh: activeBuffer.mesh,
  }
}
