'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { useToast } from "@/hooks/use-toast"

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Create audio element with preload
    audioRef.current = new Audio('/music/theme.mp3')
    audioRef.current.volume = volume
    audioRef.current.loop = true
    audioRef.current.preload = 'auto'

    // Try multiple autoplay strategies
    const attemptAutoplay = async () => {
      try {
        // Strategy 1: Direct play
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.log('First autoplay attempt failed:', error)
        
        try {
          // Strategy 2: Play with user interaction simulation
          document.addEventListener('click', async () => {
            try {
              await audioRef.current?.play()
              setIsPlaying(true)
              document.removeEventListener('click', () => {})
            } catch (error) {
              console.log('Click-based autoplay failed:', error)
            }
          }, { once: true })

          // Strategy 3: Try playing after a short delay
          setTimeout(async () => {
            try {
              await audioRef.current?.play()
              setIsPlaying(true)
            } catch (error) {
              console.log('Delayed autoplay failed:', error)
            }
          }, 1000)
        } catch (error) {
          console.log('Secondary autoplay attempts failed:', error)
          toast({
            title: "Music Autoplay Blocked",
            description: "Click the play button to start the music",
            duration: 5000,
          })
        }
      }
    }

    attemptAutoplay()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => {
        console.log('Error playing audio:', err)
        toast({
          title: "Error Playing Music",
          description: "Please try again",
          duration: 3000,
        })
      })
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return
    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
      audioRef.current.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card rounded-xl p-3 flex items-center gap-3">
      <button
        onClick={togglePlay}
        className="glass-card rounded-lg p-2 hover:bg-white/10 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      
      <button
        onClick={toggleMute}
        className="glass-card rounded-lg p-2 hover:bg-white/10 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div className="w-24">
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          step={0.01}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default MediaPlayer 