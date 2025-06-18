'use client';

import { useEffect, useRef, useState } from 'react';
import { Player } from './components/Player';
import { Pipe } from './components/Pipe';
import { ImageLoader } from './utils/imageLoader';
import { ScoreDisplay } from './components/ScoreDisplay';

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'dead'>('playing');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    // Load high score from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flappyBirdHighScore');
      console.log('Loading high score from localStorage:', saved);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [hasStarted, setHasStarted] = useState(false);

  // Save high score to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && highScore > 0) {
      console.log('Saving high score to localStorage:', highScore);
      localStorage.setItem('flappyBirdHighScore', highScore.toString());
    }
  }, [highScore]);

  // Game objects
  const playerRef = useRef<Player | null>(null);
  const pipesRef = useRef<Pipe[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastPipeSpawnTime = useRef<number>(0);
  const isDeadRef = useRef<boolean>(false);
  const gameStartTime = useRef<number>(0);
  const backgroundX = useRef<number>(0);
  const baseX = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);

  const CANVAS_WIDTH = 432;
  const CANVAS_HEIGHT = 768;
  const BASE_HEIGHT = 168;
  const PIPE_SPAWN_INTERVAL = 1500; // Spawn a new pipe every 1.5 seconds
  const PIPE_START_DELAY = 2000; // Start spawning pipes 2 seconds after first flap
  const SCROLL_SPEED = 0.55; // Same as pipe speed

  const initGame = () => {
    if (!canvasRef.current) return;
    playerRef.current = new Player(CANVAS_WIDTH, CANVAS_HEIGHT - BASE_HEIGHT);
    pipesRef.current = [];
    setScore(0);
    currentScoreRef.current = 0;
    isDeadRef.current = false;
    gameStartTime.current = 0;
    backgroundX.current = 0;
    baseX.current = 0;
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
      }
    } else {
      // Restart game when player presses space after death
      initGame();
      setGameState('playing');
    }
  };

  const handleDeath = () => {
    isDeadRef.current = true;
    if (playerRef.current) {
      playerRef.current.setDead(true);
    }
    
    // Save high score to localStorage if current score is higher
    const finalScore = currentScoreRef.current;
    console.log('Death handler - Current score:', finalScore, 'High score:', highScore);
    if (finalScore > highScore) {
      console.log('Updating high score from', highScore, 'to', finalScore);
      setHighScore(finalScore);
    }
    
    setGameState('dead');
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const backgroundImage = ImageLoader.getImage('background');
    const baseImage = ImageLoader.getImage('base');
    
    // Update scroll positions
    if (gameState === 'playing' && !isDeadRef.current) {
      backgroundX.current -= SCROLL_SPEED;
      baseX.current -= SCROLL_SPEED;
    }

    // Use modulo to create seamless looping
    const backgroundOffset = ((backgroundX.current % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH;
    const baseOffset = ((baseX.current % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH;
    
    // Draw scrolling background
    ctx.drawImage(backgroundImage, backgroundOffset, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(backgroundImage, backgroundOffset - CANVAS_WIDTH + 1, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw scrolling base
    const baseY = CANVAS_HEIGHT - BASE_HEIGHT;
    ctx.drawImage(baseImage, baseOffset, baseY, CANVAS_WIDTH, BASE_HEIGHT);
    ctx.drawImage(baseImage, baseOffset - CANVAS_WIDTH + 1, baseY, CANVAS_WIDTH, BASE_HEIGHT);
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
        setScore(prev => {
          const newScore = prev + 1;
          currentScoreRef.current = newScore;
          return newScore;
        });
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
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-lg border-4 border-white"
          tabIndex={0}
        />
        {/* Score UI using digit images */}
        {hasStarted && <ScoreDisplay score={score} />}
        {/* Overlay UI */}
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