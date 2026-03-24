'use client'

import { useEffect, useRef, useState } from 'react'
import { Music2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'vb-ambient-music-enabled'
const AMBIENT_TRACK_SRC = '/audio/ambient.mp3'

export function AmbientMusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  })
  const [isTrackAvailable, setIsTrackAvailable] = useState(true)

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    localStorage.setItem(STORAGE_KEY, String(isEnabled))

    if (!isEnabled) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      return
    }

    const playMusic = async () => {
      try {
        await audioRef.current?.play()
      } catch {
        // Browsers can block autoplay until a user gesture. Reset to off.
        setIsEnabled(false)
      }
    }

    void playMusic()
  }, [isEnabled])

  return (
    <>
      <audio
        ref={audioRef}
        src={AMBIENT_TRACK_SRC}
        loop
        preload="none"
        onError={() => {
          setIsTrackAvailable(false)
          setIsEnabled(false)
        }}
      />

      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={!isTrackAvailable}
        onClick={() => setIsEnabled((prev) => !prev)}
        aria-label={isEnabled ? 'Turn ambient music off' : 'Turn ambient music on'}
        title={isTrackAvailable ? 'Ambient Music' : 'Add /public/audio/ambient.mp3 to enable music'}
        className="h-7 rounded-full bg-white/20 px-3 text-primary-foreground hover:bg-white/30 disabled:opacity-70"
      >
        {isEnabled ? <Music2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        <span className="text-xs">Music {isEnabled ? 'On' : 'Off'}</span>
      </Button>
    </>
  )
}
