import { useRef, useState, useEffect } from 'react';

export function useMouseVelocity(containerRef: React.RefObject<HTMLElement>) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const mouseVelocityRef = useRef<{ vx: number; vy: number; speed: number } | null>(null);
  const prevMouseRef = useRef<{ x: number; y: number; t: number } | null>(null);
  // Store a history of mouse positions for the last 500ms
  const mouseHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);

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
      // Add to history and remove old entries
      mouseHistoryRef.current.push({ ...pos, t: now });
      // Keep only last 500ms
      const cutoff = now - 100;
      while (mouseHistoryRef.current.length > 0 && mouseHistoryRef.current[0].t < cutoff) {
        mouseHistoryRef.current.shift();
      }
    };
    const handleMouseLeave = () => {
      cursorRef.current = null;
      setCursor(null);
      mouseVelocityRef.current = null;
      prevMouseRef.current = null;
      mouseHistoryRef.current = [];
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

  // Returns the average velocity vector over the last ms milliseconds
  function getRecentAverageVelocity(ms: number = 500): { vx: number; vy: number; speed: number } | null {
    const history = mouseHistoryRef.current;
    if (history.length < 2) return null;
    const now = performance.now();
    // Find the oldest point within the window
    let i = history.length - 1;
    while (i > 0 && now - history[i].t < ms) {
      i--;
    }
    const start = history[i];
    const end = history[history.length - 1];
    const dt = (end.t - start.t) / 1000;
    if (dt <= 0) return null;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const vx = dx / dt;
    const vy = dy / dt;
    const speed = Math.sqrt(vx * vx + vy * vy);
    return { vx, vy, speed };
  }

  return { cursor, cursorRef, mouseVelocityRef, getRecentAverageVelocity };
} 