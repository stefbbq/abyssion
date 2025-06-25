# Codex

Reference for the codebase structure.
Use this as a starting point before doing anything!

## Core Architecture

- **Routing**: Fresh-based, with a partial-first approach for SPA-like navigation. Global UI is controlled by `_app.tsx` and `data/pages.json`.
- **Access Control**: Centralized in `routes/_middleware.ts` for `debugOnly` pages.
- **Data & Types**: All static content is in `/data`, with all corresponding TypeScript types co-located in `data/types.ts`.
- **Theme System**: A dual-theme system (`UITheme` and `GLTheme`) is generated from a single `BaseTheme`. See the "Theme System" section below for details.
- **3D Scene**: Managed via `/scene`, `/gl`, and related directories, containing all Three.js logic.

## ActionZone System (Mobile Navigation)

The ActionZone system is a fully config-driven, recursive, and type-safe architecture for mobile navigation and overlays. It is designed for maximum flexibility, maintainability, and animation control.

### Key Concepts

- **Config-Driven**: All layouts, buttons, and menu structures are defined in config files (`/components/organisms/ActionZone/configurations/`).
- **Component Map**: The renderer uses a `componentMap` to map config node `type` strings to actual UI components (atoms, molecules, etc). This enables new UI types to be added with zero renderer changes.
- **Recursive Rendering**: The renderer walks the config tree, rendering each node as the mapped component and passing down props, style, animation, and children.
- **Runtime Injection**: Data such as theme, navigation, and social links are injected at runtime via `runtimeProps`.
- **Animation**: All animation is config-driven and can be customized per node, per route, or per transition.

### Directory Structure

- `/components/organisms/ActionZone/configurations/`
  - `collapsed.ts`, `collapsedPage.ts`, `expanded.ts`: Main config files for each layout state.
  - `types.ts`: Centralized, minimal types for config nodes, grid layouts, and animation variants.
  - `index.ts`: Barrel file exporting all configs and a single `actionZoneAnimationConfig` object.
- `/components/organisms/ActionZone/componentMap.ts`: Maps config node `type` strings to UI components.
- `/components/organisms/ActionZone/ActionZoneRenderer.tsx`: Recursive renderer for config nodes.
- `/components/organisms/ActionZone/utils/`: Utility functions for config node resolution and animation variant lookup.
- `/islands/ActionZoneController.tsx`: Main controller for runtime state, theme, and data injection.

### Config Structure & Types

Config files export objects matching the following recursive type:

```ts
export type ActionZoneConfigNode = {
  type: string // e.g. 'container', 'button', 'menuButton', 'socialLinks'
  style?: Record<string, unknown>
  layout?: ActionZoneGridLayout
  children?: Record<string, ActionZoneConfigNode>
  props?: Record<string, unknown>
  animation?: ActionZoneAnimationVariant
}

export type ActionZoneConfigRoot = Record<string, ActionZoneConfigNode>

export type ActionZoneGridLayout = {
  grid: string
  slots: string[]
  gridTemplateRows?: string
  gridTemplateColumns?: string
  gap?: string
}

export type ActionZoneAnimationVariant = {
  initial: object
  animate: object
  exit?: object
  transition?: object
}
```

### Example Config (Collapsed Layout)

```ts
export const collapsed = {
  '/*': {
    type: 'container',
    style: { height: ..., borderRadius: ... },
    layout: {
      grid: 'rows: 1; cols: 3',
      slots: ['shows', 'contact', 'menu'],
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '0.5rem',
    },
    children: {
      shows: { type: 'button', props: { ... } },
      contact: { type: 'button', props: { ... } },
      menu: { type: 'button', props: { ... } },
    },
  },
}
```

### Component Map

The `componentMap` links config node `type` strings to actual UI components:

```ts
import { ActionZoneContainer } from '@atoms/ActionZoneContainer.tsx'
import { ActionZoneButton } from '@atoms/ActionZoneButton.tsx'
import { ActionZoneMenuButton } from '@atoms/ActionZoneMenuButton.tsx'
import { SocialLinks } from '@molecules/SocialLinks.tsx'
import type { ComponentType } from 'preact'

type ActionZoneComponentType = 'container' | 'button' | 'menuButton' | 'socialLinks'

export const componentMap: Record<ActionZoneComponentType, ComponentType<any>> = {
  container: ActionZoneContainer,
  button: ActionZoneButton,
  menuButton: ActionZoneMenuButton,
  socialLinks: SocialLinks,
}
```

### Rendering Pipeline

- The controller (`ActionZoneController.tsx`) determines the current layout and resolves the config node for the current route.
- The renderer (`ActionZoneRenderer.tsx`) recursively renders the config tree:
  - Looks up the component for each node type in `componentMap`.
  - Passes down `props`, `style`, `animation`, and `children`.
  - Handles grid layouts and slot ordering.
- Runtime data (theme, nav, social links) is injected via `runtimeProps` and merged into the config as needed.

### Animation Helpers

- `resolveActionZoneConfigNode`: Recursively resolves the most specific config node for a given route and key path.
- `getLayoutForRoute`: Determines which ActionZone layout should be used for each route based on pages.json configuration.

Layout transitions are now handled via `configurations/layoutTransitions.ts` which defines layout-to-layout transitions (e.g., collapsed → expanded).

All helpers are in `/components/organisms/ActionZone/utils/`.

### Extending the System

- To add a new UI type, add a new component and register it in `componentMap.ts`.
- To add a new layout or menu, update or add a config in `/configurations/`.
- To add new animation variants, update the config or add new helpers in `/utils/`.

---

## Theme System

The system uses a `BaseTheme` (color palette + mode) to generate two distinct themes:

1. **UITheme**: For all UI components, generated by `createTheme()`. It ensures proper color contrast for the current mode (light/dark).
2. **GLTheme**: For 3D rendering, generated by `createGLTheme()`. It uses colors optimized for 3D visibility, regardless of the UI mode.

**Key Functions:**

- `getTheme()`: Returns the current `UITheme`.
- `getGLTheme()`: Returns the current `GLTheme`.
- `toggleThemeMode()`: Toggles between 'light' and 'dark' modes.
- `setThemeMode()`: Sets a specific mode.

## Directory Structure

- **`/routes`**: Pages & API
  - `_app.tsx`: Main app wrapper. Conditionally renders global UI based on `data/pages.json`.
  - `_middleware.ts`: Global middleware for server-side logic (e.g., `debugOnly` access).
  - `theme.tsx`: Renders the `ThemeVisualizer` island.
  - `/partials/*.tsx`: Page content for Fresh's partial navigation.

- **`/islands`**: Interactive Components
  - `ActionZoneController.tsx`: Interactive mobile navigation.
  - `ThemeVisualizer.tsx`: UI for visualizing themes.
  - `Header.tsx`, `GLCanvas.tsx` Other major interactive components.

- **`/components`**: Reusable UI Components (Atomic Design)
  - `/atoms`: Basic building blocks (`Button`, `Icon`).
  - `/molecules`: Combinations of atoms (`CollapsedNav`, `NavButton`).
  - `/organisms`: Complex components (`ActionZone`, `Header`).

- **`/data`**: Content & Configuration
  - `types.ts`: **Centralized TypeScript definitions** for all JSON data.
  - `pages.json`: Site-wide page configuration (`debugOnly`, `showHeader`).
  - `*.json`: Static content for pages (navigation, shows, bio).

- **`/lib`**: Core Libraries
  - `/theme`: The core UI theme system. See "Theme System" section above.
  - `/gl/theme`: The 3D-specific theme system.
  - `/debug`: Debug mode detection and control.
  - `/logger`: Structured logging system.

- **`/utils`**: Shared utility functions.
  - `filterNullishValues.ts`: Removes all keys from an object whose values are null or undefined. Useful for cleaning style objects and other data before passing to components or APIs.
- **`/scene`, `/gl`, etc.**: All logic for the Three.js visualization.

## Main Entry

- `index.ts` - `initGL()`, `InitOptions`, `RendererState`
- `types.ts` - Core GL types

## Theme System (New Architecture)

### Core Theme System (`lib/theme/`)

- `index.ts` - `getTheme()`, `toggleThemeMode()`, `setThemeMode()`
- `types.ts` - `BaseTheme`, `UITheme`, theme type definitions
- `themes/index.ts` - Theme exports barrel
- `utils/createBaseTheme.ts` - `createBaseTheme()`
- `utils/hexToCSS.ts` - `hexToCSS()`

### GL Theme System (`lib/gl/theme/`)

- `index.ts` - `getGLTheme()`, `createGLTheme()`
- `types.ts` - `GLTheme` type definitions

## Islands (Interactive Components)

This directory contains interactive client-side components (islands)

- `islands/ActionZoneController.tsx` - The main interactive mobile navigation system controller
- `islands/Header.tsx` - The main interactive desktop navigation header
- `islands/ThemeVisualizer.tsx` - The interactive UI for visualizing different application themes
- `islands/GLCanvas.tsx` - The interactive 3D logo component
- `islands/PageContainer.tsx` - Handles client-side systems (logger, debug, GL scene orchestration, and background transitions)

## Component-Based Architecture (Atomic Design)

Component logic is organized using Atomic Design principles in `/components`

- **/components/atoms/**: Basic building blocks (`Button.tsx`, `Icon.tsx`)
- **/components/molecules/**: Combinations of atoms (`CollapsedNav.tsx`, `ExpandedMenu.tsx`)
- **/components/organisms/**: Complex components (`ActionZone.tsx`, `Header.tsx`)

## Data Content System

- `data/types.ts` - Centralized TypeScript definitions for all JSON data structures
- `data/pages.json` - Site-wide page configuration (`debugOnly`, `showHeader`, `showActionZone`)
- `data/nav.json` - Source of truth for all site navigation links
- `data/nav-actionZone-animation.json` - State machine for ActionZone button animations
- `data/content-shows.json` - Data for upcoming and past shows
- `data/content-bio-*.json` - Data for the biography page (members, albums, etc.)

## Routes (Pages)

- `routes/_middleware.ts` - Global middleware. Handles `debugOnly` page access control before rendering
- `routes/_app.tsx` - App wrapper. Conditionally renders global UI based on `data/pages.json` config
- `routes/theme.tsx` - Renders the `ThemeVisualizer` island. Access is controlled by middleware
- `routes/index.tsx`, `bio.tsx`, etc. - Top-level page routes that re-export their corresponding partials
- `routes/partials/` - Directory for partial page content, enabling SPA-like navigation

## Setup (Composable Utilities)

- `setup/index.ts` - Barrel exports
- `setup/setupCoreRendering.ts` - `setupCoreRendering()`
- `setup/setupResponsiveHandling.ts` - `setupResponsiveHandling()`
- `setup/setupTextureLoading.ts` - `setupTextureLoading()`
- `setup/setupLayerSystem.ts` - `setupLayerSystem()`
- `setup/setupDebugSystem.ts` - `setupDebugSystem()`

## Scene

- `scene/createScene.ts` - `createScene()`
- `scene/createCamera.ts` - `createCamera()`
- `scene/createRenderer.ts` - `createRenderer()`
- `scene/createPostProcessing.ts` - `createPostProcessing()`
- `scene/createLogoPlaneGeometry.ts` - `createLogoPlaneGeometry()`
- `scene/utils/getResponsiveCameraZ.ts` - `getResponsiveCameraZ()`

### Post-Processing Config (`configScene.json`)

- `postProcessingConfig.finalPass.gain`: Multiplies the final output color for true post-process brightness control. Allows output beyond [0,1] for extra intensity. Example:

  ```json
  "finalPass": {
    "chromaStrength": 0.002,
    "ditherStrength": 10,
    "ditherFrequency": 1000.0,
    "ditherAnimation": 0.1,
    "gain": 1.25
  }
  ```

## Animation

- `components/organisms/actionZone.animation.ts` is the main config and type definition file for all ActionZone-related animations.
- **Per-button, per-route, and per-transition animation is supported:**
  - Each button can have its own animation variant and Tailwind class override via the config.
  - The config supports a `transitions` object for route-to-route (from->to) animation variants.
  - If a specific transition is not defined, sensible fallbacks are used (from->default, default->to, or a global default).
- **Type definitions** for all animation variants, expanded menu variants, and route transitions are in the animation config file.
- All animation logic is config-driven and can be updated without touching component code.

### Example Transition Config

```ts
transitions: {
  '/shows': {
    '/contact': { /* custom animation for shows -> contact */ },
    default: { /* fallback for shows -> any */ }
  },
  default: {
    '/contact': { /* fallback for any -> contact */ }
  }
},
defaultAnimationVariant: { initial: {...}, animate: {...}, exit: {...} }
```

### Usage

Layout transitions are automatically handled based on the current layout state. The system uses layout-to-layout transitions defined in `configurations/layoutTransitions.ts`.

Example layout transition flow:
- User clicks "Shows" → Layout transitions from `collapsed` to `collapsedPage`
- User opens menu → Layout transitions to `expanded`
- User closes menu → Layout transitions back to previous state

## Layers

- `layers/index.ts`