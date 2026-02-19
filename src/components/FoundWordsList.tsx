'use client';

import { motion } from 'framer-motion';

interface FoundWordsListProps {
  words: string[];
  pangrams: string[];
  onWordClick: (word: string) => void;
  justify?: 'center' | 'start';
}

function getWordStyle(word: string, isPangram: boolean): string {
  if (isPangram) {
    return "bg-gradient-to-r from-rose-500/80 to-pink-500/80 text-white font-semibold shadow-lg shadow-rose-500/20";
  }
  switch (word.length) {
    case 4:
      return "bg-white/10 text-white/90";
    case 5:
      return "bg-emerald-500/20 text-emerald-100";
    case 6:
      return "bg-violet-500/30 text-violet-100";
    case 7:
      return "bg-amber-500/30 text-amber-100";
    default:
      return "bg-blue-500/30 text-blue-100";
  }
}

export default function FoundWordsList({ words, pangrams, onWordClick, justify = 'center' }: FoundWordsListProps) {
  const justifyClass = justify === 'start' ? 'justify-start p-1 sm:p-4' : 'justify-center p-1';

  return (
    <motion.div
      layout
      className={`flex flex-wrap gap-2 sm:gap-3 ${justifyClass}`}
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
