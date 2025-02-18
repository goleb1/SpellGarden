import { isInDictionary } from './dictionary';
import { getTodaysPuzzle } from './puzzleManager';

interface GameState {
  centerLetter: string;
  letters: string[];
  foundWords: string[];
  score: number;
  totalPossibleScore: number;
  validWords: string[]; // All valid words for the puzzle
  pangrams: string[]; // All pangrams for the puzzle
  id: string; // Puzzle ID
}

export const calculateWordScore = (word: string): number => {
  if (word.length === 4) return 1;
  if (word.length === 5) return 5;
  return word.length;
};

export const isValidWord = async (word: string, gameState: GameState): Promise<boolean> => {
  // Word must be at least 4 letters
  if (word.length < 4) return false;

  // Word must contain center letter
  if (!word.includes(gameState.centerLetter.toLowerCase())) return false;

  // Word can only contain game letters
  const validLetters = [gameState.centerLetter, ...gameState.letters];
  const hasValidLetters = word.split('').every(letter => 
    validLetters.includes(letter.toUpperCase())
  );
  
  if (!hasValidLetters) return false;

  // Word must be in the puzzle's valid words list
  return gameState.validWords.includes(word.toLowerCase());
};

export const submitWord = async (
  word: string, 
  gameState: GameState
): Promise<{ 
  isValid: boolean; 
  score: number; 
  message?: string;
  messageType?: 'error' | 'success';
}> => {
  word = word.toLowerCase();

  // Check if word has already been found
  if (gameState.foundWords.includes(word)) {
    return {
      isValid: false,
      score: 0,
      message: 'Already found',
      messageType: 'error'
    };
  }

  // Check for center letter first
  if (!word.includes(gameState.centerLetter.toLowerCase())) {
    return {
      isValid: false,
      score: 0,
      message: `Must use center letter (${gameState.centerLetter})`,
      messageType: 'error'
    };
  }

  // Check word length
  if (word.length < 4) {
    return {
      isValid: false,
      score: 0,
      message: 'Word must be at least 4 letters',
      messageType: 'error'
    };
  }

  // Check if word only uses valid letters
  const validLetters = [gameState.centerLetter.toLowerCase(), ...gameState.letters.map(l => l.toLowerCase())];
  const hasValidLetters = word.split('').every(letter => 
    validLetters.includes(letter)
  );
  
  if (!hasValidLetters) {
    return {
      isValid: false,
      score: 0,
      message: 'Can only use given letters',
      messageType: 'error'
    };
  }

  // Check if word is in puzzle's valid words
  const isValid = gameState.validWords.includes(word);
  if (!isValid) {
    return {
      isValid: false,
      score: 0,
      message: 'Not a valid word',
      messageType: 'error'
    };
  }

  // Calculate score
  const wordScore = calculateWordScore(word);
  
  // Check if it's a pangram
  const isPangram = gameState.pangrams.includes(word);
  const pangramBonus = isPangram ? 7 : 0;
  const totalScore = wordScore + pangramBonus;

  return {
    isValid: true,
    score: totalScore,
    message: isPangram ? `Pangram! +${totalScore} points` : `+${totalScore} points`,
    messageType: 'success'
  };
};

export const shuffleLetters = (letters: string[]): string[] => {
  return [...letters].sort(() => Math.random() - 0.5);
};

// Get today's game state
export const getInitialGameState = (): GameState => {
  const puzzle = getTodaysPuzzle();
  return {
    centerLetter: puzzle.center_letter.toUpperCase(),
    letters: puzzle.outside_letters.map(l => l.toUpperCase()),
    foundWords: [],
    score: 0,
    totalPossibleScore: puzzle.total_score,
    validWords: puzzle.valid_words,
    pangrams: puzzle.pangrams,
    id: puzzle.id
  };
}; 