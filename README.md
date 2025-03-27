# SpellGarden 🌸

A word puzzle game inspired by the NYT Spelling Bee, with a garden theme. Create words using the given letters, with the center letter being required in every word. My fiance and I love to play the NYT word games, and I always complain about how I would make the game better. It seemed like the perfect project to mess around with and test different AI tools.

## Features

- Beautiful garden-themed interface with hexagonal letter grid
- Smooth animations and transitions
- Score tracking and pangram detection
- Keyboard and mouse input support
- Word validation against dictionary
- Mobile-responsive design

## Game Rules

- Words must:
  - Be at least 4 letters long
  - Include the center letter
  - Only use the provided letters
  - Be valid English words
- Letters can be reused within a word
- Scoring:
  - 4-letter words = 1 point
  - 5+ letter words = 1 point per letter
  - Pangrams (words using all 7 letters) get 10 bonus points
  - Bingo (finding a word that starts with each of the 7 letters [not always possible]) gets 10 bonus points

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion