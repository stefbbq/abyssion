import { type PageProps } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import ClientInitializer from '@islands/ClientInitializer.tsx'
import GLCanvas from '@islands/GLCanvas.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import { getTheme } from '@lib/theme/index.ts'
import { hexStringToRGB } from '@lib/theme/utils/hexStringToRGB.ts'
import { rgbToCSS } from '@lib/theme/utils/rgbToCSS.ts'

export default function App({ Component, url }: PageProps) {
  const pagePath = url.pathname
  const isHomePage = pagePath === '/'
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const theme = getTheme()
  const subpageBgColor = rgbToCSS(hexStringToRGB(theme.colors.background.primary), 0.8)

  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true

  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>abyssion</title>
        <link rel='stylesheet' href='/styles.css' />
      </head>
      <body f-client-nav class='min-h-screen relative bg-black'>
        <ClientInitializer />
        <div
          class={`fixed inset-0 transition-opacity duration-500 ease-in-out ${isHomePage ? 'opacity-100' : 'opacity-20'} z-0`}
        >
          <div class='w-full h-full flex items-center justify-center'>
            <GLCanvas width={1400} height={896} />
          </div>
        </div>
        {showHeader && (
          <div class='absolute top-0 left-0 right-0 z-50'>
            <Header currentPath={url.pathname} />
          </div>
        )}
        <main
          class='min-h-screen relative z-10'
          style={{
            backgroundColor: isHomePage ? 'transparent' : subpageBgColor,
          }}
        >
          <Partial name='page-content'>
            <Component />
          </Partial>
        </main>
        {showActionZone && (
          <div class='relative z-20'>
            <ActionZoneController currentPath={url.pathname} />
          </div>
        )}
      </body>
    </html>
  )
}
