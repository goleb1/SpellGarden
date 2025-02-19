'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LetterGridProps {
  centerLetter: string;
  outerLetters: string[];
  onLetterClick: (letter: string) => void;
}

export default function LetterGrid({ 
  centerLetter, 
  outerLetters, 
  onLetterClick 
}: LetterGridProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate sizes based on screen size
  const radius = isMobile ? 88 : 82; // Tighter spacing on desktop

  return (
    <div className="relative w-full h-full">
      {/* Center hexagon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.button
          className="w-[80px] h-[92px] sm:w-[70px] sm:h-[80px] bg-amber-100 hover:bg-amber-200
                     [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
                     cursor-pointer flex items-center justify-center
                     transition-colors"
          onClick={() => onLetterClick(centerLetter)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl sm:text-xl font-bold text-black">
            {centerLetter}
          </span>
        </motion.button>
      </div>

      {/* Outer hexagons */}
      {outerLetters.map((letter, index) => {
        const angle = (index * 60 * Math.PI) / 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={letter}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <motion.button
              layoutId={`outer-letter-${letter}`}
              className="w-[80px] h-[92px] sm:w-[70px] sm:h-[80px] bg-purple-200 hover:bg-purple-300
                       [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
                       cursor-pointer flex items-center justify-center
                       transition-colors"
              onClick={() => onLetterClick(letter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                layout: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <motion.span 
                layout
                className="text-xl sm:text-lg font-bold text-black"
              >
                {letter}
              </motion.span>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
} 