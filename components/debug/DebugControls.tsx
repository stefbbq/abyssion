import controlsConfig from '@libgl/configControls.json' with { type: 'json' }
import { currentThemeFamilyName, getAllThemeFamilies, setThemeFamily } from '@lib/theme/index.ts'

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

type Props = {
  // whether the controls are visible
  visible: boolean
  // current DOF parameters
  dofParams: DOFParams
  // current tone mapping parameters
  toneMapParams: ToneMapParams
  // current theme colors
  themeColors: ThemeColors
  // callback when DOF parameters change
  onDOFChange: (params: DOFParams, meta?: { eventType: string }) => void
  // callback when tone mapping parameters change
  onToneMapChange: (params: ToneMapParams) => void
  // callback to close the debug panel
  onClose: () => void
}

/**
 * debug controls component
 * renders controls for DOF, tone mapping, theme switching, and hotkey info
 */
export const DebugControls = (props: Props) => {
  if (!props.visible) return null

  const availableThemes = getAllThemeFamilies()
  const currentTheme = currentThemeFamilyName.value

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

  const handleToneMapToggle = (e: Event) => {
    const target = e.target as HTMLInputElement
    props.onToneMapChange({
      ...props.toneMapParams,
      enabled: target.checked,
    })
  }

  const handleToneMapBlend = (e: Event) => {
    const target = e.target as HTMLInputElement
    props.onToneMapChange({
      ...props.toneMapParams,
      blendAmount: parseFloat(target.value),
    })
  }

  const handleThemeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    setThemeFamily(target.value)
  }

  return (
    <div
      className='fixed top-4 left-4 glass-effect rounded-theme-lg p-3 font-mono text-xs text-text-primary max-w-xs'
      style={{ zIndex: 2000 }}
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

      {/* instructions */}
      <div className='text-text-secondary mb-3'>
        <p className='font-bold mb-1'>Controls remain fully enabled in debug mode.</p>
        <ul className='ml-4 mb-2 space-y-0.5'>
          <li>Move mouse to rotate</li>
          <li>Click and drag to orbit</li>
          <li>Scroll to zoom</li>
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

      {/* theme selector */}
      <div className='space-y-2 mb-3'>
        <p className='font-bold text-sm mb-2'>Theme Selector</p>
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
          Current: <span className='font-semibold'>{currentTheme.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
        </div>
      </div>

      <hr className='border-border-subtle my-3' />

      {/* DOF controls */}
      <div className='space-y-2 mb-3'>
        <p className='font-bold text-sm mb-2'>Depth of Field</p>
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
      </div>

      <hr className='border-border-subtle my-3' />

      {/* tone mapping controls */}
      <div className='space-y-2'>
        <p className='font-bold text-sm mb-2'>Tone Mapping</p>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={props.toneMapParams.enabled}
            onChange={handleToneMapToggle}
            className='mr-1'
          />
          Enable Tone Mapping
        </label>
        <div className='flex items-center gap-2'>
          <label className='flex-1'>Blend Amount:</label>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={props.toneMapParams.blendAmount}
            onInput={handleToneMapBlend}
            className='flex-1'
          />
          <span className='w-12 text-right'>{props.toneMapParams.blendAmount.toFixed(2)}</span>
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
      </div>
    </div>
  )
}
