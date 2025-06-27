import { useEffect, useState } from 'preact/hooks'

/**
 * Returns the current pathname if in a browser, otherwise '/'.
 */
export const getClientPathname = (): string => {
  if (typeof window === 'undefined') return '/'
  return globalThis.location.pathname
}

/**
 * Returns the current search string (query) if in a browser, otherwise ''.
 */
export const getClientSearch = (): string => {
  if (typeof window === 'undefined') return ''
  return globalThis.location.search
}

/**
 * Reactively track the current client pathname and search string.
 * Returns [pathname, search].
 */
export const useClientLocation = (): [string, string] => {
  const [location, setLocation] = useState<[string, string]>(() => [getClientPathname(), getClientSearch()])

  useEffect(() => {
    const update = () => setLocation([getClientPathname(), getClientSearch()])
    globalThis.addEventListener('popstate', update)
    globalThis.addEventListener('pushstate', update)
    globalThis.addEventListener('replacestate', update)
    // monkey-patch pushState/replaceState to emit events
    const origPush = history.pushState
    const origReplace = history.replaceState
    history.pushState = function (...args) {
      origPush.apply(this, args)
      globalThis.dispatchEvent(new Event('pushstate'))
      update()
    }
    history.replaceState = function (...args) {
      origReplace.apply(this, args)
      globalThis.dispatchEvent(new Event('replacestate'))
      update()
    }
    return () => {
      globalThis.removeEventListener('popstate', update)
      globalThis.removeEventListener('pushstate', update)
      globalThis.removeEventListener('replacestate', update)
      history.pushState = origPush
      history.replaceState = origReplace
    }
  }, [])
  return location
}
