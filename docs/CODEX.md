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

The selective colorization system is configured via `configPostProcessing.json` under `selectiveColorization`:

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

### Post-Processing Configuration

The post-processing system is now modular and configured via separate files:

- **`configPostProcessing.json`**: Contains all post-processing effect configurations with a top-level `enabled` flag
- **`configPostProcessing.types.ts`**: TypeScript type definitions for all post-processing effects
- **`configScene.json`**: Retains only the `postProcessingEnabled` flag for backward compatibility

#### Configuration Structure

```json
{
  "enabled": true,
  "bokeh": { "focus": 0, "aperture": 0.025, "maxblur": 2 },
  "bloom": { "bloomStrength": 0, "bloomThreshold": 0.2, ... },
  "film": { "noiseIntensity": 0.05, "scanlineIntensity": 1.5, ... },
  "sharpening": { "strength": 0.2, "enabled": true },
  "pixelate": { "enabled": false, "pixelSize": 16 },
  "crtScrollCorruption": { "enabled": true, ... },
  "selectiveColorization": { "enabled": false, ... },
  "lensFlare": { "lightIntensity": 0.8, ... }
}
```

This separation allows for:

- **Modular Configuration**: Post-processing effects can be configured independently
- **Type Safety**: Dedicated TypeScript types for each effect
- **Easier Maintenance**: Changes to effects don't affect core scene configuration
- **Better Organization**: Related configuration and types are co-located

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

The **Pixel Bleed Shader** (`PixelBleedShader.ts`) creates bold digital corruption effects that sample pixels from geometric shape outlines and stretch them in fixed directions to simulate pixel corruption.

#### Features

- **Geometric Shape Outlines**: Uses triangles, rectangles, and diamonds as source areas
- **Half-Outline Sampling**: Only samples pixels from half of each shape's perimeter:
  - **Triangle**: Top two edges (from apex to both corners)
  - **Rectangle**: Top edge only
  - **Diamond**: Top-right diagonal edge only
- **Fixed Stretch Directions**: Only 3 directions supported:
  - **Down (90°)**: Vertical downward stretching
  - **Right (0°)**: Horizontal rightward stretching  
  - **Down-Right (45°)**: Diagonal stretching
- **Bold Pixel Replacement**: No tapering or fading - direct pixel duplication
- **Persistent Corruption**: Effects last for configurable duration before clearing
- **Backward Tracing**: Traces from current pixel backwards to find source outline pixels

#### Configuration Parameters

```typescript
type PixelBleedConfig = {
  intensity: number           // Overall effect strength (0.0 - 1.0)
  chunkSize: number          // Size of geometric shapes (5.0 - 200.0)  
  chunkRandomness: number    // Placement randomness (0.0 - 1.0)
  stretchDistance: number    // How far pixels stretch (0.0 - 0.5)
  geometryComplexity: number // Shape complexity (0.0 - 1.0)
  persistence: number        // How long corruption lasts (0.0 - 1.0)
  regenerationRate: number   // New corruption spawn rate (0.0 - 1.0)
}
```

#### Debug Controls

The pixel bleed effect includes comprehensive debug controls accessible via the debug panel:

- **Enable/Disable Toggle**: Activate the effect with intensity control
- **Chunk Size**: Control the size of geometric shapes (5-200 pixels)
- **Chunk Randomness**: Adjust placement variation of corruption centers
- **Stretch Distance**: How far pixels stretch (0.0-0.5 in UV space)
- **Geometry Complexity**: Complexity of geometric corruption shapes
- **Persistence**: How long corruption effects persist before clearing
- **Regeneration Rate**: Speed of new corruption appearance

#### Implementation Details

The shader uses a simplified approach focused on creating bold, clean pixel stretching:

1. **Shape Generation**: Creates geometric shapes (triangles, rectangles, diamonds) at random positions
2. **Outline Detection**: Uses `isOnActiveOutline()` to detect pixels on the "active" half of each shape's perimeter
3. **Backward Tracing**: For each pixel, traces backwards along one of the 3 fixed directions to find source outline pixels
4. **Direct Replacement**: Replaces current pixel with source pixel color - no blending or tapering
5. **Lifecycle Management**: Each corruption area has a timed lifecycle and eventually disappears

The effect creates the appearance of pixels being "stretched" or "pulled" from shape outlines in straight lines, simulating digital corruption or glitch effects.

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
  vertexShader: passthroughVertexShader,
  fragmentShader: pixelBleedFragmentShader,
})
```

The effect is disabled by default and can be enabled through debug controls or programmatically via the intensity parameter.

## Video Cycle System

The video cycle system (`/lib/gl/textures/VideoCycle/`) manages dynamic video backgrounds with efficient memory usage and smooth transitions. The system is built on functional programming principles with pure utility functions and clear separation of concerns.

### Architecture

```text
/lib/gl/textures/VideoCycle/
  index.ts                      # Main video cycle manager
  types.ts                      # TypeScript type definitions
  /utils/                       # Pure utility functions
    calculateBufferState.ts     # Buffer state calculations
    calculateNextVideoSource.ts # Video selection logic
    calculateVideoReadiness.ts  # Video readiness checks
    getNewStartTimeAndDuration.ts # Segment timing calculations
```

### Core Features

- **Efficient Memory Management**: Uses only 2-3 video elements regardless of video library size
- **Smooth Transitions**: Prepares next video while current is playing for seamless switches
- **Anti-Repetition**: Configurable system to avoid recently played videos
- **Segment Playback**: Plays random segments of videos rather than full duration
- **Pure Functions**: All calculations are deterministic and side-effect free

### Configuration

The video cycle system is configured via `configVideoCycle.json`:

```json
{
  "enabled": true,
  "cycling": {
    "minSegmentLength": 2,
    "maxSegmentLength": 8,
    "playbackSpeed": 1,
    "antiRepeat": 3
  },
  "appearance": {
    "opacity": 0.78
  },
  "videos": {
    "path": "/static/videos/"
  }
}
```

### Video Pool Management

The system maintains a pool of 3 video elements that rotate roles:

- **Active Video**: Currently visible and playing
- **Next Video**: Prepared and ready for transition
- **Backup Video**: Available for next preparation

This approach minimizes memory usage while ensuring smooth playback without loading delays.

### Pure Function Design

All video calculations are implemented as pure functions:

```typescript
// Buffer state calculation
const bufferState = calculateBufferState({
  currentStartTime: 2.5,
  currentDuration: 5.0,
  currentVideoTime: 4.0,
  transitionTriggerPoint: 0.7,
  isNextVideoPrepared: true
})

// Video source selection
const nextVideo = calculateNextVideoSource({
  currentIndex: 5,
  recentIndices: [3, 7, 1],
  manifest: videoFiles,
  basePath: '/static/videos/'
})
```

### Transition Logic

The system uses a sophisticated transition system:

1. **Preparation Phase**: When current video reaches 70% progress, next video is prepared
2. **Loading Phase**: Next video is loaded, positioned, and started playing (hidden)
3. **Transition Phase**: Buffers swap roles, opacity changes, old video is cleaned up
4. **Cycle Continues**: Process repeats with new active video

### Debug Information

The video cycle system provides comprehensive debug information:

- Current video name and index
- Playback timing and progress
- Buffer states and transitions
- Video pool status
- Recent video history
- Loading progress

### Usage in GL System

```typescript
const videoCycle = createVideoCycle(frontBuffer, backBuffer)

// In animation loop
await videoCycle.update(deltaTime)

// Debug info
const debugInfo = videoCycle.getDebugInfo()
```

### Benefits

- **Performance**: Minimal memory footprint with efficient video reuse
- **Smooth Playback**: No loading delays during video transitions
- **Flexibility**: Configurable segment lengths and anti-repetition rules
- **Reliability**: Timeout protection and error handling for video operations
- **Maintainability**: Pure functions are easy to test and debug

### Font System

- The theme supports custom font families via Tailwind's `fontFamily` extension in `tailwind.config.ts`.
- **Lovecraftian font:** The `lovecraft` font family (UnifrakturCook, cursive) is available for use in blockquotes and special headings. Add `font-lovecraft` to any element to apply it.
- **Best practices:**
  - Use `font-sans` for most body text and paragraphs (`<p>`).
  - Use `font-serif` or `font-lovecraft` for headings (`<h1>`, `<h2>`, etc.) or blockquotes for thematic effect.
  - Blockquotes in Markdown are automatically styled with `font-lovecraft` via the `TextBlock` component.

## Animation System

The animation system follows strict functional programming principles with complete separation of concerns.

### Architecture Overview

The system is organized into focused, single-purpose modules:

```text
/lib/gl/animation/
  /calculations/           # Pure calculation functions
    calculateMouseRotation.ts
    calculateScrollProgress.ts
    calculateShaderTime.ts
    calculateRotationInterpolation.ts
    calculateFocusDistance.ts
    shouldSkipFrame.ts
  /effects/               # Side effect functions
    alignFocusPlane.ts
    updateBokehFocus.ts
    createFrameEffects.ts
  /events/                # Event handler factories
    createVisibilityHandler.ts
    createFocusHandlers.ts
    attachEventListeners.ts
  /loop/                  # Animation loop management
    createAnimationLoop.ts
  /state/                 # Shared state modules
    scrollState.ts
  /orchestrators/         # Page-specific orchestrators
    /homePage/
      createHomePageOrchestrator.ts
      /calculations/      # Home page specific calculations
    /contentPage/
      createContentPageOrchestrator.ts
    /loadingState/
      createLoadingStateOrchestrator.ts
  createSceneOrchestrator.ts  # Main orchestrator
  types.ts                    # Type definitions
```

### Core Principles

- **Pure functions only**: All calculations are deterministic and side-effect free
- **One function per file**: Each function lives in its own file for modularity
- **Immutable data**: No mutation, always return new values
- **Side effect isolation**: Effects are clearly separated from calculations
- **Composable**: Pure functions are easy to combine for new behaviors
- **State synchronization**: Shared state modules for cross-component communication

### Key Components

#### Scene Orchestrator

The main orchestrator manages the animation loop and coordinates all subsystems:

```typescript
import { createSceneOrchestrator } from '@libgl/animation'

const orchestrator = createSceneOrchestrator(rendererState, orchestratorRegistry)
orchestrator.setRenderState(updatedState) // Update state after initialization
```

#### Animation Loop

Encapsulated RAF management with pause/resume capabilities:

```typescript
const loop = createAnimationLoop(targetFPS, timeIncrement, {
  onFrame: (context) => {
    // Frame logic here
  },
  onPreFrame: () => { /* Optional pre-frame hook */ },
  onPostFrame: () => { /* Optional post-frame hook */ }
})
```

#### Shared State

Scroll position is synchronized across components:

```typescript
import { scrollState, updateScrollState } from '@libgl/animation/state/scrollState'

// Update scroll position
updateScrollState(window.scrollY)

// Read scroll position in animation
const scrollY = scrollState.y
const velocity = scrollState.velocity
```

#### Event Handling

Clean event management with automatic cleanup:

```typescript
const visibilityHandler = createVisibilityHandler(onPause, onResume)
const { handleBlur, handleFocus } = createFocusHandlers(onPause, onResume)

const cleanup = attachEventListeners(visibilityHandler, handleBlur, handleFocus)
```

### API Usage

- Use pure calculation utilities for testable math:

  ```typescript
  import { calculateMouseRotation } from '@libgl/animation/calculations'
  const rotation = calculateMouseRotation(0.5, 0.3, 2.0)
  // Returns: { targetRotationX: 0.6, targetRotationY: 1.0 }
  
  import { shouldSkipFrame } from '@libgl/animation/calculations'
  const skip = shouldSkipFrame(timeSinceLastRender, targetFPS)
  // Returns: true if frame should be skipped
  ```

- Apply side effects through dedicated functions:

  ```typescript
  import { updateBokehFocus } from '@libgl/animation/effects'
  updateBokehFocus(bokehPass, focusDistance)
  
  import { alignFocusPlane } from '@libgl/animation/effects'
  alignFocusPlane() // Aligns focus plane if available
  ```

- Compose your own pure functions and use them in orchestrators for custom behaviors.

### Styling

Component styling is primarily handled by Tailwind CSS utility classes. The theme system exposes all theme values as CSS variables, which are consumed by Tailwind.

In addition to standard utilities, two custom utility classes are available in `static/styles.css` for creating blurred, semi-transparent backgrounds:

- **.glass-effect**: Used for primary content containers. It applies a lighter, more transparent blur.
- **.frost-effect**: Used for primary navigation elements (`Header`, `ActionZone`). It applies a darker, more opaque blur for better readability.

## ActionZone System

The ActionZone is the mobile navigation system that provides context-aware navigation at the bottom of the screen. It follows the same architectural patterns as the Header for consistency and maintainability.

### Architecture Overview

The ActionZone system is built with a modular, state-driven architecture:

- **ActionZone.tsx**: Main container component following Header's structure
- **ActionZoneCollapsed.tsx**: Renders the collapsed navigation state (bio, shows, contact + menu)
- **ActionZoneExpanded.tsx**: Renders the expanded menu state with all navigation and social links
- **ActionZoneController.tsx**: Interactive island managing state, animations, and active section detection
- **Unified Button Components**: Uses the base `Button.tsx` component for consistency

### Container Structure

The ActionZone follows the same encapsulated container pattern as the Header:

```tsx
<div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">  {/* Positioning wrapper */}
  <Shell as="nav" className="max-w-sm mx-auto ...">              {/* Themed container */}
    {/* State-specific content */}
  </Shell>
</div>
```

This structure provides:

- **Consistent positioning**: Fixed bottom placement with responsive margins
- **Theme integration**: Uses Shell component with `surface-header` styling
- **Centered layout**: Max-width container with auto margins
- **Mobile-first**: Hidden on desktop (`md:hidden`)

### State Management

The ActionZone has two distinct states managed by the controller:

1. **`collapsed`**: Main navigation (bio, shows, contact + menu button)
2. **`expanded`**: Full menu with all navigation items and social links

States are determined by:

- Menu open/close state in the controller
- Current route and active section detection
- Sequential animation timing for smooth transitions

### Active Section Detection

The ActionZone features intelligent active section detection:

**Intersection Observer:**

- Uses passive intersection observer to detect which section is currently visible
- Smart threshold detection: tall sections (>120% viewport height) only need to intersect, normal sections need 50% visibility
- Handles edge cases like very tall content (bio section) appropriately

**Scroll Animation Handling:**

- Pauses intersection observer during programmatic scrolling to prevent flickering
- Immediate hash update when user clicks navigation for instant feedback
- 1-second timeout to resume normal detection after scroll animation completes

**Navigation Anchoring:**

- Uses `nav-` prefixed IDs for navigation buttons to avoid conflicts with page section IDs
- Proper anchor linking with scroll behavior for smooth navigation
- Hash change detection for browser back/forward button support

### Animation System

The ActionZone features a sophisticated three-stage animation system:

**Sequential Animation Stages:**

1. **Stage 1 (0ms)**: Fade out current content (`showCollapsed/showExpanded = false`)
2. **Stage 2 (200ms)**: Change container height (`containerExpanded` state)  
3. **Stage 3 (300ms)**: Fade in new content

**Height Transitions:**

- Uses `maxHeight` transitions for smooth CSS animations
- Collapsed: `maxHeight: 64px`
- Expanded: `maxHeight: 400px`
- Sequential timing prevents jarring layout shifts

**Opacity Transitions:**

- Content uses absolute positioning with opacity fades
- `transition-opacity duration-300` for smooth content swapping
- Proper `pointer-events-none` handling during transitions
- Anchored positioning keeps collapsed nav at bottom until fully faded

### Button Architecture

All ActionZone buttons use the unified `Button.tsx` component with active state styling:

**ActionZoneButton:**

- Uses base `Button` component with role-specific styling
- Active state uses inverted colors (foreground background, background text)
- Inline styles for higher specificity: `backgroundColor: 'var(--colors-foreground)'`
- Pill-shaped design with `rounded-theme-full`

**ActionZoneMenuButton:**

- Simplified version for expanded menu items
- Uses `Button` with variants (primary for active, ghost for inactive)
- Supports both anchor links and action buttons

### Role-Based Styling

The system uses simplified role-based styling that integrates with the Button component:

```typescript
const getRoleClasses = (role: string) => {
  switch (role) {
    case 'nav-item':
      return 'h-10 px-3 py-1.5 text-sm font-medium rounded-theme-full'
    case 'action-button':
      return 'h-10 w-10 p-0 rounded-theme-full'
    default:
      return ''
  }
}
```

Active states are handled via inline styles for higher CSS specificity:

- **Active**: `backgroundColor: 'var(--colors-foreground)', color: 'var(--colors-background)'`
- **Inactive**: Uses default button styling

### Configuration System

ActionZone configurations are generated by pure functions:

- **`createCollapsedConfig()`**: Main navigation sections (bio, shows, contact + menu)
- **`createExpandedMenuConfig()`**: All navigation items including home and social links
- **`createActionZoneConfig()`**: Combines configurations based on current state
- **Removed**: `collapsedPageConfig` - eliminated for cleaner two-state system

### Controller Integration

The ActionZoneController island manages all interactive behavior:

**State Management:**

```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [currentHash, setCurrentHash] = useState('')
const [showCollapsed, setShowCollapsed] = useState(true)
const [showExpanded, setShowExpanded] = useState(false)
const [containerExpanded, setContainerExpanded] = useState(false)
```

**Intersection Observer Setup:**

- Observes all page sections for active state detection
- Adaptive thresholds based on section height
- Cleanup on component unmount

**Animation Sequencing:**

- `useRef` pattern to avoid stale closure issues
- Timeout-based sequential state updates
- Proper cleanup of timeouts and observers

### Integration with Shell Component

The ActionZone leverages the Shell component with dynamic styling:

```tsx
<Shell 
  as="nav"                    
  className="..."            
  style={{ 
    maxHeight: containerExpanded ? '400px' : '64px',
    borderRadius: 'var(--borderRadius-shellCollapsed)'
  }}
>
```

The Shell component automatically:

- Applies `surface-header` styling for navigation elements
- Provides semantic HTML structure with proper ARIA attributes
- Integrates with theme system for consistent styling and border radius

### Benefits

This refactored ActionZone system provides:

1. **Smooth UX**: Sequential animations prevent jarring transitions
2. **Smart Detection**: Adaptive intersection observer handles all section types
3. **Performance**: Optimized scroll handling with proper cleanup
4. **Consistency**: Follows Header component patterns exactly
5. **Maintainability**: Clean two-state system without legacy complexity
6. **Accessibility**: Semantic HTML with proper ARIA and keyboard support
7. **Theme Integration**: Full theme system compatibility with active state styling
8. **Responsive**: Intelligent handling of different viewport sizes and content heights

## Directory Structure

- **`/routes`**: Pages & API
  - `_app.tsx`: Main app wrapper. Renders global UI (`Header`, `ActionZone`) and the `ThemeProvider`.
  - `_middleware.ts`: Global middleware for server-side logic (e.g., `debugOnly` access).
  - `theme.tsx`: Renders the `ThemeVisualizer` island.
  - `/partials/*.tsx`: Page content for Fresh's partial navigation.

- **`/islands`**: Interactive Components
  - `ActionZoneController.tsx`: Interactive mobile navigation controller.
  - `ThemeProvider.tsx`: Injects theme CSS variables and handles dynamic updates.
  - `ThemeVisualizer.tsx`: UI for visualizing themes.
  - `Header.tsx`, `GLCanvas.tsx` Other major interactive components.
  - `ThemedBackground.tsx`: Dynamic background overlay that uses the current theme's CSS variable for background color and fades in/out based on route. Uses direct CSS variable access for background and Tailwind for layout/opacity transitions.
  - `DebugPanels.tsx`: Main debug overlay island. Manages debug state and renders `DebugControls` and `DebugInfo`.
  - `DebugControls.tsx`: UI for DOF/tone mapping controls and hotkey info (top-left).
  - `DebugInfo.tsx`: UI for debug info (bottom-left).

- **`/components`**: Reusable UI Components
  - `Shell.tsx`: A flexible container component that can render as different HTML elements (`section`, `nav`, `div`) with automatic surface styling. Navigation shells use `surface-header`, sections use `surface-shell`.
  - `Card.tsx`: A flexible card component, supporting images and custom content, with the `.glass-effect`.
  - `ListItem.tsx`: A generic component for list items.
  - `ThemeSwitcher.tsx`: Displays current theme colors in a compact preview strip and cycles through available themes.
  - `Button.tsx`: Unified button component used throughout the application. Supports multiple variants and can render as button or anchor.
  - `Dropdown.tsx`, etc.

- **`/components/actionZone`**: ActionZone System Components
  - `ActionZone.tsx`: Main container component following Header's structure pattern.
  - `ActionZoneCollapsed.tsx`: Renders collapsed navigation state (renamed from ActionZoneNav).
  - `ActionZoneExpanded.tsx`: Renders expanded menu state (renamed from ActionZoneExpandedMenu).
  - `ActionZoneButton.tsx`: Unified button component using base Button with role-specific styling.
  - `ActionZoneMenuButton.tsx`: Simplified button for expanded menu items using base Button.
  - `/config/`: Configuration functions for different ActionZone states.
  - `/utils/`: Utility functions for button creation and layout configuration.

- **`/data`**: Content & Configuration
  - `types.ts`: **Centralized TypeScript definitions** for all JSON data.
  - `pages.json`: Site-wide page configuration (`debugOnly`, `showHeader`).
  - `*.json`: Static content for pages (navigation, shows, bio).

- **`/lib/gl/configScene.types.ts`**: GL-specific type definitions for core scene configuration.
- **`/lib/gl/configPostProcessing.json`**: Post-processing effects configuration with top-level `enabled` flag.
- **`/lib/gl/configPostProcessing.types.ts`**: TypeScript type definitions for all post-processing effects.
- **`/lib/gl/textures/VideoCycle/`**: Video background management system with efficient memory usage and smooth transitions.

- **`/lib`**: Core Libraries
  - `/theme`: The core UI theme system. See "Theme System" section above.
  - `/gl/theme`: The 3D-specific theme system.
  - `/debug`: Debug mode detection and control.
  - `/logger`: Structured logging system.

- **`/utils`**: Shared utility functions.
- **`/scene`, `/gl`, etc.**: All logic for the Three.js visualization.
  - `/gl/scene/`: Core scene setup including video background with selective colorization
  - `/gl/shaders/`: Custom GLSL shaders including pixel bleed, CRT effects, and selective video background processing
  - `/gl/textures/VideoCycle/`: Advanced video background management with efficient memory usage, smooth transitions, and pure function design
  - `/gl/animation/`: Functional animation system with complete separation of concerns:
    - `/calculations/`: Pure mathematical functions
    - `/effects/`: Side effect functions
    - `/events/`: Event handler factories
    - `/loop/`: Animation loop management
    - `/state/`: Shared state modules
    - `/orchestrators/`: Page-specific animation logic
  - `/gl/layers/`: Dynamic layer management for geometric shapes and logo animations
  - `/gl/controls/`: Mouse and keyboard interaction systems

## Main Entry

- `/lib/gl/index.ts` - `initGL()`, `InitOptions`, `RendererState` - Main GL system initialization
- `/lib/gl/types.ts` - Core GL types and interfaces
- `/lib/gl/state.ts` - Global GL state management
- `/lib/gl/configScene.json` - Core scene configuration (geometry, renderer settings)
- `/lib/gl/configPostProcessing.json` - Post-processing effects configuration
- `/lib/gl/configAnimation.json` - Animation timing and behavior configuration
- `/lib/gl/configControls.json` - Mouse and keyboard interaction configuration
- `/lib/gl/configLayers.json` - Layer generation and positioning configuration
- `/lib/gl/configVideoCycle.json` - Video background cycling configuration

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

### Benefits

1. **Highly Testable**: Pure functions are easy to unit test
2. **Predictable**: No hidden side effects or state mutations
3. **Modular**: Each function can be used independently
4. **Composable**: Easy to combine functions for new behaviors
5. **Debuggable**: Clear data flow makes debugging simple
6. **Performance**: Pure calculations can be optimized and memoized
7. **Maintainable**: Clear separation between calculations and side effects
8. **Responsive**: Proper pause/resume handling for performance optimization

## Animation System Details

### Scene Orchestrator

The main scene orchestrator (`createSceneOrchestrator.ts`) coordinates all animation subsystems:

- **State Management**: Uses mutable reference for renderer state updates
- **Animation Loop**: Encapsulated RAF loop with FPS limiting
- **Event Handling**: Automatic pause/resume on visibility/focus changes
- **Frame Effects**: Applies all per-frame side effects in order
- **Orchestrator Switching**: Dynamic page-based orchestrator management

### Orchestrator Pattern

Each page has its own orchestrator with specific behaviors:

```typescript
// Loading State Orchestrator
createLoadingStateOrchestrator(onComplete, getVideoStatus)

// Home Page Orchestrator  
createHomePageOrchestrator(logoController)

// Content Page Orchestrator
createContentPageOrchestrator()
```

### Frame Effects Pipeline

All frame-based side effects are centralized:

1. **Align Focus Plane**: Updates global focus plane if available
2. **Update Controls**: Processes user input
3. **Apply Mouse Rotation**: Updates scene rotation based on mouse
4. **Update Bokeh Focus**: Calculates and applies DOF effects
5. **Update Video Background**: Manages video cycling

### State Synchronization

The system uses shared state modules for cross-component communication:

- **Scroll State**: Synchronizes scroll position between UI and GL
- **Renderer State**: Mutable reference updated after initialization
- **Scene State**: Immutable state for orchestrator management

### Performance Optimizations

- **FPS Limiting**: Configurable target FPS with frame skipping
- **Visibility API**: Pauses animation when tab is not visible
- **Focus Tracking**: Pauses on window blur for battery savings
- **Lazy Effect Creation**: Frame effects created only when needed
- **Efficient State Updates**: Minimal object creation per frame

### Recent Improvements

The animation system was recently refactored to address several critical issues:

1. **Null Safety**: Added guards to prevent crashes when composer isn't ready
2. **State Updates**: Added `setRenderState` method for post-initialization updates
3. **Time Advancement**: Fixed time not updating by explicitly setting `state.time`
4. **Scroll Synchronization**: Created shared scroll state for proper position tracking
5. **Modular Architecture**: Separated concerns into focused, testable modules

These improvements ensure the animation system is more robust, maintainable, and performant.

> **Note:** All theme shape types (`BaseTheme`, `BaseTypography`, `BaseSpacing`) are now defined in `lib/theme/themes/types.ts` alongside the theme objects themselves. They are re-exported from `lib/theme/types.ts` for convenience. This keeps type definitions close to the data and supports feature-based organization.

## Debug Overlay

The debug UI is now implemented as Preact components for maintainability and composability.

- **DebugPanels Island**: The main interactive debug UI, located at `islands/DebugPanels.tsx`. It manages debug state, keyboard shortcuts, and renders the controls/info panels.
- **DebugControls Component**: Renders DOF and tone mapping controls, theme selector, hotkey info, and lives at the top-left. Located at `components/debug/DebugControls.tsx`.
- **DebugInfo Component**: Renders debug information (e.g., camera Z, plane positions) at the bottom-left. Located at `components/debug/DebugInfo.tsx`.
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
