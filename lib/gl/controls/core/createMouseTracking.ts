import { calculateMousePosition } from '../calculations/calculateMousePosition.ts'
import { calculateMouseRotationTarget } from '../calculations/calculateMouseRotationTarget.ts'
import type { MouseRotationTarget, MouseTrackingState } from '../types.ts'

/**
 * Create mouse tracking system with functional approach
 * Returns state management functions instead of mutating global state
 */
export const createMouseTracking = (mouseCoefficient: number) => {
  let state: MouseTrackingState = {
    currentTarget: { targetRotationX: 0, targetRotationY: 0 },
    isActive: false,
  }

  const handleMouseMove = (event: MouseEvent): MouseRotationTarget => {
    const position = calculateMousePosition(event)
    const target = calculateMouseRotationTarget(position, mouseCoefficient)

    state = {
      ...state,
      currentTarget: target,
    }

    return target
  }

  const getCurrentTarget = (): MouseRotationTarget => state.currentTarget

  const getState = (): MouseTrackingState => state

  const activate = () => {
    if (state.isActive) return

    globalThis.addEventListener('mousemove', handleMouseMove)
    state = { ...state, isActive: true }
  }

  const deactivate = () => {
    if (!state.isActive) return

    globalThis.removeEventListener('mousemove', handleMouseMove)
    state = { ...state, isActive: false }
  }

  const cleanup = () => {
    deactivate()
  }

  // Auto-activate by default
  activate()

  return {
    getCurrentTarget,
    getState,
    activate,
    deactivate,
    cleanup,
  }
}
