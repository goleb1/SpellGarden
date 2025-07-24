'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect, useCallback } from 'react';
import { WordDefinition, dictionaryService } from '@/lib/dictionaryService';

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
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDefinition(null);

    try {
      const result = await dictionaryService.getDefinition(word);
      if (result) {
        setDefinition(result);
      } else {
        setError('Definition not found');
      }
    } catch (err) {
      setError('Failed to load definition');
    } finally {
      setLoading(false);
    }
  }, [word]);

  useEffect(() => {
    if (isOpen && word) {
      fetchDefinition();
    }
  }, [isOpen, word, fetchDefinition]);

  const getWordStyle = () => {
    if (isPangram) {
      return "bg-gradient-to-r from-rose-500/80 to-pink-500/80 text-white";
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
            className="relative bg-[#1C1C1E] rounded-xl shadow-xl w-[95%] sm:w-[85%] md:w-[600px] mx-4 p-6 border border-[#2D5A27] overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full uppercase font-semibold ${getWordStyle()}`}>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
                  <span className="ml-3 text-gray-400">Loading definition...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="text-red-400 mb-2">📚</div>
                  <p className="text-gray-400">{error}</p>
                  <button
                    onClick={fetchDefinition}
                    className="mt-3 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full hover:bg-green-500/30 text-green-400 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {definition && (
                <div className="space-y-4">
                  {/* Phonetic */}
                  {definition.phonetic && (
                    <div className="text-center">
                      <span className="text-gray-400 text-lg font-mono">
                        {definition.phonetic}
                      </span>
                    </div>
                  )}

                  {/* Meanings */}
                  <div className="space-y-4">
                    {definition.meanings.map((meaning, meaningIndex) => (
                      <div key={meaningIndex} className="space-y-2">
                        <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                          {meaning.partOfSpeech}
                        </h3>
                        <div className="space-y-3">
                          {meaning.definitions.map((def, defIndex) => (
                            <div key={defIndex} className="pl-4 border-l border-[#2D5A27]">
                              <p className="text-white text-sm leading-relaxed">
                                {def.definition}
                              </p>
                              {def.example && (
                                <p className="text-gray-400 text-xs italic mt-1">
                                  &ldquo;{def.example}&rdquo;
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Etymology */}
                  {definition.origin && (
                    <div className="mt-6 pt-4 border-t border-[#2D5A27]">
                      <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wide mb-2">
                        Etymology
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {definition.origin}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-[#2D5A27] text-center">
              <p className="text-xs text-gray-500">
                Definitions provided by Free Dictionary API
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}