'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { useToast } from "@/hooks/use-toast"

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.05)
  const [isMuted, setIsMuted] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Load saved audio preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('mediaPlayer-volume')
      const savedMuted = localStorage.getItem('mediaPlayer-muted')
      
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume))
      }
      
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true')
      }
    }
  }, [])

  useEffect(() => {
    // Create audio element with preload
    audioRef.current = new Audio('/music/theme.mp3')
    audioRef.current.volume = volume
    audioRef.current.loop = true
    audioRef.current.preload = 'auto'
    
    // Apply saved muted state
    if (isMuted) {
      audioRef.current.muted = true
    }

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
            duration: 3000,
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

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Update audio muted state when isMuted state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    // Default to minimized on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMinimized(true)
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
    const newMutedState = !isMuted
    audioRef.current.muted = newMutedState
    setIsMuted(newMutedState)
    
    // Save muted state to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediaPlayer-muted', newMutedState.toString())
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return
    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)
    
    // Save volume to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediaPlayer-volume', newVolume.toString())
    }
    
    if (newVolume === 0) {
      setIsMuted(true)
      audioRef.current.muted = true
      localStorage.setItem('mediaPlayer-muted', 'true')
    } else if (isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
      localStorage.setItem('mediaPlayer-muted', 'false')
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 glass-card rounded-xl p-3 flex ${minimized ? 'items-center' : 'flex-col items-center'} gap-3 transition-all duration-200 ${minimized ? 'w-auto' : 'w-fit'}`}
      style={{ cursor: 'pointer' }}
      onClick={() => setMinimized((m) => !m)}
      tabIndex={0}
      aria-label={minimized ? 'Expand player' : 'Minimize player'}
    >
      {!minimized && (
        <span className="mb-1 text-sm font-semibold text-foreground/80 select-none text-center w-full">
          Steven Universe Theme (2013)
        </span>
      )}
      <div className={`flex items-center gap-3 ${minimized ? '' : 'w-full justify-center'}`}>
        <button
          onClick={e => { e.stopPropagation(); togglePlay(); }}
          className="glass-card rounded-lg p-2 hover:bg-white/10 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        {!minimized && (
          <>
            <button
              onClick={e => { e.stopPropagation(); toggleMute(); }}
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
                onClick={e => e.stopPropagation()}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MediaPlayer 