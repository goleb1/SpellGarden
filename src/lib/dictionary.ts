import wordsDictionary from '../../words_dictionary.json';

// Convert dictionary object to Set for O(1) lookup
const WORD_LIST = new Set(Object.keys(wordsDictionary).filter(word => 
  // Filter words to only include those 4 letters or longer
  // and remove any words with special characters
  word.length >= 4 && /^[a-zA-Z]+$/.test(word)
));

export const isInDictionary = async (word: string): Promise<boolean> => {
  word = word.toLowerCase();
  return WORD_LIST.has(word);
};

// Function to get all possible words for a given set of letters (for testing)
export const getAllPossibleWords = async (
  centerLetter: string,
  letters: string[]
): Promise<string[]> => {
  const allLetters = [centerLetter.toLowerCase(), ...letters.map(l => l.toLowerCase())];
  
  return Array.from(WORD_LIST).filter(word => {
    // Word must contain center letter
    if (!word.includes(centerLetter.toLowerCase())) return false;
    
    // Word can only contain game letters
    return word.split('').every(letter => allLetters.includes(letter));
  });
}; 