import { NavButton, type NavButtonState } from './index.ts'

interface CollapsedNavProps {
  buttonStates: Record<string, NavButtonState>
  onAction: (action: NavButtonState['action']) => void
  theme: any
}

/**
 * CollapsedNav organism
 * Handles the collapsed navigation state with morphing NavButtons
 * Coordinates position-based animations between button states
 */
export const CollapsedNav = ({ buttonStates, onAction, theme }: CollapsedNavProps) => {
  return (
    <div class='px-6 h-full'>
      <div class='relative h-full w-full'>
        {/* render persistent buttons that morph */}
        <NavButton
          key='shows'
          id='shows'
          state={buttonStates.shows}
          onAction={onAction}
          theme={theme}
        />
        <NavButton
          key='contact'
          id='contact'
          state={buttonStates.contact}
          onAction={onAction}
          theme={theme}
        />
        <NavButton
          key='menu'
          id='menu'
          state={buttonStates.menu}
          onAction={onAction}
          theme={theme}
        />
      </div>
    </div>
  )
}
