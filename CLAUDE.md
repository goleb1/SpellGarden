# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

Puzzle generation does not happen in this repo. `puzzle_sets.json` is produced by a
separate dictionary/puzzle-generation project and dropped in here as a finished
output file whenever a new batch of puzzles is ready.

## Project Architecture

SpellGarden is a Next.js 14 word puzzle game inspired by NYT Spelling Bee, built with TypeScript, Tailwind CSS, and Firebase.

### Core Architecture

**Game Logic Flow:**
- Puzzles are generated and stored in `puzzle_sets.json` with live dates for daily rotation
- `puzzleData.ts` (server-only) picks the puzzle for a date; `/api/puzzle?date=YYYY-MM-DD` returns just that day's puzzle and the previous day's. The full `puzzle_sets.json` must never be imported into client code.
- `puzzleManager.ts` holds the client-side puzzle types and fetch helper; the `usePuzzle` hook loads today's puzzle using the player's local date
- `gameLogic.ts` contains word validation, scoring, and game state management
- Game state is persisted via Firebase for authenticated users or localStorage for guests

**Key Components:**
- `GameHeader` - Menu, title, puzzle info, level bar and score
- `WordInput` - The word being typed and the success/error message
- `GameControls` - Sort, Shuffle, Delete and Enter buttons
- `GameSkeleton` - Loading placeholder that mirrors the real layout; keep it in sync when the layout changes
- `LetterGrid` - Interactive hexagonal letter grid with center/outer letters
- `LevelIndicator` - Progress tracking based on score vs total possible score
- `YesterdaysPuzzleModal` - Shows previous day's puzzle solutions
- `Menu` - Navigation and puzzle info

**Data Management:**
- Firebase Auth for user authentication (Google sign-in)
- Firestore stores user progress per puzzle ID (`users/{uid}/progress/{puzzleId}`)
- Game state includes: foundWords, score, letters, validWords, pangrams, bingoIsPossible
- Automatic migration from localStorage to Firestore when users sign in

### File Structure

```
src/
├── app/
│   ├── page.tsx          # Main game interface
│   └── layout.tsx        # App-wide layout with AuthProvider
├── components/           # React components
├── lib/
│   ├── gameLogic.ts      # Word validation, scoring logic
│   ├── puzzleData.ts     # Server-only daily puzzle selection
│   ├── puzzleManager.ts  # Client puzzle types + fetch from /api/puzzle
│   ├── hooks/
│   │   ├── useAuth.ts    # Firebase auth hook
│   │   ├── usePuzzle.ts  # Loads today's + yesterday's puzzle from the API
│   │   └── useGameState.ts # Game state management with Firestore sync
│   ├── contexts/
│   │   └── AuthContext.tsx # Firebase auth context
│   └── firebase/         # Firebase configuration and utilities
```

### Game Rules Implementation

- Words must be ≥4 letters, include center letter, use only provided letters
- Scoring: 4-letter words = 1pt, 5+ letters = length in points
- Pangrams (use all 7 letters) get +10 bonus points
- Bingo bonus (find word starting with each letter) when possible

### Development Notes

- Game supports both authenticated (Firestore) and guest (localStorage) modes
- Responsive design with separate mobile/desktop layouts
- Framer Motion used for animations and transitions
- Firebase project configured with Firestore security rules

### Testing Different Puzzles

In development, open the app with `?puzzle=N` (e.g. `http://localhost:3000/?puzzle=5`) to load the Nth puzzle from the puzzle set instead of today's. This is ignored in production.