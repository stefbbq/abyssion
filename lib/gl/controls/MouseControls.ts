import { calculateMousePosition } from './calculateMousePosition.ts'
import { calculateMouseRotationTarget, type MouseRotationTarget } from './calculateMouseRotationTarget.ts'

/**
 * Create mouse tracking system that returns current rotation targets
 */
export const createMouseTracking = () => {
  let currentTarget: MouseRotationTarget = { targetRotationX: 0, targetRotationY: 0 }

  const handleMouseMove = (event: MouseEvent) => {
    const position = calculateMousePosition(event)
    currentTarget = calculateMouseRotationTarget(position)
  }

  globalThis.addEventListener('mousemove', handleMouseMove)

  return {
    getCurrentTarget: (): MouseRotationTarget => currentTarget,
    cleanup: () => globalThis.removeEventListener('mousemove', handleMouseMove),
  }
}
