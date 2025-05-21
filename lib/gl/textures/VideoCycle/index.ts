import * as THREE from 'three'
import { lc, log } from '@lib/logger/index.ts'
import { VIDEO_CYCLE_CONFIG } from './config.ts'
import { debugVideoAccess } from './utils/debugVideoAccess.ts'
import { createVideoPlane } from './utils/createVideoPlane.ts'
import { calculateScale } from './utils/calculateScale.ts'
import { loadVideo } from './utils/loadVideo.ts'
import { isVideoReady as _isVideoReady } from './utils/isVideoReady.ts'
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { getNextVideoIndex } from './utils/getNextVideoIndex.ts'
import type { VideoBackgroundManager } from '../../types.ts'

type BufferObject = {
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  geometry: THREE.PlaneGeometry
  _plannedStartTime?: number
  _plannedDuration?: number
  _plannedVideoIndex?: number
  _playStartTime?: number // timestamp (ms) when play() resolved for preroll tracking
}

export const createVideoCycle = async (
  THREE: typeof import('three'),
  scene: THREE.Scene,
): Promise<VideoBackgroundManager> => {
  // Try to debug server access first
  const workingPath = await debugVideoAccess()

  if (workingPath) {
    log(lc.GL, `Using detected working path: ${workingPath}`)
    VIDEO_CYCLE_CONFIG.videos.path = workingPath
  } else {
    log.warn(lc.GL, '⚠️ Could not detect a working path for videos. Server configuration issue likely.')
    log.warn(lc.GL, 'Try checking: 1) CORS settings 2) Static file serving 3) MIME types for .webm')
  }

  const videos: HTMLVideoElement[] = []
  const videoTextures: THREE.VideoTexture[] = []
  let currentVideoIndex = 0
  let nextVideoIndex = 0
  let recentVideoIndices: number[] = []
  let timeSinceLastSwitch = 0
  const currentOpacity = VIDEO_CYCLE_CONFIG.appearance.opacity
  const VIDEO_SWAP_TIMEOUT_MS = 1000
  const PREPARE_PREROLL_MS = 500 // allow hidden video to decode more frames before considering ready
  const PREROLL_SECONDS = 2 // ensure the next video has played for at least this long hidden
  const PREROLL_MIN_PROGRESS = 0.15 // relax: require ~3 frames of progress at 24fps
  let switchDuration = 10

  // Create two layers - one visible, one hidden for buffering
  const frontBuffer = createVideoPlane(THREE, scene)
  const backBuffer = createVideoPlane(THREE, scene)

  // Track which buffer is currently visible
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer

  // Update scale on window resize
  const handleResize = () => {
    calculateScale(frontBuffer)
    calculateScale(backBuffer)
  }

  // Add resize event listener
  globalThis.addEventListener('resize', handleResize)

  // Initialize both buffers
  calculateScale(frontBuffer)
  calculateScale(backBuffer)

  // Ensure the active buffer is visible from the start
  activeBuffer.material.opacity = currentOpacity
  activeBuffer.material.needsUpdate = true

  /**
   * Prepare the hidden buffer with the next video
   */
  const prepareNextVideo = async (initialIndex: number): Promise<number> => {
    const maxAttempts = videos.length
    let attempts = 0
    const triedIndices: number[] = []
    let videoIndex = initialIndex
    let found = false

    while (attempts < maxAttempts) {
      if (videoIndex < 0 || videoIndex >= videos.length || triedIndices.includes(videoIndex)) {
        videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
        attempts++
        continue
      }

      triedIndices.push(videoIndex)

      const texture = videoTextures[videoIndex]
      const video = videos[videoIndex]

      if (!video || !texture) {
        log.warn(lc.GL_TEXTURES, `Video or texture at index ${videoIndex} is not available`)
        videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
        attempts++
        continue
      }

      log(
        lc.GL_TEXTURES,
        `Trying to prepare video ${videoIndex}, readyState: ${video.readyState}, rez: ${video.videoWidth}x${video.videoHeight}`,
      )

      // Check readiness
      if (video.readyState < 3 || isNaN(video.duration) || video.videoWidth <= 0) {
        console.warn(`Video ${videoIndex} is not ready or has invalid duration/size`)
        videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
        attempts++
      }

      let startTime = 0
      let duration = 0

      try {
        const result = await getNewStartTimeAndDuration(
          video,
          VIDEO_CYCLE_CONFIG.cycling.minVideoLength + PREROLL_SECONDS,
          VIDEO_CYCLE_CONFIG.cycling.maxVideoLength + PREROLL_SECONDS,
        )
        startTime = result.startTime
        duration = result.duration

        if (duration < VIDEO_CYCLE_CONFIG.cycling.minVideoLength) {
          console.warn(`[${new Date().toLocaleTimeString()}] Not enough time left in video ${videoIndex} after seeking. Skipping.`)
          videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
          attempts++
          continue
        }

        // Visible duration excludes preroll period
        const visibleDuration = duration - PREROLL_SECONDS
        switchDuration = visibleDuration
        video.currentTime = startTime
        await video.play().catch(() => {})
        // Give the video a bit more time to decode frames before we mark the buffer ready
        await new Promise((resolve) => setTimeout(resolve, PREPARE_PREROLL_MS))

        // Record the moment play was initiated for preroll timing
        hiddenBuffer._playStartTime = Date.now()

        // Swap in the NEW texture but first capture the previous one so we pause the correct video
        const previousTexture = hiddenBuffer.material.map as THREE.VideoTexture | null

        hiddenBuffer.material.map = texture
        hiddenBuffer.material.needsUpdate = true

        // Pause the *previous* hidden buffer's video (now no longer referenced)
        if (previousTexture) {
          const prevVideoIdx = videoTextures.indexOf(previousTexture)
          if (prevVideoIdx !== -1 && videos[prevVideoIdx]) {
            videos[prevVideoIdx].pause()
            log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Paused previous hidden video at index ${prevVideoIdx}`)
          }
        }

        log(
          lc.GL_TEXTURES,
          `[${new Date().toLocaleTimeString()}] Prepared next video index ${videoIndex}: will start at ${startTime.toFixed(2)}s, play for ${
            duration.toFixed(2)
          }s`,
        )
        hiddenBuffer._plannedStartTime = startTime
        hiddenBuffer._plannedDuration = duration
        hiddenBuffer._plannedVideoIndex = videoIndex

        found = true
        break
      } catch (error) {
        log.error(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Error seeking to random position:`, error)
        videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
        attempts++
        continue
      }
    }

    if (!found) {
      log.error(lc.GL, 'Failed to prepare any valid next video')
      return -1 // Indicate failure
    }
    return videoIndex
  }

  /**
   * Swap the buffers to show the prepared video, ensuring the new video starts playing before the visual switch.
   */
  const swapBuffers = async () => {
    const plannedVideoIndex = hiddenBuffer._plannedVideoIndex
    const plannedStartTime = hiddenBuffer._plannedStartTime
    const plannedDuration = hiddenBuffer._plannedDuration
    const newVideoElement = videos[plannedVideoIndex]

    if (plannedVideoIndex === undefined || plannedStartTime === undefined || plannedDuration === undefined) {
      console.error(`[${new Date().toLocaleTimeString()}] Critical error: Planned video state not found on hiddenBuffer. Cannot swap.`)
      nextVideoIndex = -1 // Force re-preparation
      return
    }

    if (!newVideoElement) {
      console.error(`[${new Date().toLocaleTimeString()}] Video at index ${plannedVideoIndex} not found for new buffer. Cannot swap.`)
      nextVideoIndex = -1 // Force re-preparation
      return
    }

    try {
      await Promise.race([
        newVideoElement.play(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Video ${plannedVideoIndex} play timed out after ${VIDEO_SWAP_TIMEOUT_MS}ms`)),
            VIDEO_SWAP_TIMEOUT_MS,
          )
        ),
      ])

      log(
        lc.GL_TEXTURES,
        `[${new Date().toLocaleTimeString()}] Play initiated for video ${plannedVideoIndex} at ${plannedStartTime.toFixed(2)}s`,
      )

      // Capture reference to the video in the currently active buffer (which will become hidden) so we can pause it after the swap
      const oldActiveVideoTexture = activeBuffer.material.map as THREE.VideoTexture | null
      const oldActiveVideoElement = oldActiveVideoTexture ? (oldActiveVideoTexture.image as HTMLVideoElement) : null

      // Swap active and hidden buffer references
      const temp = activeBuffer
      activeBuffer = hiddenBuffer
      hiddenBuffer = temp

      // Update opacities: new active is visible, new hidden is invisible
      activeBuffer.material.opacity = currentOpacity
      hiddenBuffer.material.opacity = 0
      activeBuffer.material.needsUpdate = true
      hiddenBuffer.material.needsUpdate = true

      // Delay pausing the video that is now hidden to avoid a hitch caused by immediate pause()
      if (oldActiveVideoElement && !oldActiveVideoElement.paused) {
        setTimeout(() => {
          oldActiveVideoElement.pause()
          log(
            lc.GL_TEXTURES,
            `[${new Date().toLocaleTimeString()}] (delayed) Paused video in hidden buffer (previously active): ${
              videos.indexOf(
                oldActiveVideoElement,
              )
            }`,
          )
        }, 500) // pause after 0.5 s so decode pipeline stays warm during the swap frame
      }

      // Update current video state
      currentVideoIndex = plannedVideoIndex
      // visible play time excludes the preroll seconds already consumed while hidden
      switchDuration = plannedDuration - PREROLL_SECONDS
      timeSinceLastSwitch = 0 // Reset timer for the new video

      log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Swapped to video ${currentVideoIndex}.`)
      log(lc.GL_TEXTURES, `New switchDuration: ${switchDuration.toFixed(2)}s (from hiddenBuffer preparation)`)

      const candidateForNext = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)

      prepareNextVideo(candidateForNext).then((preparedIdx) => {
        nextVideoIndex = preparedIdx
        if (preparedIdx === -1) log.warn(lc.GL, `[${new Date().toLocaleTimeString()}] prepareNextVideo failed. Cycling may pause/skip.`)
      })
    } catch (e) {
      log.error(
        lc.GL_TEXTURES,
        `[${new Date().toLocaleTimeString()}] Error playing or timeout for video ${plannedVideoIndex} during swap: `,
        e,
      )
      nextVideoIndex = -1 // Force re-preparation of a (potentially different) video
    }
  }

  /**
   * Load videos from the videos directory using manifest
   */
  const loadVideos = async () => {
    try {
      log(lc.GL_TEXTURES, 'Loading video backgrounds...')
      const manifestPath = `${VIDEO_CYCLE_CONFIG.videos.path}manifest.json`
      let videoFiles: string[] = []

      try {
        const response = await fetch(manifestPath)

        if (!response.ok) throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)

        const manifest = await response.json()

        if (Array.isArray(manifest)) {
          videoFiles = manifest.map((video: any) => {
            if (typeof video === 'string') return video
            else if (video && video.file) return video.file
            return null
          }).filter(Boolean)
        }
      } catch (error) {
        console.error('Error loading video manifest:', error)
      }

      if (videoFiles.length === 0) {
        console.warn('No video files found in manifest')
        return
      }

      log(lc.GL_TEXTURES, `Found ${videoFiles.length} videos in manifest`)

      // Try to load each video
      for (const file of videoFiles) {
        const videoPath = `${VIDEO_CYCLE_CONFIG.videos.path}${file}`
        log(lc.GL_TEXTURES, `Attempting to load video: ${videoPath}`)

        const { video, texture, success } = await loadVideo(videoPath)

        if (success && texture) {
          videos.push(video)
          videoTextures.push(texture)
        }
      }

      log(lc.GL_TEXTURES, `Successfully loaded ${videos.length} of ${videoFiles.length} videos`)

      if (videos.length === 0) {
        console.error('Failed to load any videos from any paths')
        return
      }

      // Set up initial video on the active buffer
      if (videos.length > 0 && videoTextures.length > 0) {
        // Choose a random video to start with
        currentVideoIndex = Math.floor(Math.random() * videos.length)
        recentVideoIndices = [currentVideoIndex] // Initialize recent indices

        // Set initial texture on active buffer
        const initialVideo = videos[currentVideoIndex]
        const initialTexture = videoTextures[currentVideoIndex]

        activeBuffer.material.map = initialTexture
        activeBuffer.material.opacity = currentOpacity // Make the initial active buffer visible
        activeBuffer.material.needsUpdate = true
        log(lc.GL, '✅ Video texture assigned to material for initial video')

        // Ensure we have a video and texture to play
        if (initialVideo && initialTexture) {
          try {
            const startTime = await seekToRandomPosition(initialVideo, VIDEO_CYCLE_CONFIG.cycling.minVideoLength)
            initialVideo.currentTime = startTime
            await initialVideo.play()
            log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Initial video ${currentVideoIndex} began at ${startTime.toFixed(2)}s`)
          } catch (e) {
            log.error(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Error starting initial video ${currentVideoIndex}:`, e)
          }
        } else {
          // This case should ideally not be reached if videos & videoTextures are populated
          log.warn(lc.GL_TEXTURES, '❌ Initial video or texture missing, cannot start playback.')
        }

        log(lc.GL_TEXTURES, `Initial video set to ${currentVideoIndex}`)

        // Prepare next video on hidden buffer if we have more than one video
        if (videos.length > 1) {
          const candidateIndex = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)
          nextVideoIndex = await prepareNextVideo(candidateIndex) // Store the result
          if (nextVideoIndex === -1) {
            log.warn(
              lc.GL_TEXTURES,
              `[${new Date().toLocaleTimeString()}] Initial prepareNextVideo failed to find a video. Cycling may be impaired.`,
            )
          }
        }
      } else log.warn(lc.GL_TEXTURES, 'No videos could be loaded from the specified directory')
    } catch (error) {
      log.error(lc.GL_TEXTURES, 'Error loading video backgrounds:', error)
    }
  }

  /**
   * Update function called every frame
   */
  const update = async (delta: number) => {
    if (!VIDEO_CYCLE_CONFIG.enabled || videos.length < 2) return

    // Check if it's time to switch videos
    timeSinceLastSwitch += delta

    // Ensure preroll requirement met
    const prerollTimeMet = hiddenBuffer._playStartTime !== undefined && Date.now() - hiddenBuffer._playStartTime >= PREROLL_SECONDS * 1000

    // Make sure the hidden video has actually advanced in playback (decoded frames)
    let prerollProgressMet = false
    const hiddenVideoTex = hiddenBuffer.material.map as THREE.VideoTexture | null
    if (hiddenVideoTex) {
      const hv = hiddenVideoTex.image as HTMLVideoElement
      if (!isNaN(hv.currentTime) && hiddenBuffer._plannedStartTime !== undefined) {
        prerollProgressMet = hv.currentTime - hiddenBuffer._plannedStartTime >= PREROLL_MIN_PROGRESS
      }
    }

    const prerollMet = prerollTimeMet && prerollProgressMet

    // Debug
    if (!prerollMet && prerollTimeMet && !prerollProgressMet) {
      log(
        lc.GL_TEXTURES,
        '⏳ preroll: time met but video progress insufficient',
        ((hiddenVideoTex?.image as HTMLVideoElement | undefined)?.currentTime ?? 0).toFixed(2),
        'planned',
        hiddenBuffer._plannedStartTime?.toFixed(2),
      )
    }

    if (!prerollMet) return

    if (timeSinceLastSwitch >= switchDuration) {
      if (nextVideoIndex !== -1 && nextVideoIndex !== currentVideoIndex) {
        // Swap buffers to show the already-prepared video
        await swapBuffers() // Await the swap, as it now involves async play()

        // Update recent video indices
        recentVideoIndices.unshift(nextVideoIndex) // Use nextVideoIndex as it's now current
        if (recentVideoIndices.length > VIDEO_CYCLE_CONFIG.cycling.antiRepeat) recentVideoIndices.pop()

        currentVideoIndex = nextVideoIndex
        timeSinceLastSwitch = 0

        log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Switched to video ${currentVideoIndex}.`)
        log(lc.GL_TEXTURES, `New switchDuration: ${switchDuration.toFixed(2)}s (from hiddenBuffer preparation)`)

        const candidateForNext = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)

        prepareNextVideo(candidateForNext).then((preparedIdx) => {
          nextVideoIndex = preparedIdx
          if (preparedIdx === -1) {
            log.warn(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] prepareNextVideo failed. Cycling may pause/skip.`)
          }
        })
      } else if (nextVideoIndex === -1) {
        log.warn(
          lc.GL_TEXTURES,
          `[${new Date().toLocaleTimeString()}] Time to switch, but nextVideoIndex is -1 (preparation failed). Attempting to re-prepare.`,
        )
        timeSinceLastSwitch = 0 // Reset timer to avoid rapid re-attempts if prep is slow
        const candidateForNextAfterFailure = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)
        prepareNextVideo(candidateForNextAfterFailure).then((preparedIdx) => {
          nextVideoIndex = preparedIdx
        })
      } else {
        // This case (nextVideoIndex === currentVideoIndex) should ideally not happen if getNextVideoIndex and anti-repeat work correctly.
        // Or it could mean only one video is loaded.
        // Reset timer and try to prepare a different video if possible.
        timeSinceLastSwitch = 0
        if (videos.length > 1) {
          log.warn(
            lc.GL_TEXTURES,
            `[${
              new Date().toLocaleTimeString()
            }] Time to switch, but nextVideoIndex (${nextVideoIndex}) is same as current (${currentVideoIndex}). Attempting to re-prepare.`,
          )
          const candidateForNextSameIndex = getNextVideoIndex(
            currentVideoIndex,
            [...recentVideoIndices, currentVideoIndex],
            videos.length,
          )

          prepareNextVideo(candidateForNextSameIndex).then((preparedIdx) => {
            nextVideoIndex = preparedIdx
          })
        }
      }
    }
  }

  /**
   * Dispose function to clean up resources
   */
  const dispose = () => {
    // Remove event listeners
    globalThis.removeEventListener('resize', handleResize)

    // Remove buffer meshes
    scene.remove(frontBuffer.mesh)
    scene.remove(backBuffer.mesh)
    frontBuffer.geometry.dispose()
    frontBuffer.material.dispose()
    backBuffer.geometry.dispose()
    backBuffer.material.dispose()

    // Dispose textures and stop videos
    videoTextures.forEach((texture) => texture.dispose())
    videos.forEach((video) => {
      video.pause()
      video.src = ''
      video.load()
    })
  }

  // Load videos on initialization
  await loadVideos()

  // Return the manager interface
  return {
    update,
    dispose,
    mesh: activeBuffer.mesh, // Return active mesh for compatibility
  } as VideoBackgroundManager
}
