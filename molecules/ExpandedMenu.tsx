import { useSignal } from '@preact/signals'
import type { MenuItem, SocialLink } from '../utils/navigation/index.ts'

interface ExpandedMenuProps {
  currentPath: string
  menuItems: MenuItem[]
  socialLinks: SocialLink[]
  onMenuClose: () => void
  onAnchorLink: (path: string) => void
  theme: any
}

/**
 * ExpandedMenu organism
 * Handles the expanded menu state with social links and navigation items
 */
export const ExpandedMenu = ({
  currentPath,
  menuItems,
  socialLinks,
  onMenuClose,
  onAnchorLink,
  theme,
}: ExpandedMenuProps) => {
  const getButtonStyle = (isActive = false) => ({
    backgroundColor: isActive ? theme.colors.text.primary : 'transparent',
    color: isActive ? theme.colors.background.primary : theme.colors.text.secondary,
    borderRadius: '24px',
    fontWeight: isActive ? '600' : '500',
    border: 'none',
    transition: 'all 0.5s ease-out',
  })

  return (
    <div class='px-6 pb-6 space-y-6'>
      {/* social links */}
      <div class='flex items-center justify-center space-x-8 pt-2'>
        {socialLinks.map((social) => (
          <a
            key={social.key}
            href={social.url}
            class='transition-colors'
            style={{ color: theme.colors.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
            f-client-nav={false}
          >
            <div class='w-6 h-6 rounded bg-current opacity-30' />
          </a>
        ))}
      </div>

      {/* menu items */}
      <div class='space-y-1'>
        {menuItems.map((item) => {
          const isActive = currentPath === item.path

          if (item.path.startsWith('#')) {
            return (
              <button
                key={item.key}
                onClick={() => onAnchorLink(item.path)}
                class='block w-full text-center py-4 font-medium transition-all duration-200 rounded-lg'
                style={getButtonStyle(isActive)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = theme.colors.interactive?.ghostHover ||
                      theme.colors.background.tertiary
                    e.currentTarget.style.color = theme.colors.text.primary
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = theme.colors.text.secondary
                  }
                }}
              >
                {item.label}
              </button>
            )
          }

          return (
            <a
              key={item.key}
              href={item.path}
              f-partial={`/partials${item.path === '/' ? '/home' : item.path}`}
              onClick={onMenuClose}
              class='block w-full text-center py-4 font-medium transition-all duration-200 rounded-lg'
              style={getButtonStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.interactive?.ghostHover || theme.colors.background.tertiary
                  e.currentTarget.style.color = theme.colors.text.primary
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = theme.colors.text.secondary
                }
              }}
            >
              {item.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
