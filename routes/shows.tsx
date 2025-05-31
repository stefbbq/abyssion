import { Head } from '$fresh/runtime.ts'
import { Header } from '../components/Header.tsx'
import { BottomNav } from '../components/BottomNav.tsx'
import { Button } from '../components/Button.tsx'

interface Show {
  id: string
  title: string
  date: string
  venue: string
  location: string
  ticketLink: string
  isPast: boolean
}

// Sample data - will be replaced by actual data source
const shows: Show[] = [
  {
    id: '1',
    title: 'Summer Festival',
    date: '2023-08-15',
    venue: 'City Park',
    location: 'New York, NY',
    ticketLink: 'https://tickets.com/event1',
    isPast: true,
  },
  {
    id: '2',
    title: 'Club Night',
    date: '2023-10-20',
    venue: 'The Underground',
    location: 'Los Angeles, CA',
    ticketLink: 'https://tickets.com/event2',
    isPast: true,
  },
  {
    id: '3',
    title: 'Winter Tour 2024',
    date: '2024-01-15',
    venue: 'Concert Hall',
    location: 'Chicago, IL',
    ticketLink: 'https://tickets.com/event3',
    isPast: false,
  },
]

export default function Shows() {
  const upcomingShows = shows.filter((show) => !show.isPast)
  const pastShows = shows.filter((show) => show.isPast)

  return (
    <>
      <Head>
        <title>Shows | abyssion</title>
        <meta name='description' content='Upcoming and past shows for abyssion' />
      </Head>

      <div class='min-h-screen bg-gray-50 pb-20 md:pb-0'>
        <Header currentPath='/shows' />

        <main class='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div class='space-y-16'>
            <section class='text-center'>
              <h1 class='text-5xl font-bold text-gray-900 mb-6'>Shows</h1>
              <p class='text-xl text-gray-600 max-w-2xl mx-auto'>
                Join us for an unforgettable experience. Check out our upcoming performances and past shows.
              </p>
            </section>

            <section>
              <h2 class='text-3xl font-bold text-gray-900 mb-8'>Upcoming Shows</h2>
              {upcomingShows.length === 0
                ? (
                  <div class='bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center'>
                    <div class='text-gray-400 mb-4'>
                      <svg class='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <h3 class='text-lg font-semibold text-gray-900 mb-2'>No upcoming shows</h3>
                    <p class='text-gray-600'>Stay tuned for announcements about future performances.</p>
                  </div>
                )
                : (
                  <div class='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {upcomingShows.map((show) => (
                      <div
                        key={show.id}
                        class='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
                      >
                        <div class='p-6'>
                          <div class='flex items-start justify-between mb-4'>
                            <div class='flex-1'>
                              <h3 class='text-xl font-semibold text-gray-900 mb-2'>{show.title}</h3>
                              <p class='text-sm font-medium text-gray-500 mb-1'>
                                {new Date(show.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div class='bg-black text-white text-xs font-medium px-2 py-1 rounded-full'>
                              LIVE
                            </div>
                          </div>
                          <div class='space-y-2 mb-6'>
                            <p class='font-medium text-gray-900'>{show.venue}</p>
                            <p class='text-gray-600'>{show.location}</p>
                          </div>
                          <Button variant='primary' class='w-full'>
                            <a href={show.ticketLink} target='_blank' rel='noopener noreferrer' class='block w-full text-center'>
                              Get Tickets
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </section>

            {pastShows.length > 0 && (
              <section>
                <h2 class='text-3xl font-bold text-gray-900 mb-8'>Past Shows</h2>
                <div class='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
                  <div class='divide-y divide-gray-200'>
                    {pastShows.map((show) => (
                      <div key={show.id} class='p-6 hover:bg-gray-50 transition-colors'>
                        <div class='flex flex-col md:flex-row md:items-center gap-4'>
                          <div class='flex-1'>
                            <h3 class='text-lg font-semibold text-gray-900 mb-1'>{show.title}</h3>
                            <p class='text-sm text-gray-500 mb-2'>
                              {new Date(show.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <div class='flex items-center text-sm text-gray-600'>
                              <span class='font-medium'>{show.venue}</span>
                              <span class='mx-2'>•</span>
                              <span>{show.location}</span>
                            </div>
                          </div>
                          <div class='text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full self-start md:self-center'>
                            Past Show
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        <BottomNav currentPath='/shows' />
      </div>
    </>
  )
}
