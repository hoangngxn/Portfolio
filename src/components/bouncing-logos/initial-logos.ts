import { Logo } from './types';

// Function to get random coordinates within screen bounds
const getRandomCoordinates = (isMobile: boolean) => {
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const logoSize = isMobile ? 48 : 96;
  
  // Ensure logos spawn within visible bounds, accounting for logo size
  const maxX = screenWidth - logoSize;
  const maxY = screenHeight - logoSize;
  
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
  const logoSize = isMobile ? 48 : 96;
  
  return [
    {
      id: 'logo-0',
      src: '/logos/React.svg',
      alt: 'React Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-14 h-14',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-1',
      src: '/logos/TypeScript.svg',
      alt: 'TypeScript Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-14 h-14',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-2',
      src: '/logos/JavaScript.png',
      alt: 'JavaScript Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-12 h-12',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-3',
      src: '/logos/Java.svg',
      alt: 'Java Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-16 h-16',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-4',
      src: '/logos/Python.svg',
      alt: 'Python Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-16 h-16',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-5',
      src: '/logos/Rust.svg',
      alt: 'Rust Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-16 h-16',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-6',
      src: '/logos/CSS3.svg',
      alt: 'CSS3 Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-16 h-16',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    },
    {
      id: 'logo-7',
      src: '/logos/HTML5.svg',
      alt: 'HTML5 Logo',
      width: logoSize,
      height: logoSize,
      className: isMobile ? 'w-8 h-8' : 'w-16 h-16',
      dx: getRandomDirection(),
      dy: getRandomDirection(),
      ...getRandomCoordinates(isMobile)
    }
  ];
};

// Export the generated logos
export const initialLogos: Logo[] = generateInitialLogos(); 