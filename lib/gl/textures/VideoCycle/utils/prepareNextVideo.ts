import * as THREE from 'three'
import { lc, log } from '@lib/logger/index.ts'
import { VIDEO_CYCLE_CONFIG } from '../config.ts'
import { getNewStartTimeAndDuration } from './getNewStartTimeAndDuration.ts'
import { getNextVideoIndex } from './getNextVideoIndex.ts'
import type { BufferObject } from '../types.ts'

/**
 * Prepares the hidden buffer with the next video
 *
 * Attempts to find a suitable video, seek to a random position,
 * start playback, and configure the hidden buffer for seamless switching
 */
export const prepareNextVideo = async (
  initialIndex: number,
  videos: HTMLVideoElement[],
  videoTextures: THREE.VideoTexture[],
  currentVideoIndex: number,
  recentVideoIndices: number[],
  hiddenBuffer: BufferObject,
  PREPARE_PREROLL_MS: number,
): Promise<number> => {
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

    log(lc.GL_TEXTURES, `Preparing video ${videoIndex}, readyState: ${video.readyState}, rez: ${video.videoWidth}x${video.videoHeight}`)

    // Check readiness
    if (video.readyState < 3 || isNaN(video.duration) || video.videoWidth <= 0) {
      console.warn(`Video ${videoIndex} is not ready or has invalid duration/size`)
      videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
      attempts++
      continue
    }

    let startTime = 0
    let duration = 0

    try {
      // Request the actual visible duration we want (without preroll padding)
      const result = await getNewStartTimeAndDuration(
        video,
        VIDEO_CYCLE_CONFIG.cycling.minVideoLength,
        VIDEO_CYCLE_CONFIG.cycling.maxVideoLength,
      )
      startTime = result.startTime
      duration = result.duration

      if (duration < VIDEO_CYCLE_CONFIG.cycling.minVideoLength) {
        console.warn(`[${new Date().toLocaleTimeString()}] Not enough time left in video ${videoIndex} after seeking. Skipping.`)
        videoIndex = getNextVideoIndex(currentVideoIndex, [...recentVideoIndices, ...triedIndices], videos.length)
        attempts++
        continue
      }

      console.log(`🎬 About to play video ${videoIndex} from ${video.currentTime.toFixed(2)}s (should be ${startTime.toFixed(2)}s)`)
      await video.play().catch(() => {})
      console.log(`▶️ Video ${videoIndex} playing from ${video.currentTime.toFixed(2)}s`)

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
    return -1 // le fail
  }
  return videoIndex
}
