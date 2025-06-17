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
    hitSoundRef.current.volume = 0.05;
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

          // Boundary checks
          if (newX <= 0 || newX >= container.clientWidth - 96) {
            newDx = -newDx;
            newX = Math.max(0, Math.min(newX, container.clientWidth - 96));
            hitWall = true;
          }
          if (newY <= 0 || newY >= container.clientHeight - 96) {
            newDy = -newDy;
            newY = Math.max(0, Math.min(newY, container.clientHeight - 96));
            hitWall = true;
          }

          // Play hit sound if wall was hit
          if (hitWall && hitSoundRef.current) {
            hitSoundRef.current.currentTime = 0; // Reset sound to start
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
          className="absolute w-24 h-24 glass-card rounded-xl opacity-80 flex items-center justify-center"
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