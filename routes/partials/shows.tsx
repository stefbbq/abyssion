import shows from '@data/content-shows.json' with { type: 'json' }
import { Shell } from '@components/Shell.tsx'

type ShowData = {
  date: string
  venue: string
  location: string
  ticketLink: string
}

const ShowInfo = ({ show }: { show: ShowData }) => (
  <div class='space-y-2'>
    <h3 class='!text-xl !font-medium !text-[var(--colors-foreground)]'>{show.venue}</h3>
    <p class='!-mt-1 !text-[var(--colors-foreground)] !opacity-70'>{show.location}</p>
    <p class='!text-sm !text-[var(--colors-foreground)] !opacity-50'>
      {new Date(show.date).toLocaleDateString()}
    </p>
  </div>
)

export default function ShowsSection() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingShows = shows.filter((show: ShowData) => {
    const showDate = new Date(show.date)
    showDate.setHours(0, 0, 0, 0)
    return showDate >= today
  })

  const pastShows = shows.filter((show: ShowData) => {
    const showDate = new Date(show.date)
    showDate.setHours(0, 0, 0, 0)
    return showDate < today
  })

  return (
    <>
      {/* Upcoming Shows */}
      <Shell>
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>upcoming shows</h2>
        <div class='space-y-6'>
          {upcomingShows.map((show: ShowData, index: number) => (
            <div
              key={`upcoming-${index}`}
              class='surface-elevated p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4'
            >
              <ShowInfo show={show} />
              {
                /* <span class='inline-block flex-shrink-0 self-start w-fit px-3 py-1.5 opacity-70 rounded-theme-md bg-[var(--colors-secondary)] text-[var(--colors-surface)] !text-sm !font-medium'>
                Upcoming Event
              </span> */
              }
            </div>
          ))}
        </div>
      </Shell>

      {/* Past Shows */}
      <Shell>
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>past shows</h2>
        <div class='space-y-4'>
          {pastShows.map((show: ShowData, index: number) => (
            <div key={`past-${index}`} class='surface-elevated p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <ShowInfo show={show} />
              {
                /* <span class='inline-block flex-shrink-0 self-start w-fit px-3 py-1.5 opacity-70 rounded-theme-md bg-[var(--colors-foreground)] text-[var(--colors-surface)] !text-sm !font-medium'>
                Past Event
              </span> */
              }
            </div>
          ))}
        </div>
      </Shell>
    </>
  )
}
