import type { MenuItem, SocialLink } from '@data/types.ts'
import { ActionZoneMenuButton } from '@components/actionZone/ActionZoneMenuButton.tsx'
import { icons as SocialIcons, type SocialIconMap } from '@components/icons/index.ts'
import type { ActionZoneButton } from '@components/actionZone/types.ts'
import { ThemeToggle } from '@components/ThemeToggle.tsx'
import { ThemeSwitcher } from '@components/ThemeSwitcher.tsx'

type SocialIconKey = keyof SocialIconMap

type Props = {
  menuItems: MenuItem[]
  socialLinks: SocialLink[]
  onMenuClose: () => void
  onAnchorLink: (path: string) => void
  onAction: (action: ActionZoneButton['action']) => void
  currentHash: string
  buttons: ActionZoneButton[]
}

/**
 * ActionZoneExpanded component
 * Handles the expanded menu state with social links and navigation items.
 * Provides full navigation menu functionality in expanded mode.
 */
export const ActionZoneExpanded = ({ socialLinks, onAction, buttons }: Props) => {
  // Use the buttons passed from ActionZonController (already have active state applied)
  const buttonsWithActiveState = buttons

  return (
    <div class='px-4 pb-4 space-y-4'>
      {/* theme controls */}
      <div class='pt-2'>
        <div class='flex items-center justify-center space-x-3'>
          <ThemeSwitcher />
          <ThemeToggle />
        </div>
        <div class='mt-3 h-px w-full bg-gradient-to-r from-transparent via-[var(--colors-border-primary)] to-transparent opacity-30' />
      </div>

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
              return IconComponent ? <IconComponent className='w-6 h-6 opacity-60' /> : <div class='w-6 h-6 rounded bg-current opacity-30' />
            })()}
          </a>
        ))}
      </div>

      {/* menu items */}
      <div className='space-y-0.5'>
        {buttonsWithActiveState.map((button: ActionZoneButton) => (
          <ActionZoneMenuButton
            key={button.id}
            id={button.id}
            label={button.content.label}
            isActive={button.isActive}
            onClick={() => onAction(button.action)}
            action={button.action}
          />
        ))}
      </div>
    </div>
  )
}
