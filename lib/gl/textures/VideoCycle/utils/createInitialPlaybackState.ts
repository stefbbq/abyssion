import type { PlaybackState, VideoTexture } from '../VideoCycle.d.ts'
import { shouldStartPlayback } from './shouldStartPlayback.ts'

/**
 * Creates initial playback state from available videos
 *
 * @example
 * const state = createInitialPlaybackState(videos)
 */
export const createInitialPlaybackState = (videos: VideoTexture[]): PlaybackState => ({
  videos,
  currentIndex: -1,
  recentIndices: [],
  timeSinceSwitch: 0,
  currentDuration: 10,
  isPlaying: shouldStartPlayback(videos.length, false),
})
