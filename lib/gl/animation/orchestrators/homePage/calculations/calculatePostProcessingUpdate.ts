import { calculateBloomEffect } from './calculateBloomEffect.ts'
import animationConfig from '@libgl/configAnimation.json' with { type: 'json' }
import configPostProcessing from '@libgl/configPostProcessing.json' with { type: 'json' }
import type { PostProcessingConfig as PostProcessingConfigType } from '@libgl/configPostProcessing.types.ts'
import ms from 'ms'

const { animationConfig: animation } = animationConfig
const postProcessingConfig = configPostProcessing as PostProcessingConfigType

// configuration for post-processing calculation
type PostProcessingConfig = {
  // current time for effects
  currentTime: number
  // whether bloom override is active
  bloomOverrideActive: boolean
  // current bloom override timeout
  bloomOverrideTimeout: ReturnType<typeof setTimeout> | null
  // current chromatic aberration strength
  currentChromaStrength: number
  // renderer dimensions
  rendererWidth: number
  rendererHeight: number
}

// result of post-processing calculation
type PostProcessingResult = {
  // final pass updates
  finalPass: {
    // shader time value
    timeValue: number
    // new chromatic aberration strength
    chromaStrength: number
    // whether to schedule chroma reset
    scheduleChromaReset: boolean
    // chroma reset delay
    chromaResetDelay: number
    // value to reset chroma to
    chromaResetValue: number
  }
  // bloom pass updates
  bloomPass: {
    // new bloom strength
    strength: number
    // whether to activate bloom override
    activateOverride: boolean
    // bloom override duration
    overrideDuration: number
  }
  // dithering pass updates
  ditheringPass: {
    // shader time value
    timeValue: number
  }
  // sharpening pass updates
  sharpeningPass: {
    // resolution width
    resolutionWidth: number
    // resolution height
    resolutionHeight: number
  }
}

/**
 * Calculate post-processing effects updates without side effects
 * Returns data that the orchestrator can apply
 */
export const calculatePostProcessingUpdate = (config: PostProcessingConfig): PostProcessingResult => {
  const {
    currentTime,
    bloomOverrideActive,
    bloomOverrideTimeout,
    currentChromaStrength,
    rendererWidth,
    rendererHeight,
  } = config

  // Final pass chromatic aberration calculation
  const finalPassTimeValue = currentTime % ms('1000ms')
  const defaultChroma = postProcessingConfig.finalPass.chromaStrength

  let newChromaStrength = currentChromaStrength
  let scheduleChromaReset = false
  let chromaResetDelay = 0
  let chromaResetValue = defaultChroma

  if (Math.random() < animation.chromaGlitchProbability) {
    if (currentChromaStrength <= defaultChroma * 2) {
      const intensityMultiplier = animation.chromaGlitchIntensityMin +
        Math.random() * (animation.chromaGlitchIntensityMax - animation.chromaGlitchIntensityMin)

      newChromaStrength = Math.min(
        defaultChroma * intensityMultiplier,
        defaultChroma * 5,
      )

      scheduleChromaReset = true
      chromaResetDelay = animation.chromaGlitchResetDelay
      chromaResetValue = defaultChroma
    }
  }

  // Bloom effect calculation
  const bloomConfig = postProcessingConfig.bloom
  const swellConfig = bloomConfig.bloomSwell || { enabled: false }

  let bloomStrength = bloomConfig.bloomStrength
  let activateOverride = false
  let overrideDuration = 0

  if (swellConfig.enabled) {
    // Check if bloom override should be activated
    if (!bloomOverrideActive && Math.random() < swellConfig.overrideProbability) {
      activateOverride = true
      overrideDuration = swellConfig.overrideDurationMin +
        Math.random() * (swellConfig.overrideDurationMax - swellConfig.overrideDurationMin)
    }

    // Calculate bloom strength
    bloomStrength = calculateBloomEffect(
      currentTime,
      bloomConfig.bloomStrength,
      swellConfig.pulseFrequency,
      swellConfig.pulseIntensity,
      bloomOverrideActive,
      swellConfig.overrideIntensity,
    )
  }

  return {
    finalPass: {
      timeValue: finalPassTimeValue,
      chromaStrength: newChromaStrength,
      scheduleChromaReset,
      chromaResetDelay,
      chromaResetValue,
    },
    bloomPass: {
      strength: bloomStrength,
      activateOverride,
      overrideDuration,
    },
    ditheringPass: {
      timeValue: currentTime,
    },
    sharpeningPass: {
      resolutionWidth: rendererWidth,
      resolutionHeight: rendererHeight,
    },
  }
}
