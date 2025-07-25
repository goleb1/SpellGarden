## Hints System Implementation Plan

#SpellGarden

## 1\. Modal Component Structure

### Create `HintsModal.tsx` component with:

- Three hint level buttons at the top
- Dynamic content area that changes based on selected hint level
- Consistent styling with existing modals (dark theme, green accents)
- Responsive design for mobile and desktop

### Button Labels for Hint Levels:

- **Level 1**: "Letter Counts" (📊)
- **Level 2**: "Two-Letter List" (🔤)
- **Level 3**: "Word Clues" (💡)

## 2\. Data Processing Functions

### Create `src/lib/hintLogic.ts` with these functions:

```
// Level 1: Letter count grid
interface LetterCountGrid {
  [letter: string]: {
    [length: number]: number;
  };
}

function generateLetterCountGrid(
  validWords: string[], 
  foundWords: string[]
): LetterCountGrid

// Level 2: Two-letter combinations
interface TwoLetterHints {
  [twoLetters: string]: number;
}

function generateTwoLetterHints(
  validWords: string[], 
  foundWords: string[]
): TwoLetterHints

// Level 3: Word clues with definitions
interface WordClue {
  wordLength: number;
  firstLetter: string;
  definition: string;
  partOfSpeech?: string;
}

async function generateWordClues(
  validWords: string[], 
  foundWords: string[],
  dictionaryService: DictionaryService
): Promise<WordClue[]>
```

## 3\. Integration Points

### Update `Menu.tsx`:

- Add "Hints" option to dropdown menu
- Add callback prop for opening hints modal
- Icon: 💡 or similar

### Update `src/app/page.tsx`:

- Add state for hints modal: `isHintsModalOpen`
- Pass hint modal state and handlers to Menu component
- Include HintsModal component in render

## 4\. Component Implementation Details

### HintsModal Component Structure:

```
interface HintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  validWords: string[];
  foundWords: string[];
  centerLetter: string;
  outerLetters: string[];
}
```

### Level 1 - Letter Count Grid:

- Table format similar to attached image
- Rows: Each starting letter (A-Z, only show letters that have words)
- Columns: Word lengths (4, 5, 6, 7, 8+)
- Show total counts per row and column
- Highlight center letter row if applicable

### Level 2 - Two-Letter List:

- Grid layout of two-letter combinations
- Format: "AM: 4", "AN: 2", etc.
- Group by first letter for organization
- Only show combinations that have remaining words

### Level 3 - Word Clues:

- List format with each clue as a card
- Show: word length, first letter, definition/synonym
- Example: "7 letters, starts with M: A large shopping center"
- Limit to 10-15 clues at a time to avoid overwhelming
- Add "Show More" button if more clues available

## 5\. Styling Guidelines

### Follow existing modal patterns:

- Background: `bg-[#1C1C1E]`
- Border: `border border-[#2D5A27]`
- Text: White primary, gray secondary
- Buttons: Green accent (`bg-green-500/20`, `border-green-500/30`)

### Hint level buttons:

- Toggle style (active/inactive states)
- Horizontal layout on desktop, stacked on mobile
- Use existing button component patterns

## 6\. Performance Considerations

### Optimization strategies:

- Cache hint data when modal opens (don't recalculate on level switch)
- Lazy load Level 3 definitions only when that tab is selected
- Debounce definition fetching if using external API
- Memoize expensive calculations

## 7\. User Experience Features

### Progressive disclosure:

- Start with Level 1 selected by default
- Show loading states for Level 3 (definitions)
- Add tooltips explaining what each hint level provides
- Consider adding a "Used hints" indicator in game state

### Accessibility:

- Proper ARIA labels for hint level buttons
- Keyboard navigation between hint levels
- Screen reader friendly table headers for Level 1

## 8\. Implementation Steps

### Phase 1 - Basic Structure:

1. Create HintsModal component shell
2. Add menu integration
3. Implement Level 1 (letter counts)
4. Basic styling and layout

### Phase 2 - Enhanced Hints:

1. Implement Level 2 (two-letter combinations)
2. Add hint level switching logic
3. Refine responsive design

### Phase 3 - Advanced Features:

1. Implement Level 3 (word clues)
2. Integrate with existing dictionary service
3. Add loading states and error handling
4. Performance optimization

### Phase 4 - Polish:

1. Add animations and transitions
2. User testing and feedback integration
3. Analytics tracking for hint usage
4. Documentation updates

## 9\. Testing Considerations

### Test scenarios:

- Modal opens/closes correctly
- Hint calculations are accurate
- Performance with large word lists
- Mobile responsiveness
- Integration with existing game state
- Error handling for failed definition lookups