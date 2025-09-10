import shows from '@data/content-shows.json' with { type: 'json' }
import { Shell } from '@components/Shell.tsx'
import { TextBlock } from '@components/TextBlock.tsx'
import { Title } from '@components/Title.tsx'
import { RichLineItem } from '@components/RichLineItem.tsx'

type ShowData = { date: string; venue: string; location: string; ticketLink?: string }

const formatDateParts = (isoDate: string) => {
  const date = new Date(isoDate)
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = String(date.getDate())
  return { month, day }
}

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
          {upcomingShows.length === 0 && <TextBlock>No upcoming shows. Yet.</TextBlock>}
          {upcomingShows.length > 0 && (
            upcomingShows.map((show: ShowData, index: number) => {
              const { month, day } = formatDateParts(show.date)
              return (
                <RichLineItem
                  key={`upcoming-${index}`}
                  leftDate={{ month, day }}
                  title={show.venue}
                  subtitle={show.location}
                  leftBgRole='primary'
                  height='100px'
                />
              )
            })
          )}
        </div>
      </Shell>

      {/* past shows */}
      <Shell>
        <Title>past shows</Title>
        <div class='space-y-3'>
          {pastShows.map((show: ShowData, index: number) => {
            const { month, day } = formatDateParts(show.date)
            return (
              <RichLineItem
                key={`past-${index}`}
                leftDate={{ month, day }}
                title={show.venue}
                subtitle={show.location}
                rightStatus='pastEvent'
                leftBgRole='secondary'
                height='100px'
              />
            )
          })}
        </div>
      </Shell>
    </>
  )
}
