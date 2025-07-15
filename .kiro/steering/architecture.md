# Architecture & Design Patterns

## Core Architecture Principles

### Functional Programming First
- **Pure functions only**: Every function must be deterministic and side-effect free whenever possible
- **Immutability**: Never mutate data. Return new values instead
- **Composition over inheritance**: Build complex behavior by composing simple functions
- **One function per file**: Each function lives in its own file for maximum modularity (unless orchestrating module)
- **Side effect isolation**: Only orchestrators perform DOM/Three.js mutations

### Fresh Framework Architecture
- **Islands Architecture**: Client-side interactivity in specific components only
- **Partial-first approach**: SPA-like navigation with Fresh partials
- **Global UI control**: Managed by `_app.tsx` and `data/pages.json`
- **Access Control**: Centralized in `routes/_middleware.ts` for `debugOnly` pages

### Theme System Architecture

#### Reactive Theme System
- **CSS-variable-driven**: All theme values exposed as CSS variables
- **Real-time switching**: Light/dark modes without page reloads
- **Cookie persistence**: 1-year expiration for theme preferences
- **Signal-based**: Uses Preact signals for reactive updates

#### Theme Object Hierarchy
```typescript
// Single source of truth
BaseTheme -> UITheme (via createUITheme())
BaseTheme -> GLTheme (via createGLTheme())
```

#### Theme Integration Patterns
```typescript
// UI Components - use CSS variables
<div className="bg-[var(--colors-background-primary)]" />

// 3D/GL Components - use GLTheme
const glTheme = getGLTheme()
material.color = glTheme.primary
```

### 3D Graphics Architecture

#### Modular GL System
- **Composable setup functions**: `setupCoreRendering`, `setupLayerSystem`, etc.
- **Orchestrator pattern**: Side effects isolated to orchestrator functions
- **Pure calculations**: All math/position calculations are pure functions
- **Configuration-driven**: JSON configs for scene, post-processing, animation

#### Post-Processing Pipeline
1. Render Pass → 2. Bokeh Pass → 3. Bloom Pass → 4. Sharpening Pass → 
5. Pixelation Pass → 6. Pixel Bleed Pass → 7. Film Pass → 8. Final Pass → 9. Dithering Pass

#### Animation System Architecture
```
/lib/gl/animation/
  /core/           # Pure animation engine functions
  /calculations/   # Pure calculation functions  
  /orchestrators/  # Main orchestrators with side effects
  /utils/          # Pure utility functions
```

### Video Cycle System
- **Efficient memory management**: Uses only 2-3 video elements regardless of library size
- **Pure function design**: All calculations are deterministic and side-effect free
- **Smooth transitions**: Prepares next video while current is playing
- **Anti-repetition**: Configurable system to avoid recently played videos

## File Organization Patterns

### Directory Structure Strategy
- **Group by feature, not type**: Keep related functionality together
- **Co-located types**: Types defined alongside related functionality
- **Barrel exports**: Clean import paths with `index.ts` files
- **Separation of concerns**: Pure functions vs side effects

### Import Patterns
```typescript
// Use path aliases for clean imports
import { log, lc } from '@liblogger/index.ts'
import { createUITheme } from '@libtheme/createUITheme.ts'
import { initGL } from '@libgl/index.ts'

// Barrel exports for related functionality
import { currentUITheme, currentGLTheme } from '@libtheme/index.ts'
```

### Component Patterns
- **Islands**: Client-side interactivity (ThemeProvider, GLCanvas, DebugPanels)
- **Components**: Server-side rendering (Shell, Card, Button)
- **Functional components**: With hooks and signal-based state
- **Props type definition**: Always at top of file, not exported

## Configuration Strategy

### JSON-Driven Configuration
- **Scene configuration**: `configScene.json` for core 3D settings
- **Post-processing**: `configPostProcessing.json` with modular effect configs
- **Animation**: `configAnimation.json` for timing and behavior
- **Video cycling**: `configVideoCycle.json` for background management
- **Centralized types**: All JSON data types in `data/types.ts`

### Debug System Integration
- **Environment-based**: Debug mode detection and control
- **Reactive UI**: Preact components for debug panels
- **Theme-aware**: Debug UI adapts to current theme
- **Keyboard shortcuts**: Integrated hotkey system

## Performance Patterns

### 3D Graphics Optimization
- **Efficient video management**: Video pool rotation for smooth playback
- **Shader optimization**: Modular GLSL with utility functions
- **Memory management**: Proper cleanup functions for all GL resources
- **Responsive handling**: Adaptive configurations based on screen size

### State Management
- **Signal-based reactivity**: Preact signals for theme and debug state
- **Immutable updates**: No direct state mutations
- **Computed values**: Derived state through computed signals
- **Cookie persistence**: Automatic theme preference saving

## Integration Patterns

### Theme-GL Integration
- **Selective colorization**: Video backgrounds adapt to theme colors
- **Real-time updates**: 3D effects update instantly with theme changes
- **Unified color system**: Shared color palette between UI and GL themes

### Debug Integration
- **Live controls**: Real-time parameter adjustment
- **Visual feedback**: Debug info overlays with theme-aware styling
- **Development workflow**: Integrated with build system and file watching