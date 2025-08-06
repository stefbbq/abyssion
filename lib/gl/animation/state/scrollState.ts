/**
 * shared scroll state for synchronization between scroll manager and animation loop
 */
export const scrollState = {
  y: 0,
  velocity: 0,
  lastUpdateTime: 0,
}

/**
 * updates the shared scroll state
 */
export const updateScrollState = (y: number) => {
  const now = performance.now()
  const deltaTime = now - scrollState.lastUpdateTime

  if (deltaTime > 0) {
    scrollState.velocity = (y - scrollState.y) / deltaTime * 1000 // pixels per second
  }

  scrollState.y = y
  scrollState.lastUpdateTime = now
}
