import { bio } from '@data/content-bio.ts'
import { Shell } from '@components/Shell.tsx'
import { Card } from '@components/Card.tsx'
import { TextBlock } from '@components/TextBlock.tsx'
import { Title } from '@components/Title.tsx'
import { RichLineItem } from '@components/RichLineItem.tsx'

export default function BioSection() {
  return (
    <>
      {/* about */}
      <Shell>
        <Title className='mb-6'>{bio.aboutTitle}</Title>
        <TextBlock>
          {bio.about}
        </TextBlock>
      </Shell>

      {/* albums */}
      <Shell>
        <Title>{bio.albumsTitle}</Title>
        <div class='space-y-6'>
          {bio.albums.map((album, idx) => (
            <RichLineItem
              key={idx}
              left={<span class='text-2xl md:text-3xl text-[var(--colors-foreground)]'>{album.year}</span>}
              main={
                <div>
                  <p class='text-md text-[var(--colors-text-tertiary)]'>{album.description}</p>
                </div>
              }
            />
          ))}
        </div>
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
            <h3 class='text-4xl font-semibold text-[var(--colors-text-primary)]'>{member.name}</h3>
            <p class='text-md mb-0 text-[var(--colors-text-tertiary)]'>{member.role.toUpperCase()}</p>
            {
              /* <TextBlock className='mt-2'>
              {member.bio}
            </TextBlock> */
            }
          </Card>
        ))}
      </section>
    </>
  )
}
