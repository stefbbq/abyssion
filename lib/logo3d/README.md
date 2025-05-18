# Logo3D Renderer Architecture

A modular, loosely coupled architecture for the Logo3D electric effect renderer.

## Architecture Overview

The Logo3D renderer is organized into the following structure:

### Core
- **index.ts**: Main entry point that assembles all components
- **types.ts**: Type definitions shared across modules
- **constants.ts**: Configuration constants

### Modules

#### Animation
- **AnimationLoop.ts**: Animation loop and movement functions

#### Controls
- **OrbitControlsSetup.ts**: Camera controls and user input

#### Layers
- **LayerGenerator.ts**: Functions for generating layer configurations
- **LayerManager.ts**: Managing layer meshes and materials

#### Scene
- **SceneSetup.ts**: Setup of scene, camera, renderer, and post-processing

#### Shaders
- **ElectricShader.ts**: GLSL shaders for the electric effect

#### Utils
- **PerlinNoise.ts**: Noise generation utility

## Design Principles

This architecture follows several key principles:

1. **Separation of Concerns**: Each module has a single responsibility
2. **Loose Coupling**: Modules interact through well-defined interfaces
3. **High Cohesion**: Related functionality is grouped together
4. **Dependency Inversion**: Core modules don't depend on details

## Theme System

The logo3d library now includes a powerful theme system that allows you to customize all colors in the visualization from a single source.

### Built-in Themes

The library includes several built-in themes:

- `CYBERPUNK_THEME` - Default theme with cyan and magenta electric colors
- `SYNTHWAVE_THEME` - Purple and pink dominant colors inspired by 80s aesthetics
- `MONOCHROME_THEME` - Clean white and gray tones for a minimalist look

### Using Themes

```typescript
import { setTheme, SYNTHWAVE_THEME } from 'logo3d'

// Set the theme before initializing the logo
setTheme(SYNTHWAVE_THEME)

// Then initialize as normal
const logo = initLogo({
  width: 800,
  height: 600,
  outlineTexturePath: './outline.png',
  stencilTexturePath: './stencil.png',
  container: document.getElementById('logo-container')
})
```

### Creating Custom Themes

You can create custom themes by extending existing ones:

```typescript
import { createCustomTheme, CYBERPUNK_THEME } from 'logo3d'

const customTheme = createCustomTheme(CYBERPUNK_THEME, {
  // Override specific colors
  primary: { r: 1, g: 0.8, b: 0 }, // Golden
  ghostingColors: {
    cyan: { r: 0, g: 0.8, b: 1 },   // Custom cyan
    magenta: { r: 1, g: 0, b: 0.5 } // Custom magenta
  },
  ui: {
    accentColor1: 0xffcc00, // Gold
    accentColor2: 0x00ccff  // Blue
  }
})
```

## Usage

To use the Logo3D renderer, import the main entry point:

```typescript
import { initLogo3D, type InitOptions } from "../lib/logo3d/mod.ts"

// Then initialize with options
const cleanup = initLogo3D({
  width: 500,
  height: 500,
  outlineTexturePath: "/path/to/outline.png",
  stencilTexturePath: "/path/to/stencil.png",
  container: document.getElementById("container")
})

// Call cleanup when done
cleanup()
``` 