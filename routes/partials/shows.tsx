import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { Button } from '@atoms/Button.tsx'
import shows from '@data/content-shows.json' with { type: 'json' }
import type { Show } from '@data/types.ts'

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  const upcomingShows = shows.filter((show: Show) => !show.isPast)
  const pastShows = shows.filter((show: Show) => show.isPast)

  return (
    <>
      <Head>
        <title>Shows | abyssion</title>
        <meta name='description' content='Upcoming and past shows by abyssion' />
      </Head>

      <div class='min-h-screen bg-gray-50 pb-20 md:pb-0'>
        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold text-gray-900 mb-6'>Shows</h1>
              <p class='text-xl text-gray-600 max-w-2xl mx-auto'>
                Experience abyssion live. Immerse yourself in our sonic landscapes.
              </p>
            </section>

            {/* Upcoming Shows */}
            <section>
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>Upcoming Shows</h2>
              <div class='space-y-6'>
                {upcomingShows.map((show: Show) => (
                  <div
                    key={show.id}
                    class='bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'
                  >
                    <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div class='space-y-2'>
                        <h3 class='text-xl font-semibold text-gray-900'>{show.title}</h3>
                        <p class='text-gray-600'>{show.venue} • {show.location}</p>
                        <p class='text-sm text-gray-500'>{new Date(show.date).toLocaleDateString()}</p>
                      </div>
                      <Button href={show.ticketLink} variant='primary'>
                        Get Tickets
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Past Shows */}
            <section>
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>Past Shows</h2>
              <div class='space-y-4'>
                {pastShows.map((show: Show) => (
                  <div
                    key={show.id}
                    class='bg-gray-50 rounded-xl border border-gray-200 p-6'
                  >
                    <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div class='space-y-2'>
                        <h3 class='text-lg font-medium text-gray-700'>{show.title}</h3>
                        <p class='text-gray-500'>{show.venue} • {show.location}</p>
                        <p class='text-sm text-gray-400'>{new Date(show.date).toLocaleDateString()}</p>
                      </div>
                      <span class='text-sm text-gray-400 font-medium'>Past Event</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
})
