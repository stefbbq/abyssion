/**
 * Video cycle configuration type definitions
 */
export type VideoCycleConfig = {
  mode: 'off' | 'single' | 'cycle'
  cycling: {
    minSegmentLength: number
    maxSegmentLength: number
    playbackSpeed: number
    antiRepeat: number
    videoSwapTimeoutMS: number
    videoLoadTimeoutMS: number
    path: string
  }
  single: {
    path: string
    playbackSpeed: number
    videoLoadTimeoutMS: number
  }
  appearance: {
    opacity: number
  }
  position: {
    z: number
    scale: number
  }
}
