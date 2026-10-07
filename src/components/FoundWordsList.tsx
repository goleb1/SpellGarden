'use client';

import { motion } from 'framer-motion';

interface FoundWordsListProps {
  words: string[];
  pangrams: string[];
  onWordClick: (word: string) => void;
}

// Found words plant a "garden of blooms" — longer words earn richer blooms, and a
// pangram (using all 7 letters) is the rarest bloom of all.
function getWordStyle(word: string, isPangram: boolean): string {
  if (isPangram) {
    return "bg-gradient-to-br from-gold to-rose text-[#2A1208] font-bold shadow-lg shadow-rose/20";
  }
  switch (word.length) {
    case 4:
      return "bg-bloom4 text-bloom4-ink";
    case 5:
      return "bg-bloom5 text-bloom5-ink font-semibold";
    case 6:
      return "bg-bloom6 text-bloom6-ink font-semibold";
    case 7:
      return "bg-bloom7 text-bloom7-ink font-semibold";
    default:
      return "bg-bloom8 text-bloom8-ink font-semibold";
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
