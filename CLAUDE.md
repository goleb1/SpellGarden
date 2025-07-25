# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run populate-words` - Run script to generate new puzzle sets from word list

## Project Architecture

SpellGarden is a Next.js 14 word puzzle game inspired by NYT Spelling Bee, built with TypeScript, Tailwind CSS, and Firebase.

### Core Architecture

**Game Logic Flow:**
- Puzzles are generated and stored in `puzzle_sets.json` with live dates for daily rotation
- `puzzleManager.ts` handles puzzle selection based on current date
- `gameLogic.ts` contains word validation, scoring, and game state management
- Game state is persisted via Firebase for authenticated users or localStorage for guests

**Key Components:**
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
│   ├── puzzleManager.ts  # Daily puzzle selection
│   ├── hooks/
│   │   ├── useAuth.ts    # Firebase auth hook
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

- Puzzle generation script uses `an-array-of-english-words` package
- Game supports both authenticated (Firestore) and guest (localStorage) modes
- Responsive design with separate mobile/desktop layouts
- Framer Motion used for animations and transitions
- Firebase project configured with Firestore security rules

### Testing Different Puzzles

Use `setTestPuzzleIndex()` in development to test specific puzzle configurations from the puzzle set.