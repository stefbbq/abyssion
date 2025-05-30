/**
 * Calculate shader time value for a layer based on fps setting
 */
export const calculateShaderTime = (
  currentTime: number,
  lastUpdateTime: number,
  layerFps: number,
  noiseRate: number,
  isGlitchy: boolean = false,
): { shouldUpdate: boolean; newTime: number } => {
  const timeSinceLastUpdate = currentTime - lastUpdateTime
  const updateInterval = 1 / layerFps

  if (timeSinceLastUpdate < updateInterval) {
    return { shouldUpdate: false, newTime: 0 }
  }

  if (isGlitchy && layerFps <= 2 && noiseRate > 48) {
    return {
      shouldUpdate: true,
      newTime: currentTime * noiseRate * (Math.random() + 0.5),
    }
  }

  return {
    shouldUpdate: true,
    newTime: currentTime * noiseRate,
  }
}
