import { useEffect, useState } from 'preact/hooks'
import navData from '@data/nav.json' with { type: 'json' }
// import ThemeToggle from '@molecules/ThemeToggle.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@components/icons/index.ts'
import { useClientLocation } from '@lib/utils/clientLocation.ts'
import { HeaderLink } from './HeaderLink.tsx'

type SocialIconKey = keyof SocialIconMap

// styles
const headerBase = 'top-0 left-0 right-0 z-50 hidden md:block sticky transition-all duration-300 py-2'
const headerScrolled = 'mx-4'
const headerDefault = 'mx-2'
const containerBase = 'max-w-7xl mx-auto flex justify-between items-center h-16 transition-all duration-300 rounded-full px-4'
const containerScrolled = 'backdrop-blur-lg bg-[var(--glass-background)] shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]'
const containerDefault = 'bg-transparent shadow-none'
const logo = 'flex items-center m-0'
const logoText = 'text-xl font-semibold transition-colors'
const navWrapper = 'flex items-center space-x-1'
const navPages = 'flex items-center'
const navSocial = 'flex items-center'

/**
 * Desktop navigation bar for the app, styled with utility classes and CSS variables.
 * Uses the same style composition approach as HeaderLink for consistency.
 * Responsive, sticky, and theme-aware.
 */
export const Header = () => {
  const [currentPath] = useClientLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setIsScrolled(globalThis.scrollY > 20)
    globalThis.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check on initial load
    return () => globalThis.removeEventListener('scroll', handleScroll)
  }, [])

  // Track keyboard vs mouse usage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Tab' && setIsUsingKeyboard(true)
    const handleMouseDown = () => setIsUsingKeyboard(false)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Focus ring utility
  const getFocusClass = () => isUsingKeyboard ? 'focus:outline-none focus:ring-2' : 'focus:outline-none'

  // Compose header and container classes
  const headerClasses = [
    headerBase,
    isScrolled ? headerScrolled : headerDefault,
  ].join(' ')

  const containerClasses = [
    containerBase,
    isScrolled ? containerScrolled : containerDefault,
  ].join(' ')

  return (
    <header class={headerClasses}>
      <div class={containerClasses}>
        {/* Logo */}
        <h1 class={logo}>
          <HeaderLink
            href='/'
            className={`${logoText} ${getFocusClass()}`}
            ariaLabel='Abyssion home'
          >
            abyssion
          </HeaderLink>
        </h1>

        {/* Navigation */}
        <nav class={navWrapper}>
          {/* Pages */}
          <div class={navPages}>
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
          <div class={navSocial}>
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
