import type { MenuItem, SocialLink } from '@data/types.ts'
import { ActionZoneMenuButton } from '@atoms/ActionZoneMenuButton.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@atoms/icons/index.ts'
import type { UITheme } from '@lib/theme/types.ts'
import actionZoneAnimationConfig from '@organisms/actionZone.animation.ts'
import type { ActionZoneButton } from '@organisms/actionZone.animation.ts'

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
  const navButtons: ActionZoneButton[] = actionZoneAnimationConfig.expandedMenu.buttons || []

  const handleAction = (action: ActionZoneButton['action'], item: MenuItem) => {
    if (item.path.startsWith('#')) onAnchorLink(item.path)
    else if (action.type === 'navigate') onMenuClose()
  }

  return (
    <div class='px-6 pb-6 space-y-6'>
      {/* social links */}
      <div
        key='social-links'
        className='flex items-center justify-center space-x-8 pt-2'
      >
        {(socialLinks as unknown as Array<{ key: string; url: string; icon: SocialIconKey }>).map(({ key, url, icon }) => (
          <a
            key={key}
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
          </a>
        ))}
      </div>

      {/* menu items */}
      <div className='space-y-1'>
        {navButtons.map((button: ActionZoneButton) => (
          <ActionZoneMenuButton
            id={button.id}
            label={button.content.label}
            isActive={button.isActive}
            onClick={() => handleAction(button.action, menuItems.find((item) => item.key === button.id) || menuItems[0])}
            theme={theme}
            action={button.action}
          />
        ))}
      </div>
    </div>
  )
}
