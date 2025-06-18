import { Logo } from './types';

// Global constants for glass-card sizes only
export const GLASS_CARD_SIZE_MOBILE = 'w-12 h-12'; // 48px
export const GLASS_CARD_SIZE_DESKTOP = 'w-16 h-16'; // 64px

// For logo size, set per-logo below:
// width: mobile width in px
// height: mobile height in px
// desktopWidth: desktop width in px
// desktopHeight: desktop height in px
// className: mobile Tailwind class
// desktopClassName: desktop Tailwind class

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

// Function to get random direction
const getRandomDirection = () => {
  return Math.random() > 0.5 ? 1 : -1;
};

// Function to generate initial logos with responsive coordinates
const generateInitialLogos = (): Logo[] => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  return [
    {
      id: 'logo-0',
      src: '/logos/React.svg',
      alt: 'React Logo',
      width: isMobile ? 28 : 40,
      height: isMobile ? 28 : 40,
      className: isMobile ? 'w-7 h-7' : 'w-10 h-10',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-1',
      src: '/logos/TypeScript.svg',
      alt: 'TypeScript Logo',
      width: isMobile ? 24 : 32,
      height: isMobile ? 24 : 32,
      className: isMobile ? 'w-6 h-6' : 'w-8 h-8',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-2',
      src: '/logos/JavaScript.png',
      alt: 'JavaScript Logo',
      width: isMobile ? 24 : 36,
      height: isMobile ? 24 : 36,
      className: isMobile ? 'w-6 h-6' : 'w-9 h-9',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-3',
      src: '/logos/Java.svg',
      alt: 'Java Logo',
      width: isMobile ? 24 : 40,
      height: isMobile ? 24 : 40,
      className: isMobile ? 'w-7 h-7' : 'w-10 h-10',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-4',
      src: '/logos/Python.svg',
      alt: 'Python Logo',
      width: isMobile ? 26 : 38,
      height: isMobile ? 26 : 38,
      className: isMobile ? 'w-6.5 h-6.5' : 'w-9.5 h-9.5',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-5',
      src: '/logos/Rust.svg',
      alt: 'Rust Logo',
      width: isMobile ? 22 : 34,
      height: isMobile ? 22 : 34,
      className: isMobile ? 'w-5.5 h-5.5' : 'w-8.5 h-8.5',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-6',
      src: '/logos/CSS3.svg',
      alt: 'CSS3 Logo',
      width: isMobile ? 24 : 32,
      height: isMobile ? 24 : 32,
      className: isMobile ? 'w-6 h-6' : 'w-8 h-8',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-7',
      src: '/logos/HTML5.svg',
      alt: 'HTML5 Logo',
      width: isMobile ? 24 : 32,
      height: isMobile ? 24 : 32,
      className: isMobile ? 'w-6 h-6' : 'w-8 h-8',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    }
  ];
};

// Export the generated logos
export const initialLogos: Logo[] = generateInitialLogos(); 