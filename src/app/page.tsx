'use client';

import { useState, useEffect, useCallback } from 'react';
import LetterGrid from '@/components/LetterGrid';
import GameHeader from '@/components/GameHeader';
import WordInput, { type GameMessage } from '@/components/WordInput';
import GameControls from '@/components/GameControls';
import YesterdaysPuzzleModal from '@/components/YesterdaysPuzzleModal';
import WordDefinitionModal from '@/components/WordDefinitionModal';
import HintsModal from '@/components/HintsModal';
import HowToPlayModal from '@/components/HowToPlayModal';
import { submitWord, shuffleLetters } from '@/lib/gameLogic';
import { useGameState } from '@/lib/hooks/useGameState';
import { usePuzzle } from '@/lib/hooks/usePuzzle';
import FoundWordsList from '@/components/FoundWordsList';

type SortMode = 'alphabetical' | 'length' | 'chronological';
type ActiveModal = 'yesterday' | 'definition' | 'hints' | 'howToPlay' | null;

export default function Home() {
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState<GameMessage | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('chronological');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedWord, setSelectedWord] = useState<string>('');

  const { puzzle, yesterdaysPuzzle, yesterdaysDate, error: puzzleError, retry: retryPuzzle } = usePuzzle();
  const { gameState, updateState, loading: stateLoading, error: stateError } = useGameState(puzzle);

  useEffect(() => {
    if (stateError) {
      setMessage({ text: stateError, type: 'error' });
    }
  }, [stateError]);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleLetterClick = useCallback((letter: string) => {
    setCurrentWord(prev => prev + letter);
  }, []);

  const handleDelete = useCallback(() => {
    setCurrentWord(prev => prev.slice(0, -1));
  }, []);

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

  const getSortLabel = (mode: SortMode) => {
    switch (mode) {
      case 'chronological':
        return 'Newest';
      case 'alphabetical':
        return 'A–Z';
      case 'length':
        return 'Length';
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
    setActiveModal('definition');
  };

  const handleSubmit = useCallback(async () => {
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
  }, [isSubmitting, gameState, currentWord, updateState]);

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

  if (puzzleError && !gameState) {
    return (
      <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted">{puzzleError}</p>
        <button
          onClick={retryPuzzle}
          className="px-5 py-2 rounded-full bg-gold text-gold-ink font-display font-semibold"
        >
          Try again
        </button>
      </div>
    );
  }

  if (stateLoading || !gameState) {
    return (
      <div className="min-h-screen bg-bg text-ink flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-bg text-ink flex flex-col h-screen">
      <GameHeader
        gameState={gameState}
        onShowYesterdaysPuzzle={() => setActiveModal('yesterday')}
        onShowHints={() => setActiveModal('hints')}
        onShowHowToPlay={() => setActiveModal('howToPlay')}
      />

      {/* Game Container */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0 wide:max-w-[1400px] wide:grid wide:grid-cols-[1fr_1px_minmax(350px,35%)] wide:gap-x-8">
        {/* Game Board Section */}
        <div className="flex flex-col wide:min-h-0">
          <WordInput currentWord={currentWord} message={message} />

          {/* Letter Grid Container */}
          <div className="flex justify-center items-center">
            <div className="relative w-[min(400px,85vw)] h-[min(400px,85vw)] wide:w-[min(400px,50vw)] wide:h-[min(400px,50vw)]">
              <LetterGrid
                centerLetter={gameState.centerLetter}
                outerLetters={gameState.letters}
                onLetterClick={handleLetterClick}
                bingoIsPossible={gameState.bingoIsPossible}
                foundWords={gameState.foundWords}
              />
            </div>
          </div>

          {/* Control Buttons - directly under game board */}
          <GameControls
            sortLabel={getSortLabel(sortMode)}
            canSubmit={currentWord.length >= 4}
            onSort={handleSort}
            onShuffle={handleShuffle}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden wide:block w-px bg-ink/15" />

        {/* Found Words - under the board when stacked, beside it when wide */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 wide:mt-0 wide:pt-4 wide:h-full">
          <FoundWordsList
            words={getSortedWords()}
            pangrams={gameState.pangrams}
            onWordClick={handleWordClick}
          />
        </div>
      </div>

      {/* Modals */}
      {yesterdaysPuzzle && (
        <YesterdaysPuzzleModal
          isOpen={activeModal === 'yesterday'}
          onClose={closeModal}
          date={yesterdaysDate}
          centerLetter={yesterdaysPuzzle.center_letter.toUpperCase()}
          outerLetters={yesterdaysPuzzle.outside_letters.map(l => l.toUpperCase())}
          validWords={yesterdaysPuzzle.valid_words}
          pangrams={yesterdaysPuzzle.pangrams}
          puzzleId={yesterdaysPuzzle.id}
          totalPossibleScore={yesterdaysPuzzle.total_score}
        />
      )}

      <WordDefinitionModal
        isOpen={activeModal === 'definition'}
        onClose={closeModal}
        word={selectedWord}
        isPangram={gameState.pangrams.includes(selectedWord)}
      />

      <HintsModal
        isOpen={activeModal === 'hints'}
        onClose={closeModal}
        validWords={gameState.validWords}
        foundWords={gameState.foundWords}
        centerLetter={gameState.centerLetter}
        outerLetters={gameState.letters}
      />

      <HowToPlayModal
        isOpen={activeModal === 'howToPlay'}
        onClose={closeModal}
      />
    </main>
  );
}
