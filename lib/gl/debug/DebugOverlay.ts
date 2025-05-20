// DebugOverlay.ts
// Adds UI instructions and a debug panel for live scene inspection and tuning

export type DebugOverlayOptions = {
  showInstructions?: boolean
  showDebugPanel?: boolean
  initialDebug?: boolean
  onToggleDebug?: (enabled: boolean) => void
  onChangeDOF?: (params: { focus?: number; aperture?: number; maxblur?: number }) => void
}

export class DebugOverlay {
  private container: HTMLElement
  private instructions: HTMLDivElement
  private debugPanel: HTMLDivElement
  private debugEnabled: boolean
  private options: DebugOverlayOptions

  constructor(container: HTMLElement, options: DebugOverlayOptions = {}) {
    this.container = container
    this.options = options
    this.debugEnabled = options.initialDebug ?? false
    this.instructions = document.createElement('div')
    this.debugPanel = document.createElement('div')
    this.setup()
    this.setDebug(this.debugEnabled)
    window.addEventListener('keydown', this.handleKey)
  }

  private setup() {
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

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'd' || e.key === 'D') {
      this.toggleDebug()
    }
  }

  public setDebug(enabled: boolean) {
    this.debugEnabled = enabled
    this.debugPanel.style.display = enabled ? 'block' : 'none'
    if (this.options.onToggleDebug) this.options.onToggleDebug(enabled)
  }

  public toggleDebug() {
    this.setDebug(!this.debugEnabled)
  }

  public updateDOFControls(
    params: { focus: number; aperture: number; maxblur: number },
    onChange: (
      params: { focus: number; aperture: number; maxblur: number },
      meta?: { eventType?: string }
    ) => void,
  ) {
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
            <li><b>D</b>: Toggle debug panel</li>
            <li><b>R</b>: Toggle auto-rotation</li>
            <li><b>G</b>: Regenerate layers</li>
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

  public setDebugInfo(html: string) {
    const extra = this.debugPanel.querySelector('#debug-extra')
    if (extra) extra.innerHTML = html
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKey)
    this.container.removeChild(this.debugPanel)
  }
}
