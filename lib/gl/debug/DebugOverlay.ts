/**
 * DebugOverlay.ts
 * Adds UI instructions and a debug panel for live scene inspection and tuning
 * Only visible when debug mode is enabled via query parameter or cookie
 */

import controlsConfig from '@libgl/configControls.json' with { type: 'json' }
import { isDebugModeEnabled, setDebugMode } from '@lib/debug/index.ts'

/**
 * Configuration options for the debug overlay
 */
export type DebugOverlayOptions = {
  /** Whether to show instruction text */
  showInstructions?: boolean
  /** Whether to show the debug panel */
  showDebugPanel?: boolean
  /** Force debug state (overrides query param/cookie check) */
  forceDebug?: boolean
  /** Callback when debug mode is toggled */
  onToggleDebug?: (enabled: boolean) => void
  /** Callback when depth of field parameters change */
  onChangeDOF?: (params: { focus?: number; aperture?: number; maxblur?: number }) => void
}

/**
 * Parameters for depth of field controls
 */
export type DOFParams = {
  /** Focus distance */
  focus: number
  /** Aperture size */
  aperture: number
  /** Maximum blur amount */
  maxblur: number
}

/**
 * Metadata for DOF change events
 */
export type DOFChangeMeta = {
  /** Type of event that triggered the change */
  eventType?: string
}

export type DebugOverlayType = {
  updateDOFControls: (params: DOFParams, onChange: (params: DOFParams, meta?: DOFChangeMeta) => void) => void
  setDebugInfo: (html: string) => void
  destroy: () => void
  isAvailable: () => boolean
  bokehPass?: { materialBokeh: { uniforms: { focus: { value: number }; aperture: { value: number }; maxblur: { value: number } } } }
}

/**
 * Debug overlay for 3D scene inspection and parameter tuning
 * Provides keyboard shortcuts and UI controls for debugging
 *
 * @example
 * ```typescript
 * const debugOverlay = new DebugOverlay(containerElement, {
 *   initialDebug: false,
 *   onToggleDebug: (enabled) => console.log('Debug:', enabled),
 *   onChangeDOF: (params) => updateDOF(params)
 * })
 * ```
 */
export class DebugOverlay implements DebugOverlayType {
  /** The container element for the debug overlay */
  private readonly container: HTMLElement
  /** Instructions div element */
  private readonly instructions: HTMLDivElement
  /** Debug panel div element */
  private readonly debugPanel: HTMLDivElement
  /** Current debug enabled state */
  private debugEnabled: boolean
  /** Configuration options */
  private readonly options: DebugOverlayOptions
  /** Bokeh pass */
  public bokehPass?: { materialBokeh: { uniforms: { focus: { value: number }; aperture: { value: number }; maxblur: { value: number } } } }

  /**
   * Create a new debug overlay
   * Only creates visible overlay if debug mode is enabled
   *
   * @param container - The HTML element to attach the overlay to
   * @param options - Configuration options for the overlay
   */
  constructor(container: HTMLElement, options: DebugOverlayOptions = {}) {
    this.container = container
    this.options = options
    this.debugEnabled = options.forceDebug ?? isDebugModeEnabled()
    this.instructions = document.createElement('div')
    this.debugPanel = document.createElement('div')

    // Only set up the overlay if debug mode is enabled
    if (this.debugEnabled || options.forceDebug !== undefined) {
      this.setup()
      this.setDebug(this.debugEnabled)
      globalThis.addEventListener('keydown', this.handleKey)
    }
  }

  /**
   * Set up the debug panel DOM elements and styling
   * @private
   */
  private setup(): void {
    // Debug panel (now includes instructions at the top)
    this.debugPanel.style.position = 'absolute'
    this.debugPanel.style.top = '10px'
    this.debugPanel.style.left = '10px'
    this.debugPanel.style.background = 'rgba(0,0,0,0.8)'
    this.debugPanel.style.color = 'white'
    this.debugPanel.style.padding = '12px'
    this.debugPanel.style.borderRadius = '8px'
    this.debugPanel.style.fontSize = '13px'
    this.debugPanel.style.fontFamily = 'monospace'
    this.debugPanel.style.zIndex = '1000'
    this.debugPanel.style.display = 'none'
    this.debugPanel.style.pointerEvents = 'none' // Panel background is always transparent to pointer events
    this.debugPanel.style.maxWidth = '320px'
    this.debugPanel.style.maxHeight = '80vh'
    this.debugPanel.style.overflow = 'auto'
    this.container.appendChild(this.debugPanel)
  }

  /**
   * Handle keyboard events for debug shortcuts
   * @private
   * @param e - The keyboard event
   */
  private handleKey = (e: KeyboardEvent): void => {
    if (controlsConfig.inputKeys.toggleDebug?.includes(e.key)) {
      // If debug overlay wasn't initialized, check if we should enable it now
      if (!this.isAvailable() && isDebugModeEnabled()) {
        this.setup()
        globalThis.addEventListener('keydown', this.handleKey)
      }
      this.toggleDebug()
    }
  }

  /**
   * Set the debug panel visibility state
   * Only works if debug overlay is available
   *
   * @param enabled - Whether to show the debug panel
   * @public
   */
  public setDebug(enabled: boolean): void {
    if (!this.isAvailable()) return

    this.debugEnabled = enabled
    this.debugPanel.style.display = enabled ? 'block' : 'none'
    if (this.options.onToggleDebug) this.options.onToggleDebug(enabled)
    setDebugMode(enabled)
  }

  /**
   * Toggle the debug panel visibility
   * Only works if debug overlay is available
   * @public
   */
  public toggleDebug(): void {
    if (!this.isAvailable()) return
    this.setDebug(!this.debugEnabled)
  }

  /**
   * Update the depth of field controls in the debug panel
   * Creates interactive sliders for focus, aperture, and max blur parameters
   *
   * @param params - Current DOF parameter values
   * @param onChange - Callback function when parameters change
   * @public
   *
   * @example
   * ```typescript
   * debugOverlay.updateDOFControls(
   *   { focus: 5.0, aperture: 0.025, maxblur: 0.01 },
   *   (newParams, meta) => {
   *     if (meta?.eventType === 'change') {
   *       // Final value committed
   *       applyDOFSettings(newParams)
   *     }
   *   }
   * )
   * ```
   */
  public updateDOFControls(
    params: DOFParams,
    onChange: (
      params: DOFParams,
      meta?: DOFChangeMeta,
    ) => void,
  ): void {
    // Build DOF controls with instructions at the top
    this.debugPanel.innerHTML = `
      <div id="debug-panel-content" style="pointer-events:none;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-weight:bold; font-size:15px; letter-spacing:1px;">Debug Mode</span>
          <button id="dof-close" style="background:none; border:none; color:#fff; font-size:20px; font-weight:bold; cursor:pointer; margin-left:12px; line-height:1; padding:2px 8px; pointer-events:auto;">&times;</button>
        </div>
        <div style="font-size:12px; color:#fff; opacity:0.7; margin-bottom:8px;">
          <b>Controls remain fully enabled in debug mode.</b>
          <ul style="margin:4px 0 4px 18px; padding:0;">
            <li>Move mouse to rotate</li>
            <li>Click and drag to orbit</li>
            <li>Scroll to zoom</li>
          </ul>
          <b>Hotkeys:</b>
          <ul style="margin:4px 0 4px 18px; padding:0;">
            <li><b>${controlsConfig.inputKeys.toggleDebug?.[0]?.toUpperCase() || 'D'}</b>: Toggle debug panel</li>
            <li><b>${controlsConfig.inputKeys.toggleRotation[0].toUpperCase()}</b>: Toggle auto-rotation</li>
            <li><b>${controlsConfig.inputKeys.regenerateLayers[0].toUpperCase()}</b>: Regenerate layers</li>
          </ul>
        </div>
        <div style="pointer-events:auto;">
          <label>Focus: <input type="range" min="0.1" max="20" step="0.01" value="${params.focus}" id="dof-focus"></label> <span id="dof-focus-val">${params.focus}</span><br>
          <label>Aperture: <input type="range" min="0.001" max="0.2" step="0.001" value="${params.aperture}" id="dof-aperture"></label> <span id="dof-aperture-val">${params.aperture}</span><br>
          <label>Max Blur: <input type="range" min="0.001" max="2" step="0.001" value="${params.maxblur}" id="dof-maxblur"></label> <span id="dof-maxblur-val">${params.maxblur}</span><br>
        </div>
        <hr>
        <div id="debug-extra"></div>
      </div>
    `
    // After setting innerHTML, set pointer-events:auto on interactive elements
    const closeBtn = this.debugPanel.querySelector('#dof-close') as HTMLButtonElement
    if (closeBtn) closeBtn.style.pointerEvents = 'auto'
    const focusInput = this.debugPanel.querySelector('#dof-focus') as HTMLInputElement
    if (focusInput) focusInput.style.pointerEvents = 'auto'
    const apertureInput = this.debugPanel.querySelector('#dof-aperture') as HTMLInputElement
    if (apertureInput) apertureInput.style.pointerEvents = 'auto'
    const maxblurInput = this.debugPanel.querySelector('#dof-maxblur') as HTMLInputElement
    if (maxblurInput) maxblurInput.style.pointerEvents = 'auto'
    focusInput.oninput = () => {
      this.debugPanel.querySelector('#dof-focus-val')!.textContent = focusInput.value
      onChange({
        focus: parseFloat(focusInput.value),
        aperture: parseFloat(apertureInput.value),
        maxblur: parseFloat(maxblurInput.value),
      }, { eventType: 'input' })
    }
    focusInput.onchange = () => {
      onChange({
        focus: parseFloat(focusInput.value),
        aperture: parseFloat(apertureInput.value),
        maxblur: parseFloat(maxblurInput.value),
      }, { eventType: 'change' })
    }
    apertureInput.oninput = () => {
      this.debugPanel.querySelector('#dof-aperture-val')!.textContent = apertureInput.value
      onChange({
        focus: parseFloat(focusInput.value),
        aperture: parseFloat(apertureInput.value),
        maxblur: parseFloat(maxblurInput.value),
      }, { eventType: 'input' })
    }
    apertureInput.onchange = () => {
      onChange({
        focus: parseFloat(focusInput.value),
        aperture: parseFloat(apertureInput.value),
        maxblur: parseFloat(maxblurInput.value),
      }, { eventType: 'change' })
    }
    maxblurInput.oninput = () => {
      this.debugPanel.querySelector('#dof-maxblur-val')!.textContent = maxblurInput.value
      onChange({
        focus: parseFloat(focusInput.value),
        aperture: parseFloat(apertureInput.value),
        maxblur: parseFloat(maxblurInput.value),
      }, { eventType: 'input' })
    }
    maxblurInput.onchange = () => {
      onChange({
        focus: parseFloat(focusInput.value),
        aperture: parseFloat(apertureInput.value),
        maxblur: parseFloat(maxblurInput.value),
      }, { eventType: 'change' })
    }
    closeBtn.onclick = () => this.setDebug(false)
  }

  /**
   * Set additional debug information HTML content
   * Adds custom content to the debug panel's extra section
   *
   * @param html - HTML string to display in the debug info section
   * @public
   *
   * @example
   * ```typescript
   * debugOverlay.setDebugInfo(`
   *   <div>Frame Rate: ${fps} FPS</div>
   *   <div>Triangles: ${triangleCount}</div>
   * `)
   * ```
   */
  public setDebugInfo(html: string): void {
    const extra = this.debugPanel.querySelector('#debug-extra')
    if (extra) extra.innerHTML = html
  }

  /**
   * Clean up the debug overlay and remove event listeners
   * Call this when the overlay is no longer needed to prevent memory leaks
   *
   * @public
   */
  public destroy(): void {
    globalThis.removeEventListener('keydown', this.handleKey)
    this.container.removeChild(this.debugPanel)
  }

  /**
   * Check if debug overlay is available (was initialized)
   * @public
   */
  public isAvailable(): boolean {
    return this.debugEnabled || this.options.forceDebug !== undefined
  }
}
