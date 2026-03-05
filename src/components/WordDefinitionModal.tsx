'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import WordDefinitionContent, { getWordStyle } from './WordDefinitionContent';

interface WordDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  isPangram?: boolean;
}

export default function WordDefinitionModal({
  isOpen,
  onClose,
  word,
  isPangram = false
}: WordDefinitionModalProps) {
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
            className="relative bg-[#1C1C1E] rounded-xl shadow-xl w-[95%] sm:w-[85%] md:w-[600px] mx-4 p-6 border border-[#2D5A27] overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full uppercase font-semibold ${getWordStyle(word, isPangram)}`}>
                  {word.toUpperCase()}
                </div>
                {isPangram && (
                  <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                    PANGRAM
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <IoClose size={20} />
              </button>
            </div>

            <WordDefinitionContent word={word} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
