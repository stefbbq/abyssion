import shows from '@data/content-shows.json' with { type: 'json' }
import { Shell } from '@components/Shell.tsx'
import { ShowListItem } from '@components/shows/ShowListItem.tsx'
import { Title } from '@components/Title.tsx'

type ShowData = { date: string; venue: string; location: string; ticketLink?: string }

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
      {/* upcoming shows */}
      <Shell>
        <Title>upcoming shows</Title>
        <div class='space-y-4'>
          {upcomingShows.map((show: ShowData, index: number) => <ShowListItem key={`upcoming-${index}`} show={show} />)}
        </div>
      </Shell>

      {/* past shows */}
      <Shell>
        <Title>past shows</Title>
        <div class='space-y-3'>
          {pastShows.map((show: ShowData, index: number) => <ShowListItem key={`past-${index}`} show={show} isPast />)}
        </div>
      </Shell>
    </>
  )
}
