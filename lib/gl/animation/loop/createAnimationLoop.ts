import type { AnimationContext } from '../core/types.ts'
import { shouldSkipFrame } from '../calculations/shouldSkipFrame.ts'

// the state for the animation loop
type AnimationLoopState = {
  time: number
  lastTime: number
  lastRenderTime: number
  animationId: number
  isPaused: boolean
}

// the handlers for the animation loop
type AnimationHandlers = {
  onFrame: (context: AnimationContext) => void
  onPreFrame?: () => void
  onPostFrame?: () => void
}

/**
 * creates an animation loop with pause/resume capabilities
 */
export const createAnimationLoop = (
  targetFPS: number,
  timeIncrement: number,
  handlers: AnimationHandlers,
) => {
  const state: AnimationLoopState = {
    time: 0,
    lastTime: 0,
    lastRenderTime: 0,
    animationId: 0,
    isPaused: false,
  }

  const animate = (timestamp: number) => {
    handlers.onPreFrame?.()
    state.animationId = requestAnimationFrame(animate)

    // check if we should skip this frame for FPS limiting
    const timeSinceLastRender = timestamp - state.lastRenderTime
    if (shouldSkipFrame(timeSinceLastRender, targetFPS)) return

    // update timing
    state.lastRenderTime = timestamp
    const deltaTime = timestamp - state.lastTime
    state.lastTime = timestamp
    state.time += timeIncrement

    // execute frame handler
    handlers.onFrame({
      time: state.time,
      deltaTime,
    } as AnimationContext)

    handlers.onPostFrame?.()
  }

  return {
    start: () => {
      if (!state.isPaused) {
        state.lastTime = performance.now()
        animate(state.lastTime)
      }
    },
    pause: () => {
      if (!state.isPaused) {
        cancelAnimationFrame(state.animationId)
        state.isPaused = true
      }
    },
    resume: () => {
      if (state.isPaused) {
        state.isPaused = false
        state.lastTime = performance.now()
        animate(state.lastTime)
      }
    },
    dispose: () => {
      cancelAnimationFrame(state.animationId)
    },
    getTime: () => state.time,
  }
}
