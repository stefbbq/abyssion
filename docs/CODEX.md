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

The application uses a reactive, CSS-variable-driven theme system that supports dynamic switching between light and dark modes without page reloads.

1.  **`BaseTheme`**: The single source of truth, defining a color palette and a mode (`light` or `dark`). (see `lib/theme/themes/`)
2.  **`UITheme`**: A complete theme object generated from a `BaseTheme` by the `createTheme()` function. It contains all color, spacing, and effect values. It also defines two distinct visual styles:
    -   **`glass`**: A lighter, more transparent effect for content backgrounds.
    -   **`frost`**: A darker, more opaque effect for navigation elements.
3.  **`createThemeVariables()`**: A utility that converts the `UITheme` object into a flat list of CSS custom properties (e.g., `--colors-background-primary: #000;`).
4.  **`ThemeProvider` Island**: This island, located in `_app.tsx`, injects the theme variables into the document head. It uses a Preact Signal to listen for theme changes and dynamically updates the CSS variables on the client, enabling instant theme toggling.
5.  **Tailwind Integration**: `tailwind.config.ts` is configured to use these CSS variables, allowing components to be styled semantically with classes like `bg-background-primary`, `text-text-secondary`, etc.

**Key Signals & Functions:**

-   `currentThemeMode`: A signal holding the current mode (`'light'` | `'dark'`).
-   `currentTheme`: A computed signal that holds the complete, up-to-date `UITheme` object.
-   `toggleThemeMode()`: Toggles the `currentThemeMode` signal between `'light'` and `'dark'`.
-   `setThemeMode()`: Sets a specific mode.

## Styling

Component styling is primarily handled by Tailwind CSS utility classes. The theme system exposes all theme values as CSS variables, which are consumed by Tailwind.

In addition to standard utilities, two custom utility classes are available in `static/styles.css` for creating blurred, semi-transparent backgrounds:

-   **.glass-effect**: Used for primary content containers. It applies a lighter, more transparent blur.
-   **.frost-effect**: Used for primary navigation elements (`Header`, `ActionZone`). It applies a darker, more opaque blur for better readability.

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

- **`/components`**: Reusable UI Components
  - `Shell.tsx`: A generic container for content sections with the `.glass-effect`.
  - `Card.tsx`: A flexible card component, supporting images and custom content, with the `.glass-effect`.
  - `ListItem.tsx`: A generic component for list items.
  - `Button.tsx`, `Dropdown.tsx`, etc.

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
- `islands/ThemeProvider.tsx` - Injects and dynamically updates the theme's CSS variables.
- `islands/ThemeVisualizer.tsx` - The interactive UI for visualizing different application themes
- `islands/GLCanvas.tsx` - The interactive 3D logo component
- `islands/PageContainer.tsx` - Handles client-side systems (logger, debug, GL scene orchestration, and background transitions)

## Component-Based Architecture

Component logic is organized in `/components`. The architecture favors flat, reusable, and generic components over a strict atomic design hierarchy.

-   **`Shell.tsx`**: A generic container for content sections with the `.glass-effect`.
-   **`Card.tsx`**: A flexible card component, supporting images and custom content, with the `.glass-effect`.
-   **`ListItem.tsx`**: A generic component for list items.
-   Other foundational components like `Button.tsx`, `Dropdown.tsx`, and icons.

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

- `animation/index.ts` - Main animation exports
- `animation/createLogoAnimator.ts` - `createLogoAnimator()`
- `animation/core/createAnimationEngine.ts` - `createAnimationEngine()`

## Layers

- `layers/index.ts` - Barrel exports
- `layers/LogoLayer.ts` - `createLogoLayer()`
- `layers/GeometricLayer.ts` - `createGeometricLayer()`
- `layers/ShadowLayer.ts` - `createShadowLayer()`

## Controls

- `controls/index.ts` - `createControlsSystem()`
- `controls/createControlsSystem.ts` - Main controls orchestrator
- `controls/OrbitControlsSetup.ts` - `setupOrbitControls()`

## Textures & Shaders

- `textures/VideoCycle/index.ts` - `createVideoCycle()`
- `shaders/index.ts` - Barrel exports for GLSL shaders
- `shaders/ShadowShader.ts` - Gradient shadow shader for the logo layer

## Debug & Logger Systems

- `lib/debug/index.ts` - Debug mode detection and control
- `lib/logger/index.ts` - Structured, color-coded logging system

## Utils (Utility Functions)

- `utils/index.ts` - Main utils barrel exports. **Note:** Navigation types are now in `data/types.ts`

## Documentation

- `THEME_SYSTEM.md` - Complete theme system architecture guide
- `CODEX.md` - This file
- `LLM_GUIDE.md` - LLM code styles and guidelines.

## Core Architecture Summary

- **Routing**: Fresh-based, with a partial-first approach. UI and access control are configured in `data/pages.json` and enforced by `_app.tsx` and `_middleware.ts`
- **Data & Types**: All static content is in `/data`, with all corresponding TypeScript types co-located in `data/types.ts`
- **State Management**: Primarily Preact Signals for UI state
- **3D Scene**: Managed via `/scene`, `/gl`, and related directories, containing all Three.js logic

## Chromatic Aberration & Glitch Effects

- The chromatic aberration (RGB split) and glitch effect is implemented in `lib/gl/shaders/ElectricShader.ts` as `finalPassFragmentShader`.
- The effect can operate in two modes:
  - Classic: Subtle, global chromatic aberration.
  - Segmented/Flickery: Horizontal bands flicker and desync, with theme color pops (purple, blue, etc.) appearing in some bands. Bands and color pops are controlled by noise/hash for irregularity.
- The mode and effect parameters are controlled by uniforms:
  - `segmentedGlitchMode`: 0 = classic, 1 = segmented/flickery
  - `glitchIntensity`: How strong the segmented effect is (tunable for animation)
  - `flickerRate`: How fast bands flicker (tunable for animation)
  - `colorPopIntensity`: How much theme color pops in (tunable for animation)
  - `themePrimary`, `themeAccent`, `themeSecondary`: Theme colors used for color pops
- All uniforms can be animated (e.g., for page transitions) by updating the values in the post-processing pipeline (`lib/gl/scene/createPostProcessing.ts`).
- The effect is visible in the final post-processing pass (`finalPass`).
