import { defineRoute } from '$fresh/server.ts'
import { Head } from '$fresh/runtime.ts'
import { bio } from '@data/content-bio.ts'
import { Shell } from '@components/Shell.tsx'
import { Card } from '@components/Card.tsx'
import { ListItem } from '@components/ListItem.tsx'
import { TextBlock } from '@components/TextBlock.tsx'

export default defineRoute(() => {
  return (
    <>
      <Head>
        <title>About | abyssion</title>
        <meta name='description' content='Learn about the band abyssion' />
      </Head>

      {/* about */}
      <Shell>
        <h2 class='text-3xl font-bold mb-6 text-[var(--colors-text-primary)]'>{bio.aboutTitle}</h2>
        <TextBlock>
          {bio.about}
        </TextBlock>
      </Shell>

      {/* members */}
      <section class='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {bio.members.map((member) => (
          <Card
            key={member.id}
            imageUrl={member.image}
            imageAlt={member.name}
            fallbackAvatarText={member.name.split(' ').map((n) => n[0]).join('')}
          >
            <h3 class='text-3xl font-semibold text-[var(--colors-text-primary)]'>{member.name}</h3>
            <p class='text-md mb-0 text-[var(--colors-text-tertiary)]'>{member.role.toUpperCase()}</p>
            {
              /* <TextBlock className='mt-2'>
              {member.bio}
            </TextBlock> */
            }
          </Card>
        ))}
      </section>

      {/* albums */}
      <Shell>
        <h2 class='text-3xl font-bold mb-8 text-[var(--colors-text-primary)]'>{bio.albumsTitle}</h2>
        <div class='space-y-6'>
          {bio.albums.map((album, idx) => (
            <ListItem
              key={idx}
              leftSection={album.year}
              mainSection={`"${album.title}"`}
              rightSection={`${album.type}  ${album.tracks} tracks`}
            />
          ))}
        </div>
      </Shell>
    </>
  )
})
