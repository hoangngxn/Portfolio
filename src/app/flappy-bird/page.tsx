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
  const backgroundRef = useRef<Background | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastPipeSpawnTime = useRef<number>(0);
  const isDeadRef = useRef<boolean>(false);
  const gameStartTime = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);
  const lastTimestampRef = useRef<number | null>(null);

  const CANVAS_WIDTH = 432;
  const CANVAS_HEIGHT = 768;
  const BASE_HEIGHT = 168;
  const PIPE_SPAWN_INTERVAL = 1500; // Spawn a new pipe every 1.5 seconds
  const PIPE_START_DELAY = 2000; // Start spawning pipes 2 seconds after first flap
  const SCROLL_SPEED = 150; // pixels per second

  const initGame = () => {
    if (!canvasRef.current) return;
    playerRef.current = new Player(CANVAS_WIDTH, CANVAS_HEIGHT - BASE_HEIGHT);
    backgroundRef.current = new Background(CANVAS_WIDTH, CANVAS_HEIGHT, BASE_HEIGHT, SCROLL_SPEED);
    pipesRef.current = [];
    setScore(0);
    currentScoreRef.current = 0;
    isDeadRef.current = false;
    gameStartTime.current = 0;
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
      // Restart game when player presses space after death
      initGame();
      setGameState('playing');
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
      // Restart game when player clicks after death
      initGame();
      setGameState('playing');
    }
  };

  const handleDeath = () => {
    isDeadRef.current = true;
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

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Load images and sounds before starting the game
    Promise.all([
      ImageLoader.loadImages(),
      SoundLoader.loadSounds()
    ]).then(() => {
      // Initialize game immediately
      initGame();
      
      // Add keyboard event listener
      window.addEventListener('keydown', handleInput);
      
      // Add click event listener to canvas
      canvas.addEventListener('click', handleClick);

      // Start game loop
      lastPipeSpawnTime.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }).catch(error => {
      console.error('Error loading game assets:', error);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clean up event listener
      window.removeEventListener('keydown', handleInput);
      // Clean up click event listener
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
      // Clean up sounds
      SoundLoader.cleanup();
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
        {/* Score UI using digit images - hidden during death screen */}
        {hasStarted && gameState !== 'dead' && <ScoreDisplay score={score} />}
        {/* Death Screen */}
        {gameState === 'dead' && (
          <DeathScreen score={score} highScore={highScore} />
        )}
      </div>
    </div>
  );
}