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
- `islands/BottomNav.tsx` - Mobile bottom navigation with drag functionality
- `islands/Home.tsx` - 3D logo component (Logo3D)

### Components (Static UI)
- `components/ThemeToggle.tsx` - Light/dark mode toggle button
- `components/ThemeDemo.tsx` - Theme system demonstration
- `components/Button.tsx` - Reusable button component
- `components/icons/index.ts` - Icon components

### Routes (Pages)
- `routes/index.tsx` - Homepage with 3D logo
- `routes/bio.tsx` - Band biography page
- `routes/shows.tsx` - Shows/concerts page
- `routes/contact.tsx` - Contact information page

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
- `index.ts` - Main logger functionality
- `constants.ts` - Log level constants
- `colors.ts` - Terminal color utilities
- `utils/getMinLogLevel.ts` - Environment-based log levels

### Documentation
- `THEME_SYSTEM.md` - Complete theme system architecture guide
- `CODEX.md` - This file - codebase reference