export interface WordDefinition {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
  origin?: string;
}

interface DictionaryAPIResponse {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
  origin?: string;
}

class DictionaryService {
  private cache = new Map<string, WordDefinition | null>();
  private readonly BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async getDefinition(word: string): Promise<WordDefinition | null> {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord) || null;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/${encodeURIComponent(normalizedWord)}`);
      
      if (!response.ok) {
        this.cache.set(normalizedWord, null);
        return null;
      }

      const data: DictionaryAPIResponse[] = await response.json();
      
      if (!data || data.length === 0) {
        this.cache.set(normalizedWord, null);
        return null;
      }

      const entry = data[0];
      const definition: WordDefinition = {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
        meanings: entry.meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.slice(0, 3) // Limit to first 3 definitions per part of speech
        })),
        origin: entry.origin
      };

      this.cache.set(normalizedWord, definition);
      return definition;
    } catch (error) {
      console.error(`Error fetching definition for "${word}":`, error);
      this.cache.set(normalizedWord, null);
      return null;
    }
  }

}

export const dictionaryService = new DictionaryService();