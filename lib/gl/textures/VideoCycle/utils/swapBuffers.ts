import * as THREE from 'three'
import { lc, log } from '@lib/logger/index.ts'
import type { BufferObject } from '../types.ts'
import ms from 'ms'

type SwapBuffersParams = {
  activeBuffer: BufferObject
  hiddenBuffer: BufferObject
  videos: HTMLVideoElement[]
  currentOpacity: number
  VIDEO_SWAP_TIMEOUT_MS: number
}

/**
 * Swaps the buffers to show the prepared video
 *
 * Ensures the new video starts playing before the visual switch,
 * handles opacity transitions, and manages video pause timing
 */
export const swapBuffers = async (params: SwapBuffersParams): Promise<{
  newActiveBuffer: BufferObject
  newHiddenBuffer: BufferObject
  plannedVideoIndex: number
  plannedDuration: number
  success: boolean
}> => {
  const { activeBuffer, hiddenBuffer, videos, currentOpacity, VIDEO_SWAP_TIMEOUT_MS } = params

  const plannedVideoIndex = hiddenBuffer._plannedVideoIndex
  const plannedStartTime = hiddenBuffer._plannedStartTime
  const plannedDuration = hiddenBuffer._plannedDuration

  if (plannedVideoIndex === undefined || plannedStartTime === undefined || plannedDuration === undefined) {
    console.error(`[${new Date().toLocaleTimeString()}] Critical error: Planned video state not found on hiddenBuffer. Cannot swap.`)
    return {
      newActiveBuffer: activeBuffer,
      newHiddenBuffer: hiddenBuffer,
      plannedVideoIndex: -1,
      plannedDuration: 0,
      success: false,
    }
  }

  const newVideoElement = videos[plannedVideoIndex]

  if (!newVideoElement) {
    console.error(`[${new Date().toLocaleTimeString()}] Video at index ${plannedVideoIndex} not found for new buffer. Cannot swap.`)
    return {
      newActiveBuffer: activeBuffer,
      newHiddenBuffer: hiddenBuffer,
      plannedVideoIndex: -1,
      plannedDuration: 0,
      success: false,
    }
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

    log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Video ${plannedVideoIndex} playing at ${plannedStartTime.toFixed(2)}s`)

    // Capture reference to the video in the currently active buffer (which will become hidden) so we can pause it after the swap
    const oldActiveVideoTexture = activeBuffer.material.map as THREE.VideoTexture | null
    const oldActiveVideoElement = oldActiveVideoTexture ? (oldActiveVideoTexture.image as HTMLVideoElement) : null

    // Swap active and hidden buffer references
    const newActiveBuffer = hiddenBuffer
    const newHiddenBuffer = activeBuffer

    // Update opacities: new active is visible, new hidden is invisible
    newActiveBuffer.material.opacity = currentOpacity
    newHiddenBuffer.material.opacity = 0
    newActiveBuffer.material.needsUpdate = true
    newHiddenBuffer.material.needsUpdate = true

    // Delay pausing the video that is now hidden to avoid a hitch caused by immediate pause()
    if (oldActiveVideoElement && !oldActiveVideoElement.paused) {
      setTimeout(() => {
        oldActiveVideoElement.pause()
        log(
          lc.GL_TEXTURES,
          `[${new Date().toLocaleTimeString()}] (delayed) Paused video in hidden buffer (previously active): ${
            videos.indexOf(oldActiveVideoElement)
          }`,
        )
      }, ms('.5s')) // pause after half a second so decode pipeline stays warm during the swap frame
    }

    log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Swapped to video ${plannedVideoIndex}.`)

    return {
      newActiveBuffer,
      newHiddenBuffer,
      plannedVideoIndex,
      plannedDuration,
      success: true,
    }
  } catch (error) {
    log.error(
      lc.GL_TEXTURES,
      `[${new Date().toLocaleTimeString()}] Error playing or timeout for video ${plannedVideoIndex} during swap: `,
      error,
    )
    return {
      newActiveBuffer: activeBuffer,
      newHiddenBuffer: hiddenBuffer,
      plannedVideoIndex: -1,
      plannedDuration: 0,
      success: false,
    }
  }
}
