import { RichLineItem } from '@components/RichLineItem.tsx'
import { WarningIcon } from '@components/icons/WarningIcon.tsx'

export type ShowData = {
  date: string
  venue: string
  location: string
  ticketLink?: string
}

const formatDateParts = (isoDate: string) => {
  const date = new Date(isoDate)
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = String(date.getDate())
  return { month, day }
}

/**
 * show list item
 * two-column layout: left date block (100px), main info, right status for past events
 */
export const ShowListItem = ({ show, isPast }: { show: ShowData; isPast?: boolean }) => {
  const { month, day } = formatDateParts(show.date)

  const left = (
    <div class='flex flex-col items-center leading-none select-none'>
      <span
        class='block text-2xl md:text-3xl text-[var(--colors-foreground)]'
        style={{
          fontFamily: 'var(--typography-fontFamily-shows-date, var(--typography-fontFamily-heading))',
          fontWeight: 700,
          textTransform: 'none',
          letterSpacing: '0.02em',
          color: 'var(--colors-foreground)',
        }}
      >
        {month}
      </span>
      <span
        class='block -mt-1 text-5xl md:text-6xl text-[var(--colors-foreground)]'
        style={{
          fontFamily: 'var(--typography-fontFamily-shows-date, var(--typography-fontFamily-heading))',
          fontWeight: 800,
          textTransform: 'none',
          letterSpacing: '0.02em',
          color: 'var(--colors-foreground)',
        }}
      >
        {day}
      </span>
    </div>
  )

  const main = (
    <div class='min-w-0'>
      <h3
        class='truncate !text-xl !font-semibold !text-[var(--colors-foreground)]'
        style={{ fontFamily: 'var(--typography-fontFamily-shows-venue, var(--typography-fontFamily-heading))' }}
      >
        {show.venue}
      </h3>
      <p
        class='!mt-0 !text-[var(--colors-foreground)] !opacity-70 truncate'
        style={{ fontFamily: 'var(--typography-fontFamily-shows-meta, var(--typography-fontFamily-body))' }}
      >
        {show.location}
      </p>
    </div>
  )

  const right = isPast
    ? (
      <div class='flex items-center gap-2 text-[var(--colors-foreground)] opacity-70'>
        <WarningIcon className='w-4 h-4' />
        <span class='text-xs md:text-sm font-medium tracking-wider'>PAST EVENT</span>
      </div>
    )
    : null

  return <RichLineItem leftBgRole={isPast ? 'secondary' : 'primary'} {...{ left, main, right }} />
}
