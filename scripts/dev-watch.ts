/// <reference lib="deno.ns" />
import ms from 'ms'

// scripts/dev-watch.ts
// Watches shader files, rebuilds .ts modules, and restarts the app on changes.
// Run with: deno run --allow-read --allow-write --allow-run scripts/dev-watch.ts

import { lc, log } from '../lib/logger/index.ts'

const SHADER_DIR = 'lib/gl/shaders/glsl'
let app: Deno.ChildProcess | undefined
let debounceTimer: number | undefined

async function buildShaders() {
  const command = new Deno.Command('deno', {
    args: ['task', 'build:shaders'],
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const process = command.spawn()
  const { code } = await process.status
  if (code !== 0) log(lc.GL, 'Shader build failed.')
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

for await (const event of Deno.watchFs(SHADER_DIR)) {
  // Only trigger on changes to .vert or .frag files (not .ts)
  const relevant = event.paths.some(
    (path) =>
      (path.endsWith('.vert') || path.endsWith('.frag')) &&
      !path.endsWith('.ts'),
  )
  if (relevant && ['modify', 'create', 'remove'].includes(event.kind)) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      log(lc.GL, 'Shader change detected. Rebuilding...')
      await buildShaders()
    }, ms('0.2s'))
  }
}
