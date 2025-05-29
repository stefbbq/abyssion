import '$std/dotenv/load.ts'

import { start } from '$fresh/server.ts'
import manifest from './fresh.gen.ts'
import config from './fresh.config.ts'
import { initializeLoggerServer } from './lib/logger/utils/initializeLoggerServer.ts'

initializeLoggerServer()

await start(manifest, config)
