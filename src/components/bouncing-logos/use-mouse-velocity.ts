import { useRef, useState, useEffect } from 'react';

export function useMouseVelocity(containerRef: React.RefObject<HTMLElement>) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const mouseVelocityRef = useRef<{ vx: number; vy: number; speed: number } | null>(null);
  const prevMouseRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const now = performance.now();
      if (prevMouseRef.current) {
        const dt = (now - prevMouseRef.current.t) / 1000; // seconds
        if (dt > 0) {
          const dx = pos.x - prevMouseRef.current.x;
          const dy = pos.y - prevMouseRef.current.y;
          const vx = dx / dt;
          const vy = dy / dt;
          const speed = Math.sqrt(vx * vx + vy * vy);
          mouseVelocityRef.current = { vx, vy, speed };
        }
      }
      prevMouseRef.current = { ...pos, t: now };
      cursorRef.current = pos;
      setCursor(pos);
    };
    const handleMouseLeave = () => {
      cursorRef.current = null;
      setCursor(null);
      mouseVelocityRef.current = null;
      prevMouseRef.current = null;
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef]);

  return { cursor, cursorRef, mouseVelocityRef };
} 