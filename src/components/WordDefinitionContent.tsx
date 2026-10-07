'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpen } from '@phosphor-icons/react';
import { WordDefinition, dictionaryService } from '@/lib/dictionaryService';

// Mirrors FoundWordsList.tsx's "garden of blooms" palette — longer words, richer blooms.
export function getWordStyle(word: string, isPangram: boolean): string {
  if (isPangram) return 'bg-gradient-to-br from-gold to-rose text-[#2A1208]';
  switch (word.length) {
    case 4: return 'bg-bloom4 text-bloom4-ink';
    case 5: return 'bg-bloom5 text-bloom5-ink';
    case 6: return 'bg-bloom6 text-bloom6-ink';
    case 7: return 'bg-bloom7 text-bloom7-ink';
    default: return 'bg-bloom8 text-bloom8-ink';
  }
}

interface WordDefinitionContentProps {
  word: string;
}

export default function WordDefinitionContent({ word }: WordDefinitionContentProps) {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDefinition(null);
    try {
      const result = await dictionaryService.getDefinition(word);
      if (result) {
        setDefinition(result);
      } else {
        setError('Definition not found');
      }
    } catch {
      setError('Failed to load definition');
    } finally {
      setLoading(false);
    }
  }, [word]);

  useEffect(() => {
    if (word) fetchDefinition();
  }, [word, fetchDefinition]);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-leaf"></div>
            <span className="ml-3 text-muted">Loading definition...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <BookOpen size={28} weight="duotone" className="text-red-400 mb-2 mx-auto" />
            <p className="text-muted">{error}</p>
            <button
              onClick={fetchDefinition}
              className="mt-3 px-4 py-2 bg-leaf/15 border border-leaf/30 rounded-full hover:bg-leaf/25 text-leaf transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {definition && (
          <div className="space-y-4">
            {definition.phonetic && (
              <div className="text-center">
                <span className="text-muted text-lg font-mono">{definition.phonetic}</span>
              </div>
            )}
            <div className="space-y-4">
              {definition.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className="space-y-2">
                  <h3 className="text-leaf font-semibold text-sm uppercase tracking-wide">
                    {meaning.partOfSpeech}
                  </h3>
                  <div className="space-y-3">
                    {meaning.definitions.map((def, defIndex) => (
                      <div key={defIndex} className="pl-4 border-l border-ink/15">
                        <p className="text-ink text-sm leading-relaxed">{def.definition}</p>
                        {def.example && (
                          <p className="text-muted text-xs italic mt-1">&ldquo;{def.example}&rdquo;</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {definition.origin && (
              <div className="mt-6 pt-4 border-t border-ink/15">
                <h3 className="text-gold font-semibold text-sm uppercase tracking-wide mb-2">
                  Etymology
                </h3>
                <p className="text-muted text-sm leading-relaxed">{definition.origin}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-ink/15 text-center">
        <p className="text-xs text-muted">Definitions from FreeDictionaryAPI and Datamuse</p>
      </div>
    </>
  );
}
