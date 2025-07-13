# Codex

Reference for the codebase structure.
Use this as a starting point before doing anything!

## Core Architecture

- **Routing**: Fresh-based, with a partial-first approach for SPA-like navigation. Global UI is controlled by `_app.tsx` and `data/pages.json`.
- **Access Control**: Centralized in `routes/_middleware.ts` for `debugOnly` pages.
- **Data & Types**: All static content is in `/data`, with all corresponding TypeScript types co-located in `data/types.ts`.
- **Theme & Styling**: A unified, CSS-variable-driven system. See the "Theme System" section for details.
- **3D Scene**: Managed via `/scene`, `/gl`, and related directories, containing all Three.js logic.

## Theme System

The application uses a reactive, CSS-variable-driven theme system that supports dynamic switching between light and dark modes without page reloads. Theme preferences are automatically saved to cookies for persistent user experience.

### Theme Definitions

- **Available Themes:**
  - All themes are defined in `lib/theme/themes/` (e.g., `deepSpaceHUD`, `deepSpaceHUDLight`, `synthwave`, `glitchCore`, `geomodAtlas`, `hypertag`, `monochrome`, `neonGridOS`, `synthDrift`, `techscape`, `cyberpunk`).
  - Each theme is a `BaseTheme` object with a palette, mode, and variants.

### Theme Objects

- **BaseTheme:** The single source of truth, defining a color palette and a mode (`light` or `dark`).
- **UITheme:** A complete theme object generated from a `BaseTheme` by the `createTheme()` function. It contains all color, spacing, and effect values, and is the source for all CSS variables.
- **Transformation:** `createTheme(baseTheme)` transforms a `BaseTheme` into a `UITheme` with all computed values and CSS variable support.

### Theme Signals & Switching

- **currentTheme:** A computed signal holding the current `UITheme` object. Use this for theme-aware logic.
- **currentBaseTheme:** A signal holding the current `BaseTheme` object. Used by components like `ThemeSwitcher` for reactive theme display.
- **currentThemeMode:** A signal holding the current mode (`'light'` | `'dark'`).
- **toggleThemeMode() / setThemeMode():** Functions to toggle or set the theme mode. Switching is instant and client-side.
- **switchToNextThemeFamily():** Cycles through available theme families while preserving the current light/dark mode.
- **ThemeProvider Island:** Injects and dynamically updates the theme's CSS variables in the document head. Listens for theme changes and enables instant toggling.

### Cookie Persistence

Theme preferences are automatically saved to browser cookies with 1-year expiration:
- **Theme Family:** Saved as `abyssion-theme-family` cookie when switching between theme families
- **Light/Dark Mode:** Saved as `abyssion-theme-mode` cookie when toggling between light and dark modes
- **Auto-Loading:** Preferences are automatically restored on page load and browser sessions
- **SSR Safe:** Cookie reading is safely handled during server-side rendering

### CSS Variables & Tailwind Integration

- All theme values (backgrounds, surfaces, text, borders, interactive states) are exposed as CSS variables (e.g., `--colors-background-primary`).
- Tailwind is configured to use these variables, so you can use semantic classes like `bg-background-primary`, `text-text-secondary`, or arbitrary values like `bg-[var(--colors-background-primary)]`.
- For alpha blending, set the variable to an `rgba` value in your theme system, or use inline style to convert a hex to `rgba` with the desired alpha.
- **Example:**

  ```tsx
  <div className="bg-[var(--colors-background-primary)] text-[var(--colors-text-primary)]" />
  // or
  <div style={{ background: 'var(--colors-background-primary)' }} />
  ```

### Theme Visualizer

- **ThemeVisualizer Island:** An interactive UI for previewing and switching between all available themes. Located at `/theme` route. Uses the same theme system and signals as the rest of the app.

### Themed Background System

- **ThemedBackground Island:** Manages the dynamic background overlay that appears on content pages (not homepage)
- **Theme-Aware Opacity:** Uses `backgroundOpacity.light` and `backgroundOpacity.dark` values from the current theme
- **Route-Dependent:** Automatically hides on homepage to show GL canvas, appears with theme opacity on content pages
- **Real-Time Updates:** Opacity updates instantly when switching themes or toggling light/dark mode
- **Noise Animation:** Includes subtle animated noise texture overlay for visual interest

### 3D/GL Theme System

- **GL Theme System:** Located in `lib/gl/theme/`, this system extends `BaseTheme` for 3D rendering (Three.js). It provides additional colors for overlays, geometric elements, and lens flares.
- **getGLTheme():** Returns a `GLTheme` object based on the current base theme, used for 3D scene rendering.
- **Real-Time Theme Updates:** The GL system supports real-time theme switching without reloading. Video background selective colorization and other GL effects automatically update their colors when themes change.
- **Selective Colorization:** The video background features advanced selective colorization that:
  - Grayscales the video while preserving high brightness/saturation areas
  - Uses dual theme colors (primary and accent) with flexible blending modes
  - Supports configurable targeting (brightness-based, saturation-based, or mixed)
  - Provides smooth transitions using `smoothstep` for natural blending
  - Updates instantly when themes change via the shared animation behaviors
- **Post-Processing Integration:** Visual effects in Three.js (such as glitch bands and bloom highlights) are fully theme-aware and update instantly with theme changes. The canonical way to access theme colors for any Three.js effect is to call `getGLTheme()` and use its fields (e.g., `primary`, `accent`, `secondary`, or any of the `ui`, `geometric`, or `lensFlare` colors).

#### Selective Colorization Configuration

The selective colorization system is configured via `configScene.json` under `postProcessingConfig.selectiveColorization`:

```json
{
  "selectiveColorization": {
    "enabled": true,
    "useThemeColors": true,
    "targeting": {
      "brightnessWeight": 0.6,        // Weight for brightness detection (0.0-1.0)
      "saturationWeight": 0.8,        // Weight for saturation detection (0.0-1.0)
      "brightnessThreshold": 0.7,     // Brightness cutoff (0.0-1.0)
      "saturationThreshold": 0.5,     // Saturation cutoff (0.0-1.0)
      "blendSmoothness": 0.1          // Transition smoothness (0.01-0.5)
    },
    "colorBlending": {
      "blendMode": "mixed",           // "brightness" | "saturation" | "mixed"
      "blendBalance": 0.3             // Primary vs secondary color balance (0.0-1.0)
    }
  }
}
```

- **Targeting Modes:** Control how areas are detected for colorization based on brightness and/or saturation
- **Blending Modes:** Determine how primary and secondary theme colors are mixed
- **Real-time Updates:** All settings are applied immediately and update with theme changes

## Visual Effects & Shaders

The application features an advanced shader system for post-processing effects, built on Three.js with a modular GLSL architecture.

### Shader Architecture

- **Location:** `/lib/gl/shaders/` contains all shader implementations
- **Modular GLSL:** Uses a `#pragma include` system for reusable utility functions
- **Type Safety:** All shaders are converted to TypeScript modules via build process
- **Utility Functions:** Located in `/lib/gl/shaders/glsl/utils/` for shared functionality

#### GLSL Utilities

Core utility functions available for all shaders:

- **`random.glsl`**: Pseudo-random number generation from 2D coordinates
- **`random2D.glsl`**: Random 2D direction vectors for movement effects  
- **`snoise3.glsl`**: 3D Simplex noise for organic patterns
- **`randomRange.glsl`**: Random values within specified ranges

### Post-Processing Pipeline

The visual effects pipeline is managed in `/lib/gl/scene/createPostProcessing.ts` and includes:

1. **Render Pass**: Base scene rendering
2. **Bokeh Pass**: Depth of field effects
3. **Bloom Pass**: Glow and light bleeding  
4. **Sharpening Pass**: Edge enhancement
5. **Pixelation Pass**: Retro pixelation effects
6. **Pixel Bleed Pass**: Advanced corruption effects *(new)*
7. **Film Pass**: Analog film grain and scanlines
8. **Final Pass**: Color grading and chromatic aberration
9. **Dithering Pass**: Noise injection to prevent banding

### Pixel Bleed Shader

The **Pixel Bleed Shader** (`PixelBleedShader.ts`) creates sophisticated digital corruption effects that sample large chunks of the image and stretch them using geometric shapes.

#### Features

- **Geometric Shapes**: Uses triangles, rectangles, and diamonds as corruption masks
- **Multi-directional Stretching**: Up to 3 stretch directions per geometric shape
- **Persistent Corruption**: Effects build and persist over time with configurable decay
- **Layered System**: Multiple corruption layers with different timescales
- **Color Distortion**: Adds hue shifting and saturation changes to corrupted areas

#### Configuration Parameters

```typescript
type PixelBleedConfig = {
  intensity: number           // Overall effect strength (0.0 - 1.0)
  chunkSize: number          // Size of corruption areas (1.0 - 100.0)  
  chunkRandomness: number    // Placement randomness (0.0 - 1.0)
  stretchDistance: number    // How far pixels stretch (0.0 - 1.0)
  geometryComplexity: number // Shape complexity (0.0 - 1.0)
  persistence: number        // Corruption buildup (0.0 - 1.0)
  regenerationRate: number   // New corruption spawn rate (0.0 - 1.0)
}
```

#### Debug Controls

The pixel bleed effect includes comprehensive debug controls accessible via the debug panel:

- **Enable/Disable Toggle**: Activate the effect with intensity control
- **Chunk Size**: Control the size of corrupted image areas
- **Chunk Randomness**: Adjust placement variation of corruption centers
- **Stretch Distance**: How far pixels are stretched from their origin
- **Geometry Complexity**: Complexity of geometric corruption shapes
- **Persistence**: How long corruption effects build up over time  
- **Regeneration Rate**: Speed of new corruption appearance

#### Implementation Details

The shader uses two main corruption layers:

1. **Long-lived Layer**: Slow-building corruption that persists over time
2. **Fast Layer**: Quick-changing corruption for dynamic variation

Each layer generates corruption centers using noise functions and applies geometric masks (triangles, rectangles, diamonds) to define affected areas. Pixels within these areas are sampled from offset positions to create the "stretching" effect, with multiple stretch directions based on the geometric shape.

#### Usage in Pipeline

```typescript
// Added to post-processing pipeline after pixelation
const pixelBleedPass = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(width, height) },
    intensity: { value: 0.0 },
    chunkSize: { value: 30.0 },
    chunkRandomness: { value: 0.5 },
    stretchDistance: { value: 0.3 },
    geometryComplexity: { value: 0.7 },
    persistence: { value: 0.6 },
    regenerationRate: { value: 0.4 },
  },
  vertexShader: pixelBleedVertexShader,
  fragmentShader: pixelBleedFragmentShader,
})
```

The effect is disabled by default and can be enabled through debug controls or programmatically via the intensity parameter.

### Font System

- The theme supports custom font families via Tailwind's `fontFamily` extension in `tailwind.config.ts`.
- **Lovecraftian font:** The `lovecraft` font family (UnifrakturCook, cursive) is available for use in blockquotes and special headings. Add `font-lovecraft` to any element to apply it.
- **Best practices:**
  - Use `font-sans` for most body text and paragraphs (`<p>`).
  - Use `font-serif` or `font-lovecraft` for headings (`<h1>`, `<h2>`, etc.) or blockquotes for thematic effect.
  - Blockquotes in Markdown are automatically styled with `font-lovecraft` via the `TextBlock` component.

## Animation System

The animation system is designed for maximum modularity, testability, and functional purity.

### Architecture

- **/animation/core/**: Pure animation engine functions (e.g., createAnimationEngine, updateAnimationEngine)
- **/animation/calculations/**: Pure calculation functions (e.g., calculateMouseRotation, calculateStaticLayerPosition)
- **/animation/utils/**: Pure utility functions (e.g., smoothRotationInterpolation, getRandomInterval)
- **/animation/createLogoAnimator.ts**: Main orchestrator (side effects isolated here)
- **/animation/types.ts**: Type definitions

### Core Principles

- **Pure functions only**: All calculations are deterministic and side-effect free
- **One function per file**: Each function lives in its own file for modularity
- **Immutable data**: No mutation, always return new values
- **Side effect isolation**: Only orchestrators perform DOM/Three.js mutations
- **Composable**: Pure functions are easy to combine for new behaviors

### API Usage

- Import orchestrators to run animation systems:

  ```typescript
  import { createLogoAnimator } from './animation'
  const animator = createLogoAnimator(dependencies)
  const cleanup = animator.start()
  ```

- Use pure calculation utilities for testable math:

  ```typescript
  import { calculateStaticLayerPosition } from './animation'
  const position = calculateStaticLayerPosition(1000, 0, 5, false)
  // Returns: { rotationX: 0, rotationY: 0, positionZ: 5.02 }
  ```

- Compose your own pure functions and use them in orchestrators for custom behaviors.

### Styling

Component styling is primarily handled by Tailwind CSS utility classes. The theme system exposes all theme values as CSS variables, which are consumed by Tailwind.

In addition to standard utilities, two custom utility classes are available in `static/styles.css` for creating blurred, semi-transparent backgrounds:

- **.glass-effect**: Used for primary content containers. It applies a lighter, more transparent blur.
- **.frost-effect**: Used for primary navigation elements (`Header`, `ActionZone`). It applies a darker, more opaque blur for better readability.

## Directory Structure

- **`/routes`**: Pages & API
  - `_app.tsx`: Main app wrapper. Renders global UI (`Header`, `ActionZone`) and the `ThemeProvider`.
  - `_middleware.ts`: Global middleware for server-side logic (e.g., `debugOnly` access).
  - `theme.tsx`: Renders the `ThemeVisualizer` island.
  - `/partials/*.tsx`: Page content for Fresh's partial navigation.

- **`/islands`**: Interactive Components
  - `ActionZoneController.tsx`: Interactive mobile navigation.
  - `ThemeProvider.tsx`: Injects theme CSS variables and handles dynamic updates.
  - `ThemeVisualizer.tsx`: UI for visualizing themes.
  - `Header.tsx`, `GLCanvas.tsx` Other major interactive components.
  - `ThemedBackground.tsx`: Dynamic background overlay that uses the current theme's CSS variable for background color and fades in/out based on route. Uses direct CSS variable access for background and Tailwind for layout/opacity transitions.
  - `DebugPanels.tsx`: Main debug overlay island. Manages debug state and renders `DebugControls` and `DebugInfo`.
  - `DebugControls.tsx`: UI for DOF/tone mapping controls and hotkey info (top-left).
  - `DebugInfo.tsx`: UI for debug info (bottom-left).

- **`/components`**: Reusable UI Components
  - `Shell.tsx`: A generic container for content sections with the `.glass-effect`.
  - `Card.tsx`: A flexible card component, supporting images and custom content, with the `.glass-effect`.
  - `ListItem.tsx`: A generic component for list items.
  - `ThemeSwitcher.tsx`: Displays current theme colors in a compact preview strip and cycles through available themes.
  - `Button.tsx`, `Dropdown.tsx`, etc.

- **`/data`**: Content & Configuration
  - `types.ts`: **Centralized TypeScript definitions** for all JSON data.
  - `pages.json`: Site-wide page configuration (`debugOnly`, `showHeader`).
  - `*.json`: Static content for pages (navigation, shows, bio).

- **`/lib/gl/configScene.types.ts`**: GL-specific type definitions including `PostProcessingConfig` and `SelectiveColorizationParams` for advanced video effects configuration.

- **`/lib`**: Core Libraries
  - `/theme`: The core UI theme system. See "Theme System" section above.
  - `/gl/theme`: The 3D-specific theme system.
  - `/debug`: Debug mode detection and control.
  - `/logger`: Structured logging system.

- **`/utils`**: Shared utility functions.
- **`/scene`, `/gl`, etc.**: All logic for the Three.js visualization.
  - `/gl/scene/`: Core scene setup including video background with selective colorization
  - `/gl/shaders/`: Custom GLSL shaders including selective video background processing
  - `/gl/textures/VideoCycle/`: Video texture management with shader material support

## Main Entry

- `index.ts` - `initGL()`, `InitOptions`, `RendererState`
- `types.ts` - Core GL types

## Theme System

### Core Theme System (`lib/theme/`)

- `types.ts` - `UITheme`, `GLTheme`, and re-exports of theme shape types
- `themes/types.ts` - `BaseTheme`, `BaseTypography`, `BaseSpacing` (theme shape types, colocated with theme definitions)
- `themes/index.ts` - Theme exports barrel
- `utils/createBaseTheme.ts` - `createBaseTheme()`
- `utils/hexToCSS.ts` - `hexToCSS()`

#### CSS Variables and Dynamic Backgrounds

The theme system exposes all theme values as CSS variables (e.g., `--colors-background-primary`). For dynamic backgrounds (such as the ThemedBackground island), these variables are accessed directly in the component. If you need alpha blending, set the variable to an `rgba` value in your theme system, or use inline style to convert a hex to `rgba` with the desired alpha. Tailwind's arbitrary value support (`bg-[var(--colors-background-primary)]`) can be used for backgrounds, but does not support alpha blending unless the variable itself is `rgba`.

ThemedBackground uses the CSS variable directly for its background and applies opacity transitions using Tailwind classes. This ensures the background always matches the current theme and transitions smoothly during navigation.

### GL Theme System (`lib/theme/`)

- `index.ts` - `getGLTheme()`, `createGLTheme()`
- `types.ts` - `GLTheme`

## Logger System

The codebase uses a structured, color-coded logger utility for all diagnostic and debug output. This logger supports log levels, context filtering, and adapts its colors to light/dark mode.

### Usage

- Import the logger and log context enum:

  ```ts
  import { log, lc } from '@lib/logger/index.ts'
  log(lc.GL, 'Hello GL!')
  log.warn(lc.PREACT, 'Warning from preact!')
  log.error(lc.GL_ANIMATION, 'Animation error:', error)
  ```

- Log levels are available as methods: `log.trace`, `log.debug`, `log.info`, `log.warn`, `log.error`, `log.critical`.
- Contexts (imported as `lc`) group logs by subsystem (e.g., `lc.GL`, `lc.GL_ANIMATION`, `lc.PREACT`).

### Log Levels

- `trace`: Very fine-grained (diagnostic)
- `debug`: Debug-level
- `info`: Informational
- `warn`: Warnings
- `error`: Errors
- `critical`: Critical errors
- `off`: Disable logging

### Context Filtering

- Disable a context: `disableContext(lc.GL_VIDEO)`
- Enable a context: `enableContext(lc.GL_VIDEO)`
- Focus on a context: `focusContext(lc.GL)` (only show logs from this context)
- Clear focus: `clearFocus()`
- Reset all filters: `resetContexts()`

### Color Coding & Theme Adaptation

- Log output is color-coded by context and log level for easy scanning.
- Colors adapt automatically to light/dark mode using the user's system preference.
- To refresh colors after a theme change, call `refreshColors()` from the logger.

### Best Practices

- Always use the appropriate context for logs (e.g., `lc.GL_GEOMETRY` for geometry-related logs).
- Use log levels to control verbosity in development vs. production.
- Use context filtering to focus on specific subsystems during debugging.

## Animation System

### Overview

The animation system has been refactored following strict functional programming principles:

- **One function per file** for maximum modularity
- **Pure functions only** - no side effects in calculations
- **Immutable data structures** throughout
- **Clear separation** between pure calculations and necessary side effects

### Architecture

```
/animation/
  /core/                    # Pure animation engine functions
    /createAnimationEngine.ts
    /updateAnimationEngine.ts
    /addBehavior.ts
    /removeBehavior.ts
  /calculations/           # Pure calculation functions
    /calculateMouseRotation.ts
    /calculateStaticLayerPosition.ts
    /calculateRandomLayerPosition.ts
  /utils/                  # Pure utility functions
    /smoothRotationInterpolation.ts
    /getRandomInterval.ts
    /timeUtils.ts
    /interpolationUtils.ts
  /createLogoAnimator.ts   # Main orchestrator
  /types.ts               # Type definitions
```

## Core Principles

### Pure Calculations

All math and position calculations are pure functions:

```typescript
// Pure function - deterministic output for given inputs
const position = calculateStaticLayerPosition(time, index, baseZPos, isStencil)
```

### Side Effect Isolation

Side effects (DOM mutations, Three.js updates) are isolated to the main orchestrator:

```typescript
// Side effects happen only in orchestrator
plane.position.x = position.positionX // Necessary side effect
```

### One Function Per File

Each function has its own file for maximum modularity:

```typescript
// /calculations/calculateMouseRotation.ts
export const calculateMouseRotation = (mouseX, mouseY, coefficient) => ({
  targetRotationX: mouseY * coefficient,
  targetRotationY: mouseX * coefficient
})
```

## Usage

### Basic Setup

```typescript
import { createLogoAnimator } from './animation'

const animator = createLogoAnimator(dependencies)
const cleanup = animator.start()
```

### Pure Calculations (Testable)

```typescript
import { calculateStaticLayerPosition } from './animation'

// Pure function - easy to test
const position = calculateStaticLayerPosition(1000, 0, 5, false)
// Returns: { rotationX: 0, rotationY: 0, positionZ: 5.02 }
```

### Custom Calculations

```typescript
// Create your own pure calculation
const calculateCustomPosition = (time, factor) => ({
  x: Math.sin(time * factor),
  y: Math.cos(time * factor)
})

// Use in your own animator
const customPosition = calculateCustomPosition(totalTime, 0.1)
plane.position.x = customPosition.x
```

## Benefits

1. **Highly Testable**: Pure functions are easy to unit test
2. **Predictable**: No hidden side effects or state mutations
3. **Modular**: Each function can be used independently
4. **Composable**: Easy to combine functions for new behaviors
5. **Debuggable**: Clear data flow makes debugging simple

## File Organization

Following the guide's "one function per file" principle:

- Each calculation is a separate file
- Each utility is a separate file  
- Each core function is a separate file
- Main orchestrator combines them all

This makes the codebase highly modular and follows pure FP principles while keeping the necessary side effects (Three.js mutations) clearly isolated.

> **Note:** All theme shape types (`BaseTheme`, `BaseTypography`, `BaseSpacing`) are now defined in `lib/theme/themes/types.ts` alongside the theme objects themselves. They are re-exported from `lib/theme/types.ts` for convenience. This keeps type definitions close to the data and supports feature-based organization.

## Debug Overlay

The debug UI is now implemented as Preact components for maintainability and composability.

- **DebugPanels Island**: The main interactive debug UI, located at `islands/DebugPanels.tsx`. It manages debug state, keyboard shortcuts, and renders the controls/info panels.
- **DebugControls Component**: Renders DOF and tone mapping controls, theme selector, hotkey info, and lives at the top-left. Located at `components/debug/DebugControls.tsx`.
- **DebugInfo Component**: Renders debug information (e.g., camera Z, plane positions) at the bottom-left. Located at `components/debug/DebugInfo.tsx`.
- The debug system is now fully reactive, theme-aware, and integrated with the rest of the app via signals and props.
- To use the debug UI, `<DebugPanels />` is rendered in `_app.tsx` after `<GLCanvas />`.

### Debug Features

**Theme Switching**: The debug panel includes a live theme selector that allows switching between all available theme families by name. This includes:

- Dropdown with all 10 theme families (Deep Space HUD, Neon Grid OS, Glitch Core, etc.)
- Real-time theme switching without page reload
- Current theme name display with proper formatting
- Maintains current light/dark mode when switching families

**DOF Controls**: Interactive sliders for depth of field parameters:

- Focus distance (0.1 - 20.0)
- Aperture size (0.001 - 0.2)
- Maximum blur amount (0.001 - 2.0)

**Tone Mapping**: Controls for post-processing effects:

- Enable/disable toggle
- Blend amount slider (0.0 - 1.0)
- Live theme color preview swatches

**Keyboard Shortcuts**: All debug hotkeys are displayed and remain active:

- **D**: Toggle debug panel visibility
- **R**: Toggle auto-rotation
- **G**: Regenerate layers

**Visual Integration**: All debug components use theme-aware styling:

- Glass morphism effects with theme-specific opacity
- Theme-aware border radius for consistent UI
- Live color updates when themes change
- Proper contrast and readability in all theme modes
