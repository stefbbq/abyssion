import { useEffect, useState } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { getTheme } from '@lib/theme/index.ts'
import navData from '@data/nav.json' with { type: 'json' }
import { actionZoneAnimationConfig } from '@organisms/ActionZone/configurations/index.ts'
import ActionZone from '@organisms/ActionZone/ActionZone.tsx'
import { ActionZoneFadeout } from '@atoms/ActionZoneFadeout.tsx'
import { resolveActionZoneConfigNode } from '@organisms/ActionZone/utils/resolveActionZoneConfigNode.ts'

type Props = {
  currentPath?: string
}

export default function ActionZoneController({ currentPath }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const theme = getTheme()
  const currentRoute = useSignal(currentPath || '/')
  const previousRoute = useSignal(currentPath || '/')

  useEffect(() => {
    setIsMounted(true)
    const handleNavigate = () => {
      const newPath = globalThis.location.pathname
      previousRoute.value = currentRoute.value
      currentRoute.value = newPath
    }

    document.addEventListener('DOMContentLoaded', handleNavigate)
    globalThis.addEventListener('popstate', handleNavigate)
    const originalPushState = history.pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      handleNavigate()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handleNavigate)
      globalThis.addEventListener('popstate', handleNavigate)
      history.pushState = originalPushState
    }
  }, [])

  const handleAction = (action: any) => {
    switch (action.type) {
      case 'back':
        globalThis.history.back()
        break
      case 'menu':
        setIsMenuOpen(!isMenuOpen)
        break
      case 'navigate':
        break
    }
  }

  if (!isMounted) return null

  // Determine the current ActionZone layout type
  let layoutType: 'collapsed' | 'collapsedPage' | 'expanded' = 'collapsed'
  if (isMenuOpen) layoutType = 'expanded'
  // TODO: add logic for collapsedPage if needed

  // Resolve the config node for the current route/layout
  const configRoot = actionZoneAnimationConfig[layoutType]
  const node = resolveActionZoneConfigNode(configRoot, currentRoute.value, [])

  if (!node) return null

  // Prepare runtime props (theme, nav, social, etc)
  const runtimeProps = {
    theme,
    menuItems: navData.mainNav,
    socialLinks: navData.socialLinks,
  }

  return (
    <div className='md:hidden'>
      <ActionZoneFadeout
        height={160}
        gradientStart={0}
        gradientEnd={90}
        color={theme.glass.background}
        bottom={0}
        zIndex={49}
      />
      <ActionZone
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        node={node}
        onAction={handleAction}
        runtimeProps={runtimeProps}
      />
    </div>
  )
}
