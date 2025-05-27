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

## Structure

- `/routes` - Page components and API endpoints
- `/islands` - Interactive components that run on the client
- `/static` - Static assets (images, etc.)
- `/components` - Reusable UI components
- `/lib/logger` - Pretty (and basic) Logger library
- `/lib/gl` - Three.js library code

## Deployment

The site can be easily deployed using Deno Deploy for a serverless experience.

## Credits

This project uses free music from FreeMusicArchive for demonstration purposes. 
Replace with actual band tracks for production use.
