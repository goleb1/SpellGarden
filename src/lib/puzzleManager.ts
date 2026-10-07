export interface Puzzle {
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

export interface DailyPuzzles {
  today: Puzzle;
  yesterday: Puzzle;
}

// Format a Date as a local YYYY-MM-DD string. Deliberately avoids
// toISOString(), which converts to UTC first and can shift the date
// by a day for any player not at UTC+0 (e.g. local midnight at UTC+10
// becomes the previous day once converted to UTC).
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fetch the puzzles for a local YYYY-MM-DD date. The full schedule stays on
// the server (see puzzleData.ts); the browser only ever receives that day's
// puzzle and the one before it.
export const fetchDailyPuzzles = async (formattedDate: string): Promise<DailyPuzzles> => {
  const params = new URLSearchParams({ date: formattedDate });

  // For development/testing purposes: open the app with ?puzzle=N to load
  // the Nth puzzle in the set instead of today's.
  if (process.env.NODE_ENV === 'development') {
    const testIndex = new URLSearchParams(window.location.search).get('puzzle');
    if (testIndex !== null) params.set('index', testIndex);
  }

  const response = await fetch(`/api/puzzle?${params}`);
  if (!response.ok) {
    throw new Error(`Puzzle request failed with ${response.status}`);
  }
  return response.json();
};

// Get the next puzzle change time
export const getNextPuzzleTime = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};
