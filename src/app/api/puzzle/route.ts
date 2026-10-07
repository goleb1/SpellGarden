import { NextResponse } from 'next/server';
import { getPuzzleByIndex, getPuzzleForDateString } from '@/lib/puzzleData';

export const dynamic = 'force-dynamic';

// The response only depends on the date in the URL, so the CDN can cache it.
const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400';

// The furthest-ahead timezone is UTC+14, so that is the latest "today" any
// player can legitimately be on. Anything later is someone peeking ahead.
const MAX_TIMEZONE_OFFSET_MS = 14 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const toDateString = (date: Date): string => date.toISOString().slice(0, 10);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? '';

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null;
  if (!parsed || Number.isNaN(parsed.getTime()) || toDateString(parsed) !== date) {
    return NextResponse.json({ error: 'A valid date is required' }, { status: 400 });
  }

  const latestAllowed = toDateString(new Date(Date.now() + MAX_TIMEZONE_OFFSET_MS));
  if (date > latestAllowed) {
    return NextResponse.json({ error: 'That puzzle is not available yet' }, { status: 400 });
  }

  const yesterday = getPuzzleForDateString(toDateString(new Date(parsed.getTime() - DAY_MS)));

  // Development only: ?index=N loads a specific puzzle from the set for testing
  const index = searchParams.get('index');
  if (process.env.NODE_ENV === 'development' && index !== null) {
    const testPuzzle = getPuzzleByIndex(Number(index));
    if (!testPuzzle) {
      return NextResponse.json({ error: 'No puzzle at that index' }, { status: 400 });
    }
    return NextResponse.json({ today: testPuzzle, yesterday });
  }

  return NextResponse.json(
    { today: getPuzzleForDateString(date), yesterday },
    { headers: { 'Cache-Control': CACHE_CONTROL } }
  );
}
