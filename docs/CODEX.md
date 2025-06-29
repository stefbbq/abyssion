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

### Theme Definitions

- **Available Themes:**
  - All themes are defined in `lib/theme/themes/` (e.g., `deepSpaceHUD`, `deepSpaceHUDLight`, `synthwave`, `glitchCore`, `geomodAtlas`, `hypertag`, `monochrome`, `neonGridOS`, `synthDrift`, `techscape`, `cyberpunk`).
  - Each theme is a `BaseTheme` object with a palette, mode, and variants.

### Theme Objects

- **BaseTheme:** The single source of truth, defining a color palette and a mode (`light` or `dark`).
- **UITheme:** A complete theme object generated from a `BaseTheme` by the `createTheme()` function. It contains all color, spacing, and effect values, and is the source for all CSS variables.
- **Transformation:** `createTheme(baseTheme)` transforms a `BaseTheme` into a `UITheme` with all computed values and CSS variable support.

### Theme Signals & Switching

- **currentTheme:** A computed signal holding the current `UITheme` object. Use this for theme-aware logic.
- **currentThemeMode:** A signal holding the current mode (`'light'` | `'dark'`).
- **toggleThemeMode() / setThemeMode():** Functions to toggle or set the theme mode. Switching is instant and client-side.
- **ThemeProvider Island:** Injects and dynamically updates the theme's CSS variables in the document head. Listens for theme changes and enables instant toggling.

### CSS Variables & Tailwind Integration

- All theme values (backgrounds, surfaces, text, borders, interactive states) are exposed as CSS variables (e.g., `--colors-background-primary`).
- Tailwind is configured to use these variables, so you can use semantic classes like `bg-background-primary`, `text-text-secondary`, or arbitrary values like `bg-[var(--colors-background-primary)]`.
- For alpha blending, set the variable to an `rgba` value in your theme system, or use inline style to convert a hex to `rgba` with the desired alpha.
- **Example:**
  ```tsx
  <div className="bg-[var(--colors-background-primary)] text-[var(--colors-text-primary)]" />
  // or
  <div style={{ background: 'var(--colors-background-primary)' }} />
  ```

### Theme Visualizer

- **ThemeVisualizer Island:** An interactive UI for previewing and switching between all available themes. Located at `/theme` route. Uses the same theme system and signals as the rest of the app.

### 3D/GL Theme System

- **GL Theme System:** Located in `lib/gl/theme/`, this system extends `BaseTheme` for 3D rendering (Three.js). It provides additional colors for overlays, geometric elements, and lens flares.
- **getGLTheme():** Returns a `GLTheme` object based on the current base theme, used for 3D scene rendering.

### Notes

- All theme switching is instant and client-side, with no page reloads.
- ThemedBackground and other components use CSS variables directly for dynamic backgrounds and transitions.
- The theme system is designed for both UI and 3D/GL consistency.

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
  - `ThemedBackground.tsx`: Dynamic background overlay that uses the current theme's CSS variable for background color and fades in/out based on route. Uses direct CSS variable access for background and Tailwind for layout/opacity transitions.

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

#### CSS Variables and Dynamic Backgrounds

The theme system exposes all theme values as CSS variables (e.g., `--colors-background-primary`). For dynamic backgrounds (such as the ThemedBackground island), these variables are accessed directly in the component. If you need alpha blending, set the variable to an `rgba` value in your theme system, or use inline style to convert a hex to `rgba` with the desired alpha. Tailwind's arbitrary value support (`bg-[var(--colors-background-primary)]`) can be used for backgrounds, but does not support alpha blending unless the variable itself is `rgba`.

ThemedBackground uses the CSS variable directly for its background and applies opacity transitions using Tailwind classes. This ensures the background always matches the current theme and transitions smoothly during navigation.

### GL Theme System (`lib/gl/theme/`)

- `index.ts` - `getGLTheme()`, `createGLTheme()`
- `types.ts` - `GLTheme`