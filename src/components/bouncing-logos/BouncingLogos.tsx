import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Logo } from './types';
import { initialLogos, GLASS_CARD_SIZE_MOBILE, GLASS_CARD_SIZE_DESKTOP} from './initial-logos';
import { useMouseVelocity } from './use-mouse-velocity';

const BouncingLogos: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const [logos, setLogos] = useState<Logo[]>(initialLogos);
  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bouncingLogos-paused');
      return saved !== null ? saved === 'true' : false;
    }
    return false;
  });
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bouncingLogos-muted');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const { cursor, cursorRef, mouseVelocityRef } = useMouseVelocity(containerRef);
  const speedMultiplier = 1; // Slows down the overall movement
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const CURSOR_HITBOX_SIZE = 24; // px
  const GRAVITY = 0.01;

  // Save to localStorage when isPaused or isMuted changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bouncingLogos-paused', isPaused.toString());
      localStorage.setItem('bouncingLogos-muted', isMuted.toString());
    }
  }, [isPaused, isMuted]);

  useEffect(() => {
    // Initialize hit sound only if not muted
    if (!isMuted && !hitSoundRef.current) {
      hitSoundRef.current = new Audio('/music/hitsound.mp3');
      hitSoundRef.current.volume = 0.03;
    } else if (isMuted && hitSoundRef.current) {
      hitSoundRef.current = null;
    }
  }, [isMuted]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;

    const resistance = 0.998; // friction per frame
    const bounciness = 0.998; // energy loss on collision

    const animate = () => {
      if (isPaused) return;

      setLogos(prevLogos => {
        // First, update all positions and velocities
        let updated = prevLogos.map(logo => {
          let vx = Math.cos(logo.direction) * logo.speed * speedMultiplier;
          let vy = Math.sin(logo.direction) * logo.speed * speedMultiplier;
          vy += GRAVITY;
          return {
            ...logo,
            _vx: vx,
            _vy: vy,
            _newX: logo.x + vx,
            _newY: logo.y + vy,
            _hitWall: false,
            _hitCursor: false,
            _lastMouseCollision: (logo as any).lastMouseCollision || 0,
            _lastWallCollision: (logo as any).lastWallCollision || 0
          };
        });

        // Logo-to-logo collision (AABB, only process each pair once)
        const cardSizePx = isMobile ? 48 : 64;
        for (let i = 0; i < updated.length - 1; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];
            if (
              a._newX < b._newX + cardSizePx &&
              a._newX + cardSizePx > b._newX &&
              a._newY < b._newY + cardSizePx &&
              a._newY + cardSizePx > b._newY
            ) {
              // Swap velocities (arcade style)
              const tempVx = a._vx;
              const tempVy = a._vy;
              updated[i]._vx = b._vx;
              updated[i]._vy = b._vy;
              updated[j]._vx = tempVx;
              updated[j]._vy = tempVy;
              // Separate them so they don't stick
              // Move each logo away from the other by half the overlap
              const overlapX = Math.min(a._newX + cardSizePx, b._newX + cardSizePx) - Math.max(a._newX, b._newX);
              const overlapY = Math.min(a._newY + cardSizePx, b._newY + cardSizePx) - Math.max(a._newY, b._newY);
              if (overlapX < overlapY) {
                // Separate in X
                if (a._newX < b._newX) {
                  updated[i]._newX -= overlapX / 2;
                  updated[j]._newX += overlapX / 2;
                } else {
                  updated[i]._newX += overlapX / 2;
                  updated[j]._newX -= overlapX / 2;
                }
              } else {
                // Separate in Y
                if (a._newY < b._newY) {
                  updated[i]._newY -= overlapY / 2;
                  updated[j]._newY += overlapY / 2;
                } else {
                  updated[i]._newY += overlapY / 2;
                  updated[j]._newY -= overlapY / 2;
                }
              }
            }
          }
        }

        // Now process wall/cursor collisions and convert back to speed/direction
        return updated.map((logo, idx) => {
          let { _vx: vx, _vy: vy, _newX: newX, _newY: newY, _lastMouseCollision: lastMouseCollision, _lastWallCollision: lastWallCollision } = logo;
          let hitWall = false;
          let hitCursor = false;
          let newLastMouseCollision = lastMouseCollision;
          let newLastWallCollision = lastWallCollision;

          // Boundary checks with responsive size
          if (newX <= 0 || newX >= container.clientWidth - cardSizePx) {
            vx = -vx * bounciness;
            newX = Math.max(0, Math.min(newX, container.clientWidth - cardSizePx));
            hitWall = true;
            newLastWallCollision = performance.now();
          }
          if (newY <= 0 || newY >= container.clientHeight - cardSizePx) {
            vy = -vy * bounciness;
            newY = Math.max(0, Math.min(newY, container.clientHeight - cardSizePx));
            hitWall = true;
            newLastWallCollision = performance.now();
          }

          // Cursor collision detection (using ref)
          const cursorPos = cursorRef.current;
          if (cursorPos) {
            const logoLeft = newX;
            const logoRight = newX + cardSizePx;
            const logoTop = newY;
            const logoBottom = newY + cardSizePx;
            const cursorLeft = cursorPos.x - CURSOR_HITBOX_SIZE / 2;
            const cursorRight = cursorPos.x + CURSOR_HITBOX_SIZE / 2;
            const cursorTop = cursorPos.y - CURSOR_HITBOX_SIZE / 2;
            const cursorBottom = cursorPos.y + CURSOR_HITBOX_SIZE / 2;
            // Check for overlap
            if (
              logoRight > cursorLeft &&
              logoLeft < cursorRight &&
              logoBottom > cursorTop &&
              logoTop < cursorBottom
            ) {
              // Only allow collision if cooldown has passed
              const now = performance.now();
              if (now - lastMouseCollision > 100) {
                const overlapX = Math.min(logoRight, cursorRight) - Math.max(logoLeft, cursorLeft);
                const overlapY = Math.min(logoBottom, cursorBottom) - Math.max(logoTop, cursorTop);
                if (overlapX < overlapY) {
                  vx = -vx * bounciness;
                  if (logoLeft < cursorLeft) {
                    newX = cursorLeft - cardSizePx;
                  } else {
                    newX = cursorRight;
                  }
                } else {
                  vy = -vy * bounciness;
                  if (logoTop < cursorTop) {
                    newY = cursorTop - cardSizePx;
                  } else {
                    newY = cursorBottom;
                  }
                }
                if (mouseVelocityRef.current) {
                  vx += mouseVelocityRef.current.vx * 0.005;
                  vy += mouseVelocityRef.current.vy * 0.005;
                }
                hitCursor = true;
                newLastMouseCollision = now;
              }
            }
          }

          // Play hit sound if wall or cursor was hit and not muted
          if ((hitWall || hitCursor) && hitSoundRef.current && !isMuted) {
            const now = performance.now();
            const canPlayWallSound = !hitWall || (now - lastWallCollision > 200);
            const canPlayCursorSound = !hitCursor || (now - lastMouseCollision > 100);
            
            // Only play sound if logo has meaningful velocity (not stationary)
            const velocity = Math.sqrt(vx * vx + vy * vy);
            const hasMeaningfulMovement = velocity > 0.1; // Threshold for "moving"
            
            if (canPlayWallSound && canPlayCursorSound && hasMeaningfulMovement) {
              hitSoundRef.current.currentTime = 0;
              hitSoundRef.current.play().catch(err => console.log('Error playing sound:', err));
            }
          }

          // Apply resistance (friction)
          vx *= resistance;
          vy *= resistance;

          // Convert velocity vector back to speed/direction
          const newSpeed = Math.sqrt(vx * vx + vy * vy);
          const newDirection = Math.atan2(vy, vx);

          return {
            ...logo,
            x: newX,
            y: newY,
            speed: newSpeed,
            direction: newDirection,
            lastMouseCollision: newLastMouseCollision,
            lastWallCollision: newLastWallCollision
          };
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isMuted, isMobile]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black/50">
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
          className={`absolute glass-card rounded-xl opacity-80 flex items-center justify-center ${isMobile ? GLASS_CARD_SIZE_MOBILE : GLASS_CARD_SIZE_DESKTOP} pointer-events-none`}
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
      {/* Draw cursor hitbox for debugging/visual feedback */}
      {/* {cursor && (
        <div
          className="absolute border-2 border-pink-500 pointer-events-none z-50"
          style={{
            left: cursor.x - CURSOR_HITBOX_SIZE / 2,
            top: cursor.y - CURSOR_HITBOX_SIZE / 2,
            width: CURSOR_HITBOX_SIZE,
            height: CURSOR_HITBOX_SIZE,
            borderRadius: 8,
            boxSizing: 'border-box',
            background: 'rgba(255,0,128,0.08)'
          }}
        />
      )} */}
    </div>
  );
};

export default BouncingLogos; 