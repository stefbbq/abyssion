import bio from '@data/content-bio.json' with { type: 'json' }
import { Shell } from '@components/Shell.tsx'
import { Card } from '@components/Card.tsx'
import { TextBlock } from '@components/TextBlock.tsx'
import { Title } from '@components/Title.tsx'
import { RichLineItem } from '@components/RichLineItem.tsx'
import { ShellImage } from '@components/ShellImage.tsx'

export default function BioSection() {
  return (
    <>
      {/* about */}
      <Shell>
        <Title>{bio.aboutTitle}</Title>
        <ShellImage
          height='400px'
          yPosition={28}
          placement='top'
          src='/images/band_live.webp'
          srcSet='/images/band_live-640.webp 640w, /images/band_live-1024.webp 1024w, /images/band_live.webp 1433w'
          alt='Abyssion live'
          loading='eager'
          fetchpriority='high'
          decoding='async'
          sizes='(min-width: 1024px) 1024px, (min-width: 640px) 640px, 100vw'
        />
        <TextBlock>{bio.about}</TextBlock>
      </Shell>

      {/* albums */}
      <Shell>
        <Title>{bio.albumsTitle}</Title>
        <div class='space-y-6'>
          {bio.albums.map((album, idx) => <RichLineItem key={idx} leftText={album.year} title={album.title} subtitle={album.description} />)}
        </div>
      </Shell>

      {/* members */}
      <section aria-labelledby='band-members' class='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
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
