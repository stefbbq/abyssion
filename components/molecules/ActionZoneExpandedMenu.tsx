import type { MenuItem, NavButtonState, SocialLink } from '@data/types.ts'
import { ActionZoneButton } from '@molecules/ActionZoneButton.tsx'
import { AnimatePresence, motion } from 'framer-motion'
import * as SocialIcons from '@atoms/icons/index.ts'
import type { UITheme } from '@libtheme/types.ts'

type Props = {
  currentPath: string
  menuItems: MenuItem[]
  socialLinks: SocialLink[]
  onMenuClose: () => void
  onAnchorLink: (path: string) => void
  theme: UITheme
}

/**
 * ExpandedMenu organism
 * Handles the expanded menu state with social links and navigation items
 */
export const ActionZoneExpandedMenu = ({
  currentPath,
  menuItems,
  socialLinks,
  onMenuClose,
  onAnchorLink,
  theme,
}: Props) => {
  const getButtonStyle = (isActive = false) => ({
    backgroundColor: isActive ? theme.colors.text.primary : 'transparent',
    color: isActive ? theme.colors.background.primary : theme.colors.text.secondary,
    borderRadius: '24px',
    fontWeight: isActive ? '600' : '500',
    border: 'none',
  })

  // map MenuItem to NavButtonState for navigation
  const navButtons: NavButtonState[] = menuItems.map((item) => ({
    id: item.key,
    key: item.key,
    role: 'nav-item',
    content: { label: item.label },
    position: 'center',
    action: item.path.startsWith('#') ? { type: 'none' } : { type: 'navigate', href: item.path },
    isActive: currentPath === item.path,
  }))

  const handleAction = (action: NavButtonState['action'], item: MenuItem) => {
    if (item.path.startsWith('#')) onAnchorLink(item.path)
    else if (action.type === 'navigate') onMenuClose()
  }

  return (
    <div class='px-6 pb-6 space-y-6'>
      {/* social links */}
      <AnimatePresence>
        {(
          motion.div as any
        )({
          key: 'social-links',
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: 'flex items-center justify-center space-x-8 pt-2',
          children: (socialLinks as unknown as Array<{ key: string; url: string; icon: string }>).map(({ key, url, icon }) => (
            <a
              key={key}
              href={url}
              class='transition-colors'
              style={{ color: theme.colors.text.secondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
              f-client-nav={false}
            >
              {(() => {
                const IconComponent = (SocialIcons as Record<string, any>)[icon]
                return IconComponent
                  ? <IconComponent className='w-6 h-6 opacity-60' />
                  : <div class='w-6 h-6 rounded bg-current opacity-30' />
              })()}
            </a>
          )),
        })}
      </AnimatePresence>

      {/* menu items */}
      <div class='space-y-1'>
        {navButtons.map((button, idx) => (
          <ActionZoneButton
            key={button.id}
            id={button.id}
            state={button}
            onAction={() => handleAction(button.action, menuItems[idx])}
            style={getButtonStyle(button.isActive)}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
