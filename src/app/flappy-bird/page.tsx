'use client';

import { useEffect, useRef, useState } from 'react';
import { Player } from './components/Player';
import { Pipe } from './components/Pipe';
import { ImageLoader } from './utils/imageLoader';

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'dead'>('playing');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game objects
  const playerRef = useRef<Player | null>(null);
  const pipesRef = useRef<Pipe[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPipeSpawnTime = useRef<number>(0);
  const isDeadRef = useRef<boolean>(false);
  const gameStartTime = useRef<number>(0);
  const backgroundX = useRef<number>(0);
  const baseX = useRef<number>(0);

  const CANVAS_WIDTH = 288;
  const CANVAS_HEIGHT = 512;
  const BASE_HEIGHT = 112;
  const PIPE_SPAWN_INTERVAL = 2500; // Spawn a new pipe every 2.5 seconds
  const PIPE_START_DELAY = 2000; // Start spawning pipes 2 seconds after first flap
  const SCROLL_SPEED = 0.65; // Same as pipe speed

  const initGame = () => {
    if (!canvasRef.current) return;
    playerRef.current = new Player(CANVAS_WIDTH, CANVAS_HEIGHT - BASE_HEIGHT);
    pipesRef.current = [];
    setScore(0);
    isDeadRef.current = false;
    gameStartTime.current = 0;
    backgroundX.current = 0;
    baseX.current = 0;
  };

  const handleInput = (e: KeyboardEvent) => {
    // Only handle spacebar presses
    if (e.code !== 'Space') return;
    
    // Prevent page scrolling
    e.preventDefault();

    if (gameState === 'playing') {
      if (playerRef.current) {
        // If this is the first flap, record the time
        if (gameStartTime.current === 0) {
          gameStartTime.current = performance.now();
        }
        playerRef.current.jump();
      }
    } else if (gameState === 'dead') {
      // Go directly to playing state from death
      setGameState('playing');
      initGame();
    }
  };

  const handleDeath = () => {
    isDeadRef.current = true;
    if (playerRef.current) {
      playerRef.current.setDead(true);
    }
    setGameState('dead');
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const backgroundImage = ImageLoader.getImage('background');
    const baseImage = ImageLoader.getImage('base');
    
    // Draw scrolling background
    ctx.drawImage(backgroundImage, backgroundX.current, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(backgroundImage, backgroundX.current + CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw scrolling base
    const baseY = CANVAS_HEIGHT - BASE_HEIGHT;
    ctx.drawImage(baseImage, baseX.current, baseY, CANVAS_WIDTH, BASE_HEIGHT);
    ctx.drawImage(baseImage, baseX.current + CANVAS_WIDTH, baseY, CANVAS_WIDTH, BASE_HEIGHT);

    // Update scroll positions
    if (gameState === 'playing' && !isDeadRef.current) {
      backgroundX.current -= SCROLL_SPEED;
      baseX.current -= SCROLL_SPEED;

      // Reset positions when they scroll off screen
      if (backgroundX.current <= -CANVAS_WIDTH) {
        backgroundX.current = 0;
      }
      if (baseX.current <= -CANVAS_WIDTH) {
        baseX.current = 0;
      }
    }
  };

  const gameLoop = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !playerRef.current) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background and base
    drawBackground(ctx);

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
        pipe.update();
      }
      pipe.draw(ctx);

      // Check if pipe is passed (only if not dead)
      if (!isDeadRef.current && !pipe.hasPassed() && pipe.getX() + 80 < playerRef.current!.getPosition().x) {
        pipe.markAsPassed();
        setScore(prev => prev + 1);
        setHighScore(prev => Math.max(prev, score + 1));
      }

      return !pipe.isOffScreen();
    });

    // Update and draw player
    if (isDeadRef.current) {
      // Death animation - make bird red and continue falling
      playerRef.current.update();
      playerRef.current.draw(ctx, true);
    } else {
      playerRef.current.update();
      playerRef.current.draw(ctx);
    }

    // Check collisions only if not already dead
    if (!isDeadRef.current) {
      const playerCollided = playerRef.current.checkCollision();
      const pipeCollision = pipesRef.current.some(pipe => 
        pipe.checkCollision(
          playerRef.current!.getPosition().x,
          playerRef.current!.getPosition().y,
          playerRef.current!.getPosition().width / 2
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

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Load images before starting the game
    ImageLoader.loadImages().then(() => {
      // Initialize game immediately
      initGame();
      
      // Add keyboard event listener
      window.addEventListener('keydown', handleInput);

      // Start game loop
      lastPipeSpawnTime.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clean up event listener
      window.removeEventListener('keydown', handleInput);
    };
  }, [gameState]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-lg border-4 border-white"
          tabIndex={0}
        />
        
        {/* Overlay UI */}
        <div className="absolute top-4 left-4 text-white text-2xl font-bold">
          Score: {score}
        </div>
        
        {gameState === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-30">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-2xl mb-2">Score: {score}</p>
            <p className="text-xl mb-4">High Score: {highScore}</p>
            <p className="text-lg">Press Space to Play Again</p>
          </div>
        )}
      </div>
    </div>
  );
}