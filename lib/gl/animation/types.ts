/**
 * Animation types
 */

import type { RendererState } from '../types.ts'

// Animation frame callback
export type AnimationFrameCallback = (state: RendererState, deltaTime: number) => void 