/**
 * Loading effects calculation parameters
 */
type LoadingEffectsParams = {
  readonly progress: number // 0 to 1
  readonly time: number
  readonly isComplete: boolean
}

/**
 * Loading effects calculation result
 */
type LoadingEffectsResult = {
  readonly logoOpacity: number
  readonly uiOpacity: number
  readonly backgroundOpacity: number
  readonly pulseIntensity: number
}

/**
 * Calculates visual effects during loading state
 * Creates smooth fade-ins and subtle pulsing animations
 */
export const calculateLoadingEffects = (params: LoadingEffectsParams): LoadingEffectsResult => {
  const { progress, time, isComplete } = params

  // Smooth easing function for natural transitions
  const easeInOut = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const easedProgress = easeInOut(progress)

  // Subtle pulsing effect during loading
  const pulseIntensity = isComplete ? 0 : Math.sin(time * 0.002) * 0.1 + 0.9

  // Gradual fade-in of elements
  const logoOpacity = Math.min(easedProgress * 1.2, 1.0) * pulseIntensity
  const uiOpacity = Math.max(0, (easedProgress - 0.3) * 1.4) * pulseIntensity
  const backgroundOpacity = Math.max(0, (easedProgress - 0.1) * 1.1)

  return {
    logoOpacity,
    uiOpacity,
    backgroundOpacity,
    pulseIntensity,
  }
}
