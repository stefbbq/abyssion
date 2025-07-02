import { ComponentChildren } from 'preact'

type Props = {
  // optional left-aligned content (icon, avatar, etc.)
  leftSection?: ComponentChildren
  // main content (required)
  mainSection: ComponentChildren
  // optional right-aligned content (badge, action, etc.)
  rightSection?: ComponentChildren
  // additional class names
  className?: string
}

/**
 * ListItem component
 * Renders a flexible row with optional left and right sections, and a main section.
 * Theming and layout are handled via CSS variables and utility classes.
 *
 * @example
 *   <ListItem leftSection={<Icon />} mainSection='Title' rightSection='Badge' />
 */
export const ListItem = ({ leftSection, mainSection, rightSection, className }: Props) => {
  return (
    <div
      class={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg transition-colors hover:bg-background-secondary ${
        className || ''
      }`}
    >
      {leftSection && (
        <div class='font-semibold md:w-24 flex-shrink-0 text-text-primary'>
          {leftSection}
        </div>
      )}
      <div class='flex-1 text-lg font-semibold text-text-primary'>
        {mainSection}
      </div>
      {rightSection && (
        <div class='text-sm px-3 py-1 rounded-full text-text-tertiary bg-background-secondary'>
          {rightSection}
        </div>
      )}
    </div>
  )
}
