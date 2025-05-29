# abyssion - Band Website

A modern, interactive website for the music band abyssion built with Deno and Fresh.

## Features

- Full-page splash with 3D animated logo
- Social media integration (Facebook, Instagram, Discord, SoundCloud)
- Shows page with upcoming and past events
- Band bio and information
- Built-in music player with playlist support

## Tech Stack

- **Deno** + **Fresh** for server-side rendering and routing
- **TypeScript** for type safety and better developer experience
- **Three.js** for 3D visualization and interactive logo
- **Tailwind CSS** for styling
- **Functional programming** approach

## Development

```bash
# Start the development server
deno task start
```

Visit http://localhost:8000/ to see the website.

## Configuration

### Logger

The application includes a comprehensive logging system with adaptive colors for light/dark mode. You can configure the log level using environment variables:

```bash
# Set log level in .env file or environment
LOG_LEVEL=debug

# Alternative variable name  
LOGGER_LEVEL=info
```

**Available log levels** (from most to least verbose):
- `trace` - All logs (default for development)
- `debug` - Hide trace logs
- `info` - Hide trace and debug logs
- `warn` - Only warnings, errors, and critical
- `error` - Only errors and critical  
- `critical` - Only critical logs
- `off` - No logging

**Recommendations:**
- **Development:** `debug` or `trace` 
- **Production:** `info` or `warn`

## Structure

- `/routes` - Page components and API endpoints
- `/islands` - Interactive components that run on the client
- `/static` - Static assets (images, etc.)
- `/components` - Reusable UI components
- `/lib/logger` - Pretty (and basic) Logger library with adaptive theming
- `/lib/gl` - Three.js library code

## Deployment

The site can be easily deployed using Deno Deploy for a serverless experience.

## Credits

This project uses free music from FreeMusicArchive for demonstration purposes. 
Replace with actual band tracks for production use.
