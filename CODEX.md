## Codex

This codex summarizes the lib/gl codebase, organized by file path, for quick reference by LLMs.

### ` ./textures/VideoCycle/utils/getNextVideoIndex.ts `
-   **Purpose**: Selects next video index, avoiding recent repeats.
-   **Exports**: `getNextVideoIndex()`: Returns next video index based on anti-repeat logic.

### ` ./textures/VideoCycle/utils/prepareNextVideo.ts `
-   **Purpose**: Prepares a video in a hidden buffer for playback.
-   **Exports**: `prepareNextVideo()`: Asynchronously finds, seeks, and starts a video in the hidden buffer, returning its index.

### ` ./textures/VideoCycle/utils/getNewStartTimeAndDuration.ts `
-   **Purpose**: Calculates random, constrained start time/duration for a video segment.
-   **Exports**: `getNewStartTimeAndDuration()`: Returns Promise for `{ startTime, duration }` after seeking.

### ` ./textures/VideoCycle/utils/debugVideoAccess.ts `
-   **Purpose**: Debugs server access for video files (currently prefers manifest-based loading).
-   **Exports**: `debugVideoAccess()`: Tests static file access; returns `null`.

### ` ./textures/VideoCycle/utils/isVideoReady.ts `
-   **Purpose**: Checks if a video element is ready for playback.
-   **Exports**: `isVideoReady()`: Returns boolean based on `readyState`, duration, and dimensions.

### ` ./textures/VideoCycle/utils/loadVideo.ts `
-   **Purpose**: Loads a single video file into an `HTMLVideoElement` and creates a `THREE.VideoTexture`.
-   **Exports**: `loadVideo()`: Returns Promise for `{ video, texture, success }`.

### ` ./textures/VideoCycle/utils/loadVideos.ts `
-   **Purpose**: Manages loading multiple videos from a manifest, with initial batch and incremental loading.
-   **Exports**: `loadVideos()`: Returns Promise for object with `videos`, `videoTextures`, and functions `loadNextVideo()`, `hasMoreVideos()`.

### ` ./textures/VideoCycle/utils/swapBuffers.ts `
-   **Purpose**: Swaps active and hidden video buffers visually and manages playback states.
-   **Exports**: `swapBuffers()`: Asynchronously plays video in hidden buffer, updates opacities, and returns new buffer states.

### ` ./textures/VideoCycle/types.ts `
-   **Purpose**: Defines types for the VideoCycle feature.
-   **Exports**: `BufferObject`: Describes a video buffer's mesh, material, and playback planning properties.

### ` ./textures/VideoCycle/index.ts `
-   **Purpose**: Main orchestrator for video cycling background effect.
-   **Exports**: `createVideoCycle()`: Sets up video loading, state management, and returns `VideoBackgroundManager` with `update()` and `dispose()`.

### ` ./layers/ShadowLayer.ts `
-   **Purpose**: Creates an elliptical gradient shadow mesh.
-   **Exports**: `ShadowLayer` (type), `createShadowLayer()`: Returns `{ mesh, dispose }` for a responsive shadow.

### ` ./layers/UILayer.ts `
-   **Purpose**: Manages a 3D UI layer with "tech" shapes using an orthographic camera.
-   **Exports**: `createUILayer()`: Returns `{ scene, camera, resize }` for the UI overlay.

### ` ./layers/utils/createTechShapes.ts `
-   **Purpose**: Utilities for creating various 3D "technical-looking" shape meshes.
-   **Exports**: `TechShapeType` (type), `createRandomTechShape()`, `createTechShape()`.

### ` ./layers/utils/createOrbitalMarkers.ts `
-   **Purpose**: Creates 3D markers along predefined orbital paths.
-   **Exports**: `createOrbitalMarkers()`: Returns `THREE.Group` of various marker meshes.

### ` ./layers/utils/createOrbitalGrids.ts `
-   **Purpose**: Generates 3D grid patterns (circular and radial lines).
-   **Exports**: `createOrbitalGrids()`: Returns `THREE.Group` of line-based grids.

### ` ./layers/utils/createCelestialBodies.ts `
-   **Purpose**: Creates 3D celestial body-like meshes (spheres, rings) in orbit.
-   **Exports**: `createCelestialBodies()`: Returns `THREE.Group` of "celestial body" meshes.

### ` ./layers/utils/getAllLogoLayers.ts `
-   **Purpose**: Consolidates static and randomly generated logo layers, sorted by Z-position.
-   **Exports**: `getAllLogoLayers()`: Returns array of `LogoLayer` objects.

### ` ./layers/utils/recreateRandomLogoLayers.ts `
-   **Purpose**: Cleans up and regenerates logo layer meshes, primarily for random layers.
-   **Exports**: `recreateRandomLogoLayers()`: Disposes old planes, gets new layers, creates new planes, returns `{ planes, layers }`.

### ` ./layers/utils/getRandomColor.ts `
-   **Purpose**: Generates a `THREE.Color`, optionally constrained by hue or based on an RGB input.
-   **Exports**: `getRandomColor()`: Returns a `THREE.Color`.

### ` ./layers/utils/createStarfield.ts `
-   **Purpose**: Creates a 3D starfield effect using particle meshes.
-   **Exports**: `createStarfield()`: Returns `THREE.Group` of particle meshes.

### ` ./layers/utils/disposeLayers.ts `
-   **Purpose**: Disposes Three.js resources for an array of logo layer meshes.
-   **Exports**: `disposeLogoLayers()`: Cleans up geometries, materials, and removes from scene.

### ` ./layers/utils/createRandomLogoLayers.ts `
-   **Purpose**: Generates an array of `LogoLayer` objects with randomized properties.
-   **Exports**: `createRandomLogoLayers()`: Returns array of `LogoLayer` objects.

### ` ./layers/utils/createShapeLayer.ts `
-   **Purpose**: Creates a 3D group of geometric shapes for UI elements in the 3D scene.
-   **Exports**: `createShapeLayer()`: Returns `THREE.Group` with circles, hexagons, and arcs.

### ` ./layers/utils/createPlanesFromLayers.ts `
-   **Purpose**: Creates `THREE.Mesh` planes for each `LogoLayer` definition using appropriate shaders.
-   **Exports**: `createPlanesFromLayers()`: Returns array of `THREE.Mesh` objects.

### ` ./layers/utils/createDashedOrbits.ts `
-   **Purpose**: Creates 3D dashed orbital lines.
-   **Exports**: `createDashedOrbits()`: Returns `THREE.Group` of `THREE.Line` meshes with `LineDashedMaterial`.

### ` ./layers/utils/createOrbitalParticles.ts `
-   **Purpose**: Creates 3D particles distributed along orbital paths.
-   **Exports**: `createOrbitalParticles()`: Returns `THREE.Group` of particle meshes.

### ` ./layers/utils/index.ts `
-   **Purpose**: Barrel file for `./layers/utils/` directory.
-   **Exports**: All utilities from the subdirectory.

### ` ./layers/utils/createConcentricRings.ts `
-   **Purpose**: Creates 3D concentric rings using `THREE.TorusGeometry`.
-   **Exports**: `createConcentricRings()`: Returns `THREE.Group` of ring meshes.

### ` ./layers/utils/createLogoLayer.ts `
-   **Purpose**: Generates a single `LogoLayer` object with randomized visual properties.
-   **Exports**: `createLogoLayer()`: Returns a `LogoLayer` object.

### ` ./layers/GeometricLayer.ts `
-   **Purpose**: Creates a "cosmic-themed" 3D layer with various geometric elements.
-   **Exports**: `createGeometricLayer()`: Returns `THREE.Group` (currently mostly dashed orbits, other components commented out). `GeometricOptions` (type).

### ` ./layers/LogoLayer.ts ` (main file)
-   **Purpose**: Manages the logo's layered rendering system.
-   **Exports**: `LogoLayer` (type), `createLogoLayer()` (factory for layer management methods: `getAllLayers`, `createPlanes`, `regenerate`, `dispose`).

### ` ./layers/constants.ts `
-   **Purpose**: Defines constants for the layers module.
-   **Exports**: `FPS_OPTIONS`: Array of possible frame rates for layers.

### ` ./layers/index.ts ` (top-level)
-   **Purpose**: Barrel file for the `layers` module.
-   **Exports**: Key constants, types, and creator functions from the `layers` directory.

### ` ./layers/config.ts `
-   **Purpose**: Provides theme-aware configurations for layers and geometric elements.
-   **Exports**: Various `getXConfig()` functions (e.g., `getDashedOrbitsConfig`, `getStaticLogoLayers`) that merge JSON config with current theme colors. `randomLayerConfig`.

### ` ./animation/core/createAnimationEngine.ts `
-   **Purpose**: Core generic animation engine that applies behaviors to state each frame.
-   **Exports**: `createAnimationEngine()`: Creates an animation engine with pure functional approach - immutable state, composable behaviors.

### ` ./animation/core/updateAnimationEngine.ts `
-   **Purpose**: Pure function that updates animation engine state by applying behaviors.
-   **Exports**: `updateAnimationEngine()`: Immutably applies all behaviors to engine state.

### ` ./animation/core/addBehavior.ts `
-   **Purpose**: Pure function that adds a behavior to animation engine.
-   **Exports**: `addBehavior()`: Returns new engine state with added behavior.

### ` ./animation/core/removeBehavior.ts `
-   **Purpose**: Pure function that removes a behavior from animation engine.
-   **Exports**: `removeBehavior()`: Returns new engine state with behavior removed.

### ` ./animation/calculations/calculateMouseRotation.ts `
-   **Purpose**: Pure calculation function for mouse position to rotation conversion.
-   **Exports**: `calculateMouseRotation()`: Deterministic mouse rotation calculation.

### ` ./animation/calculations/calculateStaticLayerPosition.ts `
-   **Purpose**: Pure calculation function for static layer breathing animation.
-   **Exports**: `calculateStaticLayerPosition()`: Deterministic static layer position calculation.

### ` ./animation/calculations/calculateRandomLayerPosition.ts `
-   **Purpose**: Pure calculation function for random layer chaotic movement.
-   **Exports**: `calculateRandomLayerPosition()`: Deterministic random layer position calculation.

### ` ./animation/utils/smoothRotationInterpolation.ts `
-   **Purpose**: Pure interpolation function for smooth rotation transitions.
-   **Exports**: `smoothRotationInterpolation()`: Linear interpolation for rotations.

### ` ./animation/utils/getRandomInterval.ts `
-   **Purpose**: Pure function for generating random time intervals.
-   **Exports**: `getRandomInterval()`: Random interval generation with configurable bounds.

### ` ./animation/createLogoAnimator.ts `
-   **Purpose**: Main orchestrator that combines pure calculations with necessary side effects.
-   **Exports**: `createLogoAnimator()`: Logo animation orchestrator using pure functions.

### ` ./animation/AnimationLoop.ts ` (legacy)
-   **Purpose**: Original monolithic animation loop - kept for backward compatibility.
-   **Exports**: All original animation functions: Legacy animation system (deprecated in favor of pure functional system).

### ` ./animation/types.ts `
-   **Purpose**: Defines types for both new pure functional and legacy animation systems.
-   **Exports**: `AnimationEngineState`, `AnimationBehavior`, `LogoAnimationState`, etc.: Complete type system for animation.

### ` ./animation/index.ts `
-   **Purpose**: Main entry point for animation module with pure functional and legacy exports.
-   **Exports**: All animation system components: Unified animation system exports.

### ` ./controls/OrbitControlsSetup.ts `
-   **Purpose**: Sets up Three.js `OrbitControls` and keyboard controls.
-   **Exports**: `setupOrbitControls()`, `setupKeyboardControls()`.

### ` ./controls/index.ts `
-   **Purpose**: Barrel file for the controls module.
-   **Exports**: All from `./controls/OrbitControlsSetup.ts`.

### ` ./types.ts ` (main GL library types)
-   **Purpose**: Defines core TypeScript types for the 3D graphics library.
-   **Exports**: `VideoBackgroundManager`, `UIOverlay`, `InitOptions`, `RendererState`.

### ` ./shaders/DitheringShader.ts `
-   **Purpose**: GLSL shaders for blue noise dithering post-processing.
-   **Exports**: `ditheringVertexShader`, `ditheringFragmentShader`.

### ` ./shaders/ElectricShader.ts `
-   **Purpose**: Custom GLSL shaders for electric logo effect and a final pass effect.
-   **Exports**: `vertexShader`, `fragmentShader` (for layers), `finalPassVertexShader`, `finalPassFragmentShader` (chromatic aberration/vignette), `createElectricShaderMaterial()` (factory).

### ` ./shaders/index.ts `
-   **Purpose**: Barrel file for the shaders module.
-   **Exports**: `ShaderParams` (type), and all shader strings/factories from subdirectory.

### ` ./shaders/SharpeningShader.ts `
-   **Purpose**: GLSL shaders for image sharpening post-processing.
-   **Exports**: `sharpeningVertexShader`, `sharpeningFragmentShader`.

### ` ./index.ts ` (main GL library entry point)
-   **Purpose**: Initializes the entire 3D rendering environment.
-   **Exports**: `initGL()`: Asynchronously sets up scene, camera, renderer, post-processing, layers, controls, animation. Returns cleanup function. `InitOptions`, `RendererState` (types).

### ` ./theme.ts `
-   **Purpose**: Manages color theming for the visualization.
-   **Exports**: `RGBColor`, `HexColor`, `Logo3DTheme` (types). `getCurrentTheme()`, `setTheme()`, color conversion utils (`colorToRGB`, etc.), `createCustomTheme()`.

### ` ./geometry/createTechDiagram.ts `
-   **Purpose**: Creates a 3D technical diagram with nodes and connections.
-   **Exports**: `createTechDiagram()`: Returns `THREE.Group`.

### ` ./geometry/createCrosshair.ts `
-   **Purpose**: Creates a 3D crosshair shape.
-   **Exports**: `createCrosshair()`: Returns `THREE.Group`.

### ` ./geometry/createArcOutline.ts `
-   **Purpose**: Creates a 3D arc outline geometry.
-   **Exports**: `createArcOutline()`: Returns `THREE.BufferGeometry`.

### ` ./geometry/createCircleOutline.ts `
-   **Purpose**: Creates a 3D circle outline geometry with thickness.
-   **Exports**: `createCircleOutline()`: Returns `THREE.BufferGeometry`.

### ` ./geometry/createGrid.ts `
-   **Purpose**: Creates a 3D grid pattern geometry with line thickness.
-   **Exports**: `createGrid()`: Returns `THREE.BufferGeometry`.

### ` ./geometry/createSegmentedCircle.ts `
-   **Purpose**: Creates a 3D segmented circle indicator.
-   **Exports**: `createSegmentedCircle()`: Returns `THREE.Group`.

### ` ./geometry/createDataPanel.ts `
-   **Purpose**: Creates a 3D rectangular panel/frame with rounded corners.
-   **Exports**: `createDataPanel()`: Returns `THREE.Group`.

### ` ./geometry/createTriangleIndicator.ts `
-   **Purpose**: Creates a 3D triangular indicator outline with thickness.
-   **Exports**: `createTriangleIndicator()`: Returns `THREE.BufferGeometry`.

### ` ./geometry/index.ts `
-   **Purpose**: Barrel file for geometry utilities.
-   **Exports**: All geometry creation functions.

### ` ./geometry/createHexagonOutline.ts `
-   **Purpose**: Creates a 3D hexagon outline geometry with thickness.
-   **Exports**: `createHexagonOutline()`: Returns `THREE.BufferGeometry`.

### ` ./scene/addLensFlares.ts `
-   **Purpose**: Adds a configurable lens flare effect to the scene.
-   **Exports**: `addLensFlares()`: Asynchronously creates and adds `Lensflare` to a `PointLight`, returns the light.

### ` ./scene/createPostProcessing.ts `
-   **Purpose**: Sets up the post-processing pipeline (composer and passes).
-   **Exports**: `BloomParams` (type), `createPostProcessing()`: Returns Promise for `{ composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass }`.

### ` ./scene/createVideoBackground.ts `
-   **Purpose**: Manages scene setup for video background planes and their responsive scaling.
-   **Exports**: `createVideoBackground()`: Asynchronously creates planes and initializes `createVideoCycle`, returns `VideoBackgroundManager`.

### ` ./scene/createCamera.ts `
-   **Purpose**: Creates the main `THREE.PerspectiveCamera` with responsive settings.
-   **Exports**: `createCamera()`: Returns `Promise<THREE.PerspectiveCamera>`.

### ` ./scene/createScene.ts `
-   **Purpose**: Creates the basic `THREE.Scene`.
-   **Exports**: `createScene()`: Returns `Promise<THREE.Scene>`.

### ` ./scene/utils/getResponsiveCameraZ.ts `
-   **Purpose**: Calculates camera Z position based on screen aspect ratio for consistent logo framing.
-   **Exports**: `getResponsiveCameraZ()`: Returns camera Z distance (number).

### ` ./scene/utils/isMobileDevice.ts `
-   **Purpose**: Detects if the current device is mobile.
-   **Exports**: `isMobileDevice()`: Returns boolean.

### ` ./scene/utils/mobileDebugHelper.ts `
-   **Purpose**: Utilities for logging mobile responsiveness debug information.
-   **Exports**: `debugMobileResponsiveness()`, `startMobileDebugMonitoring()`.

### ` ./scene/utils/calculatePlaneSize.ts `
-   **Purpose**: Calculates plane dimensions needed to cover camera FOV at a distance.
-   **Exports**: `calculatePlaneSize()`: Returns `{ width, height }`.

### ` ./scene/utils/getBaselineDimensions.ts `
-   **Purpose**: Provides foundational dimensions for scene elements (logo, video plane, camera) for a 16:9 desktop baseline.
-   **Exports**: `ResponsiveDimensions` (interface), `getBaselineDimensions()`.

### ` ./scene/createLogoPlaneGeometry.ts `
-   **Purpose**: Creates `THREE.PlaneGeometry` for logo layers based on responsive baseline dimensions.
-   **Exports**: `createLogoPlaneGeometry()`: Returns `THREE.PlaneGeometry`.

### ` ./scene/createRenderer.ts `
-   **Purpose**: Creates and configures the `THREE.WebGLRenderer` and its DOM container.
-   **Exports**: `createRenderer()`: Returns `Promise<THREE.WebGLRenderer>`.

### ` ./scene/addVideoBackground.ts ` (wrapper)
-   **Purpose**: Simplified wrapper to add video background.
-   **Exports**: `addVideoBackground()`: Calls the main `createVideoBackground` function.

### ` ./themes/synthwave.ts `
-   **Purpose**: Defines the "Synthwave" theme colors.
-   **Exports**: `SYNTHWAVE_THEME`: `Logo3DTheme` object.

### ` ./themes/monochrome.ts `
-   **Purpose**: Defines the "Monochrome" theme colors.
-   **Exports**: `MONOCHROME_THEME`: `Logo3DTheme` object.

### ` ./themes/cyberpunk.ts `
-   **Purpose**: Defines the "Cyberpunk" theme colors.
-   **Exports**: `CYBERPUNK_THEME`: `Logo3DTheme` object.

### ` ./themes/techscape.ts `
-   **Purpose**: Defines the "Techscape" theme colors (current default).
-   **Exports**: `TECHSCAPE_THEME`: `Logo3DTheme` object.

### ` ./debug/DebugOverlay.ts `
-   **Purpose**: Provides an interactive on-screen debug overlay with UI controls.
-   **Exports**: `DebugOverlayOptions`, `DOFParams`, `DOFChangeMeta` (types). `DebugOverlay` (class for creating and managing the debug panel).