import { type PageProps } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import Header from '../islands/Header.tsx'
import BottomNav from '../islands/BottomNav.tsx'
import MusicPlayer from '../islands/MusicPlayer.tsx'

// Sample track data - would be replaced with actual tracks
const sampleTracks = [
  {
    id: '1',
    title: 'Echoes in the Void',
    artist: 'abyssion',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3',
    cover: '/images/cover1.jpg',
  },
  {
    id: '2',
    title: 'Beneath the Surface',
    artist: 'abyssion',
    url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3',
    cover: '/images/cover2.jpg',
  },
  {
    id: '3',
    title: 'Endless Night',
    artist: 'abyssion',
    url:
      'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
    cover: '/images/cover3.jpg',
  },
]

export default function App({ Component, url }: PageProps) {
  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>abyssion</title>
        <link rel='stylesheet' href='/styles.css' />
      </head>
      <body f-client-nav class='min-h-screen relative'>
        <div class='absolute top-0 left-0 right-0 z-50'>
          <Header currentPath={url.pathname} />
        </div>
        <main class='min-h-screen'>
          <Partial name='page-content'>
            <Component />
          </Partial>
        </main>
        <BottomNav currentPath={url.pathname} />
        {/* <MusicPlayer tracks={sampleTracks} /> */}
      </body>
    </html>
  )
}
