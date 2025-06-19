import { Logo } from './types';

// Original glass-card sizes
export const GLASS_CARD_SIZE_MOBILE = 'w-12 h-12'; // 48px
export const GLASS_CARD_SIZE_DESKTOP = 'w-16 h-16'; // 64px

// Function to get random coordinates within screen bounds
const getRandomCoordinates = (isMobile: boolean) => {
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const sizePx = isMobile ? 48 : 64;
  const maxX = screenWidth - sizePx;
  const maxY = screenHeight - sizePx;
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY)
  };
};

// Function to get random speed
const getRandomSpeed = () => 2 + Math.random() * 2; // 2 to 4
// Function to get random direction in radians
const getRandomDirection = () => Math.random() * Math.PI * 2;

// Base logo definitions (original sizes)
const baseLogos = [
  {
    src: '/logos/React.svg',
    alt: 'React Logo',
    width: 28, // mobile
    height: 28,
    className: 'w-7 h-7', // mobile
    widthDesktop: 40,
    heightDesktop: 40,
    classNameDesktop: 'w-10 h-10',
  },
  {
    src: '/logos/TypeScript.svg',
    alt: 'TypeScript Logo',
    width: 24,
    height: 24,
    className: 'w-6 h-6',
    widthDesktop: 32,
    heightDesktop: 32,
    classNameDesktop: 'w-8 h-8',
  },
  {
    src: '/logos/JavaScript.png',
    alt: 'JavaScript Logo',
    width: 24,
    height: 24,
    className: 'w-6 h-6',
    widthDesktop: 36,
    heightDesktop: 36,
    classNameDesktop: 'w-9 h-9',
  },
  {
    src: '/logos/Java.svg',
    alt: 'Java Logo',
    width: 24,
    height: 24,
    className: 'w-7 h-7',
    widthDesktop: 40,
    heightDesktop: 40,
    classNameDesktop: 'w-10 h-10',
  },
  {
    src: '/logos/Python.svg',
    alt: 'Python Logo',
    width: 26,
    height: 26,
    className: 'w-6.5 h-6.5',
    widthDesktop: 38,
    heightDesktop: 38,
    classNameDesktop: 'w-9.5 h-9.5',
  },
  {
    src: '/logos/Rust.svg',
    alt: 'Rust Logo',
    width: 22,
    height: 22,
    className: 'w-5.5 h-5.5',
    widthDesktop: 34,
    heightDesktop: 34,
    classNameDesktop: 'w-8.5 h-8.5',
  },
  {
    src: '/logos/CSS3.svg',
    alt: 'CSS3 Logo',
    width: 24,
    height: 24,
    className: 'w-6 h-6',
    widthDesktop: 32,
    heightDesktop: 32,
    classNameDesktop: 'w-8 h-8',
  },
  {
    src: '/logos/HTML5.svg',
    alt: 'HTML5 Logo',
    width: 24,
    height: 24,
    className: 'w-6 h-6',
    widthDesktop: 32,
    heightDesktop: 32,
    classNameDesktop: 'w-8 h-8',
  },
];

// Function to generate initial logos with responsive coordinates
const generateInitialLogos = (): Logo[] => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const logos: Logo[] = [];
  for (let repeat = 0; repeat < 3; repeat++) {
    baseLogos.forEach((base, idx) => {
      logos.push({
        id: `logo-${repeat * baseLogos.length + idx}`,
        src: base.src,
        alt: base.alt,
        width: isMobile ? base.width : base.widthDesktop,
        height: isMobile ? base.height : base.heightDesktop,
        className: isMobile ? base.className : base.classNameDesktop,
        speed: getRandomSpeed(),
        direction: getRandomDirection(),
        ...getRandomCoordinates(isMobile)
      });
    });
  }
  return logos;
};

// Export the generated logos
export const initialLogos: Logo[] = generateInitialLogos();

// Function to spawn a single random logo
export function logoSpawn(isMobile: boolean, id: string, x?: number, y?: number): Logo {
  const base = baseLogos[Math.floor(Math.random() * baseLogos.length)];
  let coords;
  if (typeof x === 'number' && typeof y === 'number') {
    coords = { x, y };
  } else {
    coords = getRandomCoordinates(isMobile);
  }
  return {
    id,
    src: base.src,
    alt: base.alt,
    width: isMobile ? base.width : base.widthDesktop,
    height: isMobile ? base.height : base.heightDesktop,
    className: isMobile ? base.className : base.classNameDesktop,
    speed: getRandomSpeed(),
    direction: getRandomDirection(),
    ...coords
  };
} 