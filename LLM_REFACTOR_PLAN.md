# Refactor Plan: GL Module (Abyssion)

## Motivation
The existing abstractions in the GL module (`scene/SceneSetup.ts`, `animation/AnimationLoop.ts`, `index.ts`) are overly abstracted, not idiomatic to the project's CODEX, and result in confusing, hard-to-test, and hard-to-maintain code. The goal is to align the codebase with the conventions outlined in `CODEX.md`:

- One top-level function per file
- Pure functions by default, no side effects at import
- All state passed explicitly
- No classes, no shared state via modules
- Avoid large or catch-all files

## Problems Identified

- `SceneSetup.ts` contains multiple unrelated functions (scene, camera, renderer, post-processing, etc.).
- `AnimationLoop.ts` uses module-level state and is not purely functional.
- `index.ts` is a monolithic initializer, too large and cross-cutting.
- Some initialization logic is scattered or mixed with effect logic.

## Refactor Plan

### 1. Split `SceneSetup.ts` into Focused Files

Each function is moved to its own file under `lib/gl/scene/`:

- `createScene.ts`: Exports `createScene`
- `createCamera.ts`: Exports `createCamera`
- `createRenderer.ts`: Exports `createRenderer`
- `createPostProcessing.ts`: Exports `createPostProcessing`
- `addLensFlares.ts`: Exports `addLensFlares`
- `createPlaneGeometry.ts`: Exports `createPlaneGeometry`
- `addVideoBackground.ts`: Exports `addVideoBackground`

### 2. Refactor `SceneSetup.ts`

- Remove all logic, leave only a deprecation notice.

### 3. Update All Imports

- Update `index.ts` and any other files to import from the new split-out files.
- Remove any references to the deprecated `SceneSetup.ts`.

### 4. Next Steps (Updated)

#### Complete Scene Refactor (before animation)

- [x] Verify all scene-related imports/exports are correct in all files (no lingering references to deprecated files)
- [x] Fix all type errors and major lint warnings in the new scene files (replace `any`, etc.)
- [ ] Ensure all scene-related files build and pass type checks
- [ ] Run a build to confirm the scene setup is functional and error-free

#### After Scene is Complete

- [ ] Refactor `AnimationLoop.ts` to export only a single top-level function, move all module-level state into explicit state objects, and split helpers out if needed
- [ ] Update `index.ts` and the rest of the codebase to reference only focused, single-function files for animation
- [ ] Optionally, address type and lint warnings in animation files

## Progress So Far

- [x] Split all functions from `SceneSetup.ts` into their own files, following CODEX conventions.
- [x] Deprecated `SceneSetup.ts` and removed all logic from it.
- [x] Updated all imports in `index.ts` to use the new, focused files.
- [ ] Refactor `AnimationLoop.ts` (next step).
- [ ] Address remaining lint/type warnings in new scene files (optional).

## Notes

- All new files are focused, pure, and side-effect free at import time.
- The new structure is composable and testable, and aligns with the project's philosophy described in `CODEX.md`.
- Further feedback or direction is welcome before proceeding with the animation loop and additional lint/type cleanup.
