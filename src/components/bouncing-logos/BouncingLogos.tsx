import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Logo } from './types';
import { initialLogos, GLASS_CARD_SIZE_MOBILE, GLASS_CARD_SIZE_DESKTOP} from './initial-logos';

const BouncingLogos: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const [logos, setLogos] = useState<Logo[]>(initialLogos);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const speedMultiplier = 1; // Slows down the overall movement
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPaused = localStorage.getItem('bouncingLogos-paused');
      const savedMuted = localStorage.getItem('bouncingLogos-muted');
      if (savedPaused !== null) setIsPaused(savedPaused === 'true');
      if (savedMuted !== null) setIsMuted(savedMuted === 'true');
    }
  }, []);

  // Save to localStorage when isPaused or isMuted changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bouncingLogos-paused', isPaused.toString());
      localStorage.setItem('bouncingLogos-muted', isMuted.toString());
    }
  }, [isPaused, isMuted]);

  useEffect(() => {
    // Initialize hit sound
    hitSoundRef.current = new Audio('/music/hitsound.mp3');
    hitSoundRef.current.volume = 0.03;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;

    const animate = () => {
      if (isPaused) return;

      setLogos(prevLogos => {
        return prevLogos.map(logo => {
          let newX = logo.x + logo.dx * speedMultiplier;
          let newY = logo.y + logo.dy * speedMultiplier;
          let newDx = logo.dx;
          let newDy = logo.dy;
          let hitWall = false;

          // Get the current glass-card size based on screen width
          const cardSizePx = isMobile ? 48 : 64;

          // Boundary checks with responsive size
          if (newX <= 0 || newX >= container.clientWidth - cardSizePx) {
            newDx = -newDx;
            newX = Math.max(0, Math.min(newX, container.clientWidth - cardSizePx));
            hitWall = true;
          }
          if (newY <= 0 || newY >= container.clientHeight - cardSizePx) {
            newDy = -newDy;
            newY = Math.max(0, Math.min(newY, container.clientHeight - cardSizePx));
            hitWall = true;
          }

          // Play hit sound if wall was hit and not muted
          if (hitWall && hitSoundRef.current && !isMuted) {
            hitSoundRef.current.currentTime = 0;
            hitSoundRef.current.play().catch(err => console.log('Error playing sound:', err));
          }

          return {
            ...logo,
            x: newX,
            y: newY,
            dx: newDx,
            dy: newDy
          };
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isMuted]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none bg-black/50">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="glass-card p-2 rounded-lg hover:bg-white/20 transition-colors"
          title={isPaused ? "Resume Animation" : "Pause Animation"}
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="glass-card p-2 rounded-lg hover:bg-white/20 transition-colors"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {logos.map((logo) => (
        <div
          key={logo.id}
          id={logo.id}
          className={`absolute glass-card rounded-xl opacity-80 flex items-center justify-center ${isMobile ? GLASS_CARD_SIZE_MOBILE : GLASS_CARD_SIZE_DESKTOP}`}
          style={{
            transform: `translate(${logo.x}px, ${logo.y}px)`,
            transition: 'transform 16ms linear'
          }}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={logo.className}
          />
        </div>
      ))}
    </div>
  );
};

export default BouncingLogos; 