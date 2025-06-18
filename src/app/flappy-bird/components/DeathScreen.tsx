import React from 'react';
import { ImageLoader } from '../utils/imageLoader';

interface DeathScreenProps {
  score: number;
  highScore: number;
}

export const DeathScreen: React.FC<DeathScreenProps> = ({ score, highScore }) => {
  // Helper function to render score digits
  const renderScoreDigits = (scoreValue: number, startX: number, y: number) => {
    const digits = scoreValue.toString().split('');
    const digitWidth = 18;
    const digitHeight = 27;
    
    // Calculate total width of all digits
    const totalWidth = digits.length * digitWidth;
    // Calculate starting position to center the digits
    const centerStartX = startX - (totalWidth / 2);
    
    return digits.map((digit, idx) => {
      const img = ImageLoader.getImage(`digit${digit}`);
      return (
        <img
          key={idx}
          src={img?.src}
          alt={digit}
          width={digitWidth}
          height={digitHeight}
          style={{
            position: 'absolute',
            left: centerStartX + (idx * digitWidth),
            top: y,
            display: 'block',
            userSelect: 'none',
          }}
          draggable={false}
        />
      );
    });
  };

  const scorePanel = ImageLoader.getImage('score');
  const gameOverImage = ImageLoader.getImage('gameover');
  const spaceImage = ImageLoader.getImage('space');

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      {/* Game Over Image with floating animation */}
      <img
        src={gameOverImage?.src}
        alt="Game Over"
        style={{
          width: 200,
          height: 45,
          marginBottom: 20,
          userSelect: 'none',
          animation: 'float 2s ease-in-out infinite',
        }}
        draggable={false}
      />
      
      {/* Score Panel */}
      <div style={{
        position: 'relative',
        width: 100,
        height: 130,
      }}>
        <img
          src={scorePanel?.src}
          alt="Score Panel"
          style={{
            width: '100%',
            height: '100%',
            userSelect: 'none',
          }}
          draggable={false}
        />
        
        {/* Current Score */}
        {renderScoreDigits(score, 52, 36)}
        
        {/* Best Score */}
        {renderScoreDigits(highScore, 52, 90)}
      </div>
      
      {/* Space instruction with floating animation */}
      <img
        src={spaceImage?.src}
        alt="Press Space to Play Again"
        style={{
          marginTop: 20,
          width: 100,
          height: 100,
          userSelect: 'none',
          animation: 'float 2s ease-in-out infinite',
        }}
        draggable={false}
      />
      
      {/* CSS Animation for floating effect */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}; 