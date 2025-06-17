'use client';

import { useEffect, useRef, useState } from 'react';
import { Player } from './components/Player';
import { Pipe } from './components/Pipe';

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'dead'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game objects
  const playerRef = useRef<Player | null>(null);
  const pipesRef = useRef<Pipe[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPipeSpawnTime = useRef<number>(0);
  const isDeadRef = useRef<boolean>(false);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PIPE_SPAWN_INTERVAL = 2500; // Spawn a new pipe every 2.5 seconds

  const initGame = () => {
    if (!canvasRef.current) return;
    playerRef.current = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);
    pipesRef.current = [];
    setScore(0);
    isDeadRef.current = false;
  };

  const handleInput = (e: KeyboardEvent) => {
    // Only handle spacebar presses
    if (e.code !== 'Space') return;
    
    // Prevent page scrolling
    e.preventDefault();

    if (gameState === 'start') {
      setGameState('playing');
      initGame();
    } else if (gameState === 'playing') {
      playerRef.current?.jump();
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

  const gameLoop = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !playerRef.current) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spawn new pipes only during gameplay
    if (gameState === 'playing' && timestamp - lastPipeSpawnTime.current > PIPE_SPAWN_INTERVAL) {
      pipesRef.current.push(new Pipe(CANVAS_WIDTH, CANVAS_HEIGHT));
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

    // Add keyboard event listener
    window.addEventListener('keydown', handleInput);

    // Start game loop for all states
    lastPipeSpawnTime.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

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
        
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-30">
            <h1 className="text-4xl font-bold mb-4">Flappy Bird</h1>
            <p className="text-xl">Press Space to Start</p>
          </div>
        )}
        
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