import { NextResponse } from 'next/server';
import type { WordDefinition } from '@/lib/dictionaryService';

const UPSTREAM_TIMEOUT_MS = 4_000;
const CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=604800';

interface FreeDictionaryResponse {
  word?: string;
  entries?: Array<{
    partOfSpeech?: string;
    pronunciations?: Array<{ type?: string; text?: string }>;
    senses?: Array<{ definition?: string; examples?: string[] }>;
  }>;
}

interface DatamuseEntry {
  word?: string;
  defs?: string[];
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'SpellGarden/1.0' },
      next: { revalidate: 86400 },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Dictionary provider returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function fromFreeDictionary(data: unknown, fallbackWord: string): WordDefinition | null {
  const payload = data as FreeDictionaryResponse | null;
  if (!payload?.entries?.length) return null;

  const meanings = payload.entries
    .map((entry) => ({
      partOfSpeech: entry.partOfSpeech || 'word',
      definitions: (entry.senses || [])
        .filter((sense) => Boolean(sense.definition))
        .slice(0, 3)
        .map((sense) => ({
          definition: sense.definition as string,
          example: sense.examples?.[0],
        })),
    }))
    .filter((meaning) => meaning.definitions.length > 0);

  if (!meanings.length) return null;
  const phonetic = payload.entries
    .flatMap((entry) => entry.pronunciations || [])
    .find((pronunciation) => pronunciation.type === 'ipa' && pronunciation.text)?.text;

  return {
    word: payload.word || fallbackWord,
    phonetic,
    meanings,
  };
}

const PARTS_OF_SPEECH: Record<string, string> = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  u: 'word',
};

function fromDatamuse(data: unknown, requestedWord: string): WordDefinition | null {
  const entries = data as DatamuseEntry[] | null;
  const entry = entries?.find((candidate) => candidate.word?.toLowerCase() === requestedWord);
  if (!entry?.defs?.length) return null;

  const grouped = new Map<string, Array<{ definition: string }>>();
  for (const raw of entry.defs) {
    const [code, definition] = raw.split('\t', 2);
    if (!definition) continue;
    const partOfSpeech = PARTS_OF_SPEECH[code] || 'word';
    const definitions = grouped.get(partOfSpeech) || [];
    if (definitions.length < 3) definitions.push({ definition: definition.trim() });
    grouped.set(partOfSpeech, definitions);
  }

  const meanings = [...grouped].map(([partOfSpeech, definitions]) => ({ partOfSpeech, definitions }));
  return meanings.length ? { word: entry.word || requestedWord, meanings } : null;
}

async function lookupDefinition(word: string): Promise<WordDefinition | null> {
  try {
    const data = await fetchJson(`https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(word)}`);
    const definition = fromFreeDictionary(data, word);
    if (definition) return definition;
  } catch (error) {
    console.warn('FreeDictionaryAPI lookup failed', error);
  }

  try {
    const query = new URLSearchParams({ sp: word, md: 'd', max: '1' });
    const data = await fetchJson(`https://api.datamuse.com/words?${query}`);
    return fromDatamuse(data, word);
  } catch (error) {
    console.error('Datamuse dictionary fallback failed', error);
    throw error;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { word: string } },
) {
  const word = decodeURIComponent(params.word).toLowerCase().trim();
  if (!/^[a-z]{1,64}$/.test(word)) {
    return NextResponse.json({ error: 'Invalid word' }, { status: 400 });
  }

  try {
    const definition = await lookupDefinition(word);
    if (!definition) {
      return NextResponse.json({ error: 'Definition not found' }, { status: 404 });
    }
    return NextResponse.json(definition, { headers: { 'Cache-Control': CACHE_CONTROL } });
  } catch {
    return NextResponse.json(
      { error: 'Dictionary service unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
