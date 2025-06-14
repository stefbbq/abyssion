import type { MenuItem, NavButtonState, SocialLink } from '@data/types.ts'
import { ActionZoneButton } from '@molecules/ActionZoneButton.tsx'
import { ActionZoneMenuButton } from '@molecules/ActionZoneMenuButton.tsx'
import { AnimatePresence, motion } from 'framer-motion'
import { icons as SocialIcons, type SocialIconMap } from '@atoms/icons/index.ts'
import type { UITheme } from '@libtheme/types.ts'

type SocialIconKey = keyof SocialIconMap

type Props = {
  currentPath: string
  menuItems: MenuItem[]
  socialLinks: SocialLink[]
  onMenuClose: () => void
  onAnchorLink: (path: string) => void
  theme: UITheme
}

// Add these variants at the top of the file or inside the component
const containerVariants = {
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  hidden: {},
}
const buttonVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
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
        <motion.div
          key='social-links'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // @ts-ignore - framer-motion types not fully compatible with Preact
          className='flex items-center justify-center space-x-8 pt-2'
        >
          {(socialLinks as unknown as Array<{ key: string; url: string; icon: SocialIconKey }>).map(({ key, url, icon }) => (
            <motion.a
              key={key}
              href={url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              class='transition-colors'
              style={{ color: theme.colors.text.secondary }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = theme.colors.text.primary}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = theme.colors.text.secondary}
              f-client-nav={false}
              as='a'
            >
              {(() => {
                const IconComponent = SocialIcons[icon]

                return IconComponent
                  ? <IconComponent className='w-6 h-6 opacity-60' />
                  : <div class='w-6 h-6 rounded bg-current opacity-30' />
              })()}
            </motion.a>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* menu items */}
      <motion.div className='space-y-1' variants={containerVariants} initial='hidden' animate='visible'>
        {navButtons.map((button, idx) => (
          <motion.div key={button.id} variants={buttonVariants} initial='hidden' animate='visible'>
            <ActionZoneMenuButton
              id={button.id}
              label={button.content.label}
              isActive={button.isActive}
              onClick={() => handleAction(button.action, menuItems[idx])}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
