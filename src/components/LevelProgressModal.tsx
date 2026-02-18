import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS, Level, MOTHER_EARTH } from './LevelIndicator';
import { IoClose } from 'react-icons/io5';

interface LevelProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalPossibleScore: number;
  foundWordsCount: number;
  totalWords: number;
}

export default function LevelProgressModal({
  isOpen,
  onClose,
  score,
  totalPossibleScore,
  foundWordsCount,
  totalWords,
}: LevelProgressModalProps) {
  const progress = score / totalPossibleScore;
  const isMotherEarth = totalWords > 0 && foundWordsCount === totalWords;
  
  // Find current level
  const currentLevel = LEVELS.reduce((prev: Level, curr: Level) => {
    if (progress >= curr.threshold) return curr;
    return prev;
  }, LEVELS[0]);

  // Calculate the progress line height based on current progress between levels
  const calculateProgressHeight = () => {
    if (isMotherEarth) return 100;

    const SEGMENT_HEIGHT = 100 / 7; // Height per segment with 7 gaps between 8 levels
    
    // If we haven't reached Sprout yet
    if (progress < LEVELS[1].threshold) {
      return (progress / LEVELS[1].threshold) * SEGMENT_HEIGHT; // First segment
    }
    
    // Find the current level index
    const currentLevelIndex = LEVELS.findIndex(level => level.name === currentLevel.name);
    const currentThreshold = LEVELS[currentLevelIndex].threshold;
    const nextThreshold = LEVELS[currentLevelIndex + 1]?.threshold ?? 1;
    
    // Calculate base height for completed levels
    const baseHeight = currentLevelIndex * SEGMENT_HEIGHT;
    
    // Calculate progress to next level
    const levelProgress = (progress - currentThreshold) / (nextThreshold - currentThreshold);
    const additionalHeight = Math.min(levelProgress * SEGMENT_HEIGHT, SEGMENT_HEIGHT);
    
    return Math.min(baseHeight + additionalHeight, 100);
  };

  // Calculate the score at which each level was completed
  const getLevelScore = (level: Level, nextLevel: Level | undefined) => {
    if (level.name === currentLevel.name) {
      return score; // Show current score for current level
    }
    if (nextLevel && progress >= nextLevel.threshold) {
      return Math.ceil(nextLevel.threshold * totalPossibleScore); // Show threshold for completed levels
    }
    return Math.ceil(level.threshold * totalPossibleScore); // Show threshold for uncompleted levels
  };

  // Calculate points needed for next levels
  const getPointsAway = (threshold: number) => {
    return Math.ceil(threshold * totalPossibleScore - score);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-[#1C1C1E] rounded-xl shadow-xl w-full max-w-[400px] min-w-[280px] mx-4 p-6 border border-[#2D5A27] overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-3 text-gray-400 hover:text-white transition-colors z-20 rounded-full hover:bg-white/5"
            >
              <IoClose size={24} className="relative" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-6 text-white relative z-20">Keep Growing! 🍃</h2>

            {/* Level progression */}
            <div className="space-y-8 relative">
              {/* Vertical progress bar container */}
              <div className="absolute left-[17px] top-5 bottom-5 w-[6px] bg-[#333333] z-0">
                <motion.div
                  initial={false}
                  animate={{ 
                    height: `${calculateProgressHeight()}%`
                  }}
                  className="absolute bottom-0 left-0 w-full bg-[#2D5A27] origin-bottom"
                />
              </div>

              {/* Mother Earth — only shown when all words are found */}
              {isMotherEarth && (
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-[#142911] border-[#2D5A27] relative z-10 ring-2 ring-[#2D5A27] ring-offset-2 ring-offset-[#1C1C1E]">
                      <span className="text-lg">{MOTHER_EARTH.emoji}</span>
                    </div>
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#2D5A27] -translate-y-1" />
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#2D5A27] translate-y-1" />
                        <span className="font-medium text-white py-2">{MOTHER_EARTH.name}</span>
                        <span className="font-bold text-white py-2">{score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {[...LEVELS].reverse().map((level, index, array) => {
                const reversedIndex = array.length - 1 - index;
                const isCompleted = progress >= level.threshold;
                // When Mother Earth is earned, no regular level is "current"
                const isCurrent = !isMotherEarth && level.name === currentLevel.name;
                const pointsAway = getPointsAway(level.threshold);
                const nextLevel = LEVELS[reversedIndex + 1];

                return (
                  <div key={level.name} className="relative">
                    {/* Level indicator */}
                    <div className="flex items-center gap-4">
                      {/* Circle indicator - width: 40px (w-10) */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-[#1C1C1E] relative z-10 ${
                          isCompleted
                            ? 'bg-[#142911] border-[#2D5A27]'
                            : 'border-[#333333]'
                        } ${isCurrent ? 'ring-2 ring-[#2D5A27] ring-offset-2 ring-offset-[#1C1C1E]' : ''}`}
                      >
                        <span className="text-lg">{level.emoji}</span>
                      </div>

                      <div className="flex-1 relative z-10">
                        <div className="flex items-center justify-between relative">
                          {/* Current level underlines */}
                          {isCurrent && (
                            <>
                              {/* Top line */}
                              <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#2D5A27] -translate-y-1" />
                              {/* Bottom line */}
                              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#2D5A27] translate-y-1" />
                            </>
                          )}
                          <span className={`font-medium ${isCompleted && !isCurrent ? 'text-[#888888]' : 'text-white'} ${isCurrent ? 'py-2' : ''}`}>
                            {level.name}
                          </span>
                          <span className={`font-bold ${isCompleted && !isCurrent ? 'text-[#888888]' : 'text-white'} ${isCurrent ? 'py-2' : ''}`}>
                            {getLevelScore(level, nextLevel)}
                          </span>
                        </div>
                        {!isCompleted && (
                          <p className="text-sm text-[#666666]">{pointsAway} points away</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 