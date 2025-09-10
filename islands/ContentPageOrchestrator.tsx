import { useEffect } from 'preact/hooks'

export default function ContentPageOrchestrator() {
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const gl = await import('@lib/gl/index.ts')

        // wait for GL to initialize and scene orchestrator to be available
        const waitForGL = async (timeoutMs = 4000) => {
          const start = performance.now()
          while (!cancelled) {
            const state = gl.getGLState()
            const orch = gl.getSceneOrchestrator()
            if (state && orch) return { state, orch }
            if (performance.now() - start > timeoutMs) return null
            await new Promise((r) => setTimeout(r, 100))
          }
          return null
        }

        const ready = await waitForGL()
        if (!ready || cancelled) return

        const { state: glState, orch: orchestrator } = { state: ready.state, orch: ready.orch }
        const { createContentPageOrchestrator } = await import(
          '@lib/gl/animation/orchestrators/contentPage/createContentPageOrchestrator.ts'
        )
        if (cancelled) return
        const contentOrchestrator = createContentPageOrchestrator(glState)
        orchestrator.switchToOrchestrator(contentOrchestrator)
        // no direct GL mutations here; handled in orchestrator
      } catch {
        // ignore if GL is disabled or not available
      }
    }

    run()
    return () => {
      cancelled = true
      ;(async () => {
        try {
          const gl = await import('@lib/gl/index.ts')
          const glState = gl.getGLState()
          const orchestrator = gl.getSceneOrchestrator()
          if (!glState || !orchestrator) return
          const { createHomePageOrchestrator } = await import(
            '@lib/gl/animation/orchestrators/homePage/createHomePageOrchestrator.ts'
          )
          const homeOrchestrator = createHomePageOrchestrator(glState)
          orchestrator.switchToOrchestrator(homeOrchestrator)
          // no direct GL mutations here; handled in orchestrator
        } catch {
          // ignore if GL not available
        }
      })()
    }
  }, [])

  return null
}
