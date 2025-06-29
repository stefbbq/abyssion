import { defineRoute } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { Button } from '@components/Button.tsx'
import shows from '@data/content-shows.json' with { type: 'json' }
import type { Show } from '@data/types.ts'
import { Shell } from '@components/Shell.tsx'

export default defineRoute(() => {
  const upcomingShows = shows.filter((show: Show) => !show.isPast)
  const pastShows = shows.filter((show: Show) => show.isPast)

  return (
    <>
      <Head>
        <title>shows | abyssion</title>
        <meta name='description' content='Upcoming and past shows by abyssion' />
      </Head>

      {/* Upcoming Shows */}
      <Shell>
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>Upcoming Shows</h2>
        <div class='space-y-6'>
          {upcomingShows.map((show: Show) => (
            <div
              key={show.id}
              class='rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow bg-[var(--colors-surface-primary)] border border-[var(--colors-border-primary)]'
            >
              <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div class='space-y-2'>
                  <h3 class='text-xl font-semibold text-[var(--colors-text-primary)]'>{show.title}</h3>
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
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>Past Shows</h2>
        <div class='space-y-4'>
          {pastShows.map((show: Show) => (
            <div
              key={show.id}
              class='rounded-xl p-6 bg-[var(--colors-surface-secondary)] border border-[var(--colors-border-primary)]'
            >
              <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div class='space-y-2'>
                  <h3 class='text-lg font-medium text-[var(--colors-text-primary)]'>{show.title}</h3>
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
