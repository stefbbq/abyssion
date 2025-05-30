import type { MousePosition } from './calculateMousePosition.ts'
import animationConfig from '@lib/configAnimation.json' with { type: 'json' }

const { userReactivity } = animationConfig

/**
 * Target rotation values calculated from mouse position
 */
export type MouseRotationTarget = {
  readonly targetRotationX: number
  readonly targetRotationY: number
}

/**
 * Calculate target rotation from normalized mouse position
 */
export const calculateMouseRotationTarget = (position: MousePosition): MouseRotationTarget => ({
  targetRotationX: position.y * userReactivity.mouseCoefficient,
  targetRotationY: position.x * userReactivity.mouseCoefficient,
})
