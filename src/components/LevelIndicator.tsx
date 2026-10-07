import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';
import {
  Moon,
  Leaf,
  Plant,
  PottedPlant,
  FlowerLotus,
  FlowerTulip,
  TreeEvergreen,
  GraduationCap,
  Globe,
  type Icon,
} from '@phosphor-icons/react';
import LevelProgressModal from './LevelProgressModal';

export interface Level {
  name: string;
  icon: Icon;
  threshold: number;
}

// Rank icons, in order of growth. A couple of these (Dormant, Botanist) don't have
// an obvious literal icon — Moon/GraduationCap were the closest fits, worth
// revisiting if a better one comes to mind.
export const LEVELS: Level[] = [
  { name: 'Dormant', icon: Moon, threshold: 0 },
  { name: 'Seedling', icon: Leaf, threshold: 0.05 },
  { name: 'Sprout', icon: Plant, threshold: 0.15 },
  { name: 'Budding', icon: PottedPlant, threshold: 0.3 },
  { name: 'Blooming', icon: FlowerLotus, threshold: 0.4 },
  { name: 'Flourishing', icon: FlowerTulip, threshold: 0.5 },
  { name: 'Verdant', icon: TreeEvergreen, threshold: 0.6 },
  { name: 'Botanist', icon: GraduationCap, threshold: 0.7 },
];

export const MOTHER_EARTH = { name: 'Mother Earth', icon: Globe };
const BOTANIST_THRESHOLD = LEVELS[LEVELS.length - 1].threshold;

interface LevelIndicatorProps {
  score: number;
  totalPossibleScore: number;
  foundWordsCount: number;
  totalWords: number;
}

export default function LevelIndicator({ score, totalPossibleScore, foundWordsCount, totalWords }: LevelIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const progress = score / totalPossibleScore;
  const [prevLevel, setPrevLevel] = useState<Level | null>(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [prevIsMotherEarth, setPrevIsMotherEarth] = useState(false);
  
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

  const isMotherEarth = totalWords > 0 && foundWordsCount === totalWords;
  const showCountdown = !isMotherEarth && score > BOTANIST_THRESHOLD * totalPossibleScore;
  const wordsLeft = totalWords - foundWordsCount;

  const DisplayIcon = isMotherEarth ? MOTHER_EARTH.icon : currentLevel.icon;
  const displayName = isMotherEarth
    ? MOTHER_EARTH.name
    : showCountdown
      ? `Botanist · ${wordsLeft} left`
      : currentLevel.name;

  useEffect(() => {
    if (isMotherEarth && !prevIsMotherEarth) {
      setShowLevelUpAnimation(true);
      const timer = setTimeout(() => setShowLevelUpAnimation(false), 1500);
      setPrevIsMotherEarth(true);
      return () => clearTimeout(timer);
    } else if (!isMotherEarth) {
      setPrevIsMotherEarth(false);
    }
  }, [isMotherEarth, prevIsMotherEarth]);

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
    <>
      <div 
        className="flex items-center gap-2 w-full cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <motion.div
          className={`relative h-8 bg-surface rounded-full overflow-hidden px-2 sm:px-3 flex items-center w-full sm:w-auto sm:min-w-[300px] lg:min-w-[360px] ${
            showLevelUpAnimation ? 'ring-2 ring-leaf/50 shadow-lg shadow-leaf/20' : ''
          } hover:bg-surface/70 transition-colors`}
          initial={false}
          animate={showLevelUpAnimation ? {
            scale: [1, 1.05, 1],
            transition: { duration: 0.5 }
          } : {}}
        >
          <div className="relative z-10 flex items-center gap-2 text-sm font-medium w-full justify-center">
            <motion.span
              key={isMotherEarth ? 'mother-earth' : currentLevel.name}
              className="flex items-center"
              initial={{ scale: 1 }}
              animate={showLevelUpAnimation ? {
                scale: [1, 1.4, 1],
                rotate: [0, 15, -15, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <DisplayIcon size={16} weight="duotone" className="text-leaf" />
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.span
                key={displayName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm"
              >
                {displayName}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-leaf/15 to-leaf/25"
            initial={{ x: '-100%' }}
            animate={{ x: `${levelProgress * 100 - 100}%` }}
            transition={{ duration: 0.5 }}
          />
          {showLevelUpAnimation && (
            <motion.div
              className="absolute inset-0 bg-leaf/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.8 }}
            />
          )}
        </motion.div>
      </div>

      <LevelProgressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        score={score}
        totalPossibleScore={totalPossibleScore}
        foundWordsCount={foundWordsCount}
        totalWords={totalWords}
      />
    </>
  );
} 