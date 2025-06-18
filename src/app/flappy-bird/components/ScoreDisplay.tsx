import React from 'react';
import { ImageLoader } from '../utils/imageLoader';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  // Split score into digits
  const digits = score.toString().split('');
  // Set digit image size
  const digitWidth = 32;
  const digitHeight = 48;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      {digits.map((digit, idx) => {
        const img = ImageLoader.getImage(`digit${digit}`);
        return (
          <img
            key={idx}
            src={img?.src}
            alt={digit}
            width={digitWidth}
            height={digitHeight}
            style={{ display: 'block', margin: '0 2px', userSelect: 'none' }}
            draggable={false}
          />
        );
      })}
    </div>
  );
}; 