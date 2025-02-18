'use client';

import { motion } from 'framer-motion';

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
  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      {/* Center hexagon */}
      <motion.button
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[80px] h-[92px] bg-amber-100 hover:bg-amber-200
                   [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
                   cursor-pointer flex items-center justify-center
                   transition-colors"
        onClick={() => onLetterClick(centerLetter)}
      >
        <span className="text-2xl font-bold text-black">
          {centerLetter}
        </span>
      </motion.button>

      {/* Outer hexagons */}
      {outerLetters.map((letter, index) => {
        const angle = (index * 60 * Math.PI) / 180;
        const radius = 88;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.button
            key={index}
            className="absolute w-[80px] h-[92px] bg-purple-200 hover:bg-purple-300
                     [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
                     cursor-pointer flex items-center justify-center
                     transition-colors"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
            onClick={() => onLetterClick(letter)}
          >
            <span className="text-xl font-bold text-black">
              {letter}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
} 