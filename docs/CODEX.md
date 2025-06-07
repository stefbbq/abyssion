## Codex

Quick reference for codebase structure and exports.

### Main Entry
- `index.ts` - `initGL()`, `InitOptions`, `RendererState`
- `types.ts` - Core GL types

### Theme System (New Architecture)

#### Core Theme System (`lib/theme/`)
- `index.ts` - `getUITheme()`, `toggleThemeMode()`, `setThemeMode()`, `getCurrentBaseTheme()`
- `types.ts` - `BaseTheme`, `UITheme`, theme type definitions
- `themes/index.ts` - Theme exports barrel
- `themes/deepSpaceHUD.ts` - `deepSpaceHUDTheme`, `deepSpaceHUDLightTheme`
- `utils/createBaseTheme.ts` - `createBaseTheme()`
- `utils/hexToCSS.ts` - `hexToCSS()`
- `utils/rgbToCSS.ts` - `rgbToCSS()`

#### GL Theme System (`lib/gl/theme/`)
- `index.ts` - `getGLTheme()`, `createGLTheme()`
- `createGLTheme.ts` - GL theme generation from base themes
- `types.ts` - `GLTheme` type definitions

### Islands (Interactive Components)
- This directory integrates components with the Fresh framework. Each file is a simple pointer that re-exports the main component logic from the `/components` directory, making it "interactive."
- `islands/ActionZoneController.tsx` - The main interactive mobile navigation system controller. It decides which layout to display.
- `islands/Header.tsx` - The main interactive desktop navigation header.
- `islands/GLCanvas.tsx` - The interactive 3D logo component.
- `islands/MusicPlayer.tsx` - The interactive audio player component.

### Component-Based Architecture (Atomic Design)
- All component logic is organized using Atomic Design principles inside the `/components` directory, broken into `atoms`, `molecules`, and `organisms`.

#### `/components/atoms/` (Basic building blocks)
- `Button.tsx` - A versatile button that renders as `<button>` or `<a>` with styles.
- `Icon.tsx` - Renders simple SVG icons.
- `icons/` - Directory containing individual SVG icon components.
- `index.ts` - Barrel file for atom exports.

#### `/components/molecules/` (Combinations of atoms)
- `CollapsedNav.tsx` - Renders the collapsed state for the mobile action zone.
- `ExpandedMenu.tsx` - Renders the expanded menu with navigation and social links.
- `GLCanvas.tsx` - The WebGL logo canvas.
- `NavButton.tsx` - A highly dynamic, animated button that uses `framer-motion`'s `layoutId` to morph between different states. It renders either an `<a>` or `<button>` tag.
- `ThemeToggle.tsx` - Light/dark mode toggle button.
- `index.ts` - Barrel file for molecule exports.

#### `/components/organisms/` (Complex components)
- `ActionZone.tsx` - The main presentation component for the mobile navigation. It's a "dumb" container that handles the open/closed/drag states and renders children with framer-motion animations.
- `ActionZoneController.tsx` - Controller for the ActionZone, managing state and layouts.
- `Header.tsx` - The main site header, visible on desktop.
- `MusicPlayer.tsx` - The audio player.
- `index.ts` - Barrel file for organism exports.

### Data Content System
- `data/` - All static content for pages in JSON files.
- `navigation.json` - The single source of truth for all site navigation and social links.
- `bandMembers.json` - Band member data for bio page.
- `shows.json` - Shows (upcoming and past) for shows page.
- `bioAbout.json` - About section paragraphs for bio page
- `bioAlbums.json` - Albums/releases for bio page
- `bioSections.json` - Section titles/descriptions for bio page

### Routes (Pages)
- `routes/index.tsx` - Homepage (re-exports partial)
- `routes/bio.tsx` - Band biography page (re-exports partial)
- `routes/shows.tsx` - Shows/concerts page (re-exports partial)
- `routes/contact.tsx` - Contact information page (re-exports partial)
- `routes/_app.tsx` - App wrapper with Fresh Partials support and persistent BottomNav/Header overlay
- `routes/partials/home.tsx` - Partial route for homepage content (loads from JSON as needed)
- `routes/partials/bio.tsx` - Partial route for bio page content (loads all content from JSON)
- `routes/partials/shows.tsx` - Partial route for shows page content (loads all content from JSON)
- `routes/partials/contact.tsx` - Partial route for contact page content

### Setup (Composable Utilities)
- `setup/index.ts` - Barrel exports
- `setup/setupCoreRendering.ts` - `setupCoreRendering()`
- `setup/setupResponsiveHandling.ts` - `setupResponsiveHandling()`
- `setup/setupTextureLoading.ts` - `setupTextureLoading()`
- `setup/setupLayerSystem.ts` - `setupLayerSystem()`
- `setup/setupDebugSystem.ts` - `setupDebugSystem()`
- `setup/createCleanupFunction.ts` - `createCleanupFunction()`

### Scene
- `scene/createScene.ts` - `createScene()`
- `scene/createCamera.ts` - `createCamera()`
- `scene/createRenderer.ts` - `createRenderer()`
- `scene/createPostProcessing.ts` - `createPostProcessing()`, `BloomParams`
- `scene/createLogoPlaneGeometry.ts` - `createLogoPlaneGeometry()`
- `scene/addLensFlares.ts` - `addLensFlares()`
- `scene/addVideoBackground.ts` - `addVideoBackground()`
- `scene/createVideoBackground.ts` - `createVideoBackground()`
- `scene/utils/getResponsiveCameraZ.ts` - `getResponsiveCameraZ()`
- `scene/utils/isMobileDevice.ts` - `isMobileDevice()`
- `scene/utils/mobileDebugHelper.ts` - `debugMobileResponsiveness()`, `startMobileDebugMonitoring()`
- `scene/utils/calculatePlaneSize.ts` - `calculatePlaneSize()`
- `scene/utils/getBaselineDimensions.ts` - `getBaselineDimensions()`, `ResponsiveDimensions`

### Animation
- `animation/index.ts` - Main animation exports
- `animation/createLogoAnimator.ts` - `createLogoAnimator()`
- `animation/AnimationLoop.ts` - Legacy animation system
- `animation/types.ts` - Animation types
- `animation/core/createAnimationEngine.ts` - `createAnimationEngine()`
- `animation/core/updateAnimationEngine.ts` - `updateAnimationEngine()`
- `animation/core/addBehavior.ts` - `addBehavior()`
- `animation/core/removeBehavior.ts` - `removeBehavior()`
- `animation/calculations/` - Pure calculation functions
- `animation/utils/` - Animation utilities

### Layers
- `layers/index.ts` - Barrel exports
- `layers/LogoLayer.ts` - `createLogoLayer()`, `LogoLayer` type
- `layers/GeometricLayer.ts` - `createGeometricLayer()`, `GeometricOptions`
- `layers/ShadowLayer.ts` - `createShadowLayer()`, `ShadowLayer`
- `layers/UILayer.ts` - `createUILayer()`
- `layers/config.ts` - Layer configuration functions
- `layers/constants.ts` - `FPS_OPTIONS`
- `layers/utils/` - Layer utilities

### Controls
- `controls/index.ts` - `createControlsSystem()`
- `controls/createControlsSystem.ts` - Main controls orchestrator
- `controls/OrbitControlsSetup.ts` - `setupOrbitControls()`, `setupKeyboardControls()`
- `controls/types.ts` - Controls types
- `controls/config/` - Controls configuration
- `controls/core/` - Core control systems

### Textures
- `textures/VideoCycle/index.ts` - `createVideoCycle()`
- `textures/VideoCycle/types.ts` - `BufferObject`
- `textures/VideoCycle/utils/` - Video utilities

### Shaders
- `shaders/index.ts` - Barrel exports
- `shaders/ElectricShader.ts` - Electric logo shaders
- `shaders/DitheringShader.ts` - Dithering shaders
- `shaders/SharpeningShader.ts` - Sharpening shaders

### Geometry
- `geometry/index.ts` - Barrel exports
- `geometry/` - 3D shape creation utilities

### Debug
- `debug/DebugOverlay.ts` - `DebugOverlay` class

### Logger System (`lib/logger/`)
- `index.ts` - Main logger with context filtering: `log()`, `log.trace()`, `log.debug()`, `log.info()`, `log.warn()`, `log.error()`, `log.critical()`, `logDeno()`
- `index.ts` - Context controls: `disableContext()`, `enableContext()`, `focusContext()`, `clearFocus()`, `resetContexts()`
- `constants.ts` - Log levels and contexts: `LogLevel`, `LogContext` (GL, GL_VIDEO, GL_ANIMATION, GL_SCENE, GL_CONTROLS, GL_GEOMETRY, GL_SHADERS, GL_TEXTURES, PREACT)
- `colors.ts` - Terminal color utilities and styling
- `utils/getMinLogLevel.ts` - Environment-based log level detection
- `utils/createClientLogger.ts` - Client logger factory with `shouldLog()`, `shouldLogWithDebugMode()`, `LogFunction` type
- `utils/createContextFilter.ts` - Context filtering state management with `ContextFilter` type
- `utils/createContextControls.ts` - Context control utilities with `ContextControls` type
- `utils/createDenoLogger.ts` - Deno-compatible logger factory
- `utils/initializeLogger.ts` - Logger initialization
- `utils/initializeLoggerClient.ts` - Client-specific initialization
- `utils/initializeLoggerServer.ts` - Server-specific initialization
- `utils/getAdaptiveColors.ts` - Adaptive color utilities
- `utils/detectTheme.ts` - Theme detection for styling

### Utils (Utility Functions)
- `utils/index.ts` - Main utils barrel exports.
- `utils/navigation/types.ts` - Contains all TypeScript definitions for navigation, e.g., `NavButtonState`, `MenuItem`, `SocialLink`.

### Documentation
- `THEME_SYSTEM.md` - Complete theme system architecture guide
- `CODEX.md` - This file - codebase reference

### Navigation System (Fresh Partials)
- **Partial-first SPA routing**: All page content lives in partials, top-level routes re-export partials for SSR and direct navigation
- **Client-side routing**: Seamless page transitions without full reloads using Fresh Partials
- **GL world persistence**: 3D environment stays active during navigation
- **Adaptive navigation states**: ActionZone morphs between layouts (`CollapsedNavHome`, `CollapsedNavPage`) based on the current route.
- **Smooth animations**: Powered by `framer-motion` using the `layoutId` prop for morphing effects.
- **Route detection**: Signal-based current path tracking within `ActionZoneController`.