import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Logo } from './types';
import { initialLogos, GLASS_CARD_SIZE_MOBILE, GLASS_CARD_SIZE_DESKTOP, logoSpawn } from './initial-logos';
import { useMouseVelocity } from './use-mouse-velocity';
import Matter from 'matter-js';
import { Settings, SquarePlus, SquareMinus } from 'lucide-react';

// =============================
// Bouncing Logos Custom Settings
// =============================

// Logo card sizes (in px)
const CARD_SIZE_MOBILE = 48;
const CARD_SIZE_DESKTOP = 64;

// Throw/Grab settings
const THROW_SCALE = 0.005; // How much of the mouse velocity to apply to the throw
const THROW_AVG_WINDOW = 100; // ms, time window for averaging mouse velocity

// Smoothing for grab follow
const GRAB_SMOOTHING = 0.4; // 0 = no movement, 1 = instant snap

// Z-index for grabbed logo
const GRABBED_Z_INDEX = 50;

// Box shadow for grabbed logo
const GRABBED_BOX_SHADOW = '0 0 0 2px #fff8';

// Default physics settings (can be changed by user)
const DEFAULT_GRAVITY_Y = 0;
const DEFAULT_RESTITUTION = 1.01;
const DEFAULT_FRICTION_AIR = 0;

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
  const { cursor, cursorRef, mouseVelocityRef, getRecentAverageVelocity } = useMouseVelocity(containerRef);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // For unique logo ids
  const nextLogoIdRef = useRef(initialLogos.length);

  // Add a ref for the spawn button
  const spawnButtonRef = useRef<HTMLButtonElement>(null);

  // --- Matter.js engine/world/bodies ---
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<{ [id: string]: Matter.Body }>({});
  const runnerRef = useRef<Matter.Runner | null>(null);

  // --- Grab and throw state ---
  const [grabbedLogoId, setGrabbedLogoId] = useState<string | null>(null);
  const grabOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const isMouseDownRef = useRef(false);

  // Physics settings state
  const [gravityY, setGravityY] = useState(DEFAULT_GRAVITY_Y);
  const [restitution, setRestitution] = useState(DEFAULT_RESTITUTION);
  const [frictionAir, setFrictionAir] = useState(DEFAULT_FRICTION_AIR);
  // For settings panel UI
  const [settingsOpen, setSettingsOpen] = useState(false);

  // For delayed collapse of settings panel
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage when isPaused changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bouncingLogos-paused', isPaused.toString());
    }
  }, [isPaused]);

  // Update physics settings on all bodies and engine when changed
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gravity.y = gravityY;
    }
    // Update all logo bodies
    Object.values(bodiesRef.current).forEach(body => {
      body.restitution = restitution;
      body.frictionAir = frictionAir;
    });
  }, [gravityY, restitution, frictionAir]);
  
  // Initialize Matter.js engine/world and create bodies for logos
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create engine and world
    const engine = Matter.Engine.create();
    engine.gravity.y = gravityY;
    engineRef.current = engine;

    // Create walls
    const wallThickness = 100;
    const cardSizePx = isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP;
    const walls = [
      // top
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }),
      // bottom
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }),
      // left
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
      // right
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true })
    ];
    Matter.World.add(engine.world, walls);

    // Create bodies for each logo
    const bodies: { [id: string]: Matter.Body } = {};
    logos.forEach(logo => {
      const body = Matter.Bodies.circle(
        logo.x + cardSizePx / 2,
        logo.y + cardSizePx / 2,
        cardSizePx / 2,
        {
          restitution,
          frictionAir,
          label: logo.id,
        }
      );
      // Set initial velocity from logo vector
      const vx = Math.cos(logo.direction) * logo.speed;
      const vy = Math.sin(logo.direction) * logo.speed;
      Matter.Body.setVelocity(body, { x: vx, y: vy });
      bodies[logo.id] = body;
      Matter.World.add(engine.world, body);
    });
    bodiesRef.current = bodies;

    // Start the engine runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    if (!isPaused) Matter.Runner.run(runner, engine);

    // Animation loop: sync Matter.js body positions to React state
    let frameId: number;
    const sync = () => {
      setLogos(prev => {
        const cardSizePx = isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP;
        const width = container.clientWidth;
        const height = container.clientHeight;
        // Only keep logos whose center is within the container bounds
        return prev.filter(logo => {
          const body = bodiesRef.current[logo.id];
          if (!body) return false;
          const cx = body.position.x;
          const cy = body.position.y;
          // Despawn if fully outside the screen (with a margin of half the card size)
          if (
            cx < -cardSizePx / 2 ||
            cx > width + cardSizePx / 2 ||
            cy < -cardSizePx / 2 ||
            cy > height + cardSizePx / 2
          ) {
            // Remove body from Matter.js world
            Matter.World.remove(engine.world, body);
            delete bodiesRef.current[logo.id];
            return false;
          }
          // Otherwise, update position
          logo.x = body.position.x - cardSizePx / 2;
          logo.y = body.position.y - cardSizePx / 2;
          return true;
        });
      });
      frameId = requestAnimationFrame(sync);
    };
    sync();

    return () => {
      cancelAnimationFrame(frameId);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      runnerRef.current = null;
      bodiesRef.current = {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, isMobile]);

  // Pause/resume Matter.js runner
  useEffect(() => {
    if (runnerRef.current && engineRef.current) {
      if (isPaused) {
        Matter.Runner.stop(runnerRef.current);
      } else {
        Matter.Runner.run(runnerRef.current, engineRef.current);
      }
    }
  }, [isPaused]);

  // Handle grab and throw
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cardSizePx = isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP;

    function getLogoAtPos(x: number, y: number) {
      for (let i = logos.length - 1; i >= 0; i--) {
        const logo = logos[i];
        const cx = logo.x + cardSizePx / 2;
        const cy = logo.y + cardSizePx / 2;
        const dx = x - cx;
        const dy = y - cy;
        if (Math.sqrt(dx * dx + dy * dy) <= cardSizePx / 2) {
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
        grabOffsetRef.current = { x: x - (logo.x + cardSizePx / 2), y: y - (logo.y + cardSizePx / 2) };
        isMouseDownRef.current = true;
        // Make body static while grabbed
        const body = bodiesRef.current[logo.id];
        if (body) {
          Matter.Body.setStatic(body, true);
        }
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
      if (grabbedLogoId && grabOffsetRef.current) {
        const body = bodiesRef.current[grabbedLogoId];
        if (body) {
          Matter.Body.setPosition(body, {
            x: x - grabOffsetRef.current.x,
            y: y - grabOffsetRef.current.y,
          });
        }
      }
    }

    function handlePointerUp(e: MouseEvent | TouchEvent) {
      if (!grabbedLogoId) return;
      // On release, set velocity based on average mouse velocity over last THROW_AVG_WINDOW ms
      const body = bodiesRef.current[grabbedLogoId];
      if (body) {
        const avg = getRecentAverageVelocity ? getRecentAverageVelocity(THROW_AVG_WINDOW) : null;
        const v = avg || mouseVelocityRef.current;
        if (v) {
          Matter.Body.setStatic(body, false);
          Matter.Body.setVelocity(body, { x: v.vx * THROW_SCALE, y: v.vy * THROW_SCALE });
        } else {
          Matter.Body.setStatic(body, false);
        }
      }
      setGrabbedLogoId(null);
      grabOffsetRef.current = null;
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
  }, [containerRef, logos, grabbedLogoId, isPaused, isMobile, getRecentAverageVelocity, mouseVelocityRef]);

  // Handle spawn logo
  function handleSpawnLogo() {
    setLogos(prev => {
      const id = `logo-${nextLogoIdRef.current++}`;
      let spawnX: number | undefined = undefined;
      let spawnY: number | undefined = undefined;
      if (spawnButtonRef.current && containerRef.current) {
        const buttonRect = spawnButtonRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        spawnX = buttonRect.left - containerRect.left + buttonRect.width / 2 - (isMobile ? CARD_SIZE_MOBILE / 2 : CARD_SIZE_DESKTOP / 2);
        spawnY = buttonRect.bottom - containerRect.top + 50;
        // Clamp to container bounds
        const maxX = containerRef.current.clientWidth - (isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP);
        const maxY = containerRef.current.clientHeight - (isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP);
        spawnX = Math.max(0, Math.min(spawnX, maxX));
        spawnY = Math.max(0, Math.min(spawnY, maxY));
      }
      const newLogo = logoSpawn(isMobile, id, spawnX, spawnY);
      // Add Matter.js body for new logo
      if (engineRef.current && bodiesRef.current) {
        const cardSizePx = isMobile ? CARD_SIZE_MOBILE : CARD_SIZE_DESKTOP;
        const body = Matter.Bodies.circle(
          newLogo.x + cardSizePx / 2,
          newLogo.y + cardSizePx / 2,
          cardSizePx / 2,
          {
            restitution,
            frictionAir,
            label: newLogo.id,
          }
        );
        // Set initial velocity from logo vector
        const vx = Math.cos(newLogo.direction) * newLogo.speed;
        const vy = Math.sin(newLogo.direction) * newLogo.speed;
        Matter.Body.setVelocity(body, { x: vx, y: vy });
        bodiesRef.current[newLogo.id] = body;
        Matter.World.add(engineRef.current.world, body);
      }
      return [...prev, newLogo];
    });
  }

  // Despawn all logos and remove their bodies from the world
  function handleDespawnAll() {
    setLogos([]);
    if (engineRef.current && bodiesRef.current) {
      Object.values(bodiesRef.current).forEach(body => {
        Matter.World.remove(engineRef.current!.world, body);
      });
      bodiesRef.current = {};
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black/50">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto z-50">
        {/* Settings Panel (Cogwheel Icon, expanding button) */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => {
            if (collapseTimeoutRef.current) {
              clearTimeout(collapseTimeoutRef.current);
              collapseTimeoutRef.current = null;
            }
            setSettingsOpen(true);
          }}
          onMouseLeave={() => {
            if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
            collapseTimeoutRef.current = setTimeout(() => {
              setSettingsOpen(false);
            }, 300);
          }}
        >
          <button
            className="glass-card p-2 rounded-lg hover:bg-yellow-100/40 flex items-center justify-center w-10 h-10"
            title="Physics Settings"
            style={{ boxShadow: '0 2px 16px 0 #0002', cursor: 'pointer', zIndex: 20 }}
          >
            <Settings className="w-6 h-6 flex-shrink-0" />
          </button>
          {/* Expandable settings panel, absolutely positioned to the left of the button */}
          <div
            className={`absolute top-0 right-full mr-2 z-50 transition-all duration-500 ${settingsOpen ? 'w-64 h-64 opacity-100' : 'w-0 h-0 opacity-0 pointer-events-none'} glass-card rounded-xl flex flex-col items-start justify-start overflow-hidden`}
            style={{ boxShadow: '0 2px 16px 0 #0002' }}
          >
            {settingsOpen && (
              <div className="flex flex-col gap-3 w-full h-full justify-center p-3">
                <div className="flex items-center gap-2 py-1">
                  <span className="font-semibold text-base">Physics</span>
                </div>
                <label className="flex flex-col text-xs font-medium w-full">
                  Gravity <span className="text-xs text-gray-500">{gravityY.toFixed(2)}</span>
                  <input type="range" min={0} max={1} step={0.01} value={gravityY} onChange={e => setGravityY(Number(e.target.value))} className="w-full" />
                </label>
                <label className="flex flex-col text-xs font-medium w-full">
                  Restitution (Bounciness) <span className="text-xs text-gray-500">{restitution.toFixed(2)}</span>
                  <input type="range" min={0} max={1.5} step={0.01} value={restitution} onChange={e => setRestitution(Number(e.target.value))} className="w-full" />
                </label>
                <label className="flex flex-col text-xs font-medium w-full">
                  Friction Air (Air Resistance) <span className="text-xs text-gray-500">{frictionAir.toFixed(2)}</span>
                  <input type="range" min={0} max={1} step={0.01} value={frictionAir} onChange={e => setFrictionAir(Number(e.target.value))} className="w-full" />
                </label>
              </div>
            )}
          </div>
        </div>
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
        {/* Spawn/Despawn Buttons */}
        <div className="group relative flex items-center gap-2">
          <button
            onClick={handleSpawnLogo}
            className="glass-card p-2 rounded-lg hover:bg-green-400/20 flex items-center justify-between w-32"
            title="Spawn Logo"
          >
            <SquarePlus className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium text-right flex-1 ml-2">
              Spawn Ball
            </span>
          </button>
          <button
            onClick={handleDespawnAll}
            className="glass-card p-2 rounded-lg hover:bg-red-400/20 flex items-center justify-between w-32"
            title="Despawn All Logos"
          >
            <SquareMinus className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium text-right flex-1 ml-2">
              Despawn All
            </span>
          </button>
        </div>
      </div>

      {logos.map((logo) => (
        <div
          key={logo.id}
          id={logo.id}
          className={`absolute glass-card rounded-full opacity-80 flex items-center justify-center ${isMobile ? GLASS_CARD_SIZE_MOBILE : GLASS_CARD_SIZE_DESKTOP} pointer-events-auto`}
          style={{
            transform: `translate(${logo.x}px, ${logo.y}px)`,
            transition: 'transform 16ms linear',
            zIndex: logo.id === grabbedLogoId ? GRABBED_Z_INDEX : undefined,
            boxShadow: logo.id === grabbedLogoId ? GRABBED_BOX_SHADOW : undefined,
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