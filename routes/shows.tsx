import { h, Fragment } from "preact";
import { Head } from "$fresh/runtime.ts";

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
    id: "1",
    title: "Summer Festival",
    date: "2023-08-15",
    venue: "City Park",
    location: "New York, NY",
    ticketLink: "https://tickets.com/event1",
    isPast: true
  },
  {
    id: "2",
    title: "Club Night",
    date: "2023-10-20",
    venue: "The Underground",
    location: "Los Angeles, CA",
    ticketLink: "https://tickets.com/event2",
    isPast: true
  },
  {
    id: "3",
    title: "Winter Tour 2024",
    date: "2024-01-15",
    venue: "Concert Hall",
    location: "Chicago, IL",
    ticketLink: "https://tickets.com/event3",
    isPast: false
  }
]

export default function Shows() {
  const upcomingShows = shows.filter(show => !show.isPast)
  const pastShows = shows.filter(show => show.isPast)

  return (
    <>
      <Head>
        <title>Shows | abyssion</title>
        <meta name="description" content="Upcoming and past shows for abyssion" />
      </Head>
      
      <div class="min-h-screen bg-gray-100">
        <header class="bg-black text-white p-6">
          <div class="max-w-6xl mx-auto">
            <nav class="flex justify-between items-center">
              <a href="/" class="text-2xl font-bold">abyssion</a>
              <div class="space-x-6">
                <a href="/shows" class="hover:underline font-medium">Shows</a>
                <a href="/bio" class="hover:underline">Bio</a>
              </div>
            </nav>
          </div>
        </header>
        
        <main class="max-w-6xl mx-auto p-6">
          <h1 class="text-4xl font-bold mb-8">Shows</h1>
          
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4">Upcoming Shows</h2>
            {upcomingShows.length === 0 ? (
              <p class="text-gray-600">No upcoming shows scheduled at the moment.</p>
            ) : (
              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingShows.map(show => (
                  <div key={show.id} class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-bold">{show.title}</h3>
                    <p class="text-gray-700 mt-2">{new Date(show.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="mt-1">{show.venue}</p>
                    <p class="text-gray-600">{show.location}</p>
                    <a href={show.ticketLink} target="_blank" rel="noopener noreferrer" class="block mt-4 px-4 py-2 bg-black text-white text-center rounded hover:bg-gray-800 transition-colors">
                      Get Tickets
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <section>
            <h2 class="text-2xl font-bold mb-4">Past Shows</h2>
            {pastShows.length === 0 ? (
              <p class="text-gray-600">No past shows to display.</p>
            ) : (
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                  <thead>
                    <tr class="bg-gray-200 text-gray-700">
                      <th class="py-3 px-4 text-left">Date</th>
                      <th class="py-3 px-4 text-left">Event</th>
                      <th class="py-3 px-4 text-left">Venue</th>
                      <th class="py-3 px-4 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastShows.map(show => (
                      <tr key={show.id} class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="py-3 px-4">{new Date(show.date).toLocaleDateString()}</td>
                        <td class="py-3 px-4 font-medium">{show.title}</td>
                        <td class="py-3 px-4">{show.venue}</td>
                        <td class="py-3 px-4">{show.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  )
} 