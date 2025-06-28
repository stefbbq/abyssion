/// <reference lib="deno.ns" />
import ms from 'ms'

// dev-watch.ts
// Watches shader files, rebuilds .ts modules, and restarts the app on changes.
// Run with: deno run --allow-read --allow-write --allow-run dev-watch.ts

import { lc, log } from './lib/logger/index.ts'

const SHADER_DIR = 'lib/gl/shaders/glsl'
let app: Deno.ChildProcess | undefined
let debounceTimer: number | undefined

async function buildShaders() {
  const command = new Deno.Command('deno', {
    args: [
      'run',
      '--allow-read',
      '--allow-write',
      'scripts/glsl-to-ts.ts',
    ],
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const process = command.spawn()
  const { code } = await process.status
  if (code !== 0) log(lc.GL, 'Shader build failed.')
}

function startApp() {
  const command = new Deno.Command('deno', {
    args: ['run', '--allow-all', 'dev.ts'],
    stdout: 'inherit',
    stderr: 'inherit',
  })
  app = command.spawn()
}

async function stopApp() {
  if (app) {
    app.kill('SIGTERM')
    await app.status
    app = undefined
  }
}

log(lc.GL, `Watching ${SHADER_DIR} for shader changes...`)
await buildShaders()
await startApp()

for await (const event of Deno.watchFs(SHADER_DIR)) {
  // Only trigger on changes to .vert, .frag, or .glsl files (not .ts)
  const relevant = event.paths.some(
    (path) =>
      (path.endsWith('.vert') || path.endsWith('.frag') || path.endsWith('.glsl')) &&
      !path.endsWith('.ts'),
  )
  if (relevant && ['modify', 'create', 'remove'].includes(event.kind)) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      log(lc.GL, 'Shader change detected. Rebuilding and restarting app...')
      await buildShaders()
      await stopApp()
      await startApp()
    }, ms('0.2s'))
  }
}
