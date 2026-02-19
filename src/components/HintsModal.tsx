'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateLetterCountGrid,
  generateTwoLetterHints,
  generateWordClues,
  EnhancedDefinitionService,
  type LetterCountGrid,
  type TwoLetterHints,
  type WordClue
} from '@/lib/hintLogic';
import { dictionaryService } from '@/lib/dictionaryService';

interface HintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  validWords: string[];
  foundWords: string[];
  centerLetter: string;
  outerLetters: string[];
}

type HintLevel = 'level1' | 'level2' | 'level3';

// Per-card reveal level: 0 = collapsed, 1 = first letter, 2 = hint phrase, 3 = full definition
type RevealLevels = Record<number, number>;

export default function HintsModal({
  isOpen,
  onClose,
  validWords,
  foundWords,
  centerLetter,
  outerLetters
}: HintsModalProps) {
  const [activeLevel, setActiveLevel] = useState<HintLevel>('level1');
  const [wordClues, setWordClues] = useState<WordClue[]>([]);
  const [loadingClues, setLoadingClues] = useState(false);
  const [revealLevels, setRevealLevels] = useState<RevealLevels>({});

  const definitionService = useMemo(() => new EnhancedDefinitionService(dictionaryService), []);

  // Memoize expensive calculations
  const letterCountGrid = useMemo(() =>
    generateLetterCountGrid(validWords, foundWords),
    [validWords, foundWords]
  );

  const twoLetterHints = useMemo(() =>
    generateTwoLetterHints(validWords, foundWords),
    [validWords, foundWords]
  );

  // Load word clues when Level 3 is selected
  useEffect(() => {
    if (activeLevel === 'level3' && wordClues.length === 0 && !loadingClues) {
      setLoadingClues(true);
      generateWordClues(validWords, foundWords, definitionService)
        .then(clues => {
          setWordClues(clues);
          setLoadingClues(false);
        })
        .catch(error => {
          console.error('Error loading word clues:', error);
          setLoadingClues(false);
        });
    }
  }, [activeLevel, validWords, foundWords, definitionService, wordClues.length, loadingClues]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveLevel('level1');
      setWordClues([]);
      setRevealLevels({});
    }
  }, [isOpen]);

  const revealNext = (index: number) => {
    setRevealLevels(prev => ({
      ...prev,
      [index]: Math.min((prev[index] ?? 0) + 1, 3)
    }));
  };

  const renderLetterCountGrid = () => {
    const letters = Object.keys(letterCountGrid).sort();
    const allLengths = new Set<number>();

    // Collect all possible word lengths
    Object.values(letterCountGrid).forEach(lengthCounts => {
      Object.keys(lengthCounts).forEach(length => {
        allLengths.add(parseInt(length));
      });
    });

    const sortedLengths = Array.from(allLengths).sort((a, b) => a - b);
    const maxLength = Math.max(...sortedLengths);

    // Group lengths: 4, 5, 6, 7, 8+
    const displayLengths = [4, 5, 6, 7];
    if (maxLength > 7) {
      displayLengths.push(8); // Represents 8+
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-2 py-1 text-gray-400">Letter</th>
              {displayLengths.map(length => (
                <th key={length} className="text-center px-2 py-1 text-gray-400">
                  {length === 8 ? '8+' : length}
                </th>
              ))}
              <th className="text-center px-2 py-1 text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody>
            {letters.map(letter => {
              const isCenterLetter = letter === centerLetter;
              const rowClass = isCenterLetter ? 'bg-green-500/20' : '';

              let rowTotal = 0;
              const cellValues = displayLengths.map(displayLength => {
                if (displayLength === 8) {
                  // Sum all lengths 8 and above
                  let count = 0;
                  Object.entries(letterCountGrid[letter] || {}).forEach(([len, cnt]) => {
                    if (parseInt(len) >= 8) {
                      count += cnt;
                    }
                  });
                  rowTotal += count;
                  return count;
                } else {
                  const count = letterCountGrid[letter]?.[displayLength] || 0;
                  rowTotal += count;
                  return count;
                }
              });

              return (
                <tr key={letter} className={rowClass}>
                  <td className={`px-2 py-1 font-medium ${isCenterLetter ? 'text-green-400' : 'text-white'}`}>
                    {letter}
                  </td>
                  {cellValues.map((count, index) => (
                    <td key={displayLengths[index]} className="text-center px-2 py-1 text-gray-300">
                      {count > 0 ? count : '-'}
                    </td>
                  ))}
                  <td className="text-center px-2 py-1 font-medium text-white">
                    {rowTotal}
                  </td>
                </tr>
              );
            })}
            {/* Column totals */}
            <tr className="border-t border-gray-600 mt-2">
              <td className="px-2 py-1 font-medium text-gray-400">Total</td>
              {displayLengths.map(displayLength => {
                let columnTotal = 0;
                letters.forEach(letter => {
                  if (displayLength === 8) {
                    Object.entries(letterCountGrid[letter] || {}).forEach(([len, cnt]) => {
                      if (parseInt(len) >= 8) {
                        columnTotal += cnt;
                      }
                    });
                  } else {
                    columnTotal += letterCountGrid[letter]?.[displayLength] || 0;
                  }
                });
                return (
                  <td key={displayLength} className="text-center px-2 py-1 font-medium text-white">
                    {columnTotal}
                  </td>
                );
              })}
              <td className="text-center px-2 py-1 font-bold text-green-400">
                {Object.values(letterCountGrid).reduce((total, lengths) =>
                  total + Object.values(lengths).reduce((sum, count) => sum + count, 0), 0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderTwoLetterHints = () => {
    const sortedTwoLetters = Object.entries(twoLetterHints)
      .sort(([a], [b]) => a.localeCompare(b));

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sortedTwoLetters.map(([letters, count]) => (
          <div
            key={letters}
            className="flex items-center justify-between p-2 bg-white/10 rounded-lg"
          >
            <span className="font-medium text-white">{letters}</span>
            <span className="text-green-400 font-bold">{count}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderWordClues = () => {
    if (loadingClues) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
          <span className="ml-3 text-gray-400">Loading word clues...</span>
        </div>
      );
    }

    if (wordClues.length === 0) {
      return (
        <p className="text-gray-400 text-center py-8">No clues available.</p>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-gray-500 text-xs mb-3">
          Each clue starts hidden. Tap <span className="text-gray-300">Reveal</span> to uncover more — one step at a time.
        </p>
        {wordClues.map((clue, index) => {
          const level = revealLevels[index] ?? 0;
          const isFullyRevealed = level >= 3;

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors ${
                isFullyRevealed
                  ? 'bg-white/5 border-gray-700 opacity-70'
                  : 'bg-white/10 border-green-500/20'
              }`}
            >
              {/* Always visible: word length + part of speech */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-green-400 font-bold text-sm">
                    {clue.wordLength} letters
                  </span>
                  {clue.partOfSpeech && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 text-sm italic">
                        {clue.partOfSpeech}
                      </span>
                    </>
                  )}
                  {/* Tap 1: first letter */}
                  {level >= 1 && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-white text-sm font-medium">
                        starts with <span className="text-green-300">{clue.firstLetter}</span>
                      </span>
                    </>
                  )}
                </div>

                {!isFullyRevealed && (
                  <button
                    onClick={() => revealNext(index)}
                    className="ml-2 shrink-0 px-2 py-1 text-xs rounded bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    Reveal
                  </button>
                )}
                {isFullyRevealed && (
                  <span className="ml-2 shrink-0 text-xs text-gray-600">revealed</span>
                )}
              </div>

              {/* Tap 2: hint phrase */}
              {level >= 2 && (
                <p className="mt-2 text-gray-300 text-sm italic border-t border-gray-700/50 pt-2">
                  {clue.hintPhrase}
                </p>
              )}

              {/* Tap 3: full definition */}
              {level >= 3 && (
                <p className="mt-2 text-gray-200 text-sm border-t border-gray-700/50 pt-2">
                  {clue.definition}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeLevel) {
      case 'level1':
        return renderLetterCountGrid();
      case 'level2':
        return renderTwoLetterHints();
      case 'level3':
        return renderWordClues();
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#1C1C1E] border border-[#2D5A27] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Hints</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close hints"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Hint Level Buttons */}
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveLevel('level1')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeLevel === 'level1'
                      ? 'bg-green-500/20 text-green-400 border-b-2 border-green-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Letter Counts hint level"
                >
                  📊 Letter Counts
                </button>
                <button
                  onClick={() => setActiveLevel('level2')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeLevel === 'level2'
                      ? 'bg-green-500/20 text-green-400 border-b-2 border-green-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Two-Letter List hint level"
                >
                  🔤 Two-Letter List
                </button>
                <button
                  onClick={() => setActiveLevel('level3')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeLevel === 'level3'
                      ? 'bg-green-500/20 text-green-400 border-b-2 border-green-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Word Clues hint level"
                >
                  💡 Word Clues
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
