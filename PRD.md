# SpellGarden - Product Requirements Document

## 1\. Product Overview

SpellGarden is a word puzzle game inspired by the NYT Spelling Bee, with a garden/flower theme. Players create words using a set of given letters arranged in a flower-like hexagonal pattern, with one central required letter.

### 1.1 Core Value Proposition

- Engaging, casual word game that combines vocabulary skills with a soothing garden aesthetic
- Free to play, browser-based game accessible on both desktop and mobile devices
- Daily puzzles that create a regular engagement pattern

## 2\. User Interface Requirements

### 2.1 Game Layout

- Logo: "SpellGarden" with flower icon in top-left corner
- Score display: Large number in top-right corner with icons for pangrams (words that use all 7 letters)
- Score progress/achievements: Bar that fills as the player accumulates score to indicate how many of total
- Input field: Centered text input box for word entry
- Letter grid: Seven hexagonal tiles arranged in a flower pattern
- Control buttons: Delete, Shuffle, Sort, and Enter
- Found words list: Display area below the game grid

### 2.2 Visual Design

- Color scheme:
    - Letter Tiles should start as light shades and change to more vibrant shades once the player has found a word starting with that letter.
        - Central letter tile: Yellow
        - Outside letters: Purple
    - Buttons: White with gray borders, Enter button in light green
- Found words display: Different colors for different word categories to add emphasis
- Score progression: the score bar should have a floral theme with each achievement level having a garden themed name.
- Decorative elements: Flower, leaf, and garden accents to make it fun and engaging visually

## 3\. Game Mechanics

### 3.1 Core Rules

- Words must:
    - Be at least 4 letters long
    - Include the center letter
    - Only use provided letters
    - Be valid English words
    - Proper nouns, hyphenated words, and obscure or offensive words are not allowed
- Letters can be reused within a word
- Each puzzle has one mandatory center letter
- There should always be at least one possible word that uses all 7 letters.

### 3.2 Scoring System

- Point allocation based on:
    - 4-letter words = 1 point
    - 5-letter words = 5 points
    - 6+ letter words = 6+ points (one point per letter)
    - Pangrams earn 7 bonus points
- Progress bar or levels to show advancement reflecting percentage to total possible points found

### 3.3 Game Controls

- Text input via:
    - Direct keyboard typing
    - Clicking/tapping letter tiles
- Button functions:
    - Delete: Remove last entered letter
    - Shuffle: Randomly rearrange outer letters
    - Sort: Cycle how the found words are sorted (alphabetically, chronologically, and by length)
    - Enter: Submit word for validation

## 4\. Technical Requirements

### 4.1 Platform

- Web-based application
- Responsive design for mobile and desktop
- Modern browser compatibility (Chrome, Firefox, Safari, Edge)

### 4.2 Core Components

- Frontend:
    - React.js for UI components
    - Tailwind CSS for styling
    - Local storage for game progress
- Backend:
    - Word validation system
    - Daily puzzle generation
    - Score tracking

### 4.3 Data Requirements

- Dictionary database for word validation
- Daily puzzle configurations
- User progress tracking
- Word list categorization

## 5\. Feature Requirements

### 5.1 MVP Features

- Daily puzzle generation
- Word validation
- Score tracking
- Basic animation for successful words
- Mobile-responsive design
- Found word list with categorization

### 5.2 Future Enhancements

- User accounts
- Achievement system
- Historical statistics
- Social sharing
- Practice mode
- Tutorial for new players

## 6\. Success Metrics

- Daily active users
- Average session length
- Word discovery rate
- Return player rate
- User satisfaction score

## 7\. Development Phases

### Phase 1 - Core Game (MVP)

- Basic game mechanics
- Word validation
- Score tracking
- Essential UI elements

### Phase 2 - Enhancement

- User accounts (authentication using Google Firebase)
- Statistics tracking
- Achievement system
- Social features
- Etomology popup on hover/click of word bubble

### Phase 3 - Optimization

- Performance improvements
- Advanced analytics
- Additional game modes
- Community features

## 8\. Technical Dependencies

- Word dictionary API or database
- Frontend framework (React)
- CSS framework (Tailwind)
- Backend service for word validation
- Database for puzzle storage (Firebase)
- Public online deployment (Vercel)