import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Level {
  name: string;
  emoji: string;
  threshold: number;
}

const LEVELS: Level[] = [
  { name: 'Seedling', emoji: '🌱', threshold: 0.1 },
  { name: 'Sprout', emoji: '🌿', threshold: 0.25 },
  { name: 'Budding', emoji: '🪴', threshold: 0.45 },
  { name: 'Blooming', emoji: '🌸', threshold: 0.65 },
  { name: 'Verdant', emoji: '🌳', threshold: 0.8 },
  { name: 'Botanist', emoji: '👩‍🌾', threshold: 0.9 },
];

interface LevelIndicatorProps {
  score: number;
  totalPossibleScore: number;
}

export default function LevelIndicator({ score, totalPossibleScore }: LevelIndicatorProps) {
  const progress = score / totalPossibleScore;
  
  const currentLevel = useMemo(() => {
    return LEVELS.reduce((prev, curr) => {
      if (progress >= curr.threshold) {
        return curr;
      }
      return prev;
    }, LEVELS[0]);
  }, [progress]);

  const nextLevel = useMemo(() => {
    const currentIndex = LEVELS.findIndex(level => level.name === currentLevel.name);
    return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
  }, [currentLevel]);

  const levelProgress = useMemo(() => {
    if (!nextLevel) return 1;
    const currentThreshold = currentLevel.threshold;
    const nextThreshold = nextLevel.threshold;
    return (progress - currentThreshold) / (nextThreshold - currentThreshold);
  }, [currentLevel, nextLevel, progress]);

  return (
    <div className="flex items-center gap-2">
      <motion.div 
        className="relative h-8 bg-white/10 rounded-full overflow-hidden px-3 flex items-center min-w-[180px]"
        initial={false}
        animate={{
          scale: [1, 1.05, 1],
          transition: { duration: 0.3 }
        }}
        key={currentLevel.name}
      >
        <div className="relative z-10 flex items-center gap-2 text-sm font-medium w-full justify-center">
          <span>{currentLevel.emoji}</span>
          <span>{currentLevel.name}</span>
        </div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-400/30"
          initial={{ x: '-100%' }}
          animate={{ x: `${levelProgress * 100 - 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </div>
  );
} 