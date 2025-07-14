import controlsConfig from '@libgl/configControls.json' with { type: 'json' }
import { currentThemeFamilyName, currentThemeMode, getAllThemeFamilies, setThemeFamily } from '@lib/theme/index.ts'
import { useState } from 'preact/hooks'
import type { CorruptionParams } from './DebugPanels.tsx'

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

/** the props for DebugControls */
type Props = {
  // whether the controls are visible
  visible: boolean
  // current DOF parameters
  dofParams: DOFParams
  // current final pass parameters
  finalPassParams: FinalPassParams
  // current selective colorization parameters
  selectiveColorizationParams: SelectiveColorizationParams
  // current corruption parameters
  corruptionParams: CorruptionParams
  // current theme colors
  themeColors: ThemeColors
  // callback when DOF parameters change
  onDOFChange: (params: DOFParams, meta?: { eventType: string }) => void
  // callback when final pass parameters change
  onFinalPassChange: (params: FinalPassParams) => void
  // callback when selective colorization parameters change
  onSelectiveColorizationChange: (params: SelectiveColorizationParams) => void
  // callback when corruption parameters change
  onCorruptionChange: (params: CorruptionParams) => void
  // callback to close the debug panel
  onClose: () => void
  // whether GL is disabled
  isGLDisabled: boolean
  // callback when GL disable changes
  onGLDisableChange: (disabled: boolean) => void
  // current active GL scene
  activeGLScene: string
  // callback when scene changes
  onSceneChange: (scene: string) => void
  // callback to reset all debug settings
  onReset: () => void
  // current video background opacity
  videoBackgroundOpacity: number
  // callback when video background opacity changes
  onVideoBackgroundOpacityChange: (opacity: number) => void
  liveFocusDistance: number
}

/**
 * debug controls component
 * renders controls for DOF, tone mapping, theme switching, and hotkey info
 */
export const DebugControls = (props: Props) => {
  const [sectionsExpanded, setSectionsExpanded] = useState({
    glControls: false,
    homepageControls: false,
    theme: false,
    dof: false,
    finalPass: false,
    corruption: false,
    colorization: false,
  })

  if (!props.visible) return null

  const availableThemes = getAllThemeFamilies()
  const currentTheme = currentThemeFamilyName.value

  const toggleSection = (section: keyof typeof sectionsExpanded) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleDOFInput = (field: keyof DOFParams) => (e: Event) => {
    const target = e.target as HTMLInputElement
    const newParams = {
      ...props.dofParams,
      [field]: parseFloat(target.value),
    }
    props.onDOFChange(newParams, { eventType: 'input' })
  }

  const handleDOFChange = (field: keyof DOFParams) => (e: Event) => {
    const target = e.target as HTMLInputElement
    const newParams = {
      ...props.dofParams,
      [field]: parseFloat(target.value),
    }
    props.onDOFChange(newParams, { eventType: 'change' })
  }

  const handleFinalPassChange = (field: keyof FinalPassParams) => (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = parseFloat(target.value)
    props.onFinalPassChange({
      ...props.finalPassParams,
      [field]: value,
    })
  }

  const handleCorruptionToggle = (field: 'enabled' | 'timeEnabled') => (e: Event) => {
    const target = e.target as HTMLInputElement
    props.onCorruptionChange({
      ...props.corruptionParams,
      [field]: target.checked,
    })
  }

  const handleCorruptionIntensityInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    const value = parseFloat(target.value)
    console.log('🎛️ Corruption intensity slider input:', value)
    props.onCorruptionChange({
      ...props.corruptionParams,
      intensity: value,
    })
  }

  const handleColorizationToggle = (e: Event) => {
    const target = e.target as HTMLInputElement
    props.onSelectiveColorizationChange({
      ...props.selectiveColorizationParams,
      enabled: target.checked,
    })
  }

  const handleColorizationChange = (field: string) => (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    const value = target.type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.type === 'range'
      ? parseFloat(target.value)
      : target.value

    if (field.includes('.')) {
      const [parentField, childField] = field.split('.')
      const currentParams = props.selectiveColorizationParams
      if (parentField === 'targeting') {
        props.onSelectiveColorizationChange({
          ...currentParams,
          targeting: {
            ...currentParams.targeting,
            [childField]: value,
          },
        })
      } else if (parentField === 'colorBlending') {
        props.onSelectiveColorizationChange({
          ...currentParams,
          colorBlending: {
            ...currentParams.colorBlending,
            [childField]: value,
          },
        })
      }
    } else {
      props.onSelectiveColorizationChange({
        ...props.selectiveColorizationParams,
        [field]: value,
      })
    }
  }

  const handleThemeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    setThemeFamily(target.value)
  }

  return (
    <div
      className='overflow-y-auto fixed bottom-4 right-4 rounded-theme-lg p-3 font-mono text-xs text-black max-w-xs bg-white/80 backdrop-blur-sm'
      style={{ zIndex: 2000, minWidth: '380px', maxHeight: '80vh' }}
    >
      {/* header */}
      <div className='flex items-center justify-between mb-2'>
        <span className='font-bold text-sm tracking-wider'>Debug Mode</span>
        <button
          type='button'
          onClick={props.onClose}
          className='text-text-primary hover:text-text-primary-hover transition-colors text-xl font-bold leading-none px-2 py-0.5'
        >
          ×
        </button>
      </div>

      {/* GL controls */}
      <div className='space-y-2 mb-3'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('glControls')}
        >
          <p className='font-bold text-sm'>GL Environment</p>
          <button
            type='button'
            onClick={() => toggleSection('glControls')}
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.glControls ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.glControls && (
          <>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Video BG Opacity:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.1'
                value={props.videoBackgroundOpacity}
                onInput={(e) => {
                  const value = parseFloat((e.target as HTMLInputElement).value)
                  console.log('🎛️ Video background opacity slider INPUT:', value)
                  props.onVideoBackgroundOpacityChange(value)
                }}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.videoBackgroundOpacity.toFixed(1)}</span>
            </div>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={props.isGLDisabled}
                onChange={(e) => props.onGLDisableChange((e.target as HTMLInputElement).checked)}
                className='mr-1'
              />
              Pause GL (disable rendering)
            </label>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Scene:</label>
              <select
                value={props.activeGLScene}
                onChange={(e) => props.onSceneChange((e.target as HTMLSelectElement).value)}
                className='flex-1 bg-surface-primary border border-border-primary rounded-theme-sm px-2 py-1 text-xs text-text-primary'
              >
                <option value='logo-page'>Logo Page</option>
                <option value='content-page'>Content Page</option>
              </select>
            </div>
            <button
              type='button'
              onClick={props.onReset}
              className='mt-2 px-2 py-1 rounded-theme-sm bg-border-primary text-text-primary hover:bg-border-subtle transition-colors w-full'
            >
              Reset to Defaults
            </button>
          </>
        )}
      </div>

      {/* instructions */}
      <div className='space-y-2 mb-3'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('homepageControls')}
        >
          <p className='font-bold text-sm'>Homepage Controls</p>
          <button
            type='button'
            onClick={() => toggleSection('homepageControls')}
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.homepageControls ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.homepageControls && (
          <div className='text-text-secondary'>
            <p className='font-bold mb-1'>Homepage interaction:</p>
            <ul className='ml-4 mb-2 space-y-0.5'>
              <li>Move mouse to rotate scene</li>
            </ul>
            <p className='font-bold mb-1'>Hotkeys:</p>
            <ul className='ml-4 space-y-0.5'>
              <li>
                <b>{controlsConfig.inputKeys.toggleDebug?.[0]?.toUpperCase() || 'D'}</b>: Toggle debug panel
              </li>
              <li>
                <b>{controlsConfig.inputKeys.toggleRotation[0].toUpperCase()}</b>: Toggle auto-rotation
              </li>
              <li>
                <b>{controlsConfig.inputKeys.regenerateLayers[0].toUpperCase()}</b>: Regenerate layers
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* theme selector */}
      <div className='space-y-2 mb-3'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('theme')}
        >
          <p className='font-bold text-sm'>Theme Selector</p>
          <button
            type='button'
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.theme ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.theme && (
          <>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Theme:</label>
              <select
                value={currentTheme}
                onChange={handleThemeChange}
                className='flex-1 bg-surface-primary border border-border-primary rounded-theme-sm px-2 py-1 text-xs text-text-primary'
              >
                {availableThemes.map((theme) => (
                  <option key={theme.name} value={theme.name}>
                    {theme.name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className='text-text-tertiary text-xs'>
              Current:{' '}
              <span className='font-semibold'>
                {currentTheme.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}{' '}
                ({currentThemeMode.value === 'dark' ? 'Dark' : 'Light'})
              </span>
            </div>
          </>
        )}
      </div>

      {/* DOF controls */}
      <div className='space-y-2 mb-3'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('dof')}
        >
          <p className='font-bold text-sm'>Depth of Field</p>
          <button
            type='button'
            onClick={() => toggleSection('dof')}
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.dof ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.dof && (
          <>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Focus:</label>
              <input
                type='range'
                min='0.1'
                max='20'
                step='0.01'
                value={props.dofParams.focus}
                onInput={handleDOFInput('focus')}
                onChange={handleDOFChange('focus')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.dofParams.focus.toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Aperture:</label>
              <input
                type='range'
                min='0.001'
                max='0.2'
                step='0.001'
                value={props.dofParams.aperture}
                onInput={handleDOFInput('aperture')}
                onChange={handleDOFChange('aperture')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.dofParams.aperture.toFixed(3)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Max Blur:</label>
              <input
                type='range'
                min='0.001'
                max='2'
                step='0.001'
                value={props.dofParams.maxblur}
                onInput={handleDOFInput('maxblur')}
                onChange={handleDOFChange('maxblur')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.dofParams.maxblur.toFixed(3)}</span>
            </div>
            {/* info: current focus distance (auto) */}
            <div className='text-xs text-gray-500 mt-2'>
              Current Focus Distance (auto): <span className='font-mono'>{props.liveFocusDistance.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Final Pass controls */}
      <div className='space-y-2 mb-3'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('finalPass')}
        >
          <p className='font-bold text-sm'>Final Pass</p>
          <button
            type='button'
            onClick={() => toggleSection('finalPass')}
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.finalPass ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.finalPass && (
          <>
            <div className='flex items-center gap-2'>
              <label className='flex-1'>Gain:</label>
              <input
                type='range'
                min='0.1'
                max='3'
                step='0.01'
                value={props.finalPassParams.gain}
                onInput={handleFinalPassChange('gain')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.finalPassParams.gain.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Contrast:</label>
              <input
                type='range'
                min='0.1'
                max='3'
                step='0.01'
                value={props.finalPassParams.contrast}
                onInput={handleFinalPassChange('contrast')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.finalPassParams.contrast.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Chroma Strength:</label>
              <input
                type='range'
                min='0'
                max='0.01'
                step='0.0001'
                value={props.finalPassParams.chromaStrength}
                onInput={handleFinalPassChange('chromaStrength')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.finalPassParams.chromaStrength.toFixed(4)}</span>
            </div>
          </>
        )}
      </div>

      {/* Corruption controls */}
      <div className='space-y-2 mb-3'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('corruption')}
        >
          <p className='font-bold text-sm'>CRT Corruption</p>
          <button
            type='button'
            onClick={() => toggleSection('corruption')}
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.corruption ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.corruption && (
          <>
            <div className='text-text-tertiary text-xs mb-2'>
              <p className='mb-1'>
                <strong>Effect:</strong> Adds CRT-style corruption effects with glitches, static, and distortion.
              </p>
              <p className='mb-1'>
                <strong>Tip:</strong> Use scroll to trigger corruption, or manually enable it here.
              </p>
            </div>

            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={props.corruptionParams.enabled}
                onChange={handleCorruptionToggle('enabled')}
                className='mr-1'
              />
              Enable Corruption
            </label>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Intensity:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.corruptionParams.intensity}
                onInput={handleCorruptionIntensityInput}
                className='flex-1'
                disabled={!props.corruptionParams.enabled}
              />
              <span className='w-12 text-right'>{props.corruptionParams.intensity.toFixed(2)}</span>
            </div>

            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={props.corruptionParams.timeEnabled}
                onChange={handleCorruptionToggle('timeEnabled')}
                className='mr-1'
                disabled={!props.corruptionParams.enabled}
              />
              Enable Time Animation
            </label>

            {/* Existing Effect Controls */}
            <div className='mt-3 pt-3 border-t border-border-subtle'>
              <p className='font-bold text-xs mb-2'>Core Effects</p>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Static Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='2'
                  step='0.01'
                  value={props.corruptionParams.staticIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      staticIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled}
                />
                <span className='w-12 text-right'>{(props.corruptionParams.staticIntensity ?? 0.8).toFixed(2)}</span>
              </div>

              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.rgbDistortionEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      rgbDistortionEnabled: checked,
                    })
                  }}
                  className='mr-1'
                  disabled={!props.corruptionParams.enabled}
                />
                RGB Distortion
              </label>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>RGB Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='50'
                  step='0.1'
                  value={props.corruptionParams.rgbDistortionIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      rgbDistortionIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.rgbDistortionEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.rgbDistortionIntensity.toFixed(1)}</span>
              </div>

              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.whiteNoiseEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      whiteNoiseEnabled: checked,
                    })
                  }}
                  className='mr-1'
                  disabled={!props.corruptionParams.enabled}
                />
                White Noise
              </label>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Noise Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='2'
                  step='0.01'
                  value={props.corruptionParams.whiteNoiseIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      whiteNoiseIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.whiteNoiseEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.whiteNoiseIntensity.toFixed(2)}</span>
              </div>

              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.blockCorruptionEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      blockCorruptionEnabled: checked,
                    })
                  }}
                  className='mr-1'
                  disabled={!props.corruptionParams.enabled}
                />
                Block Corruption
              </label>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Block Rate:</label>
                <input
                  type='range'
                  min='1'
                  max='50'
                  step='0.1'
                  value={props.corruptionParams.blockCorruptionRate}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      blockCorruptionRate: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.blockCorruptionEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.blockCorruptionRate.toFixed(1)}</span>
              </div>

              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.waveNoiseEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      waveNoiseEnabled: checked,
                    })
                  }}
                  className='mr-1'
                  disabled={!props.corruptionParams.enabled}
                />
                Wave Distortion
              </label>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Wave Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='2'
                  step='0.01'
                  value={props.corruptionParams.waveNoiseIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      waveNoiseIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.waveNoiseEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.waveNoiseIntensity.toFixed(2)}</span>
              </div>

              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.shakeEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      shakeEnabled: checked,
                    })
                  }}
                  className='mr-1'
                  disabled={!props.corruptionParams.enabled}
                />
                Screen Shake
              </label>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Shake Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='50'
                  step='0.1'
                  value={props.corruptionParams.shakeIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      shakeIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.shakeEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.shakeIntensity.toFixed(1)}</span>
              </div>
            </div>

            {/* Pixel Bleed Effect Controls */}
            <div className='mt-3 pt-3 border-t border-border-subtle'>
              <p className='font-bold text-xs mb-2'>Pixel Bleed Effect</p>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.pixelBleedEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedEnabled: checked,
                      // Reset intensity to 0 when disabling
                      pixelBleedIntensity: checked ? props.corruptionParams.pixelBleedIntensity : 0.0,
                    })
                  }}
                  disabled={!props.corruptionParams.enabled}
                />
                <label className='flex-1'>Enable Pixel Bleed</label>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Bleed Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.pixelBleedIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedIntensity.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Chunk Size:</label>
                <input
                  type='range'
                  min='5'
                  max='200'
                  step='5'
                  value={props.corruptionParams.pixelBleedChunkSize}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedChunkSize: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedChunkSize.toFixed(0)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Chunk Randomness:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.pixelBleedChunkRandomness}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedChunkRandomness: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedChunkRandomness.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Stretch Distance:</label>
                <input
                  type='range'
                  min='0'
                  max='0.5'
                  step='0.01'
                  value={props.corruptionParams.pixelBleedStretchDistance}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedStretchDistance: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedStretchDistance.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Geometry Complexity:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.pixelBleedGeometryComplexity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedGeometryComplexity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedGeometryComplexity.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Persistence:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.pixelBleedPersistence}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedPersistence: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedPersistence.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Regeneration Rate:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.pixelBleedRegenerationRate}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      pixelBleedRegenerationRate: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.pixelBleedEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.pixelBleedRegenerationRate.toFixed(2)}</span>
              </div>
            </div>

            {/* Large Block Corruption Controls */}
            <div className='mt-3 pt-3 border-t border-border-subtle'>
              <p className='font-bold text-xs mb-2'>Large Block Corruption</p>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.largeBlockEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      largeBlockEnabled: checked,
                      // Reset intensity to 0 when disabling
                      largeBlockIntensity: checked ? props.corruptionParams.largeBlockIntensity : 0.0,
                    })
                  }}
                  disabled={!props.corruptionParams.enabled}
                />
                <label className='flex-1'>Enable Large Block Corruption</label>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Block Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.largeBlockIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      largeBlockIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.largeBlockEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.largeBlockIntensity.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Block Size:</label>
                <input
                  type='range'
                  min='1'
                  max='100'
                  step='1'
                  value={props.corruptionParams.largeBlockSize}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      largeBlockSize: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.largeBlockEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.largeBlockSize.toFixed(0)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Block FPS:</label>
                <input
                  type='range'
                  min='1'
                  max='30'
                  step='1'
                  value={props.corruptionParams.largeBlockFPS}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      largeBlockFPS: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.largeBlockEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.largeBlockFPS.toFixed(0)}</span>
              </div>
            </div>

            {/* Artifact Noise Controls */}
            <div className='mt-3 pt-3 border-t border-border-subtle'>
              <p className='font-bold text-xs mb-2'>Artifact Noise</p>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={props.corruptionParams.artifactNoiseEnabled}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      artifactNoiseEnabled: checked,
                      // Reset intensity to 0 when disabling
                      artifactNoiseIntensity: checked ? props.corruptionParams.artifactNoiseIntensity : 0.0,
                    })
                  }}
                  disabled={!props.corruptionParams.enabled}
                />
                <label className='flex-1'>Enable Artifact Noise</label>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Artifact Intensity:</label>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={props.corruptionParams.artifactNoiseIntensity}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      artifactNoiseIntensity: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.artifactNoiseEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.artifactNoiseIntensity.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Chunk Size:</label>
                <input
                  type='range'
                  min='1'
                  max='200'
                  step='1'
                  value={props.corruptionParams.artifactChunkSize}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      artifactChunkSize: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.artifactNoiseEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.artifactChunkSize.toFixed(0)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Shift Amount:</label>
                <input
                  type='range'
                  min='0'
                  max='2'
                  step='0.01'
                  value={props.corruptionParams.artifactShiftAmount}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      artifactShiftAmount: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.artifactNoiseEnabled}
                />
                <span className='w-12 text-right'>{props.corruptionParams.artifactShiftAmount.toFixed(2)}</span>
              </div>

              <div className='flex items-center gap-2'>
                <label className='flex-1'>Artifact FPS:</label>
                <input
                  type='range'
                  min='1'
                  max='30'
                  step='1'
                  value={props.corruptionParams.artifactNoiseFPS ?? 10.0}
                  onInput={(e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value)
                    props.onCorruptionChange({
                      ...props.corruptionParams,
                      artifactNoiseFPS: value,
                    })
                  }}
                  className='flex-1'
                  disabled={!props.corruptionParams.enabled || !props.corruptionParams.artifactNoiseEnabled}
                />
                <span className='w-12 text-right'>{(props.corruptionParams.artifactNoiseFPS ?? 10.0).toFixed(0)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* selective colorization controls */}
      <div className='space-y-2'>
        <div
          className='flex items-center justify-between mb-2 cursor-pointer'
          onClick={() => toggleSection('colorization')}
        >
          <p className='font-bold text-sm'>Selective Colorization</p>
          <button
            type='button'
            onClick={() => toggleSection('colorization')}
            className='text-xs px-2 py-1 rounded-theme-sm bg-border-primary hover:bg-border-subtle'
          >
            {sectionsExpanded.colorization ? '−' : '+'}
          </button>
        </div>

        {sectionsExpanded.colorization && (
          <>
            <div className='text-text-tertiary text-xs mb-2'>
              <p className='mb-1'>
                <strong>Effect:</strong> Makes video background grayscale except for areas that meet brightness/saturation criteria.
              </p>
              <p className='mb-1'>
                <strong>Tip:</strong> Increase video background opacity above to see the effect more clearly.
              </p>
            </div>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={props.selectiveColorizationParams.enabled}
                onChange={handleColorizationToggle}
                className='mr-1'
              />
              Enable Selective Colorization
            </label>

            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={props.selectiveColorizationParams.useThemeColors}
                onChange={handleColorizationChange('useThemeColors')}
                className='mr-1'
              />
              Use Theme Colors
            </label>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Primary Target:</label>
              <input
                type='color'
                value={props.selectiveColorizationParams.primaryTargetColor}
                onChange={handleColorizationChange('primaryTargetColor')}
                className='w-8 h-6 border border-border-primary rounded-theme-sm'
              />
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Secondary Target:</label>
              <input
                type='color'
                value={props.selectiveColorizationParams.secondaryTargetColor}
                onChange={handleColorizationChange('secondaryTargetColor')}
                className='w-8 h-6 border border-border-primary rounded-theme-sm'
              />
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Brightness Weight:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.selectiveColorizationParams.targeting.brightnessWeight}
                onInput={handleColorizationChange('targeting.brightnessWeight')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.selectiveColorizationParams.targeting.brightnessWeight.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Saturation Weight:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.selectiveColorizationParams.targeting.saturationWeight}
                onInput={handleColorizationChange('targeting.saturationWeight')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.selectiveColorizationParams.targeting.saturationWeight.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Brightness Threshold:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.selectiveColorizationParams.targeting.brightnessThreshold}
                onInput={handleColorizationChange('targeting.brightnessThreshold')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.selectiveColorizationParams.targeting.brightnessThreshold.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Saturation Threshold:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.selectiveColorizationParams.targeting.saturationThreshold}
                onInput={handleColorizationChange('targeting.saturationThreshold')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.selectiveColorizationParams.targeting.saturationThreshold.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Blend Smoothness:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.selectiveColorizationParams.targeting.blendSmoothness}
                onInput={handleColorizationChange('targeting.blendSmoothness')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.selectiveColorizationParams.targeting.blendSmoothness.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Blend Mode:</label>
              <select
                value={props.selectiveColorizationParams.colorBlending.blendMode}
                onChange={handleColorizationChange('colorBlending.blendMode')}
                className='flex-1 bg-surface-primary border border-border-primary rounded-theme-sm px-2 py-1 text-xs text-text-primary'
              >
                <option value='mixed'>Mixed</option>
                <option value='overlay'>Overlay</option>
                <option value='multiply'>Multiply</option>
              </select>
            </div>

            <div className='flex items-center gap-2'>
              <label className='flex-1'>Blend Balance:</label>
              <input
                type='range'
                min='0'
                max='1'
                step='0.01'
                value={props.selectiveColorizationParams.colorBlending.blendBalance}
                onInput={handleColorizationChange('colorBlending.blendBalance')}
                className='flex-1'
              />
              <span className='w-12 text-right'>{props.selectiveColorizationParams.colorBlending.blendBalance.toFixed(2)}</span>
            </div>

            <div className='flex items-center gap-3 mt-2'>
              <span>Highlight:</span>
              <span
                className='w-6 h-4 inline-block rounded-theme-sm border border-border-primary'
                style={{ backgroundColor: props.themeColors.highlight }}
              />
              <span className='ml-2'>Shadow:</span>
              <span
                className='w-6 h-4 inline-block rounded-theme-sm border border-border-primary'
                style={{ backgroundColor: props.themeColors.shadow }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
