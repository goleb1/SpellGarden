import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';

interface Level {
  name: string;
  emoji: string;
  threshold: number;
}

const LEVELS: Level[] = [
  { name: 'Seedling', emoji: '🌱', threshold: 0 },
  { name: 'Sprout', emoji: '🌿', threshold: 0.1 },
  { name: 'Budding', emoji: '🪴', threshold: 0.25 },
  { name: 'Blooming', emoji: '🌸', threshold: 0.45 },
  { name: 'Verdant', emoji: '🌳', threshold: 0.65 },
  { name: 'Botanist', emoji: '👩‍🌾', threshold: 0.8 },
];

interface LevelIndicatorProps {
  score: number;
  totalPossibleScore: number;
}

export default function LevelIndicator({ score, totalPossibleScore }: LevelIndicatorProps) {
  const progress = score / totalPossibleScore;
  const [prevLevel, setPrevLevel] = useState<Level | null>(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  
  const currentLevel = useMemo(() => {
    // Find the highest level whose threshold we've passed
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (progress >= LEVELS[i].threshold) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }, [progress]);

  useEffect(() => {
    if (prevLevel && prevLevel.name !== currentLevel.name) {
      setShowLevelUpAnimation(true);
      const timer = setTimeout(() => setShowLevelUpAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
    setPrevLevel(currentLevel);
  }, [currentLevel, prevLevel]);

  const nextLevel = useMemo(() => {
    const currentIndex = LEVELS.findIndex(level => level.name === currentLevel.name);
    return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
  }, [currentLevel]);

  const levelProgress = useMemo(() => {
    if (!nextLevel) return 1;
    const currentThreshold = currentLevel.threshold;
    const nextThreshold = nextLevel.threshold;
    const progressInLevel = (progress - currentThreshold) / (nextThreshold - currentThreshold);
    return Math.min(Math.max(progressInLevel, 0), 1);
  }, [currentLevel, nextLevel, progress]);

  return (
    <div className="flex items-center gap-2 w-full">
      <motion.div 
        className={`relative h-8 bg-white/10 rounded-full overflow-hidden px-0 sm:px-3 flex items-center w-full sm:w-auto sm:min-w-[180px] ${
          showLevelUpAnimation ? 'ring-2 ring-green-400/50 shadow-lg shadow-green-400/20' : ''
        }`}
        initial={false}
        animate={showLevelUpAnimation ? {
          scale: [1, 1.05, 1],
          transition: { duration: 0.5 }
        } : {}}
      >
        <div className="relative z-10 flex items-center gap-2 text-sm font-medium w-full justify-center">
          <motion.span
            key={currentLevel.emoji}
            initial={{ scale: 1 }}
            animate={showLevelUpAnimation ? {
              scale: [1, 1.4, 1],
              rotate: [0, 15, -15, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {currentLevel.emoji}
          </motion.span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentLevel.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentLevel.name}
            </motion.span>
          </AnimatePresence>
        </div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-400/30"
          initial={{ x: '-100%' }}
          animate={{ x: `${levelProgress * 100 - 100}%` }}
          transition={{ duration: 0.5 }}
        />
        {showLevelUpAnimation && (
          <motion.div
            className="absolute inset-0 bg-green-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8 }}
          />
        )}
      </motion.div>
    </div>
  );
} 