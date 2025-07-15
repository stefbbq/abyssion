# Project Structure

## Root Level
- `deno.json` - Main configuration, tasks, and dependencies
- `fresh.config.ts` - Fresh framework configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `main.ts` - Production entry point
- `dev.ts` - Development server entry point

## Core Directories

### `/routes` - Pages & API
- `_app.tsx` - Main app wrapper with global UI (Header, ActionZone, ThemeProvider)
- `_middleware.ts` - Global middleware for access control (debugOnly pages)
- `/partials/*.tsx` - Page content for Fresh's partial navigation
- Individual route files for each page

### `/islands` - Interactive Components (Client-Side)
- `ActionZoneController.tsx` - Mobile navigation controller
- `ThemeProvider.tsx` - Injects theme CSS variables, handles dynamic updates
- `ThemedBackground.tsx` - Dynamic background overlay using theme variables
- `GLCanvas.tsx` - 3D canvas wrapper
- `Header.tsx` - Main site header
- `DebugPanels.tsx` - Debug overlay system
- Other interactive components that need client-side JavaScript

### `/components` - Reusable UI Components (Server-Side)
- `Shell.tsx` - Generic container with `.glass-effect`
- `Card.tsx` - Flexible card component with `.glass-effect`
- `Button.tsx`, `Dropdown.tsx`, `TextField.tsx` - Form components
- `ThemeSwitcher.tsx` - Theme preview and cycling
- `/actionZone/` - Action zone navigation components
- `/icons/` - SVG icon components
- `/debug/` - Debug-related components

### `/lib` - Core Libraries

#### `/lib/gl/` - 3D Graphics System
- `index.ts` - Main GL initialization (`initGL()`)
- `types.ts` - Core GL types and interfaces
- `state.ts` - Global GL state management
- `config*.json` - Configuration files for scene, post-processing, animation, etc.
- `/animation/` - Functional animation system
  - `/core/` - Pure animation engine functions
  - `/calculations/` - Pure calculation functions
  - `/orchestrators/` - Main orchestrators with side effects
  - `/utils/` - Pure utility functions
- `/scene/` - Scene setup and management
- `/shaders/` - Custom GLSL shaders and post-processing
- `/layers/` - Dynamic layer management
- `/controls/` - Mouse and keyboard interaction
- `/textures/VideoCycle/` - Video background management

#### `/lib/theme/` - Theme System
- `index.ts` - Main theme API with computed signals
- `createUITheme.ts` - UI theme creation
- `createGLTheme.ts` - 3D theme creation
- `state.ts` - Theme state management
- `/themes/` - Theme definitions
- `/utils/` - Theme utility functions
- `/colorUtils/` - Color manipulation utilities

#### `/lib/logger/` - Logging System
- `index.ts` - Main logger API
- `constants.ts` - Log levels and contexts
- `/utils/` - Logger implementation utilities

#### `/lib/debug/` - Debug System
- Debug mode detection and control utilities

### `/data` - Content & Configuration
- `types.ts` - **Centralized TypeScript definitions** for all JSON data
- `pages.json` - Site-wide page configuration
- `nav.json` - Navigation structure
- `content-*.ts` - Static content files
- Other JSON content files

### `/static` - Static Assets
- `/images/` - Logo variants, noise textures, band photos
- `/videos/` - Video background files with manifest
- `styles.css` - Global styles (`.glass-effect`, `.frost-effect`)
- `favicon.ico`, `logo.svg`

### `/scripts` - Build Scripts
- `glsl-preprocessor.ts` - GLSL include preprocessing
- `glsl-to-ts.ts` - GLSL to TypeScript conversion
- `dev-watch.ts` - Development file watcher

### `/docs` - Documentation
- `CODEX.md` - Comprehensive codebase reference
- `LLM_GUIDE.md` - AI assistant guidance
- `SURFACE_SYSTEM.md` - Surface/theming documentation
- `THEME_EXTENSIONS.md` - Theme extension guide

## Architecture Principles

### File Organization
- **One function per file** in animation/calculation systems
- **Barrel exports** (`index.ts`) for clean imports
- **Co-located types** with related functionality
- **Separation of concerns** between pure functions and side effects

### Import Patterns
```typescript
// Use path aliases for clean imports
import { log, lc } from '@liblogger/index.ts'
import { createUITheme } from '@libtheme/createUITheme.ts'
import { initGL } from '@libgl/index.ts'

// Barrel exports for related functionality
import { currentUITheme, currentGLTheme } from '@libtheme/index.ts'
```

### Component Patterns
- **Islands** for client-side interactivity
- **Components** for server-side rendering
- **Functional components** with hooks
- **Signal-based state** management

### Configuration Strategy
- **JSON configs** for data-driven systems (GL, themes, content)
- **TypeScript configs** for build tools
- **Centralized types** in `data/types.ts`
- **Environment-based** settings via debug system