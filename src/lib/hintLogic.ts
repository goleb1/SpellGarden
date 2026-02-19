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
  hintPhrase: string;      // Tap 2: fill-in-the-blank or thematic phrase
  definition: string;      // Tap 3: full definition
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

// Enhanced definition service that uses the real dictionary API
export class EnhancedDefinitionService {
  private dictionaryService: any; // Will be imported from dictionaryService

  constructor(dictionaryService: any) {
    this.dictionaryService = dictionaryService;
  }

  // Create a hint from a real definition
  private createHintFromDefinition(definition: string, word: string): string {
    // Remove the word itself from the definition to avoid giving it away
    const wordLower = word.toLowerCase();
    let hint = definition.toLowerCase();

    // Remove the word and its variations from the hint
    hint = hint.replace(new RegExp(`\\b${wordLower}\\b`, 'gi'), 'this word');
    hint = hint.replace(new RegExp(`\\b${wordLower}s\\b`, 'gi'), 'this word');
    hint = hint.replace(new RegExp(`\\b${wordLower}ing\\b`, 'gi'), 'this word');
    hint = hint.replace(new RegExp(`\\b${wordLower}ed\\b`, 'gi'), 'this word');

    // Clean up any double spaces
    hint = hint.replace(/\s+/g, ' ');

    // Remove any remaining instances of the word (partial matches)
    const wordParts = wordLower.split('');
    for (let i = 0; i < wordParts.length - 1; i++) {
      const part = wordParts.slice(i).join('');
      if (part.length >= 3) {
        hint = hint.replace(new RegExp(part, 'gi'), '...');
      }
    }

    // Clean up any awkward phrasing
    hint = hint.replace(/\s*\.{3,}\s*/g, '... ');
    hint = hint.replace(/\s+/g, ' ');

    // Capitalize first letter
    hint = hint.charAt(0).toUpperCase() + hint.slice(1);

    // If the hint is too short or unclear, add some context
    if (hint.length < 20 || hint.includes('this word') && hint.length < 30) {
      hint = `A word meaning: ${hint}`;
    }

    return hint;
  }

  // Generate a fill-in-the-blank sentence from an example, or a thematic phrase from the definition
  private generateHintPhrase(word: string, definition: string, example?: string): string {
    const wordLower = word.toLowerCase();

    // Prefer fill-in-the-blank from an example sentence
    if (example && example.trim().length > 0) {
      let blank = example;
      // Replace the word and its common inflections with blanks
      blank = blank.replace(new RegExp(`\\b${wordLower}s?\\b`, 'gi'), '_____');
      blank = blank.replace(new RegExp(`\\b${wordLower}ed\\b`, 'gi'), '_____');
      blank = blank.replace(new RegExp(`\\b${wordLower}ing\\b`, 'gi'), '_____');
      blank = blank.replace(/\s+/g, ' ').trim();
      // Only use it if the blank was actually inserted (i.e. the word appeared)
      if (blank.includes('_____')) {
        // Capitalize first letter
        return blank.charAt(0).toUpperCase() + blank.slice(1);
      }
    }

    // Fallback: extract first clause of definition as a thematic phrase
    let phrase = definition.toLowerCase();

    // Remove the word itself
    phrase = phrase.replace(new RegExp(`\\b${wordLower}\\b`, 'gi'), '');
    phrase = phrase.replace(/\s+/g, ' ').trim();

    // Take up to the first comma or ~7 words, whichever is shorter
    const upToComma = phrase.split(',')[0].trim();
    const words = upToComma.split(/\s+/).slice(0, 7).join(' ');
    const excerpt = words.replace(/[.;:]+$/, '').trim();

    if (excerpt.length >= 8) {
      const capitalized = excerpt.charAt(0).toUpperCase() + excerpt.slice(1);
      return `Think of something related to: ${capitalized}`;
    }

    // Last resort: pattern hint
    return this.generatePatternHint(word);
  }

  // Generate a hint based on word characteristics when no definition is available
  private generatePatternHint(word: string): string {
    const hints: string[] = [];

    // Length-based hints
    if (word.length === 4) {
      hints.push('A short, common word');
    } else if (word.length === 5) {
      hints.push('A medium-length word');
    } else if (word.length >= 6) {
      hints.push('A longer word');
    }

    // Letter pattern hints
    if (word.includes('ea')) {
      hints.push('Contains the "ea" sound');
    }
    if (word.includes('ee')) {
      hints.push('Contains the "ee" sound');
    }
    if (word.endsWith('ed')) {
      hints.push('Past tense form');
    }
    if (word.endsWith('s')) {
      hints.push('Plural form');
    }
    if (word.endsWith('le')) {
      hints.push('Ends with "le"');
    }
    if (word.endsWith('al')) {
      hints.push('Ends with "al"');
    }

    // Vowel pattern hints
    const vowels = word.match(/[aeiou]/g);
    if (vowels && vowels.length === 2) {
      hints.push('Has two vowels');
    } else if (vowels && vowels.length >= 3) {
      hints.push('Has multiple vowels');
    }

    // If we have multiple hints, combine them
    if (hints.length > 0) {
      return hints.join(', ');
    }

    // Fallback hints based on word structure
    if (word.length <= 4) {
      return 'A short, everyday word';
    } else if (word.length <= 6) {
      return 'A common word of medium length';
    } else {
      return 'A longer, more complex word';
    }
  }

  async getDefinition(word: string): Promise<{ definition: string; hintPhrase: string; partOfSpeech?: string } | null> {
    try {
      // Try to get the real definition from the dictionary API
      const definitionData = await this.dictionaryService.getDefinition(word);

      if (definitionData && definitionData.meanings && definitionData.meanings.length > 0) {
        // Use the first definition from the first meaning
        const firstMeaning = definitionData.meanings[0];
        const firstDefinition = firstMeaning.definitions[0];

        if (firstDefinition && firstDefinition.definition) {
          const definition = this.createHintFromDefinition(firstDefinition.definition, word);
          const hintPhrase = this.generateHintPhrase(word, firstDefinition.definition, firstDefinition.example);
          return {
            definition,
            hintPhrase,
            partOfSpeech: firstMeaning.partOfSpeech
          };
        }
      }

      // If no definition found, fall back to pattern-based hints
      return {
        definition: this.generatePatternHint(word),
        hintPhrase: this.generatePatternHint(word),
        partOfSpeech: this.detectPartOfSpeech(word)
      };

    } catch (error) {
      console.warn(`Failed to get definition for word: ${word}`, error);

      // Fall back to pattern-based hints
      return {
        definition: this.generatePatternHint(word),
        hintPhrase: this.generatePatternHint(word),
        partOfSpeech: this.detectPartOfSpeech(word)
      };
    }
  }

  // Detect part of speech based on word endings and patterns
  private detectPartOfSpeech(word: string): string | undefined {
    const wordLower = word.toLowerCase();

    // Verb endings
    if (wordLower.endsWith('ed')) return 'verb';
    if (wordLower.endsWith('ing')) return 'verb';
    if (wordLower.endsWith('ize') || wordLower.endsWith('ise')) return 'verb';
    if (wordLower.endsWith('ate')) return 'verb';
    if (wordLower.endsWith('ify')) return 'verb';

    // Adjective endings
    if (wordLower.endsWith('able') || wordLower.endsWith('ible')) return 'adjective';
    if (wordLower.endsWith('al')) return 'adjective';
    if (wordLower.endsWith('ic')) return 'adjective';
    if (wordLower.endsWith('ous')) return 'adjective';
    if (wordLower.endsWith('ful')) return 'adjective';
    if (wordLower.endsWith('less')) return 'adjective';
    if (wordLower.endsWith('ive')) return 'adjective';
    if (wordLower.endsWith('y')) return 'adjective';

    // Adverb endings
    if (wordLower.endsWith('ly')) return 'adverb';

    // Noun endings
    if (wordLower.endsWith('tion') || wordLower.endsWith('sion')) return 'noun';
    if (wordLower.endsWith('ment')) return 'noun';
    if (wordLower.endsWith('ness')) return 'noun';
    if (wordLower.endsWith('ity')) return 'noun';
    if (wordLower.endsWith('er')) return 'noun';
    if (wordLower.endsWith('or')) return 'noun';
    if (wordLower.endsWith('ist')) return 'noun';
    if (wordLower.endsWith('ism')) return 'noun';

    // Plural forms
    if (wordLower.endsWith('s') && !wordLower.endsWith('ss')) return 'noun';

    return undefined; // Don't show "unknown", just omit it
  }
}

export async function generateWordClues(
  validWords: string[],
  foundWords: string[],
  definitionService: EnhancedDefinitionService
): Promise<WordClue[]> {
  const unfoundWords = validWords.filter(word => !foundWords.includes(word.toLowerCase()));

  // Sort by length ascending — shorter (easier) words first
  const sortedUnfoundWords = unfoundWords.sort((a, b) => a.length - b.length);

  const clues: WordClue[] = [];

  for (const word of sortedUnfoundWords) {
    try {
      const definitionData = await definitionService.getDefinition(word);
      if (definitionData) {
        clues.push({
          wordLength: word.length,
          firstLetter: word.charAt(0).toUpperCase(),
          hintPhrase: definitionData.hintPhrase,
          definition: definitionData.definition,
          partOfSpeech: definitionData.partOfSpeech
        });
      }
    } catch (error) {
      console.warn(`Failed to get definition for word: ${word}`, error);
      clues.push({
        wordLength: word.length,
        firstLetter: word.charAt(0).toUpperCase(),
        hintPhrase: `A ${word.length}-letter word`,
        definition: `A ${word.length}-letter word starting with ${word.charAt(0).toUpperCase()}`
      });
    }
  }

  return clues;
}
