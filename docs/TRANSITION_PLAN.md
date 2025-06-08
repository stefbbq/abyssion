# Page Transition Animation: Implementation Plan

## 1. Objective

Implement a page transition system for the WebGL animation, allowing for animated transitions between the home page (which features the interactive logo) and other content pages (where the logo should be hidden). This system will be architected to be scalable and adhere to the project's existing functional and modular design patterns.

## 2. Core Concepts

The implementation will be centered around the `SceneOrchestrator`, which acts as a state machine for managing different animation states or "scenes" corresponding to application pages.

- **Page Orchestrators**: Each distinct animated page (like the home page) will have its own dedicated `AnimationOrchestrator`. For pages without special 3D animations, a generic "empty" orchestrator will be used to ensure a clean slate.
- **Centralized Control**: The `SceneOrchestrator` will manage the lifecycle of these page orchestrators. When a user navigates, it will be responsible for gracefully tearing down the old orchestrator and setting up the new one.
- **Dependency Injection**: A registry of all available page orchestrator factory functions will be passed to the `SceneOrchestrator` during its initialization. This decouples the scene manager from the concrete page implementations.
- **Route-Driven State**: The `ClientInitializer` island will monitor route changes, interpret the page from the URL, and issue commands to the `SceneOrchestrator` to switch to the appropriate page state.

## 3. Implementation Steps

### Step 1: Centralize Scene Orchestrator Access

To allow client-side components to communicate with the animation system, we will expose the `sceneOrchestrator` instance globally.

- [x] **`lib/gl/index.ts`**:
    - [x] The `sceneOrchestrator` instance will be created within `initGL` and stored on the module-level `glState` object.
    - [x] A new exported function, `getSceneOrchestrator()`, will provide safe, global access to this instance.
    - [x] The `initGL` function will be responsible for creating a map of all page orchestrator factories and passing it to the orchestrator. It will also register the initial orchestrator based on the entry route.

- [x] **`lib/gl/animation/index.ts`**:
    - [x] The legacy `startAnimationLoop` function will be refactored. The responsibility for creating and managing the orchestrator lifecycle will move up to `initGL`.
    - [x] This file will serve as a barrel, exporting all page orchestrator factory functions.

### Step 2: Enhance the `SceneOrchestrator`

The `SceneOrchestrator` needs to be equipped to handle the logic of switching between pages.

- [x] **`lib/gl/animation/createSceneOrchestrator.ts`**:
    - [x] The factory function's signature will be updated to accept the orchestrator registry: `createSceneOrchestrator(state: RendererState, orchestrators: Record<string, () => AnimationOrchestrator>)`.
    - [x] The `switchToPage(pageName: string)` method will be fully implemented to:
        1.  Identify and dispose of the currently active page orchestrator.
        2.  Look up the requested `pageName` in the injected orchestrator registry.
        3.  Instantiate the new orchestrator and register it as active.
        4.  Handle cases where a page name is not found, likely defaulting to the empty orchestrator.

### Step 3: Implement Page-Specific Lifecycle Methods

Page orchestrators must properly manage their own resources to prevent visual artifacts across transitions.

- [x] **`lib/gl/animation/orchestrators/createLogoPageOrchestrator.ts`**:
    - [x] The `dispose` function will be implemented to remove all logo-related meshes from the scene. This replaces the old `hideLogoLayers` logic with a more robust, encapsulated approach.
    - [x] The initialization logic will be reviewed to ensure it correctly and idempotently adds meshes to the scene when the orchestrator becomes active.

- [x] **`lib/gl/animation/orchestrators/createEmptyPageOrchestrator.ts`** (New File):
    - [x] A new, minimal orchestrator will be created. It will have empty `update` and `dispose` methods and serve as the default for any page that does not have a dedicated 3D animation scene.

### Step 4: Update Client-Side Routing Logic

The `ClientInitializer` will become the trigger for all page transitions.

- [x] **`islands/ClientInitializer.tsx`**:
    - [x] The `handleRouteChange` function will be rewritten to use the new system.
    - [x] It will import `getSceneOrchestrator` and call `switchToPage(pageName)` upon navigation events.
    - [x] It will contain the logic to map URL paths to `pageName` strings (e.g., `/` -> `logo-page`, `/portfolio` -> `portfolio-page`, others -> `empty-page`).
    - [x] All direct calls to `showLogoLayers()` and `hideLogoLayers()` will be removed.

## 4. File-by-File Change Summary

- [x] **`docs/TRANSITION_PLAN.md`** (This file): To be created.
- [x] **`lib/gl/index.ts`**: Modify `initGL` to create and manage the `sceneOrchestrator`. Export `getSceneOrchestrator`.
- [x] **`lib/gl/animation/index.ts`**: Export page orchestrator factories and refactor `startAnimationLoop`.
- [x] **`lib/gl/animation/createSceneOrchestrator.ts`**: Update signature and implement the `switchToPage` logic.
- [x] **`lib/gl/animation/orchestrators/createLogoPageOrchestrator.ts`**: Implement the `dispose` method for proper cleanup.
- [x] **`lib/gl/animation/orchestrators/createEmptyPageOrchestrator.ts`**: New file for the default empty page state.
- [x] **`islands/ClientInitializer.tsx`**: Rework `handleRouteChange` to drive transitions via the scene orchestrator.

## 5. Adherence to Project Guides

This plan is compliant with the principles in `CODEX.md` and `LLM_GUIDE.md`:

- **Functional & Composable**: Relies on factory functions and dependency injection.
- **Encapsulation**: Each orchestrator manages its own state and resources.
- **Single Responsibility**: Clear separation of concerns between routing (`ClientInitializer`), state management (`SceneOrchestrator`), and rendering (`PageOrchestrators`).
- **Architectural Consistency**: Extends the existing orchestrator pattern rather than introducing a new concept. 