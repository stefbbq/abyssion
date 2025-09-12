import { WarningIcon } from '@components/icons/WarningIcon.tsx'

type LeftDate = { month: string; day: string }
type RightStatus = 'pastEvent'

type Props = {
  /** left content as stacked date (month/day); optional */
  leftDate?: LeftDate
  /** left content as single text; optional */
  leftText?: string
  /** main title text; optional */
  title?: string
  /** secondary line under title; optional */
  subtitle?: string
  /** right status indicator; optional */
  rightStatus?: RightStatus
  /** right text content; optional */
  rightText?: string
  /** additional classes for outer wrapper */
  className?: string
  /** left background theme role */
  leftBgRole?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'background' | 'foreground'
  /** explicit container height (number treated as px, or any CSS length) */
  height?: number | string
}

/**
 * rich line item
 * theme-aware surface with a responsive grid: [100px | 1fr | auto]
 */
export const RichLineItem = ({ leftDate, leftText, title, subtitle, rightStatus, rightText, className, leftBgRole, height }: Props) => {
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
    'before:content-["" ] before:absolute before:inset-y-0 before:left-0',
    'before:w-0 md:hover:before:w-[10px] before:bg-[var(--colors-foreground)]',
    'before:opacity-100 before:transition-all before:duration-200 before:ease-out',
    'before:pointer-events-none',
  ].join(' ')

  const leftSlotClasses = 'flex items-center justify-center w-full h-full p-2 pt-4 text-[var(--colors-background)]'
  const mainSlotClasses = 'min-w-0'
  const rightSlotClasses = 'justify-self-end'
  const rightSlotHiddenClasses = 'hidden md:block'

  const mergedListItemClasses = `${listItemBaseClasses} ${className || ''}`.trim()

  const renderLeft = () => {
    if (leftDate) {
      return (
        <div class={leftSlotClasses} style={{ backgroundColor: `var(--colors-${leftBgRole || 'secondary'})` }}>
          <div class='flex flex-col items-center leading-none select-none'>
            <span
              class='block text-xl md:text-2xl'
              style={{
                fontFamily: 'var(--typography-fontFamily-shows-date, var(--typography-fontFamily-heading))',
                fontWeight: 700,
                textTransform: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {leftDate.month}
            </span>
            <span
              class='block -mt-1 text-4xl md:text-5xl'
              style={{
                fontFamily: 'var(--typography-fontFamily-shows-date, var(--typography-fontFamily-heading))',
                fontWeight: 800,
                textTransform: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {leftDate.day}
            </span>
          </div>
        </div>
      )
    }
    if (typeof leftText === 'string') {
      return (
        <div class={leftSlotClasses} style={{ backgroundColor: `var(--colors-${leftBgRole || 'secondary'})` }}>
          <span class='text-2xl md:text-3xl'>{leftText}</span>
        </div>
      )
    }
    return <div />
  }

  const renderMain = () => {
    if (title || subtitle) {
      return (
        <div class={mainSlotClasses}>
          {title ? <h3 class='truncate !text-xl !font-semibold !text-[var(--colors-foreground)]'>{title}</h3> : null}
          {subtitle ? <p class='!mt-0 !text-[var(--colors-foreground)] !opacity-70 truncate'>{subtitle}</p> : null}
        </div>
      )
    }
    return <div class={mainSlotClasses} />
  }

  const renderRight = () => {
    if (rightStatus === 'pastEvent') {
      return (
        <div class={rightSlotClasses}>
          <div class='flex items-center gap-2 text-[var(--colors-foreground)] opacity-70'>
            <WarningIcon className='w-4 h-4' />
            <span class='text-xs font-medium tracking-wider leading-tight md:hidden'>
              PAST<br />EVENT
            </span>
            <span class='hidden md:inline text-sm font-medium tracking-wider'>PAST EVENT</span>
          </div>
        </div>
      )
    }
    if (typeof rightText === 'string' && rightText.length > 0) {
      return (
        <div class={rightSlotClasses}>
          <span class='text-sm font-medium tracking-wider'>{rightText}</span>
        </div>
      )
    }
    return <div class={rightSlotHiddenClasses} />
  }

  return (
    <li class={mergedListItemClasses} style={{ height: height || '100px' }}>
      {renderLeft()}
      {renderMain()}
      {renderRight()}
    </li>
  )
}
