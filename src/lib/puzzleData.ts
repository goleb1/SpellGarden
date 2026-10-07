// Server-only: this is the one place the full puzzle schedule is loaded.
// Never import this file from a client component, or every future puzzle
// and its answers will be shipped to the browser again.
import 'server-only';
import puzzleSet from '../../puzzle_sets.json';
import type { Puzzle } from './puzzleManager';

const toPuzzle = (puzzle: (typeof puzzleSet)[number]): Puzzle => ({
  id: puzzle.id,
  live_date: puzzle.live_date,
  center_letter: puzzle.center_letter,
  outside_letters: puzzle.outside_letters,
  pangrams: puzzle.pangrams,
  bingo_possible: puzzle.bingo_possible,
  total_score: puzzle.total_score,
  total_words: puzzle.total_words,
  valid_words: puzzle.valid_words,
});

// Get the puzzle for a YYYY-MM-DD date string
export const getPuzzleForDateString = (formattedDate: string): Puzzle => {
  // Find the puzzle scheduled for that day
  const scheduledPuzzle = puzzleSet.find(puzzle => puzzle.live_date === formattedDate);

  if (scheduledPuzzle) {
    return toPuzzle(scheduledPuzzle);
  }

  // During a schedule gap, preserve what players actually saw by using the
  // most recent prior puzzle. This also keeps "yesterday's puzzle" from
  // incorrectly showing today's newly scheduled puzzle.
  const previousPuzzles = puzzleSet
    .filter(puzzle => puzzle.live_date < formattedDate)
    .sort((a, b) => b.live_date.localeCompare(a.live_date));

  if (previousPuzzles.length > 0) {
    return toPuzzle(previousPuzzles[0]);
  }

  // Before the schedule begins, use the first upcoming puzzle.
  const futurePuzzles = puzzleSet
    .filter(puzzle => puzzle.live_date > formattedDate)
    .sort((a, b) => a.live_date.localeCompare(b.live_date));

  if (futurePuzzles.length > 0) {
    return toPuzzle(futurePuzzles[0]);
  }

  return toPuzzle(puzzleSet[puzzleSet.length - 1]);
};

// For development/testing purposes: get a puzzle by its position in the set
export const getPuzzleByIndex = (index: number): Puzzle | null => {
  const puzzle = puzzleSet[index];
  return puzzle ? toPuzzle(puzzle) : null;
};
