# Waffley Roadmap

A language learning colour game with progressive difficulty through three learning phases.

## Progression System Overview

The game progresses through three phases, each lasting 100 correct answers:

| Phase | Answers | Timer | Button Style | Input Method |
|-------|---------|-------|--------------|--------------|
| **Learning Mode** | 1-100 | 10s → 2s | Colour fill + text | Click |
| **Practice Mode** | 101-200 | 10s → 2s | Text only (no colour) | Click |
| **Speech Mode** | 201-300 | 10s → 2s | None | Voice only |

After completing all 300 answers, the cycle repeats with 2 additional colours added.

**Levels:** 1 level = 10 correct answers (30 levels per cycle)

**Time progression:** Starts at 10 seconds, decreases by 2 seconds every level (every 10 correct answers). Minimum 2 seconds. Time resets to 10 seconds at the start of each phase.

**Colour selection:** Every level, 5 colours are randomly selected from a pool of 9 colours (red, green, blue, yellow, orange, pink, purple, brown, grey). This keeps each level fresh and unpredictable.

**Colour expansion (by cycle):**
- Cycle 1: 5 colours selected from pool of 9
- Cycle 2: 7 colours (+pink, purple in selection)
- Cycle 3: 9 colours (+brown, grey in selection)
- Cycle 4: 11 colours (+black, white in selection)
- Cycle 5+: All 11 colours

---

## Implementation Order

Features should be implemented in this order:

1. **Feature 1:** Level System Core (localStorage, level tracking)
2. **Feature 2:** Dynamic Time Reduction
3. **Feature 3:** Learning Mode UI
4. **Feature 4:** Practice Mode (text-only buttons)
5. **Feature 5:** Speech Mode (voice-only input)
6. **Feature 6:** Colour Expansion on Cycle Completion
7. **Feature 7:** Persistent Statistics

---

## Feature 1: Level System Core

Add persistent level/progress system that tracks correct answers across sessions.

### Task 1.1: localStorage Foundation
- [ ] Create `saveProgress(data)` function to write to localStorage
- [ ] Create `loadProgress()` function to read from localStorage
- [ ] Define progress data structure:
  ```javascript
  {
    totalCorrect: 0,      // Total correct answers (all time)
    currentCycle: 1,      // Current cycle number
    selectedLanguage: 'spanish'  // Last used language
  }
  ```
- [ ] Load progress on page load
- [ ] Save progress after each correct answer

### Task 1.2: Level Calculation
- [ ] Create `getLevel(totalCorrect)` function (level = Math.floor(correct / 10) + 1)
- [ ] Create `getPhase(totalCorrect)` function:
  - 0-99: "learning"
  - 100-199: "practice"
  - 200-299: "speech"
- [ ] Create `getLevelProgress(totalCorrect)` function (returns 0-9 within current level)
- [ ] Create `getCycleProgress(totalCorrect)` function (returns 0-299 within current cycle)

### Task 1.3: Level Display UI
- [ ] Add level indicator element to game screen header
- [ ] Display format: "Level X - Learning/Practice/Speech Mode"
- [ ] Add progress bar element showing progress within level (0-10)
- [ ] Update display after each correct answer

### Task 1.4: Level-Up Celebration
- [ ] Create level-up overlay/modal component
- [ ] Show celebration every 10 correct answers (level change)
- [ ] Display: "Level X Complete!" with new level number
- [ ] Show current time limit for next level
- [ ] Auto-dismiss after 2 seconds or click to continue
- [ ] Resume game automatically after overlay

---

## Feature 2: Dynamic Time Reduction

Implement time reduction system based on level progression.

### Task 2.1: Time Calculation
- [ ] Create `getTimeLimit(level)` function:
  ```javascript
  // Level 1 = 10s, Level 2 = 9s, ..., Level 10+ = 1s
  return Math.max(1, 11 - level);
  ```
- [ ] Replace hardcoded `timeLimit` with calculated value
- [ ] Recalculate time limit at start of each round

### Task 2.2: Time Display
- [ ] Show current time limit in game UI (e.g., "Time: 8s")
- [ ] Show new time limit in level-up overlay
- [ ] Show "Time decreased!" message when time changes

### Task 2.3: Time Reset on New Cycle
- [ ] Reset time calculation when entering new cycle (after 300 answers)
- [ ] Level within cycle = ((totalCorrect % 300) / 10) + 1
- [ ] Time limit based on level within cycle, not total level

---

## Feature 3: Learning Mode UI (Levels 1-10)

The initial learning phase with full visual aids. This is the current default behaviour.

### Task 3.1: Mode Indicator
- [ ] Add mode badge element to game screen
- [ ] Style badge: coloured background, clear text
- [ ] Display "Learning Mode" when phase is "learning"
- [ ] Position badge prominently (near colour square or score)

### Task 3.2: Button Styling (Learning Mode)
- [ ] Ensure buttons show colour fill background
- [ ] Ensure buttons show text label
- [ ] This should be current behaviour - verify and maintain

### Task 3.3: Learning Aids
- [ ] Optional: Add colour name tooltip on hover
- [ ] Optional: Brief flash of colour name on correct answer

---

## Feature 4: Practice Mode (Levels 11-20)

Remove colour fills to test text recognition.

### Task 4.1: Mode Detection
- [ ] Check phase in `generateButtons()` function
- [ ] If phase is "practice", apply neutral button styling

### Task 4.2: Neutral Button Styling
- [ ] Create CSS class `.button-practice` for text-only buttons
- [ ] Background: neutral colour (#2a2a4e or similar)
- [ ] Text: white/light colour
- [ ] No colour fill background
- [ ] Apply class when phase is "practice"

### Task 4.3: Mode Transition
- [ ] Detect when crossing from 99 to 100 correct answers
- [ ] Show "Practice Mode Unlocked!" celebration overlay
- [ ] Explain: "Buttons will no longer show colours"
- [ ] Update mode badge to "Practice Mode"

### Task 4.4: Practice Mode Badge
- [ ] Style badge differently from Learning Mode (different colour)
- [ ] Display "Practice Mode" when phase is "practice"

---

## Feature 5: Speech Mode (Levels 21-30)

Voice-only input phase for full fluency testing.

### Task 5.1: Merge Voice Feature
- [ ] Merge `feature/2-voice-answers` branch to master (if not already)
- [ ] Ensure voice recognition functions are available
- [ ] Test voice input works in Learning/Practice modes

### Task 5.2: Mode Detection for Speech
- [ ] Check phase in game logic
- [ ] If phase is "speech", enable voice-only mode

### Task 5.3: Speech Mode UI
- [ ] Hide answer buttons when phase is "speech"
- [ ] Show microphone indicator prominently
- [ ] Display "Say the colour!" prompt text
- [ ] Show voice feedback (listening indicator, heard text)
- [ ] Keep colour square visible

### Task 5.4: Speech Mode Input Handling
- [ ] Auto-start voice recognition on each round
- [ ] Process voice input as answer
- [ ] No click fallback in Speech Mode
- [ ] Handle voice recognition errors gracefully

### Task 5.5: Browser Compatibility
- [ ] Check for Speech API support on page load
- [ ] If not supported and entering Speech Mode:
  - [ ] Show warning message
  - [ ] Fall back to Practice Mode
  - [ ] Explain why Speech Mode unavailable

### Task 5.6: Mode Transition
- [ ] Detect when crossing from 199 to 200 correct answers
- [ ] Show "Speech Mode Unlocked!" celebration overlay
- [ ] Explain: "Speak the colour words to answer"
- [ ] Update mode badge to "Speech Mode"

### Task 5.7: Speech Mode Badge
- [ ] Style badge differently (third colour)
- [ ] Display "Speech Mode" when phase is "speech"

---

## Feature 6: Colour Expansion on Cycle Completion

Add more colours when completing a full 300-answer cycle.

### Task 6.1: Cycle Tracking
- [ ] Track current cycle number in progress data
- [ ] Increment cycle when completing 300 answers
- [ ] Store in localStorage

### Task 6.2: Colour Pool Definition
- [ ] Define colour pool by cycle:
  ```javascript
  const CYCLE_COLORS = {
    1: ['red', 'green', 'blue', 'yellow', 'orange'],
    2: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple'],
    3: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey'],
    4: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'black', 'white']
  };
  ```
- [ ] Cycle 5+ uses all 11 colours

### Task 6.3: Active Colours Selection
- [ ] Create `getActiveColors(cycle)` function
- [ ] Use in `generateButtons()` to determine available colours
- [ ] Use in `nextRound()` to pick random colour

### Task 6.4: Cycle Completion Detection
- [ ] Detect when totalCorrect crosses 300-answer boundary (300, 600, 900, etc.)
- [ ] Trigger cycle completion celebration

### Task 6.5: New Cycle Celebration
- [ ] Show "Cycle Complete!" overlay
- [ ] Display "New colours unlocked!" message
- [ ] List the 2 new colours being added
- [ ] Show new cycle number
- [ ] Mention time reset to 10 seconds

### Task 6.6: Cycle Reset
- [ ] Reset to Learning Mode (phase 1)
- [ ] Reset time to 10 seconds
- [ ] Continue with expanded colour pool

---

## Feature 7: Persistent Statistics

Track and display lifetime statistics.

### Task 7.1: Statistics Data Structure
- [ ] Extend progress data:
  ```javascript
  {
    totalCorrect: 0,
    currentCycle: 1,
    highestCycle: 1,
    bestStreak: 0,
    totalTime: 0,  // milliseconds
    languageStats: {
      spanish: { correct: 0, total: 0 },
      french: { correct: 0, total: 0 },
      // etc.
    }
  }
  ```
- [ ] Update statistics after each answer

### Task 7.2: Statistics Tracking
- [ ] Track correct/incorrect per language
- [ ] Track session streak
- [ ] Update best streak if current streak exceeds it
- [ ] Track time spent (optional)

### Task 7.3: Statistics Screen
- [ ] Add "Statistics" button to start screen
- [ ] Create statistics overlay/screen
- [ ] Display all tracked statistics
- [ ] Option to reset statistics

### Task 7.4: End Screen Statistics
- [ ] Show session stats on end screen
- [ ] Compare to personal bests
- [ ] Show "New personal best!" for improvements

---

## Feature 8: Audio Pronunciation (Optional Toggle)

Optional setting to play audio recording of colour word when showing a new colour.

### Task 8.1: Settings Toggle
- [ ] Add "Play Sound" toggle switch on start screen
- [ ] Store setting in localStorage
- [ ] Default to OFF (opt-in feature)
- [ ] Visual indicator showing current state (speaker icon)

### Task 8.2: Audio Assets
- [ ] Record or source native speaker audio for each colour in each language
- [ ] Store audio files (MP3/OGG) in `/audio/{lang}/{colour}.mp3` structure
- [ ] Fallback: Use Web Speech API TTS if audio files unavailable

### Task 8.3: Audio Playback System
- [ ] Create `playColorAudio(color, language)` function
- [ ] Only play if toggle is enabled
- [ ] Preload audio files for current language on game start
- [ ] Handle audio loading errors gracefully

### Task 8.4: Integration with Game Flow
- [ ] Play audio when new colour is displayed in `nextRound()` (if enabled)
- [ ] Option to replay audio (speaker icon button during round)
- [ ] Disable audio in Speech Mode (to avoid giving away answer)

---

## Feature 9: Emoji Learning Mode

Expand beyond colours to teach other vocabulary using emojis as visual cues.

### Task 9.1: Emoji Categories
- [ ] Define emoji-word mappings for adjectives:
  ```javascript
  const EMOJI_ADJECTIVES = {
    happy: '😊', sad: '😢', angry: '😠', tired: '😴',
    surprised: '😮', scared: '😨', excited: '🤩', bored: '😑'
  };
  ```
- [ ] Add translations for each adjective in all supported languages

### Task 9.2: Category Selection
- [ ] Add category selector on start screen (Colours, Adjectives, etc.)
- [ ] Store selected category in game state
- [ ] Load appropriate word set based on category

### Task 9.3: Emoji Display Mode
- [ ] Replace colour square with emoji display for non-colour categories
- [ ] Scale emoji appropriately for visibility
- [ ] Maintain same button/answer mechanic

### Task 9.4: Future Categories
- [ ] Animals (🐕 dog, 🐈 cat, 🐘 elephant, etc.)
- [ ] Food (🍎 apple, 🍕 pizza, 🍞 bread, etc.)
- [ ] Weather (☀️ sunny, 🌧️ rainy, ❄️ snowy, etc.)
- [ ] Numbers with visual counting (1️⃣, 2️⃣, etc.)

---

## Future Considerations

- Achievement badges for milestones
- Multiple save slots for different learners
- Daily streaks/goals
- Spaced repetition for difficult colours
- Leaderboard (if adding backend)
- Export/import progress data
