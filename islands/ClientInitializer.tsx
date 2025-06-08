import { useEffect } from 'preact/hooks'
import { initializeLoggerClient } from '@lib/logger/utils/initializeLoggerClient.ts'
import { isDebugModeEnabled } from '@lib/debug/index.ts'
import { resetContexts } from '@lib/logger/index.ts'

export default function ClientInitializer() {
  useEffect(() => {
    initializeLoggerClient()

    if (isDebugModeEnabled()) {
      resetContexts()
    }
  }, [])

  return null // This component doesn't render anything
}
