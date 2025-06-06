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
- `islands/Header.tsx` - Main navigation header with theme integration
- `islands/BottomNav.tsx` - Main navigation coordinator
- `islands/Home.tsx` - 3D logo component (Logo3D)
- `islands/MusicPlayer.tsx` - Audio player component

### Atomic Design System

#### Atoms (Basic UI Building Blocks)
- `atoms/Icon.tsx` - SVG icon component (back arrow, menu hamburger, etc.)
- `atoms/BaseButton.tsx` - Base button/link with Fresh Partials support
- `atoms/Button.tsx` - Reusable styled button component
- `atoms/ThemeToggle.tsx` - Light/dark mode toggle button
- `atoms/ThemeDemo.tsx` - Theme system demonstration
- `atoms/icons/` - Icon components (Facebook, Instagram, Discord, SoundCloud, Hamburger)
- `atoms/index.ts` - Atomic component barrel exports

#### Molecules (Component Combinations)
- `molecules/NavButton.tsx` - Smart navigation button (Icon + BaseButton + state)
- `molecules/ExpandedMenu.tsx` - Expanded menu with social links and navigation items
- `molecules/CollapsedNav.tsx` - Collapsed navigation with morphing buttons
- `molecules/index.ts` - Molecule component barrel exports

### Data Content System
- `data/` - All static content for pages in JSON files
  - `bandMembers.json` - Band member data for bio page
  - `shows.json` - Shows (upcoming and past) for shows page
  - `bioAbout.json` - About section paragraphs for bio page
  - `bioAlbums.json` - Albums/releases for bio page
  - `bioSections.json` - Section titles/descriptions for bio page
  - *(add more as needed for other pages)*

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
- `utils/navigation/NavigationStates.ts` - `getButtonStates()` - Navigation state calculation utility
- `utils/navigation/navigationConfig.ts` - `NAV_CONFIG`, navigation configuration constants
- `utils/navigation/index.ts` - Navigation utilities barrel exports
- `utils/index.ts` - Main utils barrel exports

### Documentation
- `THEME_SYSTEM.md` - Complete theme system architecture guide
- `CODEX.md` - This file - codebase reference

### Navigation System (Fresh Partials)
- **Partial-first SPA routing**: All page content lives in partials, top-level routes re-export partials for SSR and direct navigation
- **Client-side routing**: Seamless page transitions without full reloads using Fresh Partials
- **GL world persistence**: 3D environment stays active during navigation
- **Adaptive navigation states**: BottomNav morphs between homepage/subpage layouts
- **Smooth animations**: CSS transforms with 500ms ease-out transitions
- **Route detection**: Signal-based current path tracking with polling fallback