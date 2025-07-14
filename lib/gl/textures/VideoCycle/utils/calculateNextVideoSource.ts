import { pipe } from '@lib/utils/pipe.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }

// the video source calculation input
type VideoSourceInput = {
  // current video manifest index
  readonly currentIndex: number
  // recently played video indices to avoid
  readonly recentIndices: readonly number[]
  // manifest of available video files
  readonly manifest: readonly string[]
  // base video path
  readonly basePath: string
}

// the result of calculating next video source
type VideoSourceResult = {
  // the calculated manifest index to load
  readonly manifestIndex: number
  // the full video file path
  readonly videoPath: string
  // the video filename
  readonly filename: string
  // updated recent indices including this selection
  readonly updatedRecentIndices: readonly number[]
}

/**
 * Calculates which video source to load next based on anti-repetition rules
 *
 * Pure function that determines next video index avoiding recent selections
 */
export const calculateNextVideoSource = (input: VideoSourceInput): VideoSourceResult => {
  const { currentIndex, recentIndices, manifest, basePath } = input
  const { cycling: { antiRepeat } } = videoCycleConfig

  if (manifest.length === 0) {
    return {
      manifestIndex: 0,
      videoPath: '',
      filename: '',
      updatedRecentIndices: recentIndices,
    }
  }

  if (manifest.length === 1) {
    return {
      manifestIndex: 0,
      videoPath: `${basePath}${manifest[0]}`,
      filename: manifest[0],
      updatedRecentIndices: [0],
    }
  }

  const calculateAvoidIndices = (current: number, recent: readonly number[]): readonly number[] => [current, ...recent].slice(0, antiRepeat)

  const selectRandomIndex = (avoid: readonly number[], total: number): number => {
    if (avoid.length >= total - 1) {
      // fallback: just avoid current index
      let nextIndex: number
      do {
        nextIndex = Math.floor(Math.random() * total)
      } while (nextIndex === currentIndex)
      return nextIndex
    }

    let nextIndex: number
    do {
      nextIndex = Math.floor(Math.random() * total)
    } while (avoid.includes(nextIndex))

    return nextIndex
  }

  const updateRecentIndices = (recent: readonly number[], newIndex: number): readonly number[] => [newIndex, ...recent].slice(0, antiRepeat)

  return pipe(
    calculateAvoidIndices(currentIndex, recentIndices),
    (avoidIndices) => selectRandomIndex(avoidIndices, manifest.length),
    (selectedIndex) => ({
      manifestIndex: selectedIndex,
      videoPath: `${basePath}${manifest[selectedIndex]}`,
      filename: manifest[selectedIndex],
      updatedRecentIndices: updateRecentIndices(recentIndices, selectedIndex),
    }),
  )
}
