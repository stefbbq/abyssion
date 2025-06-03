# Theme System Architecture

## Overview

The theme system is now properly separated into **building blocks** (base themes) and **generated themes** (UI and GL) that adapt to light/dark modes with proper contrast.

## Architecture

```
BaseTheme (color palette + mode)
    ├── UITheme (UI-specific colors with proper contrast)
    └── GLTheme (GL-specific colors optimized for 3D rendering)
```

## Core Components

### 1. Base Theme (Building Blocks)
- **Purpose**: Color palette + mode declaration
- **Location**: `lib/theme/themes/deepSpaceHUD.ts`
- **Contains**: Brand colors, backgrounds, foregrounds, borders
- **Mode**: Explicitly declares `'light'` or `'dark'`

```typescript
export const deepSpaceHUDTheme = createBaseTheme({
  name: 'deep-space-hud',
  mode: 'dark',
  primary: hexStringToRGB('#4263eb'),     // Brand colors
  background: hexStringToNumber('#000000'), // Mode-appropriate backgrounds
  foreground: hexStringToRGB('#ffffff'),   // Mode-appropriate text
  // ... etc
})
```

### 2. UI Theme (Generated)
- **Purpose**: UI components with proper contrast
- **Generated from**: Base theme + mode-aware logic
- **Usage**: All UI components, layouts, interactions

```typescript
import { getUITheme } from '../lib/theme/index.ts'

const theme = getUITheme()
// Use: theme.colors.text.primary, theme.colors.background.primary, etc.
```

### 3. GL Theme (Generated)  
- **Purpose**: 3D rendering with optimized visibility
- **Generated from**: Base theme + GL-specific mappings
- **Usage**: Three.js components, shaders, 3D scenes

```typescript
import { getGLTheme } from '../lib/gl/theme/index.ts'

const glTheme = getGLTheme()
// Use: glTheme.ui.hexagonColor, glTheme.geometric.primaryColor, etc.
```

## Usage Examples

### Basic UI Component
```typescript
import { getUITheme } from '../lib/theme/index.ts'

export default function MyComponent() {
  const theme = getUITheme()
  
  return (
    <div style={{
      backgroundColor: theme.colors.background.primary,
      color: theme.colors.text.primary,
      borderColor: theme.colors.border.primary,
    }}>
      Content with proper contrast!
    </div>
  )
}
```

### Theme Switching
```typescript
import { toggleThemeMode, getThemeMode } from '../lib/theme/index.ts'

// Toggle between light/dark
const newMode = toggleThemeMode()

// Check current mode
const currentMode = getThemeMode() // 'light' | 'dark'

// Set specific mode
setThemeMode('dark')
```

### GL Component
```typescript
import { getGLTheme } from '../lib/gl/theme/index.ts'

const glTheme = getGLTheme()

// Use in Three.js materials
const material = new THREE.MeshBasicMaterial({
  color: glTheme.ui.hexagonColor
})
```

## Color Contrast Logic

### Dark Mode
- **Backgrounds**: Black (#000000) to near-black (#111111)
- **Text**: White (#ffffff) to light gray (#999999)  
- **Borders**: Medium gray (#333333)
- **Interactive**: High contrast with brand colors

### Light Mode
- **Backgrounds**: White (#ffffff) to light gray (#f8f9fa)
- **Text**: Black (#000000) to medium gray (#666666)
- **Borders**: Light gray (#e0e0e0)
- **Interactive**: Brand colors on light backgrounds

## Available Themes

- **`deepSpaceHUDTheme`** (dark mode)
- **`deepSpaceHUDLightTheme`** (light mode)

## Adding New Themes

1. Create base theme with explicit mode:
```typescript
export const myNewTheme = createBaseTheme({
  name: 'my-theme',
  mode: 'dark', // or 'light'
  // ... color definitions
})
```

2. Export from `themes/index.ts`
3. UI and GL themes are automatically generated!

## Key Benefits

✅ **Mode-aware**: Proper contrast for light/dark themes  
✅ **Separation of concerns**: Building blocks vs generated themes  
✅ **Consistent branding**: Same colors work in both UI and GL  
✅ **Automatic generation**: No manual color mapping  
✅ **Type safety**: Full TypeScript support  
✅ **Runtime switching**: Toggle themes dynamically 