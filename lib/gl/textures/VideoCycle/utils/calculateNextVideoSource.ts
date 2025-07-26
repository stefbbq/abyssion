/**
 * @description
 * Calculates which video source to load next based on anti-repetition rules
 *
 * @param input - The input object containing the current index, recent indices, manifest, and base path
 * @returns The video source result object containing the manifest index, video path, filename, and updated recent indices
 */
export const selectNextVideoIndex = (availableIndecies: readonly number[], indeciesToAvoid: readonly number[] = []): number => {
  const selectableIndecies = availableIndecies.filter((index) => !indeciesToAvoid.includes(index))

  // if there are no videos, throw
  if (selectableIndecies.length === 0) throw new Error('No videos found')

  // if there is only one video, return that video
  if (selectableIndecies.length === 1) return selectableIndecies[0]

  // if there are multiple videos, select a random index
  return selectableIndecies[Math.floor(Math.random() * selectableIndecies.length)]
}
