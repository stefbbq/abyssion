import { defineRoute } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import bandMembers from '@data/content-bio-members.json' with { type: 'json' }
import bioAbout from '@data/content-bio-about.json' with { type: 'json' }
import bioAlbums from '@data/content-bio-music.json' with { type: 'json' }
import bioSectionsData from '@data/content-bio-sections.json' with { type: 'json' }
import type { Album, BandMember } from '@data/types.ts'
import { getTheme } from '@lib/theme/index.ts'
import { Shell } from '@components/Shell.tsx'
import { Card } from '@components/Card.tsx'
import { ListItem } from '@components/ListItem.tsx'

export default defineRoute(() => {
  const theme = getTheme()
  const bioSections: { mainTitle: string; mainDescription: string; aboutTitle: string; membersTitle: string; albumsTitle: string } =
    bioSectionsData

  return (
    <>
      <Head>
        <title>{bioSections.mainTitle} | abyssion</title>
        <meta name='description' content='Learn about the band abyssion' />
      </Head>

      <div class='space-y-8'>
        {/* about */}
        <Shell>
          <h2 class='text-3xl font-bold mb-6' style={{ color: theme.colors.text.primary }}>
            {bioSections.aboutTitle}
          </h2>
          <div class='prose prose-lg max-w-none' style={{ color: theme.colors.text.secondary }}>
            {bioAbout.map((paragraph: string, idx: number) => <p key={idx}>{paragraph}</p>)}
          </div>
        </Shell>

        {/* members */}
        <section class='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          {bandMembers.map((member: BandMember) => (
            <Card
              key={member.id}
              imageUrl={member.image}
              imageAlt={member.name}
              fallbackAvatarText={member.name.split(' ').map((n: string) => n[0]).join('')}
            >
              <h3 class='text-3xl font-semibold' style={{ color: theme.colors.text.primary }}>{member.name}</h3>
              <p class='text-md mb-0' style={{ color: theme.colors.text.tertiary }}>{member.role.toUpperCase()}</p>
            </Card>
          ))}
        </section>

        {/* albums */}
        <Shell>
          <h2 class='text-3xl font-bold mb-8' style={{ color: theme.colors.text.primary }}>
            {bioSections.albumsTitle}
          </h2>
          <div class='space-y-6'>
            {bioAlbums.map((album: Album, idx: number) => (
              <ListItem
                key={idx}
                leftSection={album.year}
                mainSection={`"${album.title}"`}
                rightSection={`${album.type} • ${album.tracks} tracks`}
              />
            ))}
          </div>
        </Shell>
      </div>
    </>
  )
})
