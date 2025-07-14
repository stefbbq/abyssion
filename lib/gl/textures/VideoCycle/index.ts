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

type PreparedVideo = {
  index: number
  video: VideoTexture
  startTime: number
  duration: number
}

export const createVideoCycle = (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
): VideoBackgroundManager => {
  const {
    enabled,
    cycling: { minSegmentLength, maxSegmentLength, antiRepeat },
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
   * Selects a video and calculates its timing - THE SINGLE SOURCE OF TRUTH
   */
  const selectVideoWithTiming = (
    currentIndex: number,
    recentIndices: readonly number[],
    videos: VideoTexture[],
    isInitial = false,
  ): PreparedVideo => {
    const nextIndex = isInitial
      ? Math.floor(Math.random() * videos.length)
      : selectNextVideoIndex(currentIndex, recentIndices, videos.length)

    const video = videos[nextIndex]
    const result = getNewStartTimeAndDuration(video.video, minSegmentLength, maxSegmentLength)

    return {
      index: nextIndex,
      video,
      startTime: result.startTime,
      duration: result.duration,
    }
  }

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
      const prepared = selectVideoWithTiming(
        state.currentIndex,
        state.recentIndices,
        state.videos,
      )

      // Wait for video to be ready
      if (prepared.video.video.readyState < 3) {
        await new Promise<void>((resolve, reject) => {
          let attempts = 0
          const maxAttempts = 30 // 3 seconds max

          const checkReady = () => {
            attempts++
            if (prepared.video.video.readyState >= 3) resolve()
            else if (attempts >= maxAttempts) reject(new Error('Video not ready'))
            else setTimeout(checkReady, ms('0.1s'))
          }

          checkReady()
        })
      }

      // Set up hidden buffer with next video
      if ('uniforms' in hiddenBuffer.material) {
        // ShaderMaterial
        hiddenBuffer.material.uniforms.videoTexture.value = prepared.video.texture
        hiddenBuffer.material.uniforms.opacity.value = 0 // Keep hidden initially
      } else {
        // Fallback for MeshBasicMaterial
        hiddenBuffer.material.map = prepared.video.texture
        hiddenBuffer.material.opacity = 0
      }
      hiddenBuffer.material.needsUpdate = true

      // Apply the calculated timing
      prepared.video.video.currentTime = prepared.startTime
      await prepared.video.video.play()

      // Store preparation state
      nextVideoPrepared = true
      preparedVideoIndex = prepared.index

      // Store timing info in buffer for later use
      hiddenBuffer._plannedStartTime = prepared.startTime
      hiddenBuffer._plannedDuration = prepared.duration
      hiddenBuffer._plannedVideoIndex = prepared.index

      log.trace(lc.GL_TEXTURES, `Prepared video ${prepared.index} for smooth transition (duration: ${prepared.duration.toFixed(2)}s)`)
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

      // Select initial video with timing calculation
      const prepared = selectVideoWithTiming(0, [], state.videos, true)
      const recentIndices = [prepared.index]

      // Wait for video to have enough data
      if (prepared.video.video.readyState < 3) {
        log.trace(lc.GL_TEXTURES, `Video ${prepared.index} not ready (readyState=${prepared.video.video.readyState}), waiting...`)

        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (prepared.video.video.readyState >= 3) resolve()
            else setTimeout(checkReady, ms('0.1s'))
          }
          checkReady()
        })
      }

      if ('uniforms' in activeBuffer.material) {
        // ShaderMaterial
        activeBuffer.material.uniforms.videoTexture.value = prepared.video.texture
        activeBuffer.material.uniforms.opacity.value = opacity
      } else {
        // Fallback for MeshBasicMaterial
        activeBuffer.material.map = prepared.video.texture
        activeBuffer.material.opacity = opacity
      }
      activeBuffer.material.needsUpdate = true

      // Apply the calculated timing
      prepared.video.video.currentTime = prepared.startTime
      await prepared.video.video.play()

      // Store timing info in active buffer for update() to use
      activeBuffer._plannedStartTime = prepared.startTime
      activeBuffer._plannedDuration = prepared.duration
      activeBuffer._plannedVideoIndex = prepared.index

      log.debug(lc.GL_TEXTURES, `Started with video ${prepared.index}, duration: ${prepared.duration}s`)

      // Start preparing next video in background
      const newState = {
        ...state,
        currentIndex: prepared.index,
        recentIndices,
        currentDuration: prepared.duration,
        timeSinceSwitch: 0, // Will be calculated based on video position in update()
        isPlaying: true,
      }

      isTransitioning = false

      // Prepare next video when halfway through current one
      setTimeout(() => prepareNextVideo(newState), prepared.duration * 500) // 50% through

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

        if ('uniforms' in activeBuffer.material && 'uniforms' in hiddenBuffer.material) {
          // ShaderMaterial
          activeBuffer.material.uniforms.opacity.value = opacity
          hiddenBuffer.material.uniforms.opacity.value = 0
        } else {
          // Fallback for MeshBasicMaterial
          activeBuffer.material.opacity = opacity
          hiddenBuffer.material.opacity = 0
        }
        activeBuffer.material.needsUpdate = true
        hiddenBuffer.material.needsUpdate = true

        updatedRecentIndices = updateRecentIndices(state.recentIndices, nextIndex, antiRepeat)
      } else {
        // Fallback: preparation failed, so prepare video now
        log.debug(lc.GL_TEXTURES, `Fallback transition (no prepared video)`)

        // Select video with timing calculation once
        const prepared = selectVideoWithTiming(
          state.currentIndex,
          state.recentIndices,
          state.videos,
        )

        nextIndex = prepared.index
        duration = prepared.duration
        updatedRecentIndices = updateRecentIndices(state.recentIndices, nextIndex, antiRepeat)

        // Swap buffers
        const temp = activeBuffer
        activeBuffer = hiddenBuffer
        hiddenBuffer = temp

        // Set up new video with calculated timing
        if ('uniforms' in activeBuffer.material && 'uniforms' in hiddenBuffer.material) {
          // ShaderMaterial
          activeBuffer.material.uniforms.videoTexture.value = prepared.video.texture
          activeBuffer.material.uniforms.opacity.value = opacity
          hiddenBuffer.material.uniforms.opacity.value = 0
        } else {
          // Fallback for MeshBasicMaterial
          activeBuffer.material.map = prepared.video.texture
          activeBuffer.material.opacity = opacity
          hiddenBuffer.material.opacity = 0
        }
        activeBuffer.material.needsUpdate = true
        hiddenBuffer.material.needsUpdate = true

        // Apply the timing calculated once
        prepared.video.video.currentTime = prepared.startTime
        await prepared.video.video.play()

        // Store timing info in active buffer for update() to use
        activeBuffer._plannedStartTime = prepared.startTime
        activeBuffer._plannedDuration = prepared.duration
        activeBuffer._plannedVideoIndex = prepared.index
      }

      // Reset preparation state
      nextVideoPrepared = false
      preparedVideoIndex = -1

      const newState = {
        ...state,
        currentIndex: nextIndex,
        recentIndices: updatedRecentIndices,
        currentDuration: duration,
        timeSinceSwitch: 0, // Will be calculated based on video position in update()
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

    const currentVideo = playbackState.videos[playbackState.currentIndex]
    if (!currentVideo) return

    // Calculate elapsed time based on actual video position vs expected start time
    const expectedStartTime = activeBuffer._plannedStartTime || 0
    const videoElapsedTime = currentVideo.video.currentTime - expectedStartTime

    // Handle video looping (currentTime < startTime means video looped)
    const hasLooped = currentVideo.video.currentTime < expectedStartTime
    const shouldTransition = hasLooped || (videoElapsedTime >= playbackState.currentDuration)

    if (shouldTransition) {
      log.debug(
        lc.GL_TEXTURES,
        `Video transition triggered: ${hasLooped ? 'looped' : 'duration exceeded'} (elapsed: ${videoElapsedTime.toFixed(2)}s, expected: ${
          playbackState.currentDuration.toFixed(2)
        }s)`,
      )
      playbackState = await transitionToNextVideo(playbackState)
    } else {
      // Update timeSinceSwitch for debug/display purposes (but don't use it for switching logic)
      playbackState = {
        ...playbackState,
        timeSinceSwitch: videoElapsedTime * 1000,
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
    handleResize: () => {},
    getDebugInfo: () => {
      const currentVideo = playbackState.videos[playbackState.currentIndex]
      const currentVideoName = currentVideo?.video?.src?.split('/').pop() || 'Unknown'
      const currentVideoSrc = currentVideo?.video?.src || ''
      const fullVideoDuration = currentVideo?.video?.duration || 0
      const currentPlaybackPosition = currentVideo?.video?.currentTime || 0

      // Calculate the actual segment start time from when the video began playing
      const segmentStartTime = currentPlaybackPosition - (playbackState.timeSinceSwitch / 1000)

      // Get next prepared video name
      const nextPreparedVideo = nextVideoPrepared && preparedVideoIndex >= 0 ? playbackState.videos[preparedVideoIndex] : null
      const nextPreparedVideoName = nextPreparedVideo?.video?.src?.split('/').pop() || null

      return {
        isPlaying: playbackState.isPlaying,
        currentVideoIndex: playbackState.currentIndex,
        currentVideoName,
        currentVideoSrc,
        timeSinceSwitch: playbackState.timeSinceSwitch,
        currentDuration: playbackState.currentDuration,
        fullVideoDuration,
        videoStartTime: segmentStartTime, // Fixed: actual segment start time
        totalVideos: playbackState.videos.length,
        recentIndices: playbackState.recentIndices,
        nextPreparedIndex: nextVideoPrepared ? preparedVideoIndex : null,
        nextPreparedVideoName,
        isTransitioning,
        loadingProgress: {
          loaded: playbackState.videos.length,
          total: playbackState.videos.length, // This would need to be enhanced with manifest info
          hasMoreToLoad: false, // This would need to be enhanced with loader state
        },
      }
    },
  }
}
