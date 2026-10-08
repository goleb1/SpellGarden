'use client';

import { motion } from 'framer-motion';

interface FoundWordsListProps {
  words: string[];
  pangrams: string[];
  onWordClick: (word: string) => void;
}

// Found words plant a "garden of blooms" — each step up in length is a step up in
// vividness (soil → sprout → leaf → lilac → gold), and a pangram (using all 7
// letters) is the one pink bloom that stands apart from everything else.
function getWordStyle(word: string, isPangram: boolean): string {
  if (isPangram) {
    return "bg-gradient-to-br from-rose to-rose-deep text-rose-ink font-bold ring-1 ring-rose/60 shadow-lg shadow-rose/40";
  }
  switch (word.length) {
    case 4:
      return "bg-bloom4 text-bloom4-ink";
    case 5:
      return "bg-bloom5 text-bloom5-ink";
    case 6:
      return "bg-bloom6 text-bloom6-ink font-medium";
    case 7:
      return "bg-bloom7 text-bloom7-ink font-semibold";
    default:
      return "bg-bloom8 text-bloom8-ink font-bold";
  }
}

export default function FoundWordsList({ words, pangrams, onWordClick }: FoundWordsListProps) {
  return (
    <motion.div
      layout
      className="flex flex-wrap gap-2 sm:gap-3 p-1 justify-center wide:justify-start wide:p-4"
    >
      {words.map((word) => {
        const isPangram = pangrams.includes(word);
        return (
          <motion.button
            layout
            key={word}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              layout: { duration: 0.3, type: "spring", damping: 25, stiffness: 300 }
            }}
            onClick={() => onWordClick(word)}
            className={`px-3 py-1 rounded-full uppercase cursor-pointer hover:opacity-80 transition-opacity ${getWordStyle(word, isPangram)}`}
          >
            {word.toUpperCase()}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
