'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LetterGrid from '@/components/LetterGrid';
import LevelIndicator from '@/components/LevelIndicator';
import { submitWord, shuffleLetters, getInitialGameState } from '@/lib/gameLogic';
import { getNextPuzzleTime } from '@/lib/puzzleManager';

type SortMode = 'alphabetical' | 'length' | 'chronological';

export default function Home() {
  const [gameState, setGameState] = useState(getInitialGameState());
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState<{text: string; type: 'error' | 'success'} | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('chronological');
  const [timeToNextPuzzle, setTimeToNextPuzzle] = useState('');

  // Load saved game state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only restore if parsed data is valid and it's the same puzzle
        if (parsed && parsed.id && parsed.id === gameState.id) {
          setGameState(parsed);
        } else {
          // Clear saved state if it's invalid or a different puzzle
          localStorage.removeItem('gameState');
        }
      }
    } catch (error) {
      // If there's any error parsing the saved state, remove it
      console.error('Error loading saved game state:', error);
      localStorage.removeItem('gameState');
    }
  }, [gameState.id]);

  // Save game state when it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const next = getNextPuzzleTime();
      const diff = next.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeToNextPuzzle(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleLetterClick = (letter: string) => {
    setCurrentWord(prev => prev + letter);
  };

  const handleDelete = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const handleShuffle = () => {
    setGameState(prev => ({
      ...prev,
      letters: shuffleLetters(prev.letters)
    }));
  };

  const handleSort = () => {
    setSortMode(prev => {
      switch (prev) {
        case 'chronological':
          return 'alphabetical';
        case 'alphabetical':
          return 'length';
        case 'length':
          return 'chronological';
      }
    });
  };

  const getSortEmoji = (mode: SortMode) => {
    switch (mode) {
      case 'chronological':
        return '⏪';
      case 'alphabetical':
        return '🔤';
      case 'length':
        return '📶';
    }
  };

  const getSortedWords = () => {
    const words = [...gameState.foundWords];
    switch (sortMode) {
      case 'alphabetical':
        return words.sort();
      case 'length':
        return words.sort((a, b) => b.length - a.length);
      case 'chronological':
        return words.reverse();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await submitWord(currentWord, gameState);
      
      if (result.isValid) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + result.score,
          foundWords: [...prev.foundWords, currentWord.toLowerCase()]
        }));
      }
      
      if (result.message) {
        setMessage({
          text: result.message,
          type: result.messageType || 'error'
        });
      }
    } catch (error) {
      console.error('Error submitting word:', error);
      setMessage({
        text: 'An error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
      setCurrentWord('');
      // Clear message after 2 seconds
      setTimeout(() => setMessage(undefined), 2000);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter' && !isSubmitting) {
        handleSubmit();
      } else {
        const letter = e.key.toUpperCase();
        if ([gameState.centerLetter, ...gameState.letters].includes(letter)) {
          handleLetterClick(letter);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.centerLetter, gameState.letters, currentWord, isSubmitting]);

  return (
    <main className="min-h-screen p-4 bg-black text-white flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
        <div className="flex items-center mb-2 sm:mb-0">
          <h1 className="text-2xl font-bold">SpellGarden</h1>
          <span className="ml-2">🌸</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="hidden sm:block text-sm text-gray-400">
            Next puzzle in: {timeToNextPuzzle}
          </div>
          <LevelIndicator 
            score={gameState.score} 
            totalPossibleScore={gameState.totalPossibleScore} 
          />
          <div className="text-3xl sm:text-4xl font-bold">{gameState.score}</div>
        </div>
      </div>

      {/* Game Container */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Word Input with Message Container */}
        <div className="relative">
          <input
            type="text"
            value={currentWord}
            className="w-full p-2 sm:p-3 text-center text-xl sm:text-2xl font-semibold bg-white/10 text-white border-0 rounded-lg mb-2"
            placeholder="Type or click letters"
            readOnly
          />
          
          {/* Absolutely positioned message */}
          <div className="absolute left-0 right-0 top-full">
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-center text-lg font-semibold ${
                    message.type === 'error' ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Letter Grid Container with Fixed Aspect Ratio */}
        <div className="mb-2 flex justify-center items-center">
          <div className="relative w-[min(400px,85vw)] h-[min(400px,85vw)]">
            <LetterGrid
              centerLetter={gameState.centerLetter}
              outerLetters={gameState.letters}
              onLetterClick={handleLetterClick}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:justify-center gap-1.5 sm:gap-4 mb-2">
          <button 
            className="px-2 sm:px-6 py-1.5 sm:py-2 border border-white/20 rounded-lg hover:bg-white/10 text-white/90 transition-colors text-sm sm:text-base whitespace-nowrap"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button 
            className="px-2 sm:px-6 py-1.5 sm:py-2 border border-white/20 rounded-lg hover:bg-white/10 text-white/90 transition-colors text-sm sm:text-base whitespace-nowrap"
            onClick={handleShuffle}
          >
            Shuffle
          </button>
          <button 
            className="px-2 sm:px-6 py-1.5 sm:py-2 border border-white/20 rounded-lg hover:bg-white/10 text-white/90 transition-colors text-sm sm:text-base whitespace-nowrap"
            onClick={handleSort}
          >
            Sort {getSortEmoji(sortMode)}
          </button>
          <button 
            className={`px-2 sm:px-6 py-1.5 sm:py-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-green-400 transition-colors text-sm sm:text-base whitespace-nowrap ${
              currentWord.length < 4 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleSubmit}
            disabled={currentWord.length < 4}
          >
            Enter
          </button>
        </div>

        {/* Found Words */}
        <div className="pt-2 border-t border-white/20">
          <div className="flex-1 min-h-0 overflow-y-auto max-h-[25vh]">
            <div className="flex flex-wrap gap-2 justify-center">
              {getSortedWords().map((word, index) => (
                <motion.div
                  key={word + index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-white/10 text-white/90 rounded-full uppercase"
                >
                  {word.toUpperCase()}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
