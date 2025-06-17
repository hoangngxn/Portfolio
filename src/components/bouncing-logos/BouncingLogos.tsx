import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Logo } from './types';
import { initialLogos } from './initial-logos';

const BouncingLogos: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const [logos, setLogos] = useState<Logo[]>(initialLogos);
  const speedMultiplier = 1; // Slows down the overall movement

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
      setLogos(prevLogos => {
        return prevLogos.map(logo => {
          let newX = logo.x + logo.dx * speedMultiplier;
          let newY = logo.y + logo.dy * speedMultiplier;
          let newDx = logo.dx;
          let newDy = logo.dy;
          let hitWall = false;

          // Get the current logo size based on screen width
          const isMobile = window.innerWidth < 768;
          const logoSize = isMobile ? 48 : 96; // 48px for mobile, 96px for desktop

          // Boundary checks with responsive size
          if (newX <= 0 || newX >= container.clientWidth - logoSize) {
            newDx = -newDx;
            newX = Math.max(0, Math.min(newX, container.clientWidth - logoSize));
            hitWall = true;
          }
          if (newY <= 0 || newY >= container.clientHeight - logoSize) {
            newDy = -newDy;
            newY = Math.max(0, Math.min(newY, container.clientHeight - logoSize));
            hitWall = true;
          }

          // Play hit sound if wall was hit
          if (hitWall && hitSoundRef.current) {
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
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none bg-black/50">
      {logos.map((logo) => (
        <div
          key={logo.id}
          id={logo.id}
          className="absolute glass-card rounded-xl opacity-80 flex items-center justify-center
            w-12 h-12 md:w-24 md:h-24" // Responsive size: 48px on mobile, 96px on desktop
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
            className="w-8 h-8 md:w-14 md:h-14" // Responsive image size
          />
        </div>
      ))}
    </div>
  );
};

export default BouncingLogos; 