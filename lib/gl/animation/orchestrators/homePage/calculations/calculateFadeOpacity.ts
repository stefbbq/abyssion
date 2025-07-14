// the result of calculating fade opacity
export type FadeOpacityResult = {
  fadeMultiplier: number
}

export type FadeConfig = {
  scrollProgress: number
  fadeStartThreshold: number
  fadeEndThreshold: number
  layerIndex: number
  totalLayers: number
}

/**
 * Returns a fade multiplier (0 to 1) for a given layer based on scroll position and fade thresholds.
 * Fades out layers in order as scroll progresses.
 */
export const calculateFadeOpacity = (config: FadeConfig): FadeOpacityResult => {
  const {
    scrollProgress,
    fadeStartThreshold,
    fadeEndThreshold,
    layerIndex,
    totalLayers,
  } = config

  if (scrollProgress < fadeStartThreshold) return { fadeMultiplier: 1 }
  if (scrollProgress >= fadeEndThreshold) return { fadeMultiplier: 0 }

  // Fade progress (0 to 1)
  const fadeProgress = (scrollProgress - fadeStartThreshold) / (fadeEndThreshold - fadeStartThreshold)
  // Each layer fades out in sequence
  const layerFadePoint = (layerIndex + 1) / totalLayers
  if (fadeProgress >= layerFadePoint) return { fadeMultiplier: 0 }
  if (fadeProgress <= layerIndex / totalLayers) return { fadeMultiplier: 1 }
  // Linear fade for this layer
  const localFade = (layerFadePoint - fadeProgress) * totalLayers
  return { fadeMultiplier: Math.max(0, Math.min(1, localFade)) }
}
