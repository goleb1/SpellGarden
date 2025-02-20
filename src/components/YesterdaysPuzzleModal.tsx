import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

interface YesterdaysPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  centerLetter: string;
  outerLetters: string[];
  validWords: {
    [key: number]: string[]; // Key is word length, value is array of words
  };
}

export default function YesterdaysPuzzleModal({
  isOpen,
  onClose,
  date,
  centerLetter,
  outerLetters,
  validWords,
}: YesterdaysPuzzleModalProps) {
  // Format the date as specified in the design
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // All letters in a single array for display
  const allLetters = [centerLetter, ...outerLetters];

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
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-3 text-gray-400 hover:text-white transition-colors z-20 rounded-full hover:bg-white/5"
            >
              <IoClose size={24} className="relative" />
            </button>

            {/* Title and Date */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Yesterday&apos;s Puzzle</h2>
              <p className="text-gray-400 text-sm">{formattedDate}</p>
            </div>

            {/* Letters Display */}
            <div className="flex justify-center gap-2 mb-8">
              {allLetters.map((letter, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl font-bold ${
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
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {Object.entries(validWords)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([length, words]) => (
                  <div key={length}>
                    <h3 className="text-gray-400 font-medium mb-3">
                      {length} LETTERS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {words.map((word) => (
                        <div
                          key={word}
                          className="px-3 py-1.5 bg-[#333333] rounded-full text-white text-sm sm:text-base"
                        >
                          {word.toUpperCase()}
                        </div>
                      ))}
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