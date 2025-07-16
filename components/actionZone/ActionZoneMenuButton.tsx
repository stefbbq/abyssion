import { CSSProperties } from 'preact/compat'
import { Button, type ButtonVariant } from '@components/Button.tsx'
import type { ActionZoneButton } from './types.ts'

type Props = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
  style?: CSSProperties
  action: ActionZoneButton['action']
}

/**
 * ActionZoneMenuButton
 * Dedicated button for expanded menu items using the unified Button component
 * Provides proper active state styling and theme-aware border radius
 */
export const ActionZoneMenuButton = ({ id, label, isActive = false, onClick, style = {}, action }: Props) => {
  // custom styling for menu buttons with shell-matching border radius
  const menuButtonClasses = 'w-full h-10 flex items-center justify-center font-medium text-sm rounded-shell-expanded'

  const handleClick = (e?: Event) => {
    if (action.type === 'navigate' && action.href?.startsWith('#')) {
      e?.preventDefault()
    }
    onClick()
  }

  // use ghost variant for all, handle active state with inline styles
  const buttonVariant: ButtonVariant = 'ghost'

  // active state with inline styles (higher specificity)
  const customStyle = {
    ...(isActive ? { backgroundColor: 'var(--colors-foreground)', color: 'var(--colors-background)' } : {}),
    ...style,
  }

  const buttonProps = {
    id,
    class: menuButtonClasses,
    style: customStyle,
    onClick: handleClick,
    variant: buttonVariant,
    size: 'sm' as const,
  }

  if (action?.type === 'navigate' && action.href) {
    return (
      <Button {...buttonProps} href={action.href}>
        {label}
      </Button>
    )
  }

  return (
    <Button {...buttonProps}>
      {label}
    </Button>
  )
}
