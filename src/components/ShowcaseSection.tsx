"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Code2, Play, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

// Dynamically import the FlappyBird component to avoid SSR issues
const FlappyBird = dynamic(() => import('@/app/flappy-bird/page'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="glass-card rounded-lg p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  )
});

// Wrapper component to scale the game properly
const ScaledFlappyBird: React.FC = () => {
  const [scale, setScale] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 1;
    }
    return 0.65;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Game canvas dimensions
        const gameWidth = 432;
        const gameHeight = 768;
        
        // Calculate scale to fit both width and height
        const scaleX = containerWidth / gameWidth;
        const scaleY = containerHeight / gameHeight;
        
        // Use a different scale for mobile and desktop
        const isMobile = window.innerWidth < 768;
        const scaleFactor = isMobile ? 0.9 : 0.8;
        const optimalScale = Math.min(scaleX, scaleY) * scaleFactor;
        
        setScale(optimalScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl overflow-hidden"
    >
      <div className="relative" style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'center center',
        width: '432px',
        height: '768px'
      }}>
        <FlappyBird />
      </div>
    </div>
  );
};

const ShowcaseSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const isMobile = useIsMobile();

  // FLIP animation state for info card (desktop only)
  const infoCardRef = useRef<HTMLDivElement>(null);
  const [flipStyle, setFlipStyle] = useState<React.CSSProperties>({});
  const [isFlipping, setIsFlipping] = useState(false);

  const handleVideoClick = () => {
    if (!isMobile && infoCardRef.current) {
      // FLIP: First - get initial position
      const firstRect = infoCardRef.current.getBoundingClientRect();
      setTransitioning(true);
      setTimeout(() => {
        setShowGame(true);
        setTimeout(() => {
          // FLIP: Last - get new position
          if (infoCardRef.current) {
            const lastRect = infoCardRef.current.getBoundingClientRect();
            const deltaX = firstRect.left - lastRect.left;
            const deltaY = firstRect.top - lastRect.top;
            setFlipStyle({
              transform: `translate(${deltaX}px, ${deltaY}px)`,
              transition: 'none',
              zIndex: 50,
              position: 'relative',
            });
            setIsFlipping(true);
            // Invert & Play
            requestAnimationFrame(() => {
              setFlipStyle({
                transform: 'translate(0, 0)',
                transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)',
                zIndex: 50,
                position: 'relative',
              });
            });
            setTimeout(() => {
              setIsFlipping(false);
              setFlipStyle({});
              setTransitioning(false);
            }, 400);
          } else {
            setIsFlipping(false);
            setFlipStyle({});
            setTransitioning(false);
          }
        }, 10); // Let DOM update
      }, 10); // Duration matches transition
    } else {
      setTransitioning(true);
      setTimeout(() => {
        setShowGame(true);
        setTransitioning(false);
      }, 400); // Duration matches transition
    }
  };

  const handleCloseGame = () => {
    if (!isMobile && infoCardRef.current) {
      // FLIP: First - get initial position
      const firstRect = infoCardRef.current.getBoundingClientRect();
      setTransitioning(true);
      setTimeout(() => {
        setShowGame(false);
        setTimeout(() => {
          // FLIP: Last - get new position
          if (infoCardRef.current) {
            const lastRect = infoCardRef.current.getBoundingClientRect();
            const deltaX = firstRect.left - lastRect.left;
            const deltaY = firstRect.top - lastRect.top;
            setFlipStyle({
              transform: `translate(${deltaX}px, ${deltaY}px)`,
              transition: 'none',
              zIndex: 50,
              position: 'relative',
            });
            setIsFlipping(true);
            // Invert & Play
            requestAnimationFrame(() => {
              setFlipStyle({
                transform: 'translate(0, 0)',
                transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)',
                zIndex: 50,
                position: 'relative',
              });
            });
            setTimeout(() => {
              setIsFlipping(false);
              setFlipStyle({});
              setTransitioning(false);
            }, 400);
          } else {
            setIsFlipping(false);
            setFlipStyle({});
            setTransitioning(false);
          }
        }, 10); // Let DOM update
      }, 10);
    } else {
      setTransitioning(true);
      setTimeout(() => {
        setShowGame(false);
        setTransitioning(false);
      }, 400);
    }
  };

  return (
    <section id="showcase" className="h-screen flex items-center justify-center py-8 md:py-12 px-2 md:px-6 snap-section">
      <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 glow-text">
            Showcase
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A Flappy Bird game built with TypeScript and HTML5 Canvas. Just a fun project{' '}
            <Image 
              src="/media/joe.webp" 
              alt="Joe emoji" 
              width={50} 
              height={50} 
              className="inline-block"
            />
          </p>
        </div>

        {/* Main Showcase Container */}
        {isMobile ? (
          // MOBILE: Only show the video/game card and a compact info panel
          <>
            <div className="w-full max-w-sm mx-auto h-full flex flex-col justify-center">
              <div className={`glass-card rounded-2xl p-4 md:p-6 h-full flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${transitioning ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}`}>
                <div className="w-full flex-1 flex items-center justify-center">
                  <div className={`relative overflow-hidden rounded-xl mb-4 bg-black/20 ${showGame ? 'h-96 md:h-[500px] lg:h-[600px]' : 'h-64 md:h-80 lg:h-96'}`}>
                    {!showGame ? (
                      <>
                        <video
                          className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl cursor-pointer"
                          autoPlay
                          loop
                          muted
                          playsInline
                          onClick={handleVideoClick}
                        >
                          <source src="/media/flappy.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div 
                          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          onClick={handleVideoClick}
                        >
                          <div className="glass-card rounded-full p-4">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="relative w-full h-full">
                        <button
                          onClick={handleCloseGame}
                          className="absolute top-2 right-2 z-10 glass-card rounded-full p-2 hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <div className="w-full h-full">
                          <ScaledFlappyBird />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!showGame && (
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      <strong>Click the video to play the game directly in this panel!!</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Compact Info Panel for Mobile */}
            <div className="w-full max-w-sm mx-auto mt-3">
              <div className="glass-card rounded-2xl p-4 flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <div className="glass-card rounded-full p-2 mr-2">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Flappy Bird</h3>
                </div>
                <p className="text-xs text-muted-foreground text-center mb-2">
                  A Flappy Bird clone built with TypeScript and HTML5 Canvas.
                </p>
                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 mb-2 justify-center">
                  <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                    TypeScript
                  </span>
                  <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                    HTML5 Canvas
                  </span>
                  <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                    Game Development
                  </span>
                  <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                    Sound Effects
                  </span>
                </div>
                <a
                  href="https://github.com/hoangngxn/Portfolio/tree/main/src/app/flappy-bird"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-hover rounded-lg px-4 py-2 text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
                >
                  <Code2 className="w-4 h-4" />
                  <span>View Code</span>
                </a>
              </div>
            </div>
          </>
        ) : (
          // DESKTOP: Show full layout
          <div className="flex-1 flex flex-col lg:flex-row gap-6 items-center justify-center">
            {/* Large Media Display */}
            <div className={`flex-1 ${showGame ? 'max-w-5xl' : 'max-w-4xl'} w-full`}>
              <div className={`glass-card rounded-2xl p-4 md:p-6 transition-all duration-500 ease-in-out ${transitioning ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}`}>
                {/* Media Display Area */}
                <div className={`relative overflow-hidden rounded-xl mb-4 bg-black/20 ${showGame ? 'h-96 md:h-[500px] lg:h-[600px]' : 'h-64 md:h-80 lg:h-96'}`}>
                  {!showGame ? (
                    <>
                      <video
                        className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl cursor-pointer"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onClick={handleVideoClick}
                      >
                        <source src="/media/flappy.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div 
                        className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleVideoClick}
                      >
                        <div className="glass-card rounded-full p-4">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full">
                      <button
                        onClick={handleCloseGame}
                        className="absolute top-2 right-2 z-10 glass-card rounded-full p-2 hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="w-full h-full">
                        <ScaledFlappyBird />
                      </div>
                    </div>
                  )}
                </div>
                {/* Click instruction */}
                {!showGame && (
                  <div className="text-center">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Click the video to play the game directly in this panel
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Game Info Panel */}
            <div
              className="w-full lg:w-80"
              ref={infoCardRef}
              style={isFlipping ? flipStyle : undefined}
            >
              <div className="glass-card rounded-2xl p-4 md:p-6 h-full">
                {/* Game Icon and Title */}
                <div className="flex items-center mb-4">
                  <div className="glass-card rounded-full p-3 mr-3">
                    <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-semibold text-foreground">
                    Flappy Bird
                  </h3>
                </div>
                {/* Game Description */}
                <div className="space-y-4">
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    A fully functional Flappy Bird clone built with TypeScript and HTML5 Canvas. 
                    Features smooth animations, sound effects, score tracking, and responsive controls.
                  </p>
                  {/* Technologies */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                        TypeScript
                      </span>
                      <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                        HTML5 Canvas
                      </span>
                      <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                        Game Development
                      </span>
                      <span className="text-xs px-2 py-0.5 glass-card rounded-full text-muted-foreground">
                        Sound Effects
                      </span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleVideoClick}
                      className="w-full glass-card glass-hover rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play Game</span>
                    </button>
                    <a
                      href="https://github.com/hoangngxn/Portfolio/tree/main/src/app/flappy-bird"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full glass-card glass-hover rounded-lg px-4 py-2 text-sm font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>View Code</span>
                    </a>
                  </div>
                  {/* Game Instructions */}
                  <div className="pt-2 border-t border-primary/20">
                    <h4 className="text-sm font-semibold text-foreground mb-2">How to Play</h4>
                    <p className="text-xs text-muted-foreground">
                      Press <kbd className="px-2 py-1 bg-background/50 rounded text-xs">Space</kbd> to flap and navigate through pipes. 
                      Challenge yourself to beat your high score!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Floating Elements for Visual Appeal (desktop only) */}
        {!isMobile && (
          <>
            <div className="absolute top-1/4 right-8 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-8 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
    </section>
  );
};

export default ShowcaseSection; 