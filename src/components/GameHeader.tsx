import { useState, useEffect } from 'react';
import Menu from './Menu';
import PuzzleInfo from './PuzzleInfo';
import LevelIndicator from './LevelIndicator';
import { getNextPuzzleTime } from '@/lib/puzzleManager';
import type { GameState } from '@/lib/gameLogic';

interface GameHeaderProps {
  gameState: GameState;
  onShowYesterdaysPuzzle: () => void;
  onShowHints: () => void;
  onShowHowToPlay: () => void;
}

export default function GameHeader({ gameState, onShowYesterdaysPuzzle, onShowHints, onShowHowToPlay }: GameHeaderProps) {
  const [timeToNextPuzzle, setTimeToNextPuzzle] = useState('');

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

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-8">
      {/* Top row with menu, title, info, and score on mobile */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center">
          <Menu
            onShowYesterdaysPuzzle={onShowYesterdaysPuzzle}
            onShowHints={onShowHints}
            onShowHowToPlay={onShowHowToPlay}
            timeToNextPuzzle={timeToNextPuzzle}
          />
          <h1 className="text-2xl font-display font-bold leading-none">SpellGarden</h1>
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
        <div className="sm:hidden text-2xl font-display font-bold min-w-[3ch] text-right">
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
        <div className="hidden sm:block text-2xl font-display font-bold min-w-[3ch] text-right">
          {gameState.score}
        </div>
      </div>
    </div>
  );
}
