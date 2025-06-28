import { useEffect, useState } from 'preact/hooks'
import { getTheme } from '@lib/theme/index.ts'
import navData from '@data/nav.json' with { type: 'json' }
// import ThemeToggle from '@molecules/ThemeToggle.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@components/icons/index.ts'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { HeaderLink } from './HeaderLink.tsx'

type SocialIconKey = keyof SocialIconMap

/**
 * Vercel-inspired header component with clean navigation
 * Hidden on mobile devices where BottomNav is used instead
 * Uses new theme system for automatic light/dark mode support
 */
export default function Header() {
  const [currentPath] = useClientLocation()
  const theme = getTheme()
  const isHomepage = currentPath === '/'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check on initial load
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track keyboard vs mouse usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setIsUsingKeyboard(true)
    }

    const handleMouseDown = () => setIsUsingKeyboard(false)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const getFocusClass = () => isUsingKeyboard ? 'focus:outline-none focus:ring-2' : 'focus:outline-none'

  const headerClasses = [
    'top-0',
    'left-0',
    'right-0',
    'z-50',
    'hidden',
    'md:block',
    'sticky',
    'transition-all',
    'duration-300',
    'py-2',
    isScrolled ? 'mx-4' : 'mx-2',
  ].join(' ')

  const containerClasses = [
    'max-w-7xl',
    'mx-auto',
    'flex',
    'justify-between',
    'items-center',
    'h-16',
    'transition-all',
    'duration-300',
    'rounded-full',
    'px-4',
    isScrolled ? 'backdrop-blur-lg' : '',
  ].join(' ')

  return (
    <header class={headerClasses}>
      <div
        class={containerClasses}
        style={{
          backgroundColor: isScrolled ? 'var(--glass-background)' : 'transparent',
          boxShadow: isScrolled ? '0 8px 32px 0 rgba(0,0,0,0.25)' : 'none',
        }}
      >
        {/* Logo */}
        <h1 class='flex items-center m-0'>
          <HeaderLink
            href='/'
            className={`text-xl font-semibold transition-colors ${getFocusClass()}`}
            ariaLabel='Abyssion home'
          >
            abyssion
          </HeaderLink>
        </h1>

        {/* Navigation */}
        <nav class='flex items-center space-x-1'>
          {/* Pages */}
          <div class='flex items-center'>
            {navData.mainNav
              .filter((item) => !item.excludeFrom?.includes('header'))
              .map((item) => (
                <HeaderLink
                  key={item.key}
                  href={item.path}
                  className={getFocusClass()}
                  isActive={item.path === currentPath}
                >
                  {item.label}
                </HeaderLink>
              ))}
          </div>

          {/* Social Icons */}
          <div class='flex items-center'>
            {(navData.socialLinks as Array<{ key: string; url: string; label: string; icon: SocialIconKey }>)
              .map((item) => {
                const IconComponent = SocialIcons[item.icon]
                return (
                  <HeaderLink
                    key={item.key}
                    href={item.url}
                    ariaLabel={item.label}
                    className={`transition-colors focus:ring-offset-2 rounded ${getFocusClass()}`}
                    compact
                  >
                    {IconComponent ? <IconComponent className='w-5 h-5' /> : <div class='w-5 h-5 bg-current' />}
                  </HeaderLink>
                )
              })}
            {/* <ThemeToggle /> */}
          </div>
        </nav>
      </div>
    </header>
  )
}
