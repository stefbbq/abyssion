import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { Button } from '@atoms/Button.tsx'
import shows from '@data/content-shows.json' with { type: 'json' }
import type { Show } from '@data/types.ts'
import { getTheme } from '@lib/theme/index.ts'

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

export default defineRoute(() => {
  const theme = getTheme()
  const upcomingShows = shows.filter((show: Show) => !show.isPast)
  const pastShows = shows.filter((show: Show) => show.isPast)

  return (
    <>
      <Head>
        <title>Shows | abyssion</title>
        <meta name='description' content='Upcoming and past shows by abyssion' />
      </Head>

      <div class='min-h-screen pb-20 md:pb-0' style={{ backgroundColor: theme.colors.background.primary }}>
        <main class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>Shows</h1>
              <p class='text-xl max-w-2xl mx-auto' style={{ color: theme.colors.text.secondary }}>
                Experience abyssion live. Immerse yourself in our sonic landscapes.
              </p>
            </section>

            {/* Upcoming Shows */}
            <section>
              <h2 class='text-3xl font-bold mb-8' style={{ color: theme.colors.text.primary }}>Upcoming Shows</h2>
              <div class='space-y-6'>
                {upcomingShows.map((show: Show) => (
                  <div
                    key={show.id}
                    class='rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow'
                    style={{
                      backgroundColor: theme.colors.surface.primary,
                      border: `1px solid ${theme.colors.border.primary}`,
                    }}
                  >
                    <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div class='space-y-2'>
                        <h3 class='text-xl font-semibold' style={{ color: theme.colors.text.primary }}>{show.title}</h3>
                        <p style={{ color: theme.colors.text.secondary }}>{show.venue} • {show.location}</p>
                        <p class='text-sm' style={{ color: theme.colors.text.tertiary }}>
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
            </section>

            {/* Past Shows */}
            <section>
              <h2 class='text-3xl font-bold mb-8' style={{ color: theme.colors.text.primary }}>Past Shows</h2>
              <div class='space-y-4'>
                {pastShows.map((show: Show) => (
                  <div
                    key={show.id}
                    class='rounded-xl p-6'
                    style={{
                      backgroundColor: theme.colors.surface.secondary,
                      border: `1px solid ${theme.colors.border.primary}`,
                    }}
                  >
                    <div class='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div class='space-y-2'>
                        <h3 class='text-lg font-medium' style={{ color: theme.colors.text.primary }}>{show.title}</h3>
                        <p style={{ color: theme.colors.text.secondary }}>{show.venue} • {show.location}</p>
                        <p class='text-sm' style={{ color: theme.colors.text.tertiary }}>
                          {new Date(show.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span class='text-sm font-medium' style={{ color: theme.colors.text.tertiary }}>Past Event</span>
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
