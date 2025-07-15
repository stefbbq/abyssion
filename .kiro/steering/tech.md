# Tech Stack

## Core Framework
- **Deno** - Runtime environment
- **Fresh** - Full-stack web framework with SSR and islands architecture
- **TypeScript** - Primary language with strict type checking
- **Preact** - React-compatible UI library (aliased as 'react' in imports)

## 3D Graphics & Animation
- **Three.js** (v0.149.0) - 3D rendering and WebGL
- **Custom GLSL Shaders** - Post-processing effects (CRT, pixel bleeding, bloom, etc.)
- **Functional Animation System** - Pure function-based animations with side-effect isolation

## Styling & Theming
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Variables** - Dynamic theming system
- **Custom Theme Engine** - Real-time theme switching with light/dark modes

## Build System & Development

### Common Commands
```bash
# Development
deno task start          # Start dev server with file watching
deno task dev           # Build shaders + start dev server
deno task watch         # File watcher with shader rebuilding

# Building & Deployment  
deno task build         # Production build
deno task preview       # Preview production build

# Code Quality
deno task check         # Format, lint, and type check
deno fmt               # Format code
deno lint              # Lint code

# Shader Development
deno task build:shaders              # Build all shaders
deno task build:shaders:preprocess   # Preprocess GLSL includes
deno task build:shaders:to-ts        # Convert GLSL to TypeScript
```

### Code Style
- **No semicolons** (`semiColons: false`)
- **Single quotes** (`singleQuote: true`)
- **2-space indentation** (`indentWidth: 2`)
- **140 character line width** (`lineWidth: 140`)
- **No tabs** (`useTabs: false`)

## Key Libraries
- **@preact/signals** - Reactive state management
- **framer-motion** - Animation library
- **phosphor-react** - Icon library
- **ms** - Time parsing utility

## Architecture Patterns
- **Islands Architecture** - Client-side interactivity in specific components
- **Functional Programming** - Pure functions, immutable data, side-effect isolation
- **One Function Per File** - Maximum modularity in animation/calculation systems
- **CSS-in-JS via Variables** - Theme system uses CSS custom properties
- **Barrel Exports** - Clean import paths with index.ts files

## Path Aliases
```typescript
"@src/*": "./*"
"@components/*": "components/*"  
"@islands/*": "islands/*"
"@lib/*": "lib/*"
"@libgl/*": "lib/gl/*"
"@libtheme/*": "lib/theme/*"
"@liblogger/*": "lib/logger/*"
"@data/*": "data/*"
```

## Configuration Files
- `deno.json` - Main Deno configuration and tasks
- `fresh.config.ts` - Fresh framework configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript compiler options
- Various JSON configs in `/lib/gl/` for 3D scene settings