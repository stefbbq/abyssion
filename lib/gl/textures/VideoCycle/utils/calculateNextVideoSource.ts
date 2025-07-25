import type { VideoSelectionInput, VideoSelection } from '../types.ts'

/**
 * Calculates the next video source using anti-repetition logic
 * 
 * This pure function selects the next video to play from the manifest while
 * avoiding recently played videos. It uses random selection from available
 * videos that haven't been played recently according to the anti-repeat threshold.
 * 
 * @param input - Video selection parameters including current state and manifest
 * @returns Video selection with index, filename, and full URL
 * 
 * @example
 * const selection = calculateNextVideoSource({
 *   currentIndex: 2,
 *   recentIndices: [0, 1, 2],
 *   manifest: ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4'],
 *   basePath: '/static/videos/',
 *   antiRepeatCount: 2
 * })
 * // Returns: { index: 3, filename: 'video4.mp4', url: '/static/videos/video4.mp4' }
 */
export const calculateNextVideoSource = (input: VideoSelectionInput): VideoSelection => {
  const {
    currentIndex,
    recentIndices,
    manifest,
    basePath,
    antiRepeatCount
  } = input

  // If manifest is empty, return current index (fallback)
  if (manifest.length === 0) {
    return {
      index: currentIndex,
      filename: '',
      url: basePath
    }
  }

  // If only one video available, return it
  if (manifest.length === 1) {
    return {
      index: 0,
      filename: manifest[0],
      url: basePath + manifest[0]
    }
  }

  // Get the most recent videos to avoid (limited by antiRepeatCount)
  const videosToAvoid = new Set(recentIndices.slice(-antiRepeatCount))
  
  // Find available videos (not in recent list)
  const availableIndices: number[] = []
  for (let i = 0; i < manifest.length; i++) {
    if (!videosToAvoid.has(i)) {
      availableIndices.push(i)
    }
  }

  // If no videos are available (all are recent), fall back to any video except current
  let candidateIndices = availableIndices
  if (candidateIndices.length === 0) {
    candidateIndices = []
    for (let i = 0; i < manifest.length; i++) {
      if (i !== currentIndex) {
        candidateIndices.push(i)
      }
    }
  }

  // If still no candidates (only one video total), use current
  if (candidateIndices.length === 0) {
    candidateIndices = [currentIndex]
  }

  // Select random video from candidates
  const randomIndex = Math.floor(Math.random() * candidateIndices.length)
  const selectedIndex = candidateIndices[randomIndex]
  const selectedFilename = manifest[selectedIndex]

  return {
    index: selectedIndex,
    filename: selectedFilename,
    url: basePath + selectedFilename
  }
}