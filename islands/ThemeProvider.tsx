// deno-lint-ignore-file react-no-danger
import { Head } from '$fresh/runtime.ts'
import { useSignalEffect } from '@preact/signals'
import { currentUITheme } from '@lib/theme/index.ts'
import { currentThemeFamilyName, currentThemeMode } from '@lib/theme/state.ts'
import { createThemeVariables } from '@lib/theme/utils/createThemeVariables.ts'

/**
 * A global provider that injects the current theme's CSS variables into the document head.
 * It automatically updates whenever the theme changes.
 */
export default function ThemeProvider() {
  const themeVariables = createThemeVariables(currentUITheme.value)
  const fontUrls = currentUITheme.value.typography.fontUrls || []

  // This effect will run on the client side whenever the theme changes.
  useSignalEffect(() => {
    const styleElement = document.getElementById('theme-variables') || document.createElement('style')
    styleElement.id = 'theme-variables'
    styleElement.innerHTML = createThemeVariables(currentUITheme.value)
    document.head.appendChild(styleElement)

    // Set theme metadata on the root element for CSS scoping
    const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    document.documentElement.setAttribute('data-theme-family', kebab(currentThemeFamilyName.value))
    document.documentElement.setAttribute('data-theme-mode', currentThemeMode.value)

    // Inject font links dynamically
    fontUrls.forEach((url) => {
      if (!document.querySelector(`link[data-theme-font="${url}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        link.setAttribute('data-theme-font', url)
        document.head.appendChild(link)
      }
    })
  })

  // During SSR, we inject the initial theme variables and font links.
  return (
    <Head>
      <style id='theme-variables' dangerouslySetInnerHTML={{ __html: themeVariables }} />
      {fontUrls.map((url) => <link key={url} rel='stylesheet' href={url} data-theme-font={url} />)}
    </Head>
  )
}
