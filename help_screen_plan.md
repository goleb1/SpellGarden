## Help / How to Play Implementation

#SpellGarden

## 1\. Modal Component Structure

### Create `HowToPlayModal.tsx` component with:

- Multi-section layout explaining game rules and features
- Visual examples using game elements (hexagon letters, word examples)
- Navigation between sections (optional tabs or scrollable content)
- Consistent styling with existing modals
- "Got it!" or "Start Playing" button to close

## 2\. Content Sections Structure

### Section 1 - Game Objective:

- Brief overview: "Find words using the given letters"
- Center letter requirement explanation
- Minimum word length (4 letters)
- Visual: Example hexagon grid with highlighted center letter

### Section 2 - Scoring System:

- Point values: 4-letter words = 1 point, 5+ letters = 1 point per letter
- Pangram explanation and bonus (uses all 7 letters = +10 points)
- Bingo explanation and bonus (find word starting with each letter = +10 points)
- Visual: Example words with point calculations

### Section 3 - Game Features:

- Level progression system with emojis
- Found words display and color coding
- Shuffle button functionality
- Delete/backspace options
- Keyboard vs. click input

### Section 4 - Tips for Success:

- Look for common prefixes/suffixes
- Try different word lengths
- Use the shuffle feature when stuck
- Check for pangrams (words using all letters)

## 3\. First-Time User Detection

### Create `src/lib/userPreferences.ts`:

```
interface UserPreferences {
  hasSeenTutorial: boolean;
  lastPlayedDate?: string;
  preferredSortMode?: 'alphabetical' | 'length' | 'chronological';
}

class UserPreferencesManager {
  private static STORAGE_KEY = 'spellgarden_preferences';
  
  static getPreferences(): UserPreferences;
  static setPreferences(prefs: Partial<UserPreferences>): void;
  static isFirstTimeUser(): boolean;
  static markTutorialSeen(): void;
}
```

### Integration with Authentication:

- For authenticated users: Store preferences in Firestore (`users/{uid}/preferences`)
- For guest users: Store in localStorage
- Migrate localStorage preferences when user signs in

## 4\. Auto-Show Logic Implementation

### Update `src/app/page.tsx`:

```
// Add state for tutorial
const [showTutorial, setShowTutorial] = useState(false);
const [tutorialCheckComplete, setTutorialCheckComplete] = useState(false);

// Check if user needs tutorial on component mount
useEffect(() => {
  const checkTutorialStatus = async () => {
    const isFirstTime = await UserPreferencesManager.isFirstTimeUser();
    if (isFirstTime) {
      setShowTutorial(true);
    }
    setTutorialCheckComplete(true);
  };
  
  if (!stateLoading && gameState) {
    checkTutorialStatus();
  }
}, [stateLoading, gameState, user]);
```

### Tutorial Completion Handling:

```
const handleTutorialComplete = async () => {
  await UserPreferencesManager.markTutorialSeen();
  setShowTutorial(false);
};
```

## 5\. Menu Integration

### Update `Menu.tsx`:

- Add "How to Play" option with question mark icon (❓ or 📖)
- Add callback prop for opening tutorial modal
- Position below "Yesterday's Puzzle" option

### Props interface update:

```
interface MenuProps {
  onShowYesterdaysPuzzle: () => void;
  onShowHowToPlay: () => void;
  timeToNextPuzzle: string;
}
```

## 6\. Component Implementation Details

### HowToPlayModal Structure:

```
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean; // Changes button text and behavior
}
```

### Visual Elements to Include:

- Hexagon letter grid mockup showing center/outer letters
- Example words with point values
- Level indicator examples
- Color-coded word examples (4-letter, 5-letter, pangrams)
- Bingo demonstration with letter highlighting

### Interactive Elements:

- Animated hexagon that demonstrates letter clicking
- Example word formation sequence
- Point calculation animation
- Level progression visualization

## 7\. Styling and Layout

### Modal Dimensions:

- Wider than other modals to accommodate visual content
- Mobile: Full screen with scroll
- Desktop: Large centered modal (800px+ width)
- Max height with internal scrolling

### Content Layout:

```
// Section-based layout
<div className="space-y-6">
  <WelcomeSection />
  <ObjectiveSection />
  <ScoringSection />
  <FeaturesSection />
  <TipsSection />
  <ClosingSection />
</div>
```

### Visual Components:

- Mini hexagon grid component for demonstrations
- Point calculation examples
- Level emoji showcase
- Color legend for word types

## 8\. Content Writing Guidelines

### Tone and Style:

- Friendly and encouraging
- Concise but comprehensive
- Use garden/botanical metaphors when appropriate
- Progressive complexity (basic rules first, advanced tips last)

### Example Content Snippets:

```
"Welcome to SpellGarden! 🌸
Create words using the letters in the hexagon grid. Every word must include the center letter and be at least 4 letters long."

"Scoring: Short words (4 letters) = 1 point. Longer words = 1 point per letter. Find a pangram (uses all 7 letters) for a 10-point bonus!"
```

## 9\. Accessibility Considerations

### Implementation details:

- Proper heading hierarchy (h2, h3 tags)
- Alt text for visual examples
- Keyboard navigation support
- Screen reader friendly descriptions
- High contrast for visual elements
- Focus management when modal opens

## 10\. Data Storage Strategy

### Firestore Schema (authenticated users):

```
// users/{uid}/preferences
{
  hasSeenTutorial: boolean,
  tutorialCompletedAt: timestamp,
  gamePreferences: {
    preferredSortMode: string,
    // future preferences
  }
}
```

### localStorage Schema (guest users):

```
// Key: 'spellgarden_preferences'
{
  hasSeenTutorial: boolean,
  tutorialCompletedAt: string,
  version: "1.0" // for future migrations
}
```

## 11\. Implementation Phases

### Phase 1 - Core Tutorial:

1. Create HowToPlayModal component
2. Implement basic content sections
3. Add menu integration
4. Basic styling and layout

### Phase 2 - First-Time Logic:

1. Create UserPreferencesManager
2. Implement first-time user detection
3. Add auto-show functionality
4. Firestore integration for auth users

### Phase 3 - Enhanced Visuals:

1. Create interactive hexagon demonstrations
2. Add animations and visual examples
3. Implement point calculation demos
4. Mobile responsiveness optimization

### Phase 4 - Polish and Testing:

1. Content refinement and copy editing
2. Accessibility improvements
3. User testing and feedback integration
4. Performance optimization

## 12\. Testing Scenarios

### Functional Testing:

- First-time user sees tutorial automatically
- Returning user doesn't see tutorial
- Tutorial can be manually opened from menu
- Preferences sync between localStorage and Firestore
- Tutorial completion properly recorded

### User Experience Testing:

- Tutorial content is clear and helpful
- Visual examples are effective
- Modal is responsive on all devices
- Tutorial doesn't feel overwhelming
- Easy to skip or close if needed

### Edge Cases:

- User closes tutorial before completion
- Multiple tabs/sessions handling
- Authentication state changes during tutorial
- Network connectivity issues