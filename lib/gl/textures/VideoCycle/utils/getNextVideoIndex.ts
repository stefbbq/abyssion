import { VIDEO_CYCLE_CONFIG } from '../config.ts'

export function getNextVideoIndex(currentIndex: number, recentIndices: number[], totalVideos: number): number {
  if (totalVideos <= 1) return 0
  const indicesToAvoid = [currentIndex, ...recentIndices].slice(0, VIDEO_CYCLE_CONFIG.cycling.antiRepeat)

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
