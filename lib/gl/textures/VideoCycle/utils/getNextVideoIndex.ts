import videoCycleConfig from '@lib/configVideoCycle.json' with { type: 'json' }

/**
 * Determines the next video index to play while avoiding recent videos
 *
 * This function implements a smart cycling algorithm that:
 * - Avoids repeating the current video
 * - Avoids recently played videos based on antiRepeat config
 * - Falls back to random selection when most videos are in the avoid list
 */
export const getNextVideoIndex = (currentIndex: number, recentIndices: number[], totalVideos: number): number => {
  const { cycling: { antiRepeat } } = videoCycleConfig
  if (totalVideos <= 1) return 0
  const indicesToAvoid = [currentIndex, ...recentIndices].slice(0, antiRepeat)

  if (indicesToAvoid.length >= totalVideos - 1) {
    let nextIndex

    do {
      nextIndex = Math.floor(Math.random() * totalVideos)
    } while (nextIndex === currentIndex)

    return nextIndex
  }

  let nextIndex

  do {
    nextIndex = Math.floor(Math.random() * totalVideos)
  } while (indicesToAvoid.includes(nextIndex))

  return nextIndex
}
