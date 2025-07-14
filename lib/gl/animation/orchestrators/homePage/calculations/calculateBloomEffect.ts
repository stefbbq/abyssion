/**
 * Calculate bloom effect with pulsing and override intensity
 * Combines base bloom with animated pulsing and optional override
 */
export const calculateBloomEffect = (
  currentTime: number,
  baseStrength: number,
  pulseFrequency: number,
  pulseIntensity: number,
  overrideActive: boolean,
  overrideIntensity: number,
): number => {
  // Base pulsing effect
  const pulseValue = Math.sin(currentTime * pulseFrequency) * pulseIntensity
  const pulsingStrength = baseStrength + pulseValue

  // Apply override if active
  if (overrideActive) {
    return Math.max(pulsingStrength, overrideIntensity)
  }

  return Math.max(0, pulsingStrength)
}
