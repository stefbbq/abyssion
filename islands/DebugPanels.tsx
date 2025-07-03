/**
 * interactive debug panels island for GL scene debugging
 * Features theme-aware styling and filter effects
 */

import { useEffect, useRef } from 'preact/hooks'
import { signal } from '@preact/signals'
import { DebugInfo } from '@components/debug/DebugInfo.tsx'
import { DebugControls } from '@components/debug/DebugControls.tsx'
import { isDebugModeEnabled, setDebugMode } from '@lib/debug/index.ts'
import { lc, log } from '@lib/logger/index.ts'
import controlsConfig from '@libgl/configControls.json' with { type: 'json' }

// debug parameter types
type DOFParams = {
  focus: number
  aperture: number
  maxblur: number
}

type ToneMapParams = {
  enabled: boolean
  blendAmount: number
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
const toneMapParams = signal({ enabled: true, blendAmount: 1.0 })
const themeColors = signal({ highlight: '#ff00ff', shadow: '#0000ff' })

// callbacks that will be set by setupDebugSystem
let onDOFChangeCallback: ((params: DOFParams, meta?: DOFMeta) => void) | null = null
let onToneMapChangeCallback: ((params: ToneMapParams) => void) | null = null
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
    return () => globalThis.removeEventListener('keydown', handleKeydown)
  }, [props.forceDebug])

  const handleDOFChange = (params: DOFParams, meta?: DOFMeta) => {
    dofParams.value = params
    if (onDOFChangeCallback) onDOFChangeCallback(params, meta)
  }

  const handleToneMapChange = (params: ToneMapParams) => {
    toneMapParams.value = params
    if (onToneMapChangeCallback) onToneMapChangeCallback(params)
  }

  const handleClose = () => {
    debugVisible.value = false
    setDebugMode(false)
    if (onToggleDebugCallback) onToggleDebugCallback(false)
  }

  return (
    <>
      <DebugControls
        visible={debugVisible.value}
        dofParams={dofParams.value}
        toneMapParams={toneMapParams.value}
        themeColors={themeColors.value}
        onDOFChange={handleDOFChange}
        onToneMapChange={handleToneMapChange}
        onClose={handleClose}
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
  // update tone map parameters
  updateToneMapParams: (params: ToneMapParams, colors: ThemeColors) => {
    toneMapParams.value = params
    themeColors.value = colors
  },
  // set debug info content
  setDebugInfo: (content: string) => {
    debugInfoContent.value = content
  },
  // set callbacks
  setCallbacks: (callbacks: {
    onDOFChange?: (params: DOFParams, meta?: DOFMeta) => void
    onToneMapChange?: (params: ToneMapParams) => void
    onToggleDebug?: (enabled: boolean) => void
  }) => {
    if (callbacks.onDOFChange) onDOFChangeCallback = callbacks.onDOFChange
    if (callbacks.onToneMapChange) onToneMapChangeCallback = callbacks.onToneMapChange
    if (callbacks.onToggleDebug) onToggleDebugCallback = callbacks.onToggleDebug
  },
  // check if debug is available
  isAvailable: () => debugVisible.value,
}
