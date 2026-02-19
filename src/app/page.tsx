'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import LetterGrid from '@/components/LetterGrid';
import LevelIndicator from '@/components/LevelIndicator';
import PuzzleInfo from '@/components/PuzzleInfo';
import YesterdaysPuzzleModal from '@/components/YesterdaysPuzzleModal';
import WordDefinitionModal from '@/components/WordDefinitionModal';
import HintsModal from '@/components/HintsModal';
import HowToPlayModal from '@/components/HowToPlayModal';
import { submitWord, shuffleLetters, getInitialGameState } from '@/lib/gameLogic';
import { getNextPuzzleTime, getPuzzleForDate } from '@/lib/puzzleManager';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGameState } from '@/lib/hooks/useGameState';
import Menu from '@/components/Menu';

type SortMode = 'alphabetical' | 'length' | 'chronological';

interface YesterdaysPuzzleData extends ReturnType<typeof getPuzzleForDate> {
  date: Date;
}

export default function Home() {
  const { user } = useAuth();
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState<{text: string; type: 'error' | 'success'} | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('chronological');
  const [timeToNextPuzzle, setTimeToNextPuzzle] = useState('');
  const [isYesterdaysPuzzleModalOpen, setIsYesterdaysPuzzleModalOpen] = useState(false);
  const [yesterdaysPuzzle, setYesterdaysPuzzle] = useState<YesterdaysPuzzleData | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [isWordDefinitionModalOpen, setIsWordDefinitionModalOpen] = useState(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  const initialGameState = getInitialGameState();
  const { gameState, updateState, loading: stateLoading, error: stateError } = useGameState(initialGameState.id);

  useEffect(() => {
    if (stateError) {
      setMessage({ text: stateError, type: 'error' });
    }
  }, [stateError]);

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

  // Get yesterday's puzzle data
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const puzzle = getPuzzleForDate(yesterday);
    
    setYesterdaysPuzzle({
      ...puzzle,
      date: yesterday
    });
  }, []);


  const handleLetterClick = (letter: string) => {
    setCurrentWord(prev => prev + letter);
  };

  const handleDelete = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const handleShuffle = () => {
    if (!gameState) return;
    updateState({
      letters: shuffleLetters(gameState.letters)
    });
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
    if (!gameState) return [];
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

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    setIsWordDefinitionModalOpen(true);
  };

  const handleCloseHowToPlay = () => {
    setIsHowToPlayModalOpen(false);
  };

  const handleShowHowToPlay = () => {
    setIsHowToPlayModalOpen(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting || !gameState) return;
    setIsSubmitting(true);

    try {
      const result = await submitWord(currentWord, gameState);
      
      if (result.isValid) {
        await updateState({
          score: gameState.score + result.score,
          foundWords: [...gameState.foundWords, currentWord.toLowerCase()]
        });
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
    if (!gameState) return;

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
  }, [gameState, handleDelete, handleSubmit, handleLetterClick, isSubmitting]);

  if (stateLoading || !gameState) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <style>{`
          @media screen and (max-width: 767px) {
            @media screen and (orientation: landscape) {
              html {
                transform: rotate(-90deg);
                transform-origin: left top;
                width: 100vh;
                height: 100vw;
                overflow-x: hidden;
                position: absolute;
                top: 100%;
                left: 0;
              }
            }
          }
        `}</style>
      </Head>
      <main className="min-h-screen p-4 bg-black text-white flex flex-col h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-8">
          {/* Top row with menu, title, info, and score on mobile */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center">
              <Menu 
                onShowYesterdaysPuzzle={() => setIsYesterdaysPuzzleModalOpen(true)}
                onShowHints={() => setIsHintsModalOpen(true)}
                onShowHowToPlay={handleShowHowToPlay}
                timeToNextPuzzle={timeToNextPuzzle}
              />
              <h1 className="text-2xl font-bold">SpellGarden</h1>
              <div className="ml-2">
                <PuzzleInfo 
                  bingoIsPossible={gameState.bingoIsPossible}
                  pangramCount={gameState.pangrams.length}
                  foundPangrams={gameState.foundWords.filter(word => gameState.pangrams.includes(word))}
                  foundWords={gameState.foundWords}
                  centerLetter={gameState.centerLetter}
                  outerLetters={gameState.letters}
                />
              </div>
            </div>
            {/* Score - visible on mobile only in header */}
            <div className="sm:hidden text-2xl font-bold min-w-[3ch] text-right">
              {gameState.score}
            </div>
          </div>

          {/* Level indicator row */}
          <div className="flex items-center justify-center sm:justify-start gap-4 w-full sm:w-auto">
            <LevelIndicator
              score={gameState.score}
              totalPossibleScore={gameState.totalPossibleScore}
              foundWordsCount={gameState.foundWords.length}
              totalWords={gameState.validWords.length}
            />
            {/* Score - visible on desktop only next to level indicator */}
            <div className="hidden sm:block text-2xl font-bold min-w-[3ch] text-right">
              {gameState.score}
            </div>
          </div>
        </div>

        {/* Game Container */}
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0 md:landscape:max-w-[1400px] md:landscape:grid md:landscape:grid-cols-[1fr_1px_minmax(350px,35%)] md:landscape:gap-x-8">
          {/* Game Board Section */}
          <div className="flex flex-col min-h-0 flex-1">
            {/* Word Input with Message Container */}
            <div className="relative mb-2 sm:mb-4 flex justify-center">
              {/* Absolutely positioned message */}
              <div className="absolute left-0 right-0 bottom-full mb-1 sm:mb-2">
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
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

              <input
                type="text"
                value={currentWord}
                className="w-full max-w-full sm:max-w-md md:max-w-lg p-2 sm:p-3 text-center text-xl sm:text-2xl font-semibold bg-white/10 text-white border-0 rounded-full"
                placeholder="Type or click letters"
                readOnly
              />
            </div>

            {/* Letter Grid Container */}
            <div className="flex justify-center items-center">
              <div className="relative w-[min(400px,85vw)] h-[min(400px,85vw)] md:landscape:w-[min(400px,50vw)] md:landscape:h-[min(400px,50vw)]">
                <LetterGrid
                  centerLetter={gameState.centerLetter}
                  outerLetters={gameState.letters}
                  onLetterClick={handleLetterClick}
                  bingoIsPossible={gameState.bingoIsPossible}
                  foundWords={gameState.foundWords}
                />
              </div>
            </div>

            {/* Control Buttons - Now directly under game board */}
            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-1.5 sm:gap-6 mt-2 sm:mt-6">
              <button 
                className="px-2 sm:px-8 py-1.5 sm:py-2.5 bg-green-500/20 border border-green-500/30 rounded-bl-3xl rounded-br-3xl rounded-tr-3xl hover:bg-green-500/30 text-green-400 transition-colors text-sm sm:text-base whitespace-nowrap order-1 sm:order-1"
                onClick={handleSort}
              >
                Sort {getSortEmoji(sortMode)}
              </button>
              <button 
                className="px-2 sm:px-8 py-1.5 sm:py-2.5 bg-green-500/20 border border-green-500/30 rounded-bl-3xl rounded-br-3xl rounded-tr-3xl hover:bg-green-500/30 text-green-400 transition-colors text-sm sm:text-base whitespace-nowrap order-2 sm:order-2"
                onClick={handleShuffle}
              >
                Shuffle
              </button>
              <button 
                className="px-2 sm:px-8 py-1.5 sm:py-2.5 bg-green-500/20 border border-green-500/30 rounded-bl-3xl rounded-br-3xl rounded-tl-3xl hover:bg-green-500/30 text-green-400 transition-colors text-sm sm:text-base whitespace-nowrap order-3 sm:order-3"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button 
                className={`px-2 sm:px-8 py-1.5 sm:py-2.5 bg-green-500/20 border border-green-500/30 rounded-bl-3xl rounded-br-3xl rounded-tl-3xl hover:bg-green-500/30 text-green-400 transition-colors text-sm sm:text-base whitespace-nowrap order-4 sm:order-4 ${
                  currentWord.length < 4 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSubmit}
                disabled={currentWord.length < 4}
              >
                Enter
              </button>
            </div>

            {/* Found Words - Mobile Only - Now at the bottom */}
            <div className="md:landscape:hidden flex-1 min-h-0 overflow-y-auto mt-4">
              <motion.div 
                layout
                className="flex flex-wrap gap-2 justify-center p-1"
              >
                {getSortedWords().map((word) => {
                  const isPangram = gameState.pangrams.includes(word);
                  const getWordStyle = () => {
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
                  };

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
                      onClick={() => handleWordClick(word)}
                      className={`px-3 py-1 rounded-full uppercase cursor-pointer hover:opacity-80 transition-opacity ${getWordStyle()}`}
                    >
                      {word.toUpperCase()}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:landscape:block w-px bg-white/20" />

          {/* Found Words - Desktop Only */}
          <div className="hidden md:landscape:flex md:landscape:flex-col md:landscape:pt-4 md:landscape:h-full md:landscape:overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <motion.div 
                layout
                className="flex flex-wrap gap-2 sm:gap-3 justify-start p-1 sm:p-4"
              >
                {getSortedWords().map((word) => {
                  const isPangram = gameState.pangrams.includes(word);
                  const getWordStyle = () => {
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
                  };

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
                      onClick={() => handleWordClick(word)}
                      className={`px-3 py-1 rounded-full uppercase cursor-pointer hover:opacity-80 transition-opacity ${getWordStyle()}`}
                    >
                      {word.toUpperCase()}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {yesterdaysPuzzle && (
          <YesterdaysPuzzleModal
            isOpen={isYesterdaysPuzzleModalOpen}
            onClose={() => setIsYesterdaysPuzzleModalOpen(false)}
            date={yesterdaysPuzzle.date}
            centerLetter={yesterdaysPuzzle.center_letter.toUpperCase()}
            outerLetters={yesterdaysPuzzle.outside_letters.map(l => l.toUpperCase())}
            validWords={yesterdaysPuzzle.valid_words}
            pangrams={yesterdaysPuzzle.pangrams}
            puzzleId={yesterdaysPuzzle.id}
            totalPossibleScore={yesterdaysPuzzle.total_score}
          />
        )}

        <WordDefinitionModal
          isOpen={isWordDefinitionModalOpen}
          onClose={() => setIsWordDefinitionModalOpen(false)}
          word={selectedWord}
          isPangram={gameState?.pangrams.includes(selectedWord) || false}
        />

        {gameState && (
          <HintsModal
            isOpen={isHintsModalOpen}
            onClose={() => setIsHintsModalOpen(false)}
            validWords={gameState.validWords}
            foundWords={gameState.foundWords}
            centerLetter={gameState.centerLetter}
            outerLetters={gameState.letters}
          />
        )}

        <HowToPlayModal
          isOpen={isHowToPlayModalOpen}
          onClose={handleCloseHowToPlay}
        />
      </main>
    </>
  );
}
