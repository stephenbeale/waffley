# Waffley Roadmap

A language learning colour game with progressive difficulty through three learning phases.

## Progression System Overview

The game progresses through three phases, each lasting 100 correct answers:

| Phase | Answers | Button Style | Input Method |
|-------|---------|--------------|--------------|
| **Learning Mode** | 1-100 | Colour fill + text | Click |
| **Practice Mode** | 101-200 | Text only (no colour) | Click |
| **Speech Mode** | 201-300 | None | Voice only |

After completing all 300 answers, the cycle repeats with 2 additional colours added.

**Time progression:** Starts at 10 seconds, decreases by 1 second every 10 correct answers (minimum 1 second).

---

## Feature 1: Level System with Progress Tracking

Add a persistent level/progress system that tracks correct answers across sessions.

### Requirements
- Track total correct answers (persisted to localStorage)
- Display current level (1-30) based on answers (1 level = 10 correct)
- Show progress bar within current level (0-10)
- Display current phase (Learning/Practice/Speech) prominently
- Level-up celebration overlay every 10 correct answers

### UI Changes
- Add level indicator to game screen (e.g., "Level 5 - Learning Mode")
- Add progress bar showing progress within current level
- Level-up overlay with countdown before resuming

---

## Feature 2: Dynamic Time Reduction

Implement the time reduction system based on level progression.

### Requirements
- Start at 10 seconds for Level 1
- Reduce by 1 second per level (Level 2 = 9s, Level 3 = 8s, etc.)
- Minimum time limit of 1 second at Level 10+
- Time resets to 10 seconds when starting a new 300-answer cycle with more colours

### Considerations
- Display current time limit in level-up overlay
- Smooth transition when time changes

---

## Feature 3: Learning Mode (Levels 1-10)

The initial learning phase with full visual aids.

### Requirements
- Buttons display colour fill background + text label
- All visual aids enabled to help memorisation
- Available colours based on current cycle (starts with 5)
- This is the current default behaviour, so mainly ensure it's properly labelled

### UI Changes
- Show "Learning Mode" badge/indicator
- Possibly add colour name tooltip on hover for reinforcement

---

## Feature 4: Practice Mode (Levels 11-20)

Remove colour fills to test text recognition.

### Requirements
- Triggered automatically at 100 correct answers (Level 11)
- Buttons show text labels only (no colour fill background)
- All buttons use neutral background colour
- Tests that the user has learned to read the colour words

### UI Changes
- Show "Practice Mode" badge/indicator
- Transition animation/celebration when entering Practice Mode
- Buttons styled with neutral background (e.g., #2a2a4e)

---

## Feature 5: Speech Mode (Levels 21-30)

Voice-only input phase for full fluency testing.

### Requirements
- Triggered automatically at 200 correct answers (Level 21)
- No buttons displayed at all
- Voice input is mandatory (no click option)
- Uses the voice recognition system from Feature 2 (voice-answers)
- Browser compatibility check - warn if Speech API not supported

### UI Changes
- Show "Speech Mode" badge/indicator
- Display only: colour square, mic indicator, and voice feedback
- Large "Say the colour!" prompt
- Transition celebration when entering Speech Mode

### Considerations
- What happens if user's browser doesn't support Speech API?
- Option: Fall back to Practice Mode with a warning message

---

## Feature 6: Colour Expansion on Cycle Completion

Add more colours when completing a full 300-answer cycle.

### Requirements
- After 300 correct answers (completing Speech Mode), start new cycle
- Add 2 new colours from the pool: pink, purple, brown, grey, black, white
- Cycle 1: 5 colours (red, green, blue, yellow, orange)
- Cycle 2: 7 colours (+pink, purple)
- Cycle 3: 9 colours (+brown, grey)
- Cycle 4: 11 colours (+black, white)
- Cycle 5+: All 11 colours (no more to add)

### UI Changes
- "New colours unlocked!" celebration
- Show which colours were added
- Reset to Learning Mode with new colour set

### Considerations
- Time limit resets to 10 seconds for new cycle
- Progress/level display should show current cycle number

---

## Feature 7: Persistent Statistics

Track and display lifetime statistics.

### Requirements
- Total correct answers (all time)
- Current cycle number
- Highest cycle reached
- Best streak within a single session
- Time spent learning (optional)
- Per-language statistics

### UI Changes
- Statistics screen accessible from start screen
- Personal best displays on end screen

---

## Future Considerations

- Achievement badges for milestones
- Multiple save slots for different learners
- Daily streaks/goals
- Spaced repetition for difficult colours
- Audio pronunciation of colour words (Text-to-Speech)
