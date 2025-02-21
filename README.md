# SpellGarden 🌸

A word puzzle game inspired by the NYT Spelling Bee, with a garden theme. Create words using the given letters, with the center letter being required in every word.

## Features

- Beautiful garden-themed interface with hexagonal letter grid
- Smooth animations and transitions
- Score tracking and pangram detection
- Keyboard and mouse input support
- Word validation against dictionary
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spellgarden.git
cd spellgarden
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Rules

- Words must:
  - Be at least 4 letters long
  - Include the center letter
  - Only use the provided letters
  - Be valid English words
- Letters can be reused within a word
- Scoring:
  - 4-letter words = 1 point
  - 5-letter words = 5 points
  - 6+ letter words = 1 point per letter
  - Pangrams (words using all 7 letters) get 7 bonus points

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.