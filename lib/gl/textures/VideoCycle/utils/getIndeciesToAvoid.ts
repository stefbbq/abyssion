import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfigRaw from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoCycleConfig } from '@libgl/configVideoCycle.types.ts'

const videoCycleConfig = videoCycleConfigRaw as unknown as VideoCycleConfig
const { cycling: { antiRepeat } } = videoCycleConfig

/**
 * @description
 * Calculates the indices to avoid based on the current index and recent indices
 *
 * @param current - The current index
 * @param recent - The recent indices
 * @returns The indices to avoid
 */
export const getIndeciesToAvoid = (current: number, recent: readonly number[]): readonly number[] => {
  const avoidIndices = [current, ...recent].slice(0, antiRepeat)
  log.debug(lc.GL_VIDEO, 'Avoid indices:', avoidIndices)

  return [current, ...recent].slice(0, antiRepeat)
}
