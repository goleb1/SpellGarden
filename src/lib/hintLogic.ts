// Level 1: Letter count grid
export interface LetterCountGrid {
  [letter: string]: {
    [length: number]: number;
  };
}

// Level 2: Two-letter combinations
export interface TwoLetterHints {
  [twoLetters: string]: number;
}

// Level 3: Word clues with definitions
export interface WordClue {
  wordLength: number;
  firstLetter: string;
  definition: string;
  partOfSpeech?: string;
}

export function generateLetterCountGrid(
  validWords: string[], 
  foundWords: string[]
): LetterCountGrid {
  const unfoundWords = validWords.filter(word => !foundWords.includes(word.toLowerCase()));
  const grid: LetterCountGrid = {};

  unfoundWords.forEach(word => {
    const firstLetter = word.charAt(0).toUpperCase();
    const length = word.length;

    if (!grid[firstLetter]) {
      grid[firstLetter] = {};
    }

    if (!grid[firstLetter][length]) {
      grid[firstLetter][length] = 0;
    }

    grid[firstLetter][length]++;
  });

  return grid;
}

export function generateTwoLetterHints(
  validWords: string[], 
  foundWords: string[]
): TwoLetterHints {
  const unfoundWords = validWords.filter(word => !foundWords.includes(word.toLowerCase()));
  const twoLetterCounts: TwoLetterHints = {};

  unfoundWords.forEach(word => {
    if (word.length >= 2) {
      const twoLetters = word.substring(0, 2).toUpperCase();
      if (!twoLetterCounts[twoLetters]) {
        twoLetterCounts[twoLetters] = 0;
      }
      twoLetterCounts[twoLetters]++;
    }
  });

  return twoLetterCounts;
}

// Simple definition service for word clues
export class SimpleDefinitionService {
  private definitions: Record<string, { definition: string; partOfSpeech?: string }> = {
    // Common 4-letter words
    'base': { definition: 'The lowest part or foundation', partOfSpeech: 'noun' },
    'able': { definition: 'Having the power or skill', partOfSpeech: 'adjective' },
    'beat': { definition: 'To strike repeatedly', partOfSpeech: 'verb' },
    'deal': { definition: 'To distribute or handle', partOfSpeech: 'verb' },
    'seal': { definition: 'To close securely', partOfSpeech: 'verb' },
    'beam': { definition: 'A ray of light', partOfSpeech: 'noun' },
    'meal': { definition: 'Food eaten at a particular time', partOfSpeech: 'noun' },
    'real': { definition: 'Actually existing', partOfSpeech: 'adjective' },
    'tale': { definition: 'A story or narrative', partOfSpeech: 'noun' },
    'late': { definition: 'After the expected time', partOfSpeech: 'adjective' },
    'bale': { definition: 'A large bundle', partOfSpeech: 'noun' },
    'male': { definition: 'Of the masculine gender', partOfSpeech: 'adjective' },
    'team': { definition: 'A group working together', partOfSpeech: 'noun' },
    'meat': { definition: 'Animal flesh as food', partOfSpeech: 'noun' },
    
    // Common 5+ letter words
    'table': { definition: 'A piece of furniture with a flat top', partOfSpeech: 'noun' },
    'metal': { definition: 'A solid material like iron or gold', partOfSpeech: 'noun' },
    'blame': { definition: 'To hold responsible for a fault', partOfSpeech: 'verb' },
    'beast': { definition: 'A large animal', partOfSpeech: 'noun' },
    'beams': { definition: 'Rays of light (plural)', partOfSpeech: 'noun' },
    'meals': { definition: 'Food portions (plural)', partOfSpeech: 'noun' },
    'teams': { definition: 'Groups working together (plural)', partOfSpeech: 'noun' },
    'steam': { definition: 'Water vapor from boiling', partOfSpeech: 'noun' },
    'dream': { definition: 'Images in sleep', partOfSpeech: 'noun' },
    'bleat': { definition: 'The cry of a sheep or goat', partOfSpeech: 'noun' },
    'least': { definition: 'The smallest amount', partOfSpeech: 'adjective' },
    'stable': { definition: 'A building for horses', partOfSpeech: 'noun' },
    'enable': { definition: 'To make possible', partOfSpeech: 'verb' },
    'detail': { definition: 'A small part or feature', partOfSpeech: 'noun' },
    'beetle': { definition: 'A type of insect', partOfSpeech: 'noun' },
    'bottle': { definition: 'A container for liquids', partOfSpeech: 'noun' },
    'battle': { definition: 'A fight between armies', partOfSpeech: 'noun' },
    'tablet': { definition: 'A flat piece or pill', partOfSpeech: 'noun' },
    'delete': { definition: 'To remove or erase', partOfSpeech: 'verb' },
    'beadle': { definition: 'A church official', partOfSpeech: 'noun' },
    'meatal': { definition: 'Relating to a passage in the body', partOfSpeech: 'adjective' },
    'ablate': { definition: 'To remove by cutting', partOfSpeech: 'verb' },
    'belated': { definition: 'Coming late', partOfSpeech: 'adjective' },
    'bleated': { definition: 'Made the cry of a sheep (past tense)', partOfSpeech: 'verb' },
    'beatles': { definition: 'Famous rock band', partOfSpeech: 'noun' },
    'stabled': { definition: 'Kept in a stable (past tense)', partOfSpeech: 'verb' },
    'enabled': { definition: 'Made possible (past tense)', partOfSpeech: 'verb' },
    'detailed': { definition: 'Showing many details', partOfSpeech: 'adjective' },
    'defeated': { definition: 'Beaten in competition', partOfSpeech: 'verb' }
  };

  async getDefinition(word: string): Promise<{ definition: string; partOfSpeech?: string } | null> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const def = this.definitions[word.toLowerCase()];
    if (def) {
      return def;
    }
    
    // Fallback for words not in our simple dictionary
    return {
      definition: `A word meaning something related to "${word}"`,
      partOfSpeech: 'unknown'
    };
  }
}

export async function generateWordClues(
  validWords: string[], 
  foundWords: string[],
  definitionService: SimpleDefinitionService,
  maxClues: number = 15
): Promise<WordClue[]> {
  const unfoundWords = validWords.filter(word => !foundWords.includes(word.toLowerCase()));
  
  // Sort by length descending to prioritize longer words
  const sortedUnfoundWords = unfoundWords.sort((a, b) => b.length - a.length);
  
  // Take up to maxClues words
  const wordsToProcess = sortedUnfoundWords.slice(0, maxClues);
  
  const clues: WordClue[] = [];
  
  for (const word of wordsToProcess) {
    try {
      const definitionData = await definitionService.getDefinition(word);
      if (definitionData) {
        clues.push({
          wordLength: word.length,
          firstLetter: word.charAt(0).toUpperCase(),
          definition: definitionData.definition,
          partOfSpeech: definitionData.partOfSpeech
        });
      }
    } catch (error) {
      console.warn(`Failed to get definition for word: ${word}`, error);
      // Add a generic clue even if definition lookup fails
      clues.push({
        wordLength: word.length,
        firstLetter: word.charAt(0).toUpperCase(),
        definition: `A ${word.length}-letter word starting with ${word.charAt(0).toUpperCase()}`
      });
    }
  }
  
  return clues;
}