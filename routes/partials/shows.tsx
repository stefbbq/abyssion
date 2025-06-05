import { defineRoute, RouteConfig } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import { Head } from '$fresh/runtime.ts'
import Header from '../../islands/Header.tsx'
import { Button } from '../../atoms/index.ts'

// disable app wrapper and layouts for partial routes
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
}

interface Show {
  id: string
  title: string
  date: string
  venue: string
  location: string
  ticketLink: string
  isPast: boolean
}

const upcomingShows: Show[] = [
  {
    id: '1',
    title: 'Abyssion Live',
    date: '2024-02-15',
    venue: 'The Underground',
    location: 'Berlin, Germany',
    ticketLink: 'https://tickets.example.com/show1',
    isPast: false,
  },
  {
    id: '2',
    title: 'Dark Frequencies Tour',
    date: '2024-02-28',
    venue: 'Warehouse 23',
    location: 'Amsterdam, Netherlands',
    ticketLink: 'https://tickets.example.com/show2',
    isPast: false,
  },
]

const pastShows: Show[] = [
  {
    id: '3',
    title: 'Echoes in the Void',
    date: '2023-12-10',
    venue: 'Club Vertex',
    location: 'Prague, Czech Republic',
    ticketLink: '',
    isPast: true,
  },
]

export default defineRoute(() => {
  return (
    <Partial name='page-content'>
      <Head>
        <title>Shows | abyssion</title>
        <meta name='description' content='Upcoming and past shows by abyssion' />
      </Head>

      <div class='min-h-screen bg-gray-50 pb-20 md:pb-0'>
        <Header currentPath='/shows' />

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
                {upcomingShows.map((show) => (
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
                {pastShows.map((show) => (
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
    </Partial>
  )
})
