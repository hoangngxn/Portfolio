import React from 'react';
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

  return (
    <>
      <style>{flyUpDown}</style>
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
        <button
          className="glass-card rounded-full p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
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