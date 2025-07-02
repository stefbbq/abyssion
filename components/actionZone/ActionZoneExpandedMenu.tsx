import type { MenuItem, SocialLink } from '@data/types.ts'
import { ActionZoneMenuButton } from '@components/actionZone/ActionZoneMenuButton.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@components/icons/index.ts'
import actionZoneAnimationConfig from '@components/actionZone/config/index.ts'
import type { ActionZoneButton } from '@components/actionZone/types.ts'

type SocialIconKey = keyof SocialIconMap

type Props = {
  menuItems: MenuItem[]
  socialLinks: SocialLink[]
  onMenuClose: () => void
  onAnchorLink: (path: string) => void
}

/**
 * ExpandedMenu organism
 * Handles the expanded menu state with social links and navigation items
 */
export const ActionZoneExpandedMenu = ({
  menuItems,
  socialLinks,
  onMenuClose,
  onAnchorLink,
}: Props) => {
  const navButtons: ActionZoneButton[] = actionZoneAnimationConfig.expandedMenu.buttons || []

  const handleAction = (action: ActionZoneButton['action'], item: MenuItem) => {
    if (item.path.startsWith('#')) onAnchorLink(item.path)
    else if (action.type === 'navigate') onMenuClose()
  }

  return (
    <div class='px-4 pb-4 space-y-4'>
      {/* social links */}
      <div
        key='social-links'
        className='flex items-center justify-center space-x-6 pt-1'
      >
        {(socialLinks as unknown as Array<{ key: string; url: string; icon: SocialIconKey }>).map(({ key, url, icon }) => (
          <a
            key={key}
            href={url}
            class='transition-colors text-text-secondary hover:text-text-primary'
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
      <div className='space-y-0.5'>
        {navButtons.map((button: ActionZoneButton) => (
          <ActionZoneMenuButton
            id={button.id}
            label={button.content.label}
            isActive={button.isActive}
            onClick={() => handleAction(button.action, menuItems.find((item) => item.key === button.id) || menuItems[0])}
            action={button.action}
          />
        ))}
      </div>
    </div>
  )
}
