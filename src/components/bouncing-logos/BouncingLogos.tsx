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
  const GRAVITY = 0;

  // --- Smoothed cursor position for grab only ---
  const SMOOTHING = 0.3; // 0 = no movement, 1 = instant snap

  // --- Grab and throw state ---
  const [grabbedLogoId, setGrabbedLogoId] = useState<string | null>(null);
  const grabOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const smoothedGrabPosRef = useRef<{ x: number; y: number } | null>(null);
  const isMouseDownRef = useRef(false);

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

  // Mouse event handlers for grab/throw
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardSizePx = isMobile ? 48 : 64;

    function getLogoAtPos(x: number, y: number) {
      // Find topmost logo under the mouse
      for (let i = logos.length - 1; i >= 0; i--) {
        const logo = logos[i];
        if (
          x >= logo.x &&
          x <= logo.x + cardSizePx &&
          y >= logo.y &&
          y <= logo.y + cardSizePx
        ) {
          return logo;
        }
      }
      return null;
    }

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (isPaused) return;
      let clientX: number, clientY: number;
      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const logo = getLogoAtPos(x, y);
      if (logo) {
        setGrabbedLogoId(logo.id);
        grabOffsetRef.current = { x: x - logo.x, y: y - logo.y };
        smoothedGrabPosRef.current = { x: logo.x, y: logo.y };
        isMouseDownRef.current = true;
        e.preventDefault();
      }
    }

    function handlePointerMove(e: MouseEvent | TouchEvent) {
      if (!grabbedLogoId || !isMouseDownRef.current) return;
      let clientX: number, clientY: number;
      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (grabOffsetRef.current && smoothedGrabPosRef.current) {
        // Smoothly follow mouse
        smoothedGrabPosRef.current.x += ((x - grabOffsetRef.current.x) - smoothedGrabPosRef.current.x) * 0.4;
        smoothedGrabPosRef.current.y += ((y - grabOffsetRef.current.y) - smoothedGrabPosRef.current.y) * 0.4;
      }
    }

    function handlePointerUp(e: MouseEvent | TouchEvent) {
      if (!grabbedLogoId) return;
      // On release, set velocity based on mouse velocity
      setLogos(prev => prev.map(logo => {
        if (logo.id === grabbedLogoId && mouseVelocityRef.current) {
          const scale = 0.005; // tune for feel
          const vx = mouseVelocityRef.current.vx * scale;
          const vy = mouseVelocityRef.current.vy * scale;
          const speed = Math.sqrt(vx * vx + vy * vy);
          const direction = Math.atan2(vy, vx);
          return { ...logo, speed, direction };
        }
        return logo;
      }));
      setGrabbedLogoId(null);
      grabOffsetRef.current = null;
      smoothedGrabPosRef.current = null;
      isMouseDownRef.current = false;
    }

    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    // Touch events
    container.addEventListener('touchstart', handlePointerDown, { passive: false });
    container.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      container.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [containerRef, logos, grabbedLogoId, isPaused, isMobile]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationFrameId: number;

    const resistance = 0.998; // friction per frame
    const bounciness = 0.998; // energy loss on collision

    const animate = () => {
      if (isPaused) return;

      setLogos(prevLogos => {
        let updated = prevLogos.map(logo => {
          // If grabbed, follow smoothed grab pos and do not add extra properties
          if (logo.id === grabbedLogoId && smoothedGrabPosRef.current) {
            return {
              ...logo,
              x: smoothedGrabPosRef.current.x,
              y: smoothedGrabPosRef.current.y,
              speed: 0,
              direction: logo.direction,
            };
          } else if (logo.id === grabbedLogoId) {
            // If grabbed but no smoothed pos, just return as-is
            return logo;
          }
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

        // Split updated into grabbed and non-grabbed
        const grabbed = updated.filter(l => l.id === grabbedLogoId);
        type LogoWithPhysics = Logo & {
          _vx: number;
          _vy: number;
          _newX: number;
          _newY: number;
          _hitWall: boolean;
          _hitCursor: boolean;
          _lastMouseCollision: number;
          _lastWallCollision: number;
        };
        let nonGrabbed = updated.filter(l => l.id !== grabbedLogoId) as LogoWithPhysics[];

        // Logo-to-logo collision (AABB, only process each pair once)
        const cardSizePx = isMobile ? 48 : 64;
        for (let i = 0; i < nonGrabbed.length - 1; i++) {
          for (let j = i + 1; j < nonGrabbed.length; j++) {
            const a = nonGrabbed[i];
            const b = nonGrabbed[j];
            if (
              a._newX < b._newX + cardSizePx &&
              a._newX + cardSizePx > b._newX &&
              a._newY < b._newY + cardSizePx &&
              a._newY + cardSizePx > b._newY
            ) {
              // Swap velocities (arcade style)
              const tempVx = a._vx;
              const tempVy = a._vy;
              nonGrabbed[i]._vx = b._vx;
              nonGrabbed[i]._vy = b._vy;
              nonGrabbed[j]._vx = tempVx;
              nonGrabbed[j]._vy = tempVy;
              // Separate them so they don't stick
              // Move each logo away from the other by half the overlap
              const overlapX = Math.min(a._newX + cardSizePx, b._newX + cardSizePx) - Math.max(a._newX, b._newX);
              const overlapY = Math.min(a._newY + cardSizePx, b._newY + cardSizePx) - Math.max(a._newY, b._newY);
              if (overlapX < overlapY) {
                if (a._newX < b._newX) {
                  nonGrabbed[i]._newX -= overlapX / 2;
                  nonGrabbed[j]._newX += overlapX / 2;
                } else {
                  nonGrabbed[i]._newX += overlapX / 2;
                  nonGrabbed[j]._newX -= overlapX / 2;
                }
              } else {
                if (a._newY < b._newY) {
                  nonGrabbed[i]._newY -= overlapY / 2;
                  nonGrabbed[j]._newY += overlapY / 2;
                } else {
                  nonGrabbed[i]._newY += overlapY / 2;
                  nonGrabbed[j]._newY -= overlapY / 2;
                }
              }
            }
          }
        }

        // Now process wall collisions and convert back to speed/direction
        nonGrabbed = nonGrabbed.map((logo, idx) => {
          let { _vx: vx, _vy: vy, _newX: newX, _newY: newY, _lastWallCollision: lastWallCollision } = logo;
          let hitWall = false;
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
            lastWallCollision: newLastWallCollision
          };
        });

        // Merge grabbed and non-grabbed for final state
        return [...nonGrabbed, ...grabbed];
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isMobile, grabbedLogoId]);

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
          className={`absolute glass-card rounded-xl opacity-80 flex items-center justify-center ${isMobile ? GLASS_CARD_SIZE_MOBILE : GLASS_CARD_SIZE_DESKTOP} pointer-events-auto`}
          style={{
            transform: `translate(${logo.x}px, ${logo.y}px)`,
            transition: 'transform 16ms linear',
            zIndex: logo.id === grabbedLogoId ? 50 : undefined,
            boxShadow: logo.id === grabbedLogoId ? '0 0 0 2px #fff8' : undefined,
            cursor: grabbedLogoId === logo.id ? 'grabbing' : 'grab',
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
      {/* (No cursor hitbox needed) */}
    </div>
  );
};

export default BouncingLogos; 