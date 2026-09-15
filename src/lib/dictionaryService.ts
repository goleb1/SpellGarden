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

const REQUEST_TIMEOUT_MS = 10_000;

function isWordDefinition(value: unknown): value is WordDefinition {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<WordDefinition>;
  return (
    typeof candidate.word === 'string' &&
    Array.isArray(candidate.meanings) &&
    candidate.meanings.every(
      (meaning) =>
        typeof meaning?.partOfSpeech === 'string' &&
        Array.isArray(meaning.definitions) &&
        meaning.definitions.every((definition) => typeof definition?.definition === 'string'),
    )
  );
}

class DictionaryService {
  private cache = new Map<string, WordDefinition | null>();

  async getDefinition(word: string): Promise<WordDefinition | null> {
    const normalizedWord = word.toLowerCase().trim();

    if (this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord) || null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`/api/definition/${encodeURIComponent(normalizedWord)}`, {
        signal: controller.signal,
      });

      if (response.status === 404) {
        this.cache.set(normalizedWord, null);
        return null;
      }
      if (!response.ok) {
        throw new Error(`Definition lookup returned ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!isWordDefinition(data)) {
        throw new Error('Definition lookup returned an invalid response');
      }

      this.cache.set(normalizedWord, data);
      return data;
    } catch (error) {
      console.error(`Error fetching definition for "${word}":`, error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const dictionaryService = new DictionaryService();
