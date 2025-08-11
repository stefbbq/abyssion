import type { ContentContact } from '@data/types.ts'
import type { MusicGroupLD, PersonLD } from '@lib/seo/ld.types.ts'

type CreateMusicGroupInput = {
  origin: string
  logoUrl: string
  imageUrl: string
  description?: string
  sameAs?: string[]
  contact?: ContentContact
  members?: PersonLD[]
}

/** creates a MusicGroup JSON-LD object for the band */
export const createMusicGroupLD = (input: CreateMusicGroupInput): MusicGroupLD => {
  const { origin, logoUrl, imageUrl, description, sameAs, contact, members } = input

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: 'Abyssion',
    url: origin,
    logo: logoUrl,
    image: imageUrl,
    sameAs,
    email: contact?.email || undefined,
    description,
    member: members,
    address: contact?.location,
  }
}
