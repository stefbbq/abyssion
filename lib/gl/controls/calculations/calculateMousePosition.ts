import type { MousePosition } from '../types.ts'

/**
 * Calculate normalized mouse position from event
 * Pure function that transforms MouseEvent to normalized coordinates
 */
export const calculateMousePosition = (event: MouseEvent): MousePosition => ({
  x: (event.clientX / globalThis.innerWidth) * 2 - 1,
  y: (event.clientY / globalThis.innerHeight) * 2 - 1,
})
