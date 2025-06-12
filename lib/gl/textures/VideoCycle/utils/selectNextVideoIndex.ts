/**
 * Selects next video index avoiding recent ones using randomization with fallback
 *
 * @example
 * const nextIndex = selectNextVideoIndex(2, [1, 2], 5, 3)
 */
export const selectNextVideoIndex = (
  currentIndex: number,
  recentIndices: readonly number[],
  totalVideos: number,
): number => {
  if (totalVideos <= 1) return 0

  let nextIndex = currentIndex
  let attempts = 0

  // Try random selection avoiding recent indices
  while ((nextIndex === currentIndex || recentIndices.includes(nextIndex)) && attempts < totalVideos) {
    nextIndex = Math.floor(Math.random() * totalVideos)
    attempts++
  }

  // Fallback to sequential if random selection fails
  if (nextIndex === currentIndex) {
    nextIndex = (currentIndex + 1) % totalVideos
  }

  return nextIndex
}
