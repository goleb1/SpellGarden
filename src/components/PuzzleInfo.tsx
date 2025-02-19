import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Burst component for achievement animations
const Burst = ({ color }: { color: string }) => {
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    return {
      x: Math.cos(angle) * 30,
      y: Math.sin(angle) * 30,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full ${color}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 1.5,
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
};

// Individual Pangram Indicator component
const PangramIndicator = ({ 
  index, 
  isFound, 
  justFound,
  allPangramsFound,
  onMouseEnter,
  onMouseLeave,
  onTouchStart
}: { 
  index: number;
  isFound: boolean;
  justFound: boolean;
  allPangramsFound: boolean;
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onTouchStart: (event: React.TouchEvent) => void;
}) => (
  <motion.div
    className="relative cursor-help"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1 * index }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
  >
    <AnimatePresence mode="wait">
      <motion.span
        key={`${isFound}-${allPangramsFound}`}
        className="text-lg inline-block relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {allPangramsFound ? '🌺' : isFound ? '🌸' : '🌱'}
        {justFound && <Burst color="bg-pink-400" />}
      </motion.span>
    </AnimatePresence>
  </motion.div>
);

interface PuzzleInfoProps {
  bingoIsPossible: boolean;
  pangramCount: number;
  foundPangrams: string[];
  foundWords: string[];
  centerLetter: string;
  outerLetters: string[];
}

export default function PuzzleInfo({ 
  bingoIsPossible, 
  pangramCount, 
  foundPangrams,
  foundWords,
  centerLetter,
  outerLetters
}: PuzzleInfoProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const bingoRef = useRef<HTMLDivElement>(null);
  const pangramRef = useRef<HTMLDivElement>(null);
  const [lastBingoState, setLastBingoState] = useState(false);
  const [lastFoundPangrams, setLastFoundPangrams] = useState<string[]>([]);
  const [showBingoBurst, setShowBingoBurst] = useState(false);
  const [justFoundPangrams, setJustFoundPangrams] = useState<Set<number>>(new Set());

  // Calculate progress
  const pangramsFound = foundPangrams.length;
  const pangramsRemaining = pangramCount - pangramsFound;
  
  // Check if we have found words starting with each letter
  const allLetters = [centerLetter.toLowerCase(), ...outerLetters.map(l => l.toLowerCase())];
  const foundStartingLetters = new Set(foundWords.map(word => word[0].toLowerCase()));
  const hasBingo = allLetters.every(letter => foundStartingLetters.has(letter));

  // Effect to trigger bursts
  useEffect(() => {
    if (hasBingo && !lastBingoState) {
      setShowBingoBurst(true);
      setTimeout(() => setShowBingoBurst(false), 600);
    }
    setLastBingoState(hasBingo);

    // Check for newly found pangrams
    if (foundPangrams.length > lastFoundPangrams.length) {
      const newJustFound = new Set<number>();
      for (let i = 0; i < pangramCount; i++) {
        if (foundPangrams[i] && !lastFoundPangrams[i]) {
          newJustFound.add(i);
        }
      }
      setJustFoundPangrams(newJustFound);
      setTimeout(() => setJustFoundPangrams(new Set()), 600);
    }
    setLastFoundPangrams(foundPangrams);
  }, [hasBingo, foundPangrams, lastBingoState, lastFoundPangrams, pangramCount]);

  // Get appropriate emoji based on progress
  const getBingoEmoji = () => {
    if (!bingoIsPossible) return '🌱';
    return hasBingo ? '🌻' : '🪴';
  };

  // Get appropriate tooltip text based on progress
  const getBingoTooltip = () => {
    if (!bingoIsPossible) return 'No bingo possible today';
    if (hasBingo) return 'You found the bingo!';
    return 'There is a bingo!';
  };

  const getPangramTooltip = () => {
    if (pangramsFound === 0) {
      return pangramCount === 1 
        ? '1 pangram to find' 
        : `${pangramCount} pangrams to find`;
    }
    if (pangramsFound < pangramCount) {
      return pangramsRemaining === 1
        ? '1 pangram remaining!'
        : `${pangramsRemaining} pangrams remaining!`;
    }
    return pangramCount === 1 
      ? 'You found the pangram!' 
      : `You found all ${pangramCount} pangrams!`;
  };

  const handleTooltipShow = (type: 'bingo' | 'pangram', event: React.MouseEvent | React.TouchEvent) => {
    const targetRef = type === 'bingo' ? bingoRef : pangramRef;
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8
      });
      setShowTooltip(type);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {bingoIsPossible && (
        <motion.div 
          ref={bingoRef}
          className="relative cursor-help"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onMouseEnter={(e) => handleTooltipShow('bingo', e)}
          onMouseLeave={() => setShowTooltip(null)}
          onTouchStart={(e) => {
            handleTooltipShow('bingo', e);
            setTimeout(() => setShowTooltip(null), 2000);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span 
              key={getBingoEmoji()}
              className="text-lg inline-block relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {getBingoEmoji()}
              {showBingoBurst && <Burst color="bg-yellow-400" />}
            </motion.span>
          </AnimatePresence>
          {showTooltip === 'bingo' && (
            <div 
              className="fixed transform -translate-x-1/2 whitespace-nowrap bg-black/90 text-white/90 text-xs px-2 py-1 rounded z-50"
              style={{ 
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`
              }}
            >
              {getBingoTooltip()}
            </div>
          )}
        </motion.div>
      )}
      
      <div ref={pangramRef} className="flex gap-0.5">
        {Array.from({ length: Math.min(pangramCount, 3) }).map((_, index) => (
          <PangramIndicator
            key={index}
            index={index}
            isFound={index < foundPangrams.length}
            justFound={justFoundPangrams.has(index)}
            allPangramsFound={foundPangrams.length === pangramCount}
            onMouseEnter={(e) => handleTooltipShow('pangram', e)}
            onMouseLeave={() => setShowTooltip(null)}
            onTouchStart={(e) => {
              handleTooltipShow('pangram', e);
              setTimeout(() => setShowTooltip(null), 2000);
            }}
          />
        ))}
        {showTooltip === 'pangram' && (
          <div 
            className="fixed transform -translate-x-1/2 whitespace-nowrap bg-black/90 text-white/90 text-xs px-2 py-1 rounded z-50"
            style={{ 
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`
            }}
          >
            {getPangramTooltip()}
          </div>
        )}
      </div>
    </div>
  );
} 