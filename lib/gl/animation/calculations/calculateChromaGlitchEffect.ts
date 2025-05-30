/**
 * Calculates chromatic aberration glitch effect values
 * Pure function that determines if and how to apply glitch effects
 */
export const calculateChromaGlitchEffect = (
  currentChromaStrength: number,
  defaultChromaStrength: number,
  glitchConfig: {
    chromaGlitchProbability: number
    chromaGlitchIntensityMin: number
    chromaGlitchIntensityMax: number
  },
): { shouldApplyGlitch: boolean; newChromaStrength: number; shouldReset: boolean } => {
  // If the current value is already significantly higher than default,
  // don't increase it further to prevent accumulated growth
  if (currentChromaStrength > defaultChromaStrength * 2) {
    return {
      shouldApplyGlitch: false,
      newChromaStrength: currentChromaStrength,
      shouldReset: false,
    }
  }

  // Check for glitch application
  if (Math.random() < glitchConfig.chromaGlitchProbability) {
    const intensityMultiplier = glitchConfig.chromaGlitchIntensityMin +
      Math.random() * (glitchConfig.chromaGlitchIntensityMax - glitchConfig.chromaGlitchIntensityMin)

    // Apply the effect but with a maximum cap
    const newValue = defaultChromaStrength * intensityMultiplier
    return {
      shouldApplyGlitch: true,
      newChromaStrength: Math.min(newValue, defaultChromaStrength * 5),
      shouldReset: false,
    }
  }

  // Occasionally reset to default value even without a glitch
  if (Math.random() < 0.001) {
    return {
      shouldApplyGlitch: false,
      newChromaStrength: defaultChromaStrength,
      shouldReset: true,
    }
  }

  return {
    shouldApplyGlitch: false,
    newChromaStrength: currentChromaStrength,
    shouldReset: false,
  }
}
