import { ComponentChildren } from 'preact'

type Props = {
  // left grid slot, e.g., a date block
  left: ComponentChildren
  // main grid slot, e.g., title and subtitle
  main: ComponentChildren
  // optional right slot, e.g., status badge
  right?: ComponentChildren
  // additional classes for outer wrapper
  className?: string
  // optional left background role (uses theme colors)
  leftBgRole?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'background' | 'foreground'
}

/**
 * rich line item
 * theme-aware surface with a responsive grid: [100px | 1fr | auto]
 *
 * @param left - left grid slot, e.g., a date block
 * @param main - main grid slot, e.g., title and subtitle
 * @param right - optional right slot, e.g., status badge
 * @param className - additional classes for outer wrapper
 */
export const RichLineItem = ({ left, main, right, className, leftBgRole }: Props) => {
  const listItemBaseClasses = [
    'surface-elevated',
    'pr-3',
    'grid items-center',
    'gap-4 md:gap-6',
    'grid-cols-[100px_1fr_auto]',
    'overflow-hidden relative',
    'transition-all duration-200 ease-out',
    'pl-0',
    'md:hover:pl-[10px]',
    'before:content-[""] before:absolute before:inset-y-0 before:left-0',
    'before:w-0 md:hover:before:w-[10px] before:bg-[var(--colors-foreground)]',
    'before:opacity-100 before:transition-all before:duration-200 before:ease-out',
    'before:pointer-events-none',
  ].join(' ')

  const leftSlotClasses = 'flex items-center justify-center w-full h-full p-2 pt-4 text-[var(--colors-foreground)]'
  const mainSlotClasses = 'min-w-0'
  const rightSlotClasses = 'justify-self-end'
  const rightSlotHiddenClasses = 'hidden md:block'

  const mergedListItemClasses = `${listItemBaseClasses} ${className || ''}`.trim()

  return (
    <li class={mergedListItemClasses}>
      {/* left slot */}
      <div class={leftSlotClasses} style={{ backgroundColor: `var(--colors-${leftBgRole || 'secondary'})` }}>{left}</div>

      {/* main slot */}
      <div class={mainSlotClasses}>{main}</div>

      {/* right slot */}
      {right ? <div class={rightSlotClasses}>{right}</div> : <div class={rightSlotHiddenClasses} />}
    </li>
  )
}
