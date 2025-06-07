import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { lc, log } from '@lib/logger/index.ts'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  cover?: string
}

interface MusicPlayerProps {
  tracks: Track[]
  initialTrack?: number
}

export default function MusicPlayer({ tracks, initialTrack = 0 }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrack)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    // Reset player state when track changes
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
          .catch((error) => {
            log.error(lc.PREACT, 'Error playing audio:', error)
            setIsPlaying(false)
          })
      }
    }
  }, [currentTrackIndex])

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
          .catch((error) => {
            log.error(lc.PREACT, 'Error playing audio:', error)
          })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => prev === 0 ? tracks.length - 1 : prev - 1)
  }

  const handleNext = () => {
    setCurrentTrackIndex((prev) => prev === tracks.length - 1 ? 0 : prev + 1)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleProgressClick = (e: MouseEvent) => {
    if (!progressBarRef.current || !audioRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div
      class={`fixed bottom-0 left-0 right-0 bg-black text-white transition-all duration-300 ${isExpanded ? 'h-64' : 'h-16'}`}
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* Progress bar */}
      <div
        ref={progressBarRef}
        class='h-1 w-full bg-gray-700 cursor-pointer'
        onClick={handleProgressClick}
      >
        <div
          class='h-full bg-white'
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Mini player */}
      <div class='flex items-center justify-between px-4 h-16'>
        <div class='flex items-center'>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            class='mr-4 text-white hover:text-gray-300'
          >
            {isExpanded ? '▼' : '▲'}
          </button>

          <div class='w-10 h-10 bg-gray-700 mr-3 flex-shrink-0'>
            {currentTrack.cover && (
              <img
                src={currentTrack.cover}
                alt={`${currentTrack.title} cover`}
                class='w-full h-full object-cover'
              />
            )}
          </div>

          <div class='truncate'>
            <div class='font-medium truncate'>{currentTrack.title}</div>
            <div class='text-sm text-gray-400 truncate'>{currentTrack.artist}</div>
          </div>
        </div>

        <div class='flex items-center'>
          <button
            onClick={handlePrevious}
            class='w-10 h-10 flex items-center justify-center text-xl hover:text-gray-300'
          >
            ⏮
          </button>

          <button
            onClick={handlePlay}
            class='w-12 h-12 flex items-center justify-center text-2xl mx-2 hover:text-gray-300'
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={handleNext}
            class='w-10 h-10 flex items-center justify-center text-xl hover:text-gray-300'
          >
            ⏭
          </button>

          <div class='ml-4 text-sm'>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Expanded player with playlist */}
      {isExpanded && (
        <div class='p-4 overflow-y-auto' style={{ height: 'calc(100% - 4rem)' }}>
          <h3 class='text-lg font-bold mb-3'>Playlist</h3>
          <ul class='space-y-2'>
            {tracks.map((track, index) => (
              <li
                key={track.id}
                class={`flex items-center p-2 cursor-pointer hover:bg-gray-800 transition-colors ${
                  currentTrackIndex === index ? 'bg-gray-800' : ''
                }`}
                onClick={() => setCurrentTrackIndex(index)}
              >
                <div class='w-8 h-8 bg-gray-700 mr-3 flex-shrink-0'>
                  {track.cover && (
                    <img
                      src={track.cover}
                      alt={`${track.title} cover`}
                      class='w-full h-full object-cover'
                    />
                  )}
                </div>
                <div>
                  <div class='font-medium'>{track.title}</div>
                  <div class='text-sm text-gray-400'>{track.artist}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
