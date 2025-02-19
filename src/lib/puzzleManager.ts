import puzzleSet from '../../puzzle_set.json';

interface Puzzle {
  id: string;
  center_letter: string;
  outside_letters: string[];
  pangrams: string[];
  bingo_possible: boolean;
  total_score: number;
  valid_words: string[];
}

// For development/testing purposes
let overridePuzzleIndex: number | null = null;

export const setTestPuzzleIndex = (index: number) => {
  if (process.env.NODE_ENV === 'development') {
    overridePuzzleIndex = index;
    // Clear local storage to prevent conflicts
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gameState');
    }
  }
};

// Function to get a deterministic index based on the date
const getDailyPuzzleIndex = (date: Date): number => {
  // If we have an override index for testing, use that instead
  if (process.env.NODE_ENV === 'development' && overridePuzzleIndex !== null) {
    return overridePuzzleIndex;
  }

  // Get days since epoch (January 1, 1970)
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  
  // Use modulo to cycle through the puzzles
  return daysSinceEpoch % puzzleSet.length;
};

// Get today's puzzle
export const getTodaysPuzzle = (): Puzzle => {
  const today = new Date();
  // Reset to start of day in user's timezone
  today.setHours(0, 0, 0, 0);
  
  const index = getDailyPuzzleIndex(today);
  return puzzleSet[index];
};

// Get puzzle for a specific date
export const getPuzzleForDate = (date: Date): Puzzle => {
  // Reset to start of day
  date.setHours(0, 0, 0, 0);
  
  const index = getDailyPuzzleIndex(date);
  return puzzleSet[index];
};

// Get the next puzzle change time
export const getNextPuzzleTime = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}; 