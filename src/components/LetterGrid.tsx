'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LetterGridProps {
  centerLetter: string;
  outerLetters: string[];
  onLetterClick: (letter: string) => void;
  bingoIsPossible: boolean;
  foundWords: string[];
}

export default function LetterGrid({ 
  centerLetter, 
  outerLetters, 
  onLetterClick,
  bingoIsPossible,
  foundWords
}: LetterGridProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate which letters have been found as starting letters
  const foundStartingLetters = new Set(
    foundWords.map(word => word[0].toLowerCase())
  );

  // Increased radius for better spacing on larger screens
  const radius = isMobile ? 88 : 110; // Increased from 82 to 110 for desktop

  // Center letter = the sun; outer letters = petals. Tiles start soft/idle and
  // bloom into their full color once a word starting with that letter is found
  // (tracked for the bingo achievement). When bingo isn't possible for today's
  // puzzle, every tile just shows its full "found" color from the start.
  const getTileClasses = (letter: string, isCenter: boolean) => {
    const isFound = !bingoIsPossible || foundStartingLetters.has(letter.toLowerCase());

    if (isCenter) {
      return isFound
        ? 'bg-gold text-gold-ink hover:bg-gold/90'
        : 'bg-gold-soft text-ink border border-ink/15 hover:bg-gold-soft/80';
    }
    return isFound
      ? 'bg-petal-found text-petal-ink hover:bg-petal-found/90'
      : 'bg-petal-idle text-ink border border-ink/15 hover:bg-petal-idle/80';
  };

  if (isMobile === null) return null;

  return (
    <div className="relative w-full h-full">
      {/* Center hexagon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.button
          className={`w-[80px] h-[92px] sm:w-[100px] sm:h-[115px]
                     [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
                     cursor-pointer flex items-center justify-center
                     transition-colors ${getTileClasses(centerLetter, true)}`}
          onClick={() => onLetterClick(centerLetter)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl sm:text-3xl font-display font-bold">
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
              className={`w-[80px] h-[92px] sm:w-[100px] sm:h-[115px]
                       [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
                       cursor-pointer flex items-center justify-center
                       transition-colors ${getTileClasses(letter, false)}`}
              onClick={() => onLetterClick(letter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                layout: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <motion.span
                layout
                className="text-xl sm:text-2xl font-display font-bold"
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