/**
 * Mouse position data normalized to -1 to 1 range
 */
export type MousePosition = {
  readonly x: number
  readonly y: number
}

/**
 * Calculate normalized mouse position from event
 */
export const calculateMousePosition = (event: MouseEvent): MousePosition => ({
  x: (event.clientX / globalThis.innerWidth) * 2 - 1,
  y: (event.clientY / globalThis.innerHeight) * 2 - 1,
})
