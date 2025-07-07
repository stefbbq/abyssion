/**
 * interactive debug panels island for GL scene debugging
 * Features theme-aware styling and filter effects
 */

import { useEffect, useRef } from 'preact/hooks'
import { signal } from '@preact/signals'
import { DebugInfo } from '@components/debug/DebugInfo.tsx'
import { DebugControls } from '@islands/DebugControls.tsx'
import { isDebugModeEnabled, loadDebugSettings, resetDebugSettings, saveDebugSettings, setDebugMode } from '@lib/debug/index.ts'
import { lc, log } from '@lib/logger/index.ts'
import controlsConfig from '@libgl/configControls.json' with { type: 'json' }

// debug parameter types
type DOFParams = {
  focus: number
  aperture: number
  maxblur: number
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

type DOFMeta = {
  eventType: string
}

// global signals for debug state
const debugVisible = signal(false)
const debugInfoContent = signal('')
const dofParams = signal({ focus: 5.0, aperture: 0.025, maxblur: 0.01 })
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

// the debug state for GL rendering
const isGLDisabled = signal(false)

// the active GL scene name
const activeGLScene = signal<'logo-page' | 'content-page'>('logo-page')

// callbacks that will be set by setupDebugSystem
let onDOFChangeCallback: ((params: DOFParams, meta?: DOFMeta) => void) | null = null
let onSelectiveColorizationChangeCallback: ((params: SelectiveColorizationParams) => void) | null = null
let onToggleDebugCallback: ((enabled: boolean) => void) | null = null

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
        if (loaded.selectiveColorizationParams) selectiveColorizationParams.value = loaded.selectiveColorizationParams
        if (loaded.themeColors) themeColors.value = loaded.themeColors
      }
    }

    // Now set up subscriptions to save on change
    const signals = [dofParams, selectiveColorizationParams, themeColors, isGLDisabled, activeGLScene] as const
    const unsubscribers = signals.map((sig) =>
      sig.subscribe(() => {
        saveDebugSettings({
          isGLDisabled: isGLDisabled.value,
          activeGLScene: activeGLScene.value,
          dofParams: dofParams.value,
          selectiveColorizationParams: selectiveColorizationParams.value,
          themeColors: themeColors.value,
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

  const handleSelectiveColorizationChange = (params: SelectiveColorizationParams) => {
    selectiveColorizationParams.value = params
    if (onSelectiveColorizationChangeCallback) onSelectiveColorizationChangeCallback(params)
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
    activeGLScene.value = scene as 'logo-page' | 'content-page'
    // switch scene if GL is enabled and debug is visible
    if (!isGLDisabled.value && debugVisible.value && typeof window !== 'undefined') {
      try {
        const mod = await import('@lib/gl/index.ts')
        const orchestrator = mod.getSceneOrchestrator()
        if (orchestrator) orchestrator.switchToPage(scene)
      } catch {}
    }
  }

  const handleReset = () => {
    resetDebugSettings()
    isGLDisabled.value = false
    activeGLScene.value = 'logo-page'
    dofParams.value = { focus: 5.0, aperture: 0.025, maxblur: 0.01 }
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
        blendSmoothness: 0.3,
      },
      colorBlending: {
        blendMode: 'mixed' as const,
        blendBalance: 0.3,
      },
    }
    themeColors.value = { highlight: '#ff00ff', shadow: '#0000ff' }
  }

  return (
    <>
      <DebugControls
        visible={debugVisible.value}
        dofParams={dofParams.value}
        selectiveColorizationParams={selectiveColorizationParams.value}
        themeColors={themeColors.value}
        onDOFChange={handleDOFChange}
        onSelectiveColorizationChange={handleSelectiveColorizationChange}
        onClose={handleClose}
        isGLDisabled={isGLDisabled.value}
        onGLDisableChange={handleGLDisableChange}
        activeGLScene={activeGLScene.value}
        onSceneChange={handleSceneChange}
        onReset={handleReset}
      />
      <DebugInfo
        visible={debugVisible.value}
        content={debugInfoContent.value}
      />
    </>
  )
}

// export API for setupDebugSystem to use
export const debugPanelsAPI = {
  // update DOF parameters
  updateDOFParams: (params: DOFParams) => {
    dofParams.value = params
  },
  // update selective colorization parameters
  updateSelectiveColorizationParams: (params: SelectiveColorizationParams, colors: ThemeColors) => {
    selectiveColorizationParams.value = params
    themeColors.value = colors
  },
  // set debug info content
  setDebugInfo: (content: string) => {
    debugInfoContent.value = content
  },
  // set callbacks
  setCallbacks: (callbacks: {
    onDOFChange?: (params: DOFParams, meta?: DOFMeta) => void
    onSelectiveColorizationChange?: (params: SelectiveColorizationParams) => void
    onToggleDebug?: (enabled: boolean) => void
  }) => {
    if (callbacks.onDOFChange) onDOFChangeCallback = callbacks.onDOFChange
    if (callbacks.onSelectiveColorizationChange) onSelectiveColorizationChangeCallback = callbacks.onSelectiveColorizationChange
    if (callbacks.onToggleDebug) onToggleDebugCallback = callbacks.onToggleDebug
  },
  // check if debug is available
  isAvailable: () => debugVisible.value,
}

export { activeGLScene, isGLDisabled, resetDebugSettings }
