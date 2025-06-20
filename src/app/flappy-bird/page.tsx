'use client';

import { useEffect, useRef, useState } from 'react';
import { Player } from './components/Player';
import { Pipe } from './components/Pipe';
import { Background } from './components/Background';
import { ImageLoader } from './utils/imageLoader';
import { SoundLoader } from './utils/soundLoader';
import { ScoreDisplay } from './components/ScoreDisplay';
import { DeathScreen } from './components/DeathScreen';

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'dead'>('playing');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Game objects
  const playerRef = useRef<Player | null>(null);
  const pipesRef = useRef<Pipe[]>([]);
  const backgroundRef = useRef<Background | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastPipeSpawnTime = useRef<number>(0);
  const isDeadRef = useRef<boolean>(false);
  const gameStartTime = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);
  const lastTimestampRef = useRef<number | null>(null);
  const deathTimeRef = useRef<number>(0);

  const CANVAS_WIDTH = 432;
  const CANVAS_HEIGHT = 768;
  const BASE_HEIGHT = 168;
  const PIPE_SPAWN_INTERVAL = 1500; // Spawn a new pipe every 1.5 seconds
  const PIPE_START_DELAY = 2000; // Start spawning pipes 2 seconds after first flap
  const SCROLL_SPEED = 150; // pixels per second

  // Load high score from localStorage safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('flappyBirdHighScore');
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) {
            setHighScore(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to load high score from localStorage:', err);
      }
    }
  }, []);

  // Save high score to localStorage safely
  useEffect(() => {
    if (typeof window !== 'undefined' && highScore > 0) {
      try {
        localStorage.setItem('flappyBirdHighScore', highScore.toString());
      } catch (err) {
        console.warn('Failed to save high score to localStorage:', err);
      }
    }
  }, [highScore]);

  const initGame = () => {
    if (!canvasRef.current) return;
    playerRef.current = new Player(CANVAS_WIDTH, CANVAS_HEIGHT - BASE_HEIGHT);
    backgroundRef.current = new Background(CANVAS_WIDTH, CANVAS_HEIGHT, BASE_HEIGHT, SCROLL_SPEED);
    pipesRef.current = [];
    setScore(0);
    currentScoreRef.current = 0;
    isDeadRef.current = false;
    gameStartTime.current = 0;
    deathTimeRef.current = 0;
    setHasStarted(false);
  };

  const handleInput = (e: KeyboardEvent) => {
    // Only handle spacebar presses
    if (e.code !== 'Space') return;
    
    // Prevent page scrolling
    e.preventDefault();

    if (!isDeadRef.current) {
      if (playerRef.current) {
        // If this is the first flap, record the time
        if (gameStartTime.current === 0) {
          gameStartTime.current = performance.now();
          setHasStarted(true);
        }
        playerRef.current.jump();
        
        // Play wing sound
        SoundLoader.playSound('wing');
      }
    } else {
      // Check if at least 1 second has passed since death
      const timeSinceDeath = performance.now() - deathTimeRef.current;
      if (timeSinceDeath >= 1000) {
        // Restart game when player presses space after death
        initGame();
        setGameState('playing');
      }
    }
  };

  const handleClick = () => {
    if (!isDeadRef.current) {
      if (playerRef.current) {
        // If this is the first flap, record the time
        if (gameStartTime.current === 0) {
          gameStartTime.current = performance.now();
          setHasStarted(true);
        }
        playerRef.current.jump();
        
        // Play wing sound
        SoundLoader.playSound('wing');
      }
    } else {
      // Check if at least 1 second has passed since death
      const timeSinceDeath = performance.now() - deathTimeRef.current;
      if (timeSinceDeath >= 1000) {
        // Restart game when player clicks after death
        initGame();
        setGameState('playing');
      }
    }
  };

  const handleDeath = () => {
    isDeadRef.current = true;
    deathTimeRef.current = performance.now();
    if (playerRef.current) {
      playerRef.current.setDead(true);
    }
    
    // Play hit sound
    SoundLoader.playSound('hit');
    
    // Save high score to localStorage if current score is higher
    const finalScore = currentScoreRef.current;
    console.log('Death handler - Current score:', finalScore, 'High score:', highScore);
    if (finalScore > highScore) {
      console.log('Updating high score from', highScore, 'to', finalScore);
      setHighScore(finalScore);
    }
    
    setGameState('dead');
  };

  const gameLoop = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !playerRef.current || !backgroundRef.current) return;

    // Calculate deltaTime in seconds
    let deltaTime = 1 / 60; // default to 1/60th of a second
    if (lastTimestampRef.current !== null) {
      deltaTime = (timestamp - lastTimestampRef.current) / 1000;
    }
    lastTimestampRef.current = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw background
    backgroundRef.current.update(deltaTime, gameState === 'playing', isDeadRef.current);
    backgroundRef.current.draw(ctx);

    // Spawn new pipes only during gameplay and after the start delay
    if (gameState === 'playing' && 
        !isDeadRef.current && 
        gameStartTime.current > 0 && 
        timestamp - gameStartTime.current > PIPE_START_DELAY &&
        timestamp - lastPipeSpawnTime.current > PIPE_SPAWN_INTERVAL) {
      pipesRef.current.push(new Pipe(CANVAS_WIDTH, CANVAS_HEIGHT - BASE_HEIGHT));
      lastPipeSpawnTime.current = timestamp;
    }

    // Update and draw pipes
    pipesRef.current = pipesRef.current.filter(pipe => {
      // Only update pipe position if we're playing and not dead
      if (gameState === 'playing' && !isDeadRef.current) {
        pipe.update(deltaTime);
      }
      pipe.draw(ctx);

      // Check if pipe is passed (only if not dead)
      if (!isDeadRef.current && !pipe.hasPassed() && pipe.getX() < playerRef.current!.getPosition().x) {
        pipe.markAsPassed();
        setScore(prev => {
          const newScore = prev + 1;
          currentScoreRef.current = newScore;
          return newScore;
        });
        
        // Play point sound
        SoundLoader.playSound('point');
      }

      return !pipe.isOffScreen();
    });

    // Update and draw player
    if (isDeadRef.current) {
      // Death animation - make bird red and continue falling
      playerRef.current.update(deltaTime);
      playerRef.current.draw(ctx, true);
    } else {
      playerRef.current.update(deltaTime);
      playerRef.current.draw(ctx);
    }

    // Check collisions only if not already dead
    if (!isDeadRef.current) {
      const playerCollided = playerRef.current.checkCollision();
      const playerPos = playerRef.current.getPosition();
      const pipeCollision = pipesRef.current.some(pipe => 
        pipe.checkCollision(
          playerPos.x,
          playerPos.y,
          playerPos.width,
          playerPos.height
        )
      );

      if (playerCollided || pipeCollision) {
        handleDeath();
      }
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Initialize game with proper error handling
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load images and sounds before starting the game
        await Promise.all([
          ImageLoader.loadImages(),
          SoundLoader.loadSounds()
        ]);

        // Initialize game immediately
        initGame();
        
        // Add keyboard event listener
        window.addEventListener('keydown', handleInput);
        
        // Add click event listener to canvas
        canvas.addEventListener('click', handleClick);

        // Start game loop
        lastPipeSpawnTime.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to load game assets. Please refresh the page.');
        setIsLoading(false);
      }
    };

    // Only initialize if we're in the browser
    if (typeof window !== 'undefined') {
      initializeGame();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clean up event listeners
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleInput);
        if (canvas) {
          canvas.removeEventListener('click', handleClick);
        }
      }
      // Clean up sounds
      try {
        SoundLoader.cleanup();
      } catch (err) {
        console.warn('Error cleaning up sounds:', err);
      }
    };
  }, []);

  useEffect(() => {
    lastTimestampRef.current = null;
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-lg border-4 border-white"
          tabIndex={0}
        />
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="glass-card rounded-lg p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white text-sm">Loading game...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="glass-card rounded-lg p-4 max-w-sm text-center">
              <p className="text-red-400 text-sm mb-2">Error</p>
              <p className="text-white text-xs mb-3">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
        
        {/* Score UI using digit images - hidden during death screen */}
        {hasStarted && gameState !== 'dead' && !isLoading && !error && <ScoreDisplay score={score} />}
        {/* Death Screen */}
        {gameState === 'dead' && !isLoading && !error && (
          <DeathScreen score={score} highScore={highScore} />
        )}
      </div>
    </div>
  );
}