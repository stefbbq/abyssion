import { h, Fragment } from "preact";
import { type PageProps } from "$fresh/server.ts";
import MusicPlayer from "../islands/MusicPlayer.tsx";

// Sample track data - would be replaced with actual tracks
const sampleTracks = [
  {
    id: "1",
    title: "Echoes in the Void",
    artist: "abyssion",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
    cover: "/images/cover1.jpg"
  },
  {
    id: "2",
    title: "Beneath the Surface",
    artist: "abyssion",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3",
    cover: "/images/cover2.jpg"
  },
  {
    id: "3",
    title: "Endless Night",
    artist: "abyssion",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    cover: "/images/cover3.jpg"
  }
]

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>abyssion</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
        {/* <MusicPlayer tracks={sampleTracks} /> */}
      </body>
    </html>
  );
}
