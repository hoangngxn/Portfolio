import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

// Custom keyframes for flying up-down animation
const flyUpDown = `
  @keyframes fly-up-down {
    0% { transform: translateY(0); }
    50% { transform: translateY(18px); }
    100% { transform: translateY(0); }
  }
`;

const sectionIds = ['hero', 'about', 'showcase', 'projects', 'contact'];

const FloatingNextSectionArrow: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're on mobile or desktop
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
      
      let scrollY: number;
      let viewportHeight: number;
      
      if (isMobile) {
        // On mobile, use window scroll
        scrollY = window.scrollY || window.pageYOffset;
        viewportHeight = window.innerHeight;
      } else {
        // On desktop, use snap container scroll
        const container = document.querySelector('.snap-container') as HTMLElement;
        if (!container) return;
        scrollY = container.scrollTop;
        viewportHeight = container.clientHeight;
      }
      
      // Get the about section element
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        const aboutBottom = aboutRect.bottom + (isMobile ? window.scrollY : 0);
        
        // Show arrow only when in hero or about sections
        // Hide when scrolled past the about section
        setIsVisible(scrollY + viewportHeight < aboutBottom);
      }
    };

    // Add scroll listeners for both mobile and desktop
    window.addEventListener('scroll', handleScroll);
    
    // For desktop snap scrolling, also listen to the container
    const container = document.querySelector('.snap-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Scroll to the next section after the current viewport
  const handleArrowClick = () => {
    // Find the first section below the current scroll position
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const currentBottom = scrollY + viewportHeight / 2;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + window.scrollY;
        if (elTop > currentBottom) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }
    // If at the end, scroll to top
    const first = document.getElementById(sectionIds[0]);
    if (first) {
      first.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{flyUpDown}
      {`
        @keyframes fade-in-pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center">
        <div
          className="glass-card backdrop-blur-sm rounded-xl px-3 py-1 mb-2 pointer-events-auto"
          style={{ animation: 'fade-in-pulse 2.2s ease-in-out infinite' }}
          aria-hidden="true"
        >
          <span className="text-xs md:text-sm text-primary font-medium select-none">
            SCROLL DOWN FOR MORE
          </span>
        </div>
        <button
          className="glass-card rounded-xl p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
          style={{ animation: 'fly-up-down 1.6s ease-in-out infinite' }}
          aria-label="Scroll to next section"
          onClick={handleArrowClick}
        >
          <ArrowDown className="w-7 h-7 text-primary" />
        </button>
      </div>
    </>
  );
};

export default FloatingNextSectionArrow; 