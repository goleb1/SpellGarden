import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { LEVELS } from './LevelIndicator';

interface YesterdaysPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  centerLetter: string;
  outerLetters: string[];
  validWords: string[];
  pangrams: string[];
  puzzleId: string;
  totalPossibleScore: number;
}

export default function YesterdaysPuzzleModal({
  isOpen,
  onClose,
  date,
  centerLetter,
  outerLetters,
  validWords,
  pangrams,
  puzzleId,
  totalPossibleScore,
}: YesterdaysPuzzleModalProps) {
  const { user } = useAuth();
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Format the date as specified in the design
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // All letters in a single array for display
  const allLetters = [centerLetter, ...outerLetters];

  // Fetch user's found words when modal opens
  useEffect(() => {
    const fetchFoundWords = async () => {
      if (isOpen) {
        try {
          if (user) {
            // Fetch from Firestore for authenticated users
            const progressRef = doc(db, `users/${user.uid}/progress/${puzzleId}`);
            const docSnap = await getDoc(progressRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setFoundWords(data.foundWords || []);
              setScore(data.score || 0);
            } else {
              setFoundWords([]);
              setScore(0);
            }
          } else {
            // Fetch from localStorage for guests
            const savedState = localStorage.getItem(`gameState_${puzzleId}`);
            if (savedState) {
              const parsedState = JSON.parse(savedState);
              setFoundWords(parsedState.foundWords || []);
              setScore(parsedState.score || 0);
            } else {
              setFoundWords([]);
              setScore(0);
            }
          }
        } catch (error) {
          console.error('Error fetching found words:', error);
          setFoundWords([]);
          setScore(0);
        }
      }
    };

    fetchFoundWords();
  }, [isOpen, puzzleId, user]);

  // Calculate performance metrics
  const progress = score / totalPossibleScore;
  const currentLevel = LEVELS.reduce((prev, curr) => {
    if (progress >= curr.threshold) return curr;
    return prev;
  }, LEVELS[0]);
  const wordCompletionPercentage = Math.round((foundWords.length / validWords.length) * 100);

  // Group words by starting letter
  const groupedWords = validWords.reduce((acc, word) => {
    const firstLetter = word[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(word);
    return acc;
  }, {} as Record<string, string[]>);

  // Sort letter groups alphabetically
  const letterGroups = Object.entries(groupedWords).sort(([a], [b]) => a.localeCompare(b));

  // Convert to Sets for faster lookups
  const foundWordsSet = new Set(foundWords);
  const pangramsSet = new Set(pangrams);

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
            className="relative bg-[#1C1C1E] rounded-xl shadow-xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[800px] min-w-[280px] mx-4 p-6 border border-[#2D5A27] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Title and Date */}
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Yesterday&apos;s Puzzle</h2>
                <p className="text-xs sm:text-sm text-gray-400">{formattedDate}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <IoClose size={20} className="relative" />
              </button>
            </div>

            {/* Performance Summary */}
            <div className="mb-4 p-3 bg-[#142911] rounded-lg border border-[#2D5A27] text-sm">
              <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2">
                {/* Score */}
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-0.5">Score</div>
                  <div className="text-xl font-bold text-white leading-none mb-0.5">{score}</div>
                  <div className="text-[10px] text-gray-500 leading-none">of {totalPossibleScore}</div>
                </div>

                {/* Level */}
                <div className="text-center border-l border-r border-[#2D5A27]/50 px-3">
                  <div className="text-gray-400 text-xs mb-0.5">Level</div>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-lg">{currentLevel.emoji}</span>
                    <span className="text-white font-medium text-sm leading-none">{currentLevel.name}</span>
                  </div>
                </div>

                {/* Word Completion */}
                <div className="text-center">
                  <div className="text-gray-400 text-xs mb-0.5">Words</div>
                  <div className="text-xl font-bold text-white leading-none mb-0.5">{foundWords.length}</div>
                  <div className="text-[10px] text-gray-500 leading-none">({wordCompletionPercentage}%)</div>
                </div>
              </div>
            </div>

            {/* Letters Display */}
            <div className="flex justify-center gap-1.5 mb-4">
              {allLetters.map((letter, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-base sm:text-xl font-bold ${
                    index === 0
                      ? 'bg-[#2D5A27] text-white'
                      : 'bg-[#333333] text-white'
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Word Lists */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {letterGroups.map(([letter, words]) => (
                <div key={letter}>
                  <h3 className="text-gray-400 font-medium mb-2 text-sm">{letter}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {words.map((word) => {
                      const isFound = foundWordsSet.has(word);
                      const isPangram = pangramsSet.has(word);
                      return (
                        <div
                          key={word}
                          className={`px-2.5 py-1 rounded-full text-white text-sm ${
                            isPangram
                              ? (isFound ? 'bg-gradient-to-r from-rose-500/80 to-pink-500/80 shadow-lg shadow-rose-500/20 font-semibold' : 'bg-[#333333] border border-pink-500')
                              : (isFound ? 'bg-[#2D5A27]' : 'bg-[#333333]')
                          }`}
                        >
                          {word.toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 