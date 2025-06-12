import { lc, log } from '@lib/logger/index.ts'
import { loadVideos } from './loadVideos.ts'
import { convertLoaderToVideoTextures } from './convertLoaderToVideoTextures.ts'
import { addVideosToQueue } from './addVideosToQueue.ts'
import type { VideoLoader, VideoTexture } from '../types.ts'
import ms from 'ms'

/**
 * Creates a stream of video loading events
 *
 * Loads initial batch immediately, then continues loading in background
 * Returns an async generator that yields video arrays as they become available
 */
export const createVideoLoadingStream = async function* (): AsyncGenerator<VideoTexture[], void, unknown> {
  const loader: VideoLoader = await loadVideos()

  // Yield initial batch
  const initialVideos = convertLoaderToVideoTextures(loader)
  if (initialVideos.length > 0) {
    log(lc.GL_TEXTURES, `Initial videos loaded: ${initialVideos.length}`)
    yield initialVideos
  }

  // Background loading with delay
  await new Promise((resolve) => setTimeout(resolve, ms('2s')))

  let currentQueue = initialVideos

  while (loader.hasMoreVideos()) {
    const result = await loader.loadNextVideo()

    if (result.video && result.texture) {
      const newVideo: VideoTexture = {
        video: result.video,
        texture: result.texture,
      }

      currentQueue = addVideosToQueue(currentQueue, [newVideo])
      log.trace(lc.GL_TEXTURES, `Background video loaded. Total: ${currentQueue.length}`)
      yield currentQueue
    }

    // Throttle background loading
    await new Promise((resolve) => setTimeout(resolve, ms('500ms')))
  }
}
