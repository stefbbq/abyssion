import * as Three from 'three'

import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfigRaw from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoCycleConfig } from '@libgl/configVideoCycle.types.ts'

const videoCycleConfig = videoCycleConfigRaw as unknown as VideoCycleConfig

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
  log.trace(lc.GL_VIDEO, `Updating video pool with %c${countToLoad} video(s)%c`, 'font-weight: bold', 'font-weight: normal')
  log.trace(lc.GL_VIDEO, `Videos remaining in manifest: %c${videoPool.manifest.length}%c`, 'font-weight: bold', 'font-weight: normal')

  const newVideos: HTMLVideoElement[] = Array.from({ length: countToLoad }, (_, i) => {
    log.trace(
      lc.GL_VIDEO,
      `Creating video ${i + 1} of ${countToLoad} with path %c${videoPool.manifest[i]}%c`,
      'font-weight: bold',
      'font-weight: normal',
    )

    const video = document.createElement('video')
    video.autoplay = false
    video.loop = false
    video.muted = true
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    video.preload = 'auto'
    video.playbackRate = videoCycleConfig.cycling.playbackSpeed
    // use configured base path for videos
    const basePath = (videoCycleConfig.cycling?.path || '/media/videos/').replace(/\/?$/, '/')
    video.src = `${basePath}${videoPool.manifest[i]}`
    return video
  })

  const newTextures: Three.VideoTexture[] = newVideos.map((video) => {
    const texture = new Three.VideoTexture(video)
    texture.minFilter = Three.LinearFilter
    texture.magFilter = Three.LinearFilter
    texture.format = Three.RGBAFormat
    texture.generateMipmaps = false
    return texture
  })

  const remainingManifest = videoPool.manifest.slice(countToLoad)

  // Wait for all new videos to be fully loaded (100% downloaded)
  await Promise.all(
    newVideos.map(
      (video) =>
        new Promise<void>((resolve, reject) => {
          const videoName = video.src.split('/').pop()

          const checkFullDownload = () => {
            if (
              video.readyState === 4 &&
              video.networkState === 1 // NETWORK_IDLE means download complete
            ) {
              cleanup()
              log.debug(lc.GL_VIDEO, `Video download complete: ${videoName}`)
              resolve()
              return
            }

            // Show progress...
          }

          // Polling backup - check every 500ms in case events don't fire frequently enough
          const pollInterval = setInterval(checkFullDownload, 500)

          const onError = (event: Event) => {
            cleanup()
            log.error(lc.GL_VIDEO, `Video loading error for ${videoName}:`, event)
            reject(new Error(`Video loading error: ${videoName}`))
          }

          const cleanup = () => {
            clearInterval(pollInterval)
            video.removeEventListener('loadedmetadata', checkFullDownload)
            video.removeEventListener('progress', checkFullDownload)
            video.removeEventListener('canplaythrough', checkFullDownload)
            video.removeEventListener('error', onError)
          }

          video.addEventListener('loadedmetadata', checkFullDownload)
          video.addEventListener('progress', checkFullDownload)
          video.addEventListener('canplaythrough', checkFullDownload)
          video.addEventListener('error', onError)

          // In case it's already loaded
          checkFullDownload()
        }),
    ),
  )

  return {
    videos: [...videoPool.videos, ...newVideos],
    textures: [...videoPool.textures, ...newTextures],
    manifest: remainingManifest,
  }
}
