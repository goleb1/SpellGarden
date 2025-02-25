import puzzleSet from '../../puzzle_sets.json';

interface Puzzle {
  id: string;
  live_date: string;
  center_letter: string;
  outside_letters: string[];
  pangrams: string[];
  bingo_possible: boolean;
  total_score: number;
  total_words: number;
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

// Function to get today's puzzle based on live_date
const getDailyPuzzle = (date: Date): Puzzle => {
  // If we have an override index for testing, use that instead
  if (process.env.NODE_ENV === 'development' && overridePuzzleIndex !== null) {
    return puzzleSet[overridePuzzleIndex];
  }

  // Format the date as YYYY-MM-DD
  const formattedDate = date.toISOString().split('T')[0];
  
  // Find the puzzle scheduled for today
  const todaysPuzzle = puzzleSet.find(puzzle => puzzle.live_date === formattedDate);
  
  if (!todaysPuzzle) {
    // If no puzzle is scheduled for today, find the next available puzzle
    const futurePuzzles = puzzleSet
      .filter(puzzle => puzzle.live_date > formattedDate)
      .sort((a, b) => a.live_date.localeCompare(b.live_date));
    
    if (futurePuzzles.length > 0) {
      return futurePuzzles[0];
    }
    
    // If no future puzzles, return the last puzzle in the set
    return puzzleSet[puzzleSet.length - 1];
  }
  
  return todaysPuzzle;
};

// Get today's puzzle
export const getTodaysPuzzle = (): Puzzle => {
  const today = new Date();
  // Reset to start of day in user's timezone
  today.setHours(0, 0, 0, 0);
  return getDailyPuzzle(today);
};

// Get puzzle for a specific date
export const getPuzzleForDate = (date: Date): Puzzle => {
  // Reset to start of day
  date.setHours(0, 0, 0, 0);
  return getDailyPuzzle(date);
};

// Get the next puzzle change time
export const getNextPuzzleTime = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}; 