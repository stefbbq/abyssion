import '$std/dotenv/load.ts'

import { start } from '$fresh/server.ts'
import manifest from './fresh.gen.ts'
import config from './fresh.config.ts'
import { initializeServerLogger } from '@lib/logger/utils/initializeServerLogger.ts'

initializeServerLogger()
await start(manifest, config)
