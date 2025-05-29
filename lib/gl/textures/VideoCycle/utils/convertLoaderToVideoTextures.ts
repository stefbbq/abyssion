import type { VideoLoader, VideoTexture } from '../VideoCycle.d.ts'

/**
 * Converts video loader results to VideoTexture array
 *
 * @example
 * const videoTextures = convertLoaderToVideoTextures(loader)
 */
export const convertLoaderToVideoTextures = (loader: VideoLoader): VideoTexture[] =>
  loader.videos.map((video, index) => ({
    video,
    texture: loader.videoTextures[index],
  }))
