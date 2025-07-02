import { defineRoute } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { Button } from '@components/Button.tsx'
import shows from '@data/content-shows.json' with { type: 'json' }
import { Shell } from '@components/Shell.tsx'

type ShowData = {
  date: string
  venue: string
  location: string
  ticketLink: string
}

export default defineRoute(() => {
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
      <Head>
        <title>shows | abyssion</title>
        <meta name='description' content='Upcoming and past shows by abyssion' />
      </Head>

      {/* Upcoming Shows */}
      <Shell>
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>upcoming shows</h2>
        <div class='space-y-6'>
          {upcomingShows.map((show: ShowData, index: number) => (
            <div
              key={`upcoming-${index}`}
              class='rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow bg-[var(--colors-surface-primary)] border border-[var(--colors-border-primary)]'
            >
              <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div class='space-y-2'>
                  <h3 class='text-xl font-semibold text-[var(--colors-text-primary)]'>{show.venue}</h3>
                  <p class='text-[var(--colors-text-secondary)]'>{show.venue} • {show.location}</p>
                  <p class='text-sm text-[var(--colors-text-tertiary)]'>
                    {new Date(show.date).toLocaleDateString()}
                  </p>
                </div>
                <Button href={show.ticketLink} variant='primary'>
                  Get Tickets
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Shell>

      {/* Past Shows */}
      <Shell>
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>past shows</h2>
        <div class='space-y-4'>
          {pastShows.map((show: ShowData, index: number) => (
            <div
              key={`past-${index}`}
              class='rounded-xl p-6 border border-dashed'
              style={{
                backgroundColor: 'rgba(var(--colors-surface-secondary-rgb), 0.5)',
                borderColor: 'rgba(var(--colors-border-primary-rgb), 0.5)',
              }}
            >
              <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div class='space-y-2'>
                  <h3 class='text-lg font-medium text-[var(--colors-text-primary)]'>{show.venue}</h3>
                  <p class='text-[var(--colors-text-secondary)]'>{show.venue} • {show.location}</p>
                  <p class='text-sm text-[var(--colors-text-tertiary)]'>
                    {new Date(show.date).toLocaleDateString()}
                  </p>
                </div>
                <span class='text-sm font-medium text-[var(--colors-text-tertiary)]'>Past Event</span>
              </div>
            </div>
          ))}
        </div>
      </Shell>
    </>
  )
})
