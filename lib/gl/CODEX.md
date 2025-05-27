# Logo3D Library Codex

**NOTE to the reader LLM: Always keep the codex up to date with the latest changes to the codebase.**

## Overview

A sophisticated 3D logo visualization library built with Three.js that creates dynamic, animated logo displays with electric effects, video backgrounds, and responsive design. The library provides a complete rendering pipeline with post-processing effects, geometric overlays, and interactive controls.

**Recent Major Update**: Complete mobile responsiveness refactoring with camera-based scaling strategy, eliminating logo warping and ensuring perfect visibility across all devices and aspect ratios.

## Core Architecture

### Entry Point

- **File**: `index.ts`
- **Function**: `initGL(options: InitOptions)`
- **Purpose**: Main initialization function that orchestrates the entire 3D scene setup
- **Returns**: Cleanup function for proper resource disposal

### Key Components

#### 1. Scene Management (`scene/`)

- **createScene.ts**: Basic 3D scene with theme-based background
- **createCamera.ts**: Responsive perspective camera with mobile optimizations
- **createRenderer.ts**: WebGL renderer with high pixel ratio and container management
- **createPostProcessing.ts**: Complete post-processing pipeline
- **addLensFlares.ts**: Lens flare effects for atmospheric lighting
- **createVideoBackground.ts**: Video cycling background system with responsive scaling

#### 2. Responsive Utilities (`scene/utils/`)

- **getResponsiveDimensions.ts**: Single source of truth for all responsive calculations
- **isMobileDevice.ts**: Comprehensive mobile device detection
- **mobileDebugHelper.ts**: Mobile responsiveness debugging tools

#### 3. Logo Layer System (`layers/`)

- **LogoLayer.ts**: Main layer management with static and random layer generation
- **config.ts**: Theme-based configuration for all layer types
- **utils/**: Layer creation, management, and disposal utilities

#### 4. Geometric Overlays (`layers/GeometricLayer.ts`, `layers/UILayer.ts`)

- **GeometricLayer**: 3D geometric shapes (rings, orbits, particles) around the logo
- **UILayer**: 2D HUD overlay with technical UI elements
- **ShadowLayer**: Elliptical gradient shadow behind the logo

#### 5. Shader System (`shaders/`)

- **ElectricShader.ts**: Main logo effect with noise-based electric distortion
- **DitheringShader.ts**: Blue noise dithering for banding reduction
- **SharpeningShader.ts**: Unsharp mask for detail enhancement

#### 6. Animation System (`animation/`)

- **AnimationLoop.ts**: Main animation loop with layer regeneration and effects
- **config.ts**: Animation timing and visual effect parameters

## Key Features

### Mobile Responsiveness (NEW)

- **Camera-based scaling**: Logo maintains fixed size, camera moves to optimal distance
- **No geometry warping**: Logo preserves aspect ratio across all devices
- **Comprehensive device detection**: User agent, screen size, and touch capabilities
- **Mobile optimizations**: Extra padding, reduced effects, performance tuning
- **Debug helpers**: Real-time responsive dimension monitoring

### Logo Rendering

- **Multi-layer system**: Static base layers + randomly generated layers
- **Electric effects**: Noise-based distortion with configurable parameters
- **Stencil support**: Mask layers for complex compositing
- **Responsive scaling**: Automatic sizing based on device and screen

### Visual Effects

- **Post-processing pipeline**:
  - Depth of field (Bokeh)
  - Film grain and scanlines
  - Bloom lighting
  - Chromatic aberration
  - Sharpening
  - Blue noise dithering
- **Dynamic layer regeneration**: Automatic random layer recreation
- **Mouse interaction**: Scene rotation based on mouse movement

### Video Background System (`textures/VideoCycle/`)

- **Dual-buffer rendering**: Seamless video transitions
- **Manifest-based loading**: JSON manifest for video file management
- **Random segment playback**: Videos play random segments with anti-repeat logic
- **Responsive scaling**: Videos scale to cover viewport with overflow
- **Fixed aspect ratio**: Maintains 16:9 video aspect ratio across all screen sizes

## File Structure Deep Dive

### Core Systems

#### Scene Utilities (`scene/utils/`)

```
scene/utils/
├── getResponsiveDimensions.ts    # Single source of truth for responsive calculations
├── isMobileDevice.ts             # Comprehensive mobile detection
└── mobileDebugHelper.ts          # Mobile responsiveness debugging
```

#### Textures (`textures/VideoCycle/`)

```
VideoCycle/
├── index.ts              # Main video cycling manager
├── config.ts             # Video system configuration
└── utils/
    ├── loadVideo.ts       # Single video loading
    ├── calculateScale.ts  # Responsive video scaling
    ├── getNextVideoIndex.ts # Anti-repeat video selection
    └── getNewStartTimeAndDuration.ts # Random segment timing
```

#### Layers (`layers/`)

```
layers/
├── LogoLayer.ts          # Main layer system
├── GeometricLayer.ts     # 3D geometric overlays
├── UILayer.ts            # 2D HUD overlay
├── ShadowLayer.ts        # Logo shadow
├── config.ts             # Theme-based configurations
└── utils/
    ├── createRandomLogoLayers.ts # Random layer generation
    ├── createPlanesFromLayers.ts # Mesh creation from layers
    ├── getAllLogoLayers.ts       # Layer aggregation
    └── [various shape creators]  # Geometric shape utilities
```

#### Geometry (`geometry/`)

- Shape creation utilities for UI elements
- Circle outlines, hexagons, grids, crosshairs, etc.
- Used by both 3D geometric layer and 2D UI overlay

### Configuration & Theming

#### Theme System (`theme.ts`, `themes/`)

- **Current theme**: `TECHSCAPE_THEME` (teal/green)
- **Available themes**: Cyberpunk, Synthwave, Monochrome, Techscape
- **Theme structure**: Colors for logo layers, UI, geometric elements, lens flares
- **Dynamic configuration**: Config functions that pull from current theme

#### Scene Configuration (`scene/config.ts`)

- Renderer settings (pixel ratio, antialiasing)
- Post-processing parameters
- Camera positioning
- Video background settings
- Lens flare configuration

## Key Algorithms

### Responsive Scaling Strategy (NEW)

**Core Principle**: Instead of scaling logo geometry (which causes warping), move camera to appropriate distance.

1. **Fixed Logo Size**: Logo plane maintains constant world-space dimensions
2. **Camera Distance Calculation**: 
   ```typescript
   // Calculate required distance for width and height constraints
   const requiredDistanceForWidth = (logoWidth * 1.1) / (2 * Math.tan(fovRad / 2) * screenAspect)
   const requiredDistanceForHeight = (logoHeight * 1.1) / (2 * Math.tan(fovRad / 2))
   // Use larger distance to ensure both dimensions fit
   const optimalCameraZ = Math.max(requiredDistanceForWidth, requiredDistanceForHeight, 4)
   ```
3. **Padding Strategy**: 10% padding for desktop, 20% extra for mobile touch interaction
4. **Consistent Framing**: Logo always fits comfortably in viewport regardless of aspect ratio

### Video Background Scaling (SIMPLIFIED)

**Previous**: Complex aspect ratio logic with screen size dependencies
**Current**: Simple FOV-based calculation
```typescript
const visibleHeight = 2 * Math.tan(fovRad / 2) * distance
const scale = (visibleHeight * 1.1) / videoPlaneHeight // 1.1 = 10% overflow
```

### Mobile Device Detection

1. **User Agent Analysis**: Comprehensive mobile device pattern matching
2. **Screen Size Heuristics**: Width/height thresholds and aspect ratios
3. **Touch Capability**: Detection of touch interface support
4. **Combined Logic**: Multiple detection methods for accuracy

### Video Cycling Logic

1. **Dual Buffer System**: Front buffer (visible) + back buffer (preparing next video)
2. **Anti-repeat Selection**: Tracks recent video indices to avoid repetition
3. **Random Segment Playback**: Each video plays a random segment within duration constraints
4. **Seamless Transitions**: Hidden buffer prepares while visible buffer plays
5. **Buffer Swap Scaling**: Ensures new active buffer gets correct scale applied

### Layer Animation

1. **Static Layers**: Subtle breathing motion with sine wave positioning
2. **Random Layers**: Chaotic movement with burst displacements and opacity flickers
3. **Shader Time Updates**: FPS-based time updates for different animation speeds
4. **Automatic Regeneration**: Random layers regenerate every 1-4 seconds

## Usage Patterns

### Basic Initialization

```typescript
import { initGL } from './lib/gl'

const cleanup = await initGL({
  width: window.innerWidth,
  height: window.innerHeight,
  outlineTexturePath: '/textures/logo-outline.png',
  stencilTexturePath: '/textures/logo-stencil.png',
  container: document.getElementById('canvas-container')
})

// Later cleanup
cleanup()
```

### Responsive Dimensions Access

```typescript
import { getResponsiveDimensions } from './lib/gl/scene/utils/getResponsiveDimensions'

const dimensions = getResponsiveDimensions()
console.log('Camera Z:', dimensions.cameraZ)
console.log('Logo size:', dimensions.planeWidth, 'x', dimensions.planeHeight)
```

### Mobile Detection

```typescript
import { isMobileDevice } from './lib/gl/scene/utils/isMobileDevice'

if (isMobileDevice()) {
  // Apply mobile-specific optimizations
}
```

### Theme Switching

```typescript
import { setTheme, SYNTHWAVE_THEME } from './lib/gl/theme'

setTheme(SYNTHWAVE_THEME)
// Regenerate scene to apply new theme
```

### Custom Configuration

```typescript
// Modify video background settings
VIDEO_BACKGROUND_CONFIG.enabled = false

// Adjust animation parameters
ANIMATION_CONFIG.TIME_INCREMENT = 0.02
```

## Debug Features

### Debug Overlay (`debug/DebugOverlay.ts`)

- **Hotkeys**: 
  - `D`: Toggle debug panel
  - `R`: Toggle auto-rotation
  - `G`: Regenerate layers
- **DOF Controls**: Live depth-of-field adjustment with focus plane visualization
- **Scene Info**: Camera position, plane positions, responsive dimensions

### Mobile Debug Helper (`scene/utils/mobileDebugHelper.ts`)

- Device detection details
- Screen dimensions and characteristics
- Calculated responsive dimensions
- Visibility recommendations
- Real-time responsive monitoring

## Performance Considerations

### Mobile Optimizations

- Reduced particle counts (80% of desktop)
- Simplified geometric effects
- Lower shader complexity on mobile detection
- Adaptive camera positioning instead of scaling
- Extra padding for touch interaction

### Memory Management

- Proper disposal functions for all resources
- Texture cleanup on layer regeneration
- Video element management with pause/cleanup
- Event listener cleanup on destruction

### Rendering Optimizations

- Additive blending for electric effects
- Depth buffer management for proper layering
- Efficient post-processing pipeline order
- Pixel ratio capping to prevent excessive resolution

## Architecture Improvements (RECENT)

### Code Organization Refactoring

1. **Separation of Concerns**:
   - `createVideoBackground.ts`: Scene management (plane creation, scaling, scene add/remove)
   - `createVideoCycle.ts`: Pure texture management (video loading, cycling, transitions)
   - Functional approach: Create planes, pass to texture handlers

2. **Single Source of Truth**:
   - `getResponsiveDimensions.ts`: All responsive calculations centralized
   - Eliminated duplicate scaling logic across files
   - Consistent responsive behavior throughout application

3. **Utility Organization**:
   - Moved utilities from config files to dedicated `scene/utils/` directory
   - One function per file with comprehensive TypeScript documentation
   - Removed redundant files and duplicate logic

### Bug Fixes

1. **Buffer Swap Scaling**: Fixed critical bug where video buffer swaps didn't apply correct scaling
2. **Mobile Visibility**: Resolved logo invisibility on mobile devices
3. **Aspect Ratio Warping**: Eliminated logo distortion when resizing from wide screens

## Extension Points

### Adding New Themes

1. Create theme file in `themes/`
2. Define `Logo3DTheme` structure
3. Update theme imports and selection

### Custom Geometric Shapes

1. Add shape creator in `geometry/`
2. Use in `layers/utils/createTechShapes.ts`
3. Configure in layer configs

### New Post-Processing Effects

1. Create shader in `shaders/`
2. Add to post-processing pipeline in `scene/createPostProcessing.ts`
3. Update animation loop for parameter updates

### Video Background Customization

1. Modify `VIDEO_CYCLE_CONFIG` in `scene/config.ts`
2. Extend video loading logic in `textures/VideoCycle/utils/`
3. Add new transition effects in main cycling logic

### Responsive Behavior Customization

1. Modify calculations in `getResponsiveDimensions.ts`
2. Add device-specific logic in `isMobileDevice.ts`
3. Extend debug helpers in `mobileDebugHelper.ts`

## Common Gotchas

1. **Texture Loading**: Ensure CORS is properly configured for texture files
2. **Video Paths**: Video manifest must be accessible and properly formatted
3. **Mobile Performance**: Test on actual devices, not just browser dev tools
4. **Memory Leaks**: Always call cleanup function when unmounting
5. **Theme Updates**: Some config changes require scene regeneration
6. **Z-Fighting**: Layer z-positions must be carefully managed for proper depth sorting
7. **Responsive Testing**: Test across multiple device types and orientations
8. **Video Buffer Management**: Ensure proper scaling is applied during buffer swaps

## Future Enhancement Areas

1. **WebXR Support**: VR/AR compatibility
2. **Audio Reactive**: Sync animations to audio input
3. **Particle Physics**: More sophisticated particle systems
4. **Advanced Shaders**: PBR materials, advanced lighting
5. **Performance Profiling**: Built-in performance monitoring
6. **Asset Streaming**: Progressive loading for large video libraries
7. **Advanced Responsive**: Orientation change handling, dynamic viewport adjustments
8. **Accessibility**: Screen reader support, reduced motion preferences 