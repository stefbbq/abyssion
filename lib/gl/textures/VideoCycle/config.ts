/**
 * Configuration for the VideoCycle module
 */
export const VIDEO_CYCLE_CONFIG = {
  enabled: true,
  cycling: {
    minVideoLength: 1, // Minimum video display time in seconds
    maxVideoLength: 3, // Maximum video display time in seconds
    playbackSpeed: 1, // Playback speed of videos (1 = normal speed)
    antiRepeat: 2, // How many videos to remember to avoid repeating too soon
  },
  appearance: {
    opacity: 0.5, // Opacity of the video background
  },
  position: {
    z: -10, // Z position of the video plane
    scale: 1.1, // Scale factor for the video plane
  },
  videos: {
    path: '/videos/', // Path to video directory
  },
}
