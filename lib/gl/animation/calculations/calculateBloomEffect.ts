/**
 * Calculate bloom effect strength with pulsing and override logic
 */
export const calculateBloomEffect = (
  time: number,
  baseStrength: number,
  pulseFrequency: number,
  pulseIntensity: number,
  overrideActive: boolean,
  overrideIntensity: number,
): number => {
  if (overrideActive) {
    return baseStrength * overrideIntensity
  }

  return baseStrength + Math.sin(time * pulseFrequency) * pulseIntensity
}
