import type { MenuItem, SocialLink } from '@data/types.ts'
import { ActionZoneMenuButton } from '@atoms/ActionZoneMenuButton.tsx'
import { AnimatePresence, motion } from 'framer-motion'
import { icons as SocialIcons, type SocialIconMap } from '@atoms/icons/index.ts'
import type { UITheme } from '@libtheme/types.ts'
import actionZoneAnimationConfig from '@organisms/actionZone.animation.ts'
import type { ActionZoneAnimationButton, ActionZoneAnimationVariant } from '@organisms/actionZone.animation.ts'

type SocialIconKey = keyof SocialIconMap

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
  // get the current expanded menu layout from the animation config
  const expandedMenuLayout = actionZoneAnimationConfig.expandedMenu[currentPath] || actionZoneAnimationConfig.expandedMenu.default
  const navButtons: ActionZoneAnimationButton[] = expandedMenuLayout.buttons || []

  const handleAction = (action: ActionZoneAnimationButton['action'], item: MenuItem) => {
    if (item.path.startsWith('#')) onAnchorLink(item.path)
    else if (action.type === 'navigate') onMenuClose()
  }

  const socialLinksAnim: ActionZoneAnimationVariant = actionZoneAnimationConfig.expandedMenuVariants.socialLinks

  return (
    <div class='px-6 pb-6 space-y-6'>
      {/* social links */}
      <motion.div
        key='social-links'
        // @ts-ignore - framer-motion types not fully compatible with Preact
        className='flex items-center justify-center space-x-8 pt-2'
        initial={socialLinksAnim.initial}
        animate={socialLinksAnim.animate}
        exit={socialLinksAnim.exit}
        transition={socialLinksAnim.transition}
      >
        {(socialLinks as unknown as Array<{ key: string; url: string; icon: SocialIconKey }>).map(({ key, url, icon }) => (
          <motion.a
            key={key}
            // @ts-ignore - framer-motion types not fully compatible with Preact
            href={url}
            class='transition-colors'
            style={{ color: theme.colors.text.secondary }}
            onMouseEnter={(e: MouseEvent) => (e.currentTarget as HTMLAnchorElement).style.color = theme.colors.text.primary}
            onMouseLeave={(e: MouseEvent) => (e.currentTarget as HTMLAnchorElement).style.color = theme.colors.text.secondary}
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

      {/* menu items */}
      <motion.div
        // @ts-ignore - framer-motion types not fully compatible with Preact
        className='space-y-1'
        variants={actionZoneAnimationConfig.expandedMenuVariants.container}
        initial='hidden'
        animate='visible'
        exit='hidden'
      >
        {navButtons.map((button: ActionZoneAnimationButton, idx: number) => {
          return (
            <motion.div
              key={button.id}
              variants={actionZoneAnimationConfig.expandedMenuVariants.button}
            >
              <ActionZoneMenuButton
                id={button.id}
                label={button.content.label}
                isActive={button.isActive}
                onClick={() => handleAction(button.action, menuItems.find((item) => item.key === button.id) || menuItems[idx])}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
