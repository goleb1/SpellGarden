import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { LEVELS, MOTHER_EARTH } from './LevelIndicator';
import WordDefinitionContent, { getWordStyle } from './WordDefinitionContent';

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

// Slide animation variants — custom value is the direction: 1 = forward, -1 = back
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

const slideTransition = { duration: 0.2, ease: 'easeInOut' };

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
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const allLetters = [centerLetter, ...outerLetters];

  useEffect(() => {
    const fetchFoundWords = async () => {
      if (isOpen) {
        setSelectedWord(null);
        try {
          if (user) {
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

  const progress = score / totalPossibleScore;
  const currentLevel = LEVELS.reduce((prev, curr) => {
    if (progress >= curr.threshold) return curr;
    return prev;
  }, LEVELS[0]);
  const isMotherEarth = foundWords.length > 0 && foundWords.length === validWords.length;
  const displayLevel = isMotherEarth ? MOTHER_EARTH : currentLevel;
  const wordCompletionPercentage = Math.round((foundWords.length / validWords.length) * 100);

  const groupedWords = validWords.reduce((acc, word) => {
    const firstLetter = word[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(word);
    return acc;
  }, {} as Record<string, string[]>);

  const letterGroups = Object.entries(groupedWords).sort(([a], [b]) => a.localeCompare(b));

  const foundWordsSet = new Set(foundWords);
  const pangramsSet = new Set(pangrams);

  const handleWordClick = (word: string) => {
    setDirection(1);
    setSelectedWord(word);
  };

  const handleBack = () => {
    setDirection(-1);
    setSelectedWord(null);
  };

  const selectedWordIsPangram = selectedWord ? pangramsSet.has(selectedWord) : false;

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
            className="relative bg-surface rounded-xl shadow-xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[800px] min-w-[280px] mx-4 p-6 border border-ink/15 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header — always static */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-semibold text-ink">Yesterday&apos;s Puzzle</h2>
                <p className="text-xs sm:text-sm text-muted">{formattedDate}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-ink transition-colors rounded-full hover:bg-ink/5 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Performance Summary */}
            <div className="mb-4 p-3 bg-bg rounded-lg border border-ink/15 text-sm">
              <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2">
                <div className="text-center">
                  <div className="text-muted text-xs mb-0.5">Score</div>
                  <div className="text-xl font-display font-bold text-ink leading-none mb-0.5">{score}</div>
                  <div className="text-[10px] text-muted leading-none">of {totalPossibleScore}</div>
                </div>
                <div className="text-center border-l border-r border-ink/15 px-3">
                  <div className="text-muted text-xs mb-0.5">Level</div>
                  <div className="flex items-center justify-center gap-1.5">
                    <displayLevel.icon size={18} weight="duotone" className="text-leaf" />
                    <span className="text-ink font-medium text-sm leading-none">{displayLevel.name}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted text-xs mb-0.5">Words</div>
                  <div className="text-xl font-display font-bold text-ink leading-none mb-0.5">{foundWords.length}</div>
                  <div className="text-[10px] text-muted leading-none">({wordCompletionPercentage}%)</div>
                </div>
              </div>
            </div>

            {/* Letters Display */}
            <div className="flex justify-center gap-1.5 mb-3">
              {allLetters.map((letter, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-base sm:text-xl font-display font-bold ${
                    index === 0
                      ? 'bg-gold text-gold-ink'
                      : 'bg-petal-found text-petal-ink'
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Word pill row — fixed height so nothing above shifts when a word is selected */}
            <div className="h-9 flex items-center mb-3">
              <AnimatePresence initial={false}>
                {selectedWord !== null && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={slideTransition}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={handleBack}
                      className="p-1.5 text-muted hover:text-ink transition-colors rounded-full hover:bg-ink/5 shrink-0"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div className={`px-3 py-1 rounded-full uppercase font-display font-semibold text-sm ${getWordStyle(selectedWord, selectedWordIsPangram)}`}>
                      {selectedWord.toUpperCase()}
                    </div>
                    {selectedWordIsPangram && (
                      <span className="text-xs px-2 py-1 bg-rose/20 text-rose rounded-full border border-rose/30 hidden sm:inline">
                        PANGRAM
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Body — slides between word list and definition */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {selectedWord === null ? (
                  <motion.div
                    key="word-list"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                    className="space-y-4 pr-2"
                  >
                    {letterGroups.map(([letter, words]) => (
                      <div key={letter}>
                        <h3 className="text-muted font-medium mb-2 text-sm">{letter}</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {words.map((word) => {
                            const isFound = foundWordsSet.has(word);
                            const isPangram = pangramsSet.has(word);
                            return (
                              <button
                                key={word}
                                onClick={() => handleWordClick(word)}
                                className={`px-2.5 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                                  isPangram
                                    ? (isFound ? 'bg-gradient-to-r from-rose to-rose-deep text-rose-ink shadow-lg shadow-rose/30 font-semibold' : 'bg-ink/10 border border-rose/50 text-muted')
                                    : (isFound ? 'bg-leaf text-bg' : 'bg-ink/10 text-muted')
                                }`}
                              >
                                {word.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`definition-${selectedWord}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                    className="flex flex-col"
                  >
                    <WordDefinitionContent word={selectedWord} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
