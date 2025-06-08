import * as Three from 'three'
import type { RGBColor } from '@libtheme/types.ts'

/**
 * Generate a random color from seed color and randomness percentage
 *
 * @param THREE - Three.js instance
 * @param seedColor - Base RGB color to start from
 * @param randomness - How much to randomize (0.0 = no change, 1.0 = full random)
 * @returns Three.js Color object
 */
export const getRandomColor = (
  THREE: typeof Three,
  seedColor: RGBColor,
  randomness: number = 0.3,
): Three.Color => {
  // calculate random adjustments for each channel
  const rAdjust = (Math.random() - 0.5) * randomness
  const gAdjust = (Math.random() - 0.5) * randomness
  const bAdjust = (Math.random() - 0.5) * randomness

  // apply adjustments and clamp to [0, 1]
  const newR = Math.max(0, Math.min(1, seedColor.r + rAdjust))
  const newG = Math.max(0, Math.min(1, seedColor.g + gAdjust))
  const newB = Math.max(0, Math.min(1, seedColor.b + bAdjust))

  return new THREE.Color(newR, newG, newB)
}
