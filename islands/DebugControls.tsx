import controlsConfig from '@libgl/configControls.json' with { type: 'json' }
import { currentThemeFamilyName, currentThemeMode, getAllThemeFamilies, setThemeFamily } from '@lib/theme/index.ts'
import { useState } from 'preact/hooks'

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

/** the props for DebugControls */
type Props = {
  // whether the controls are visible
  visible: boolean
  // current DOF parameters
  dofParams: DOFParams
  // current selective colorization parameters
  selectiveColorizationParams: SelectiveColorizationParams
  // current theme colors
  themeColors: ThemeColors
  // callback when DOF parameters change
  onDOFChange: (params: DOFParams, meta?: { eventType: string }) => void
  // callback when selective colorization parameters change
  onSelectiveColorizationChange: (params: SelectiveColorizationParams) => void
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
}

/**
 * debug controls component
 * renders controls for DOF, tone mapping, theme switching, and hotkey info
 */
export const DebugControls = (props: Props) => {
  if (!props.visible) return null

  const availableThemes = getAllThemeFamilies()
  const currentTheme = currentThemeFamilyName.value

  // Collapsible sections state
  const [sectionsExpanded, setSectionsExpanded] = useState({
    glControls: true,
    homepageControls: false,
    theme: true,
    dof: false,
    colorization: false,
  })

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
      className='fixed bottom-4 right-4 rounded-theme-lg p-3 font-mono text-xs text-black max-w-xs bg-white/80 backdrop-blur-sm'
      style={{ zIndex: 2000, minWidth: '280px' }}
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
        <div className='flex items-center justify-between mb-2'>
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

      <hr className='border-border-subtle my-3' />

      {/* instructions */}
      <div className='space-y-2 mb-3'>
        <div className='flex items-center justify-between mb-2'>
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
        )}
      </div>

      {/* theme selector */}
      <div className='space-y-2 mb-3'>
        <div className='flex items-center justify-between mb-2'>
          <p className='font-bold text-sm'>Theme Selector</p>
          <button
            type='button'
            onClick={() => toggleSection('theme')}
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

      <hr className='border-border-subtle my-3' />

      {/* DOF controls */}
      <div className='space-y-2 mb-3'>
        <div className='flex items-center justify-between mb-2'>
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
          </>
        )}
      </div>

      <hr className='border-border-subtle my-3' />

      {/* selective colorization controls */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between mb-2'>
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
