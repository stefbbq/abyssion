import HomeSection from './partials/home.tsx'
import ShowsSection from './partials/shows.tsx'
import BioSection from './partials/bio.tsx'
import ContactSection from './partials/contact.tsx'
import { Section } from '@components/Section.tsx'

export default function MainPage() {
  return (
    <main class='space-y-8'>
      <Section id='home' fullHeight>
        <HomeSection />
      </Section>
      <Section id='shows'>
        <ShowsSection />
      </Section>
      <Section id='bio'>
        <BioSection />
      </Section>
      <Section id='contact' lastSection>
        <ContactSection />
      </Section>
    </main>
  )
}
