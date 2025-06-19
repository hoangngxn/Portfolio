'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause, ChevronDown } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.05)
  const [isMuted, setIsMuted] = useState(false)
  const [minimized, setMinimized] = useState(true)
  const [showText, setShowText] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

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

    // Add play/pause event listeners to sync isPlaying state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

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
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
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

  // Handle text fade-in after expansion
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (!minimized) {
      timeout = setTimeout(() => setShowText(true), 500); // match transition duration
    } else {
      setShowText(false);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [minimized]);

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
      className={`fixed bottom-4 right-4 z-50 glass-card rounded-xl flex transition-all duration-500 ease-in-out cursor-pointer
        ${minimized ? 'items-center justify-center flex-row w-14 h-14 p-2' : 'flex-col items-center w-64 h-24 p-3 gap-3'}`}
      style={{ position: 'fixed' }}
      onMouseEnter={() => setMinimized(false)}
      onMouseLeave={() => setMinimized(true)}
    >
      {/* Title only in expanded mode, no arrow */}
      {!minimized && (
        <div className={`relative flex items-center w-full mb-1 transition-opacity duration-300 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} ease-out` }>
          <span className="text-sm font-semibold text-foreground/80 select-none text-left w-full">
            Steven Universe Theme (2013)
          </span>
        </div>
      )}
      <div className={`flex items-center gap-3 ${minimized ? 'justify-center' : 'w-full justify-center'}`}>
        <div className={
          minimized
            ? ''
            : `transition-opacity transition-transform duration-300 ease-out ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`
        } style={{ width: minimized ? '100%' : 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: minimized ? 'center' : 'flex-start' }}>
          <button
            onClick={minimized ? undefined : (e => { e.stopPropagation(); togglePlay(); })}
            className={`glass-card rounded-lg p-2 transition-colors ${minimized ? 'pointer-events-none opacity-60' : 'hover:bg-white/10'}`}
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
              <div className="w-24 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={e => handleVolumeChange([parseFloat(e.target.value)])}
                  className="w-full"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaPlayer 