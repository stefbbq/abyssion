import * as Three from 'three'

import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }

/**
 * Represents a video pool for efficient memory management
 * Contains 2-3 video elements that dynamically load different sources
 */
export type VideoPool = {
  /** The video elements in the pool */
  videos: readonly HTMLVideoElement[]
  /** The textures for each video element */
  textures: readonly Three.VideoTexture[]
  /** The remaining manifest */
  manifest: readonly string[]
}

/**
 * @description
 * Updates a video pool by creating and loading a specified number of new video elements and their textures.
 * The function only resolves once all new videos are fully loaded (canplaythrough event).
 *
 * @param videoPool The current video pool
 * @param countToLoad The number of new videos to create and load
 * @returns {Promise<VideoPool>} A promise that resolves to the updated video pool after all new videos are loaded
 */
export const updateVideoPool = async (
  videoPool: VideoPool,
  countToLoad: number = 3,
): Promise<VideoPool> => {
  log.debug(lc.GL_VIDEO, `Updating video pool with ${countToLoad} videos`)
  log.debug(lc.GL_VIDEO, 'Manifest', videoPool.manifest)

  const newVideos: HTMLVideoElement[] = Array.from({ length: countToLoad }, (_, i) => {
    log.debug(lc.GL_VIDEO, `Creating video ${i + 1} of ${countToLoad}`)
    log.debug(lc.GL_VIDEO, `Video path: ${videoPool.manifest[i]}`)

    const video = document.createElement('video')
    video.autoplay = false
    video.loop = true
    video.muted = true
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    video.preload = 'auto'
    video.playbackRate = videoCycleConfig.cycling.playbackSpeed
    video.src = `/videos/${videoPool.manifest[i]}`
    return video
  })

  const newTextures: Three.VideoTexture[] = newVideos.map((video) => {
    const texture = new Three.VideoTexture(video)
    texture.minFilter = Three.LinearFilter
    texture.magFilter = Three.LinearFilter
    texture.format = Three.RGBAFormat
    return texture
  })

  const remainingManifest = videoPool.manifest.slice(countToLoad)

  // Wait for all new videos to be fully loaded (canplaythrough)
  await Promise.all(
    newVideos.map(
      (video) =>
        new Promise<void>((resolve) => {
          const onCanPlayThrough = () => {
            video.removeEventListener('canplaythrough', onCanPlayThrough)
            resolve()
          }
          video.addEventListener('canplaythrough', onCanPlayThrough)
        }),
    ),
  )

  return {
    videos: [...videoPool.videos, ...newVideos],
    textures: [...videoPool.textures, ...newTextures],
    manifest: remainingManifest,
  }
}
