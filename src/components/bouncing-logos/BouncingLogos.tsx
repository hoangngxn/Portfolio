import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Logo } from './types';
import { initialLogos, GLASS_CARD_SIZE_MOBILE, GLASS_CARD_SIZE_DESKTOP, logoSpawn } from './initial-logos';
import { useMouseVelocity } from './use-mouse-velocity';

const BouncingLogos: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logos, setLogos] = useState<Logo[]>(initialLogos);
  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bouncingLogos-paused');
      return saved !== null ? saved === 'true' : false;
    }
    return false;
  });
  const { cursor, cursorRef, mouseVelocityRef } = useMouseVelocity(containerRef);
  const speedMultiplier = 1; // Slows down the overall movement
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const CURSOR_HITBOX_SIZE = 24; // px
  const GRAVITY = 0.01;

  // --- Smoothed cursor position ---
  const smoothedCursorRef = useRef<{ x: number; y: number } | null>(null);
  const SMOOTHING = 0.5; // 0 = no movement, 1 = instant snap

  // For unique logo ids
  const nextLogoIdRef = useRef(initialLogos.length);

  // Add a ref for the spawn button
  const spawnButtonRef = useRef<HTMLButtonElement>(null);

  // Save to localStorage when isPaused changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bouncingLogos-paused', isPaused.toString());
    }
  }, [isPaused]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;

    const resistance = 0.998; // friction per frame
    const bounciness = 0.998; // energy loss on collision

    const animate = () => {
      if (isPaused) return;

      // --- Smooth the cursor position ---
      if (cursorRef.current) {
        if (!smoothedCursorRef.current) {
          smoothedCursorRef.current = { ...cursorRef.current };
        } else {
          smoothedCursorRef.current.x += (cursorRef.current.x - smoothedCursorRef.current.x) * SMOOTHING;
          smoothedCursorRef.current.y += (cursorRef.current.y - smoothedCursorRef.current.y) * SMOOTHING;
        }
      } else {
        smoothedCursorRef.current = null;
      }

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

          // Cursor collision detection (using smoothed ref)
          const cursorPos = smoothedCursorRef.current;
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
              if (now - lastMouseCollision > 500) { //cooldown
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
                  vx += mouseVelocityRef.current.vx * 0.003;
                  vy += mouseVelocityRef.current.vy * 0.003;
                }
                hitCursor = true;
                newLastMouseCollision = now;
              }
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
  }, [isPaused, isMobile]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black/50">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
        {/* Pause/Resume Button */}
        <div className="group relative flex items-center">
          <button
            ref={spawnButtonRef}
            onClick={() => setIsPaused(!isPaused)}
            className="glass-card p-2 rounded-lg hover:bg-white/20 flex items-center justify-between w-26"
            title={isPaused ? "Resume Animation" : "Pause Animation"}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium text-right flex-1 ml-2">
              {isPaused ? "Paused" : "Running"}
            </span>
          </button>
        </div>
        {/* Spawn Logo Button */}
        <div className="group relative flex items-center">
          <button
            ref={spawnButtonRef}
            onClick={() => {
              setLogos(prev => {
                const id = `logo-${nextLogoIdRef.current++}`;
                let spawnX: number | undefined = undefined;
                let spawnY: number | undefined = undefined;
                if (spawnButtonRef.current && containerRef.current) {
                  const buttonRect = spawnButtonRef.current.getBoundingClientRect();
                  const containerRect = containerRef.current.getBoundingClientRect();
                  spawnX = buttonRect.left - containerRect.left + buttonRect.width / 2 - (isMobile ? 24 : 32); // center logo
                  spawnY = buttonRect.bottom - containerRect.top + 50; // 50px below button
                  // Clamp to container bounds
                  const maxX = containerRef.current.clientWidth - (isMobile ? 48 : 64);
                  const maxY = containerRef.current.clientHeight - (isMobile ? 48 : 64);
                  spawnX = Math.max(0, Math.min(spawnX, maxX));
                  spawnY = Math.max(0, Math.min(spawnY, maxY));
                }
                const newLogo = logoSpawn(isMobile, id, spawnX, spawnY);
                return [...prev, newLogo];
              });
            }}
            className="glass-card p-2 rounded-lg hover:bg-green-400/20 flex items-center justify-between w-32"
            title="Spawn Logo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-right flex-1 ml-2">
              Spawn Logo
            </span>
          </button>
        </div>
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
      {/* {smoothedCursorRef.current && (
        <div
          className="absolute border-2 border-pink-500 pointer-events-none z-50"
          style={{
            left: smoothedCursorRef.current.x - CURSOR_HITBOX_SIZE / 2,
            top: smoothedCursorRef.current.y - CURSOR_HITBOX_SIZE / 2,
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