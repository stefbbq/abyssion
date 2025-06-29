// deno-lint-ignore-file react-no-danger
import { Head } from '$fresh/runtime.ts'
import { useSignalEffect } from '@preact/signals'
import { currentTheme } from '@lib/theme/index.ts'
import { createThemeVariables } from '@lib/theme/utils/createThemeVariables.ts'

/**
 * A global provider that injects the current theme's CSS variables into the document head.
 * It automatically updates whenever the theme changes.
 */
export default function ThemeProvider() {
  const themeVariables = createThemeVariables(currentTheme.value)

  // This effect will run on the client side whenever the theme changes.
  useSignalEffect(() => {
    const styleElement = document.getElementById('theme-variables') || document.createElement('style')
    styleElement.id = 'theme-variables'
    styleElement.innerHTML = createThemeVariables(currentTheme.value)
    document.head.appendChild(styleElement)
  })

  // During SSR, we inject the initial theme variables.
  return (
    <Head>
      <style id='theme-variables' dangerouslySetInnerHTML={{ __html: themeVariables }} />
    </Head>
  )
}
