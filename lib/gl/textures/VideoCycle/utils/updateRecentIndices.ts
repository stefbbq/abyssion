/**
 * Updates recent indices array immutably, maintaining anti-repeat limit
 *
 * @example
 * const updated = updateRecentIndices([1, 2], 3, 3) // [3, 1, 2]
 * const trimmed = updateRecentIndices([1, 2, 4], 3, 2) // [3, 1]
 */
export const updateRecentIndices = (
  current: readonly number[],
  newIndex: number,
  antiRepeatLimit: number,
): readonly number[] => {
  const updated = [newIndex, ...current]
  return updated.length > antiRepeatLimit ? updated.slice(0, antiRepeatLimit) : updated
}
