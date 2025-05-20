# Band Site Requirements & Implementation Plan

## Project Overview

Building a modern band website called "abyssion" with interactive elements and media playback capabilities.

## Technical Requirements

- Modern tech stack using Deno + Fresh (Deno's web framework)
- TypeScript for type safety
- Functional programming approach
- Three.js for 3D logo visualization
- Responsive design

## Core Features

### Homepage

- Full-page splash with 3D animated "abyssion" logo
  - Interactive elements responding to mouse movement and scrolling
  - Subtle autonomous animation
- Configurable social media links
  - Facebook
  - Instagram
  - Discord
  - SoundCloud
- Navigation to subpages

### Shows Page

- List of upcoming shows
- Archive of past shows
- Ability to filter/sort shows
- Link to ticket purchasing platforms

### Bio Page

- Band history and information
- Band member profiles
- Media gallery

### Music Player

- Embedded media player across the site
- Playlist functionality
- Minimal UI that doesn't interfere with site navigation

## Technical Stack Details

### Frontend

- Deno + Fresh for server-side rendering and routing
- Islands architecture for interactive components
- Three.js for 3D visualization
- Twind (Tailwind-in-JS) for styling

### Backend

- Deno runtime
- Fresh server for API endpoints
- Simple JSON data storage (upgradable to a database later)

### Deployment

- Deno Deploy for seamless deployment

## Code Style

### 🎯 Philosophy

- One top-levle function per file for utilities and one-off tooling — atomic, testable, tree-shakeable
- Pure functions by default — isolate side effects
- Composition > inheritance — closures and factories
- UI owns DOM, GL owns canvas — hard separation between Preact and WebGL


## 🗂️ Folder Structure

```
/components/               → Pure Preact components
/islands/                  → Interactive components (event handlers, hooks)
/lib/
  /gl/
    createScene.ts         → Initializes Three.js scene
    createRenderer.ts      → Returns configured WebGLRenderer
    createCamera.ts        → Returns configured camera
    createMesh.ts          → Builds and returns a mesh
    startRenderLoop.ts     → Starts animation/rendering
    resizeRenderer.ts      → Handles responsive rescaling
  /services/
    fetchVideoManifest.ts  → Loads manifest.json
    selectNextVideo.ts     → Chooses next video index
    loadVideo.ts           → Loads and validates a video element
    prepareTexture.ts      → Generates a VideoTexture
  config.ts                → Centralized app config
  safeDelay.ts             → Simple delay util (e.g. debounce, backoff)
/routes/
  index.tsx                → Main entry point (Fresh)
/types/
  video.ts                 → Shared types for video assets
  gl.ts                    → Types for GL setup (Scene, Mesh, etc)
/static/                   → Static files (videos, textures, favicon)
/main.ts                   → App bootstrapping
```


## 🧩 Composition Strategy

- Functional files export a single named function
- All state is passed in explicitly
- No classes, no `this`, no side effects at import time
- Build complex behavior by composing small functions


## 🧬 Example Composition (No Code)

- `createScene()` → gets passed to `startRenderLoop()`
- `createCamera()` and `createRenderer()` are passed into `createScene()`
- `loadVideo()` + `prepareTexture()` → feeds `createMesh()`
- UI `islands/` control which videos to play or when to trigger changes


## ✅ Benefits

- Dead-simple testability (one function per test)
- Minimal imports per file
- Clear ownership of side effects
- Easy to replace/mock pieces in isolation
- No tangled dependencies or init order issues



## 🚫 Anti-Patterns

- Don’t share state through modules
- Don’t mix UI with rendering logic
- Don’t instantiate things at import time
- Avoid large files or catch-all utils
- Never use window., always global.