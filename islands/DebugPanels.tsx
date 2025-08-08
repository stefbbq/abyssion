/**
 * interactive debug panels island for GL scene debugging
 * Features theme-aware styling and filter effects
 */

import { useEffect, useRef } from 'preact/hooks'
import { signal } from '@preact/signals'
import { DebugInfo } from '@components/debug/DebugInfo.tsx'
import { VideoDebugInfo } from '@components/debug/VideoDebugInfo.tsx'
import { DebugControls } from '@islands/DebugControls.tsx'
import { isDebugModeEnabled, loadDebugSettings, resetDebugSettings, saveDebugSettings, setDebugMode } from '@lib/debug/index.ts'
import { lc, log } from '@lib/logger/index.ts'
import controlsConfig from '@libgl/configControls.json' with { type: 'json' }

// debug parameter types
type DOFParams = {
  focus: number
  aperture: number
  maxblur: number
  /** live focus distance being used by the animation loop */
  liveFocusDistance: number
}

type FinalPassParams = {
  chromaStrength: number
  gain: number
  contrast: number
}

type SelectiveColorizationParams = {
  enabled: boolean
  useThemeColors: boolean
  primaryTargetColor: string
  secondaryTargetColor: string
  targeting: {
    brightnessWeight: number
    saturationWeight: number
    brightnessThreshold: number
    saturationThreshold: number
    blendSmoothness: number
  }
  colorBlending: {
    blendMode: 'mixed' | 'overlay' | 'multiply'
    blendBalance: number
  }
}

type ThemeColors = {
  highlight: string
  shadow: string
}

type CorruptionParams = {
  enabled: boolean
  intensity: number
  timeEnabled: boolean

  // Existing effect parameters
  staticIntensity: number

  // RGB distortion parameters
  rgbDistortionIntensity: number
  rgbDistortionEnabled: boolean

  // White noise parameters
  whiteNoiseIntensity: number
  whiteNoiseEnabled: boolean

  // Original block corruption parameters
  blockCorruptionRate: number
  blockCorruptionEnabled: boolean

  // Wave distortion parameters
  waveNoiseIntensity: number
  waveNoiseEnabled: boolean

  // Screen shake parameters
  shakeIntensity: number
  shakeEnabled: boolean

  // Advanced pixel bleed effect parameters
  pixelBleedIntensity: number
  pixelBleedChunkSize: number
  pixelBleedChunkRandomness: number
  pixelBleedStretchDistance: number
  pixelBleedGeometryComplexity: number
  pixelBleedPersistence: number
  pixelBleedRegenerationRate: number
  pixelBleedEnabled: boolean

  // Large block corruption parameters
  largeBlockIntensity: number
  largeBlockSize: number
  largeBlockFPS: number
  largeBlockEnabled: boolean

  // Artifact noise parameters
  artifactNoiseIntensity: number
  artifactChunkSize: number
  artifactShiftAmount: number
  artifactNoiseFPS: number
  artifactNoiseEnabled: boolean
}

type DOFMeta = {
  eventType: string
}

// global signals for debug state
const debugVisible = signal(false)
const debugInfoContent = signal('')
const videoDebugInfoContent = signal('')
const dofParams = signal({ focus: 5.0, aperture: 0.025, maxblur: 0.01, liveFocusDistance: 5.0 })
const finalPassParams = signal({ chromaStrength: 0.002, gain: 1.0, contrast: 1.0 })
const selectiveColorizationParams = signal<SelectiveColorizationParams>({
  enabled: true,
  useThemeColors: true,
  primaryTargetColor: '#ff6600',
  secondaryTargetColor: '#0066ff',
  targeting: {
    brightnessWeight: 0.2,
    saturationWeight: 0.8,
    brightnessThreshold: 0.7,
    saturationThreshold: 0.25,
    blendSmoothness: 0.3,
  },
  colorBlending: {
    blendMode: 'mixed',
    blendBalance: 0.3,
  },
})
const themeColors = signal({ highlight: '#ff00ff', shadow: '#0000ff' })
const corruptionParams = signal<CorruptionParams>({
  enabled: false,
  intensity: 0.0,
  timeEnabled: true,

  // Existing effect defaults (all disabled by default)
  staticIntensity: 0.8,

  // RGB distortion defaults
  rgbDistortionIntensity: 20.0,
  rgbDistortionEnabled: false,

  // White noise defaults
  whiteNoiseIntensity: 0.3,
  whiteNoiseEnabled: false,

  // Original block corruption defaults
  blockCorruptionRate: 10.0,
  blockCorruptionEnabled: false,

  // Wave distortion defaults
  waveNoiseIntensity: 0.2,
  waveNoiseEnabled: false,

  // Screen shake defaults
  shakeIntensity: 10.0,
  shakeEnabled: false,

  // Advanced pixel bleed effect defaults
  pixelBleedIntensity: 0.0,
  pixelBleedChunkSize: 30.0,
  pixelBleedChunkRandomness: 0.5,
  pixelBleedStretchDistance: 0.3,
  pixelBleedGeometryComplexity: 0.7,
  pixelBleedPersistence: 0.6,
  pixelBleedRegenerationRate: 0.4,
  pixelBleedEnabled: false,

  // Large block corruption defaults
  largeBlockIntensity: 0.0,
  largeBlockSize: 15.0,
  largeBlockFPS: 6.0,
  largeBlockEnabled: false,

  // Artifact noise defaults
  artifactNoiseIntensity: 0.0,
  artifactChunkSize: 20.0,
  artifactShiftAmount: 0.5,
  artifactNoiseFPS: 10.0,
  artifactNoiseEnabled: false,
})

// the debug state for GL rendering
const isGLDisabled = signal(false)

// the active GL scene name
const activeGLScene = signal<'home-page' | 'content-page'>('home-page')

// video background opacity
const videoBackgroundOpacity = signal(0.5)

// callbacks that will be set by setupDebugSystem
let onDOFChangeCallback: ((params: DOFParams, meta?: DOFMeta) => void) | null = null
let onFinalPassChangeCallback: ((params: FinalPassParams) => void) | null = null
let onSelectiveColorizationChangeCallback: ((params: SelectiveColorizationParams) => void) | null = null
let onCorruptionChangeCallback: ((params: CorruptionParams) => void) | null = null
let onToggleDebugCallback: ((enabled: boolean) => void) | null = null
let onVideoBackgroundOpacityChangeCallback: ((opacity: number) => void) | null = null

// the props for DebugPanels
type Props = {
  // force debug mode regardless of cookies/query params
  forceDebug?: boolean
}

/**
 * debug panels island component
 * manages debug state and renders debug controls/info
 * uses theme-aware styling throughout
 */
export const DebugPanels = (props: Props) => {
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    // initialize debug state
    const shouldShowDebug = props.forceDebug !== undefined ? props.forceDebug : isDebugModeEnabled()
    debugVisible.value = shouldShowDebug

    // load settings from local storage if debug is enabled
    if (shouldShowDebug) {
      const loaded = loadDebugSettings()
      if (loaded) {
        if (typeof loaded.isGLDisabled === 'boolean') isGLDisabled.value = loaded.isGLDisabled
        if (typeof loaded.activeGLScene === 'string') activeGLScene.value = loaded.activeGLScene
        if (loaded.dofParams) dofParams.value = loaded.dofParams
        if (loaded.finalPassParams) finalPassParams.value = loaded.finalPassParams
        if (loaded.selectiveColorizationParams) selectiveColorizationParams.value = loaded.selectiveColorizationParams
        if (loaded.corruptionParams) {
          corruptionParams.value = {
            ...corruptionParams.value,
            ...loaded.corruptionParams,
          }
        }
        if (loaded.themeColors) themeColors.value = loaded.themeColors
        if (typeof loaded.videoBackgroundOpacity === 'number') videoBackgroundOpacity.value = loaded.videoBackgroundOpacity
      }
    }

    // Now set up subscriptions to save on change
    const signals = [
      dofParams,
      finalPassParams,
      selectiveColorizationParams,
      corruptionParams,
      themeColors,
      isGLDisabled,
      activeGLScene,
      videoBackgroundOpacity,
    ] as const
    const unsubscribers = signals.map((sig) =>
      sig.subscribe(() => {
        saveDebugSettings({
          isGLDisabled: isGLDisabled.value,
          activeGLScene: activeGLScene.value,
          dofParams: dofParams.value,
          finalPassParams: finalPassParams.value,
          selectiveColorizationParams: selectiveColorizationParams.value,
          corruptionParams: corruptionParams.value,
          themeColors: themeColors.value,
          videoBackgroundOpacity: videoBackgroundOpacity.value,
        })
      })
    )

    // keyboard handler
    const handleKeydown = (e: KeyboardEvent) => {
      if (controlsConfig.inputKeys.toggleDebug?.includes(e.key)) {
        debugVisible.value = !debugVisible.value
        setDebugMode(debugVisible.value)
        if (onToggleDebugCallback) onToggleDebugCallback(debugVisible.value)
        log.debug(lc.GL_DEBUG, 'Debug toggled:', debugVisible.value)
      }
    }

    globalThis.addEventListener('keydown', handleKeydown)
    return () => {
      globalThis.removeEventListener('keydown', handleKeydown)
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [props.forceDebug])

  const handleDOFChange = (params: DOFParams, meta?: DOFMeta) => {
    dofParams.value = params
    if (onDOFChangeCallback) onDOFChangeCallback(params, meta)
  }

  const handleFinalPassChange = (params: FinalPassParams) => {
    finalPassParams.value = params
    if (onFinalPassChangeCallback) onFinalPassChangeCallback(params)
  }

  const handleSelectiveColorizationChange = (params: SelectiveColorizationParams) => {
    selectiveColorizationParams.value = params
    if (onSelectiveColorizationChangeCallback) onSelectiveColorizationChangeCallback(params)
  }

  const handleCorruptionChange = (params: CorruptionParams) => {
    console.log('🔄 handleCorruptionChange called in DebugPanels with:', params)
    console.log('🔄 Old corruptionParams.value:', corruptionParams.value)
    corruptionParams.value = params
    console.log('🔄 New corruptionParams.value:', corruptionParams.value)
    if (onCorruptionChangeCallback) onCorruptionChangeCallback(params)
  }

  const handleClose = () => {
    debugVisible.value = false
    setDebugMode(false)
    if (onToggleDebugCallback) onToggleDebugCallback(false)
  }

  const handleGLDisableChange = (disabled: boolean) => {
    isGLDisabled.value = disabled
  }

  const handleSceneChange = async (scene: string) => {
    activeGLScene.value = scene as 'home-page' | 'content-page'
    // switch scene if GL is enabled and debug is visible
    if (!isGLDisabled.value && debugVisible.value && typeof window !== 'undefined') {
      try {
        const mod = await import('@lib/gl/index.ts')
        const glState = mod.getGLState()
        const orchestrator = mod.getSceneOrchestrator()

        if (orchestrator && glState) {
          // create the appropriate orchestrator based on scene name
          if (scene === 'home-page') {
            const { createHomePageOrchestrator } = await import('@lib/gl/animation/orchestrators/homePage/createHomePageOrchestrator.ts')
            const homeOrchestrator = createHomePageOrchestrator(glState)
            orchestrator.switchToOrchestrator(homeOrchestrator)
          } else if (scene === 'content-page') {
            const { createContentPageOrchestrator } = await import(
              '@lib/gl/animation/orchestrators/contentPage/createContentPageOrchestrator.ts'
            )
            const contentOrchestrator = createContentPageOrchestrator(glState)
            orchestrator.switchToOrchestrator(contentOrchestrator)
          }
        }
      } catch (error) {
        log.error(lc.GL, 'Error switching scene:', scene, error)
      }
    }
  }

  const handleReset = () => {
    dofParams.value = { focus: 5.0, aperture: 0.025, maxblur: 0.01, liveFocusDistance: 5.0 }
    finalPassParams.value = { chromaStrength: 0.002, gain: 1.0, contrast: 1.0 }
    selectiveColorizationParams.value = {
      enabled: true,
      useThemeColors: true,
      primaryTargetColor: '#ff6600',
      secondaryTargetColor: '#0066ff',
      targeting: {
        brightnessWeight: 0.2,
        saturationWeight: 0.8,
        brightnessThreshold: 0.7,
        saturationThreshold: 0.25,
        blendSmoothness: 0.1,
      },
      colorBlending: {
        blendMode: 'mixed',
        blendBalance: 0.5,
      },
    }
    corruptionParams.value = {
      enabled: false,
      intensity: 0.5,
      timeEnabled: false,
      staticIntensity: 0.1,
      rgbDistortionIntensity: 0.1,
      rgbDistortionEnabled: false,
      whiteNoiseIntensity: 0.1,
      whiteNoiseEnabled: false,
      blockCorruptionRate: 0.1,
      blockCorruptionEnabled: false,
      waveNoiseIntensity: 0.1,
      waveNoiseEnabled: false,
      shakeIntensity: 0.1,
      shakeEnabled: false,
      pixelBleedIntensity: 0.1,
      pixelBleedChunkSize: 5,
      pixelBleedChunkRandomness: 0.5,
      pixelBleedStretchDistance: 10,
      pixelBleedGeometryComplexity: 5,
      pixelBleedPersistence: 0.8,
      pixelBleedRegenerationRate: 0.1,
      pixelBleedEnabled: false,
      largeBlockIntensity: 0.1,
      largeBlockSize: 50,
      largeBlockFPS: 10,
      largeBlockEnabled: false,
      artifactNoiseIntensity: 0.1,
      artifactChunkSize: 10,
      artifactShiftAmount: 5,
      artifactNoiseFPS: 15,
      artifactNoiseEnabled: false,
    }
    videoBackgroundOpacity.value = 1.0
  }

  const handleVideoBackgroundOpacityChange = (opacity: number) => {
    console.log('🔄 handleVideoBackgroundOpacityChange called in DebugPanels with:', opacity)
    console.log('🔄 Old videoBackgroundOpacity.value:', videoBackgroundOpacity.value)
    videoBackgroundOpacity.value = opacity
    console.log('🔄 New videoBackgroundOpacity.value:', videoBackgroundOpacity.value)
    if (onVideoBackgroundOpacityChangeCallback) onVideoBackgroundOpacityChangeCallback(opacity)
  }

  return (
    <>
      <DebugControls
        visible={debugVisible.value}
        dofParams={dofParams.value}
        finalPassParams={finalPassParams.value}
        selectiveColorizationParams={selectiveColorizationParams.value}
        corruptionParams={corruptionParams.value}
        themeColors={themeColors.value}
        onDOFChange={handleDOFChange}
        onFinalPassChange={handleFinalPassChange}
        onSelectiveColorizationChange={handleSelectiveColorizationChange}
        onCorruptionChange={handleCorruptionChange}
        onClose={handleClose}
        isGLDisabled={isGLDisabled.value}
        onGLDisableChange={handleGLDisableChange}
        activeGLScene={activeGLScene.value}
        onSceneChange={handleSceneChange}
        onReset={handleReset}
        videoBackgroundOpacity={videoBackgroundOpacity.value}
        onVideoBackgroundOpacityChange={handleVideoBackgroundOpacityChange}
        liveFocusDistance={dofParams.value.liveFocusDistance}
      />
      {debugVisible.value && (
        <div className='fixed bottom-4 left-4 flex flex-col gap-4 z-50'>
          <VideoDebugInfo
            visible={debugVisible.value}
            content={videoDebugInfoContent.value}
          />
          <DebugInfo
            visible={debugVisible.value}
            content={debugInfoContent.value}
          />
        </div>
      )}
    </>
  )
}

// export API for setupDebugSystem to use
export const debugPanelsAPI = {
  // update DOF parameters
  updateDOFParams: (params: DOFParams) => {
    dofParams.value = params
  },
  // update final pass parameters
  updateFinalPassParams: (params: FinalPassParams) => {
    finalPassParams.value = params
  },
  // update selective colorization parameters
  updateSelectiveColorizationParams: (params: SelectiveColorizationParams, colors: ThemeColors) => {
    selectiveColorizationParams.value = params
    themeColors.value = colors
  },
  // update corruption parameters
  updateCorruptionParams: (params: CorruptionParams) => {
    corruptionParams.value = params
  },
  // update video background opacity
  updateVideoBackgroundOpacity: (opacity: number) => {
    videoBackgroundOpacity.value = opacity
  },
  // set debug info content
  setDebugInfo: (content: string) => {
    debugInfoContent.value = content
  },
  // set video debug info content
  setVideoDebugInfo: (content: string) => {
    videoDebugInfoContent.value = content
  },
  // set callbacks
  setCallbacks: (callbacks: {
    onDOFChange?: (params: DOFParams, meta?: DOFMeta) => void
    onFinalPassChange?: (params: FinalPassParams) => void
    onSelectiveColorizationChange?: (params: SelectiveColorizationParams) => void
    onCorruptionChange?: (params: CorruptionParams) => void
    onToggleDebug?: (enabled: boolean) => void
    onVideoBackgroundOpacityChange?: (opacity: number) => void
  }) => {
    if (callbacks.onDOFChange) onDOFChangeCallback = callbacks.onDOFChange
    if (callbacks.onFinalPassChange) onFinalPassChangeCallback = callbacks.onFinalPassChange
    if (callbacks.onSelectiveColorizationChange) onSelectiveColorizationChangeCallback = callbacks.onSelectiveColorizationChange
    if (callbacks.onCorruptionChange) onCorruptionChangeCallback = callbacks.onCorruptionChange
    if (callbacks.onToggleDebug) onToggleDebugCallback = callbacks.onToggleDebug
    if (callbacks.onVideoBackgroundOpacityChange) onVideoBackgroundOpacityChangeCallback = callbacks.onVideoBackgroundOpacityChange
  },
  // check if debug is available
  isAvailable: () => debugVisible.value,
}

export { activeGLScene, isGLDisabled, resetDebugSettings }
export type { CorruptionParams }
