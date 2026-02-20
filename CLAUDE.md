# Waffley - Project Documentation

## Overview

Waffley is an interactive language learning game that teaches vocabulary through progressive stages: Learn (recognition), Practice (multiple choice), and Output (speech production). Users progress through mastery-based levels, earning achievements as they build fluency.

## Project Structure

- `app.js` - Main application logic and game state management
- `styles.css` - Application styling
- `index.html` - Application structure
- `ROADMAP.md` - Feature roadmap and technical debt tracking

## Key Architecture Decisions

### Game State Management
The application uses a centralized `game` state object (introduced in session 2026-02-15) that manages:
- Current round state (`roundActive`, `currentRound`, `correctCount`, `incorrectCount`)
- Timer and UI state (`timerInterval`, `countdownInterval`, `isPaused`)
- Active items and target tracking (`activeItems`, `targetEmoji`, `targetIndex`)
- Level progression (`currentLevel`, `itemMastery` tracking)

### Category Data Model
Categories are unified in `CATEGORY_DATA` with a `displayType` property:
- Standard categories use `displayType: 'emoji'`
- Colors use `displayType: 'color'` for special rendering
- This eliminates conditional logic throughout the codebase

### Data Layer Integrity
Shuffled data is stored in `game.activeItems` rather than mutating the source `CATEGORY_DATA`. This prevents side effects and makes the data layer predictable.

## Development Guidelines

### Git Workflow
- Create feature branches before development (`feature/<desc>`, `fix/<desc>`, `refactor/<desc>`)
- Never work directly on master/main
- Use git-manager agent workflow for commits and merges

### Code Quality Standards
- Maintain accessibility: ARIA labels, keyboard navigation, focus management
- Guard against race conditions with state flags
- Preserve focus indicators for keyboard users
- Use semantic HTML and proper ARIA roles for overlays

## Session Notes

### 2026-02-15 - Major Feature Implementation & Code Quality Sprint

**Work Completed:**

1. **Mastery-Based Level Progression** (Major Feature)
   - Replaced fixed answer-count thresholds with per-item mastery tracking
   - Level-up now requires each item to be answered correctly at least twice
   - Added `itemMastery` map to track correct answer counts per vocabulary item
   - Updated level-up card to show mastery progress with visual indicators

2. **Priority 1 Code Quality Fixes**
   - Restored visible focus indicators on answer buttons (replaced `outline: none` with `focus-visible` rings)
   - Added comprehensive ARIA labels to overlays, controls, progress bars, and displays
   - Guarded against timer race conditions with `roundActive` flag
   - Implemented overlay focus management (auto-focus first button when overlays appear)

3. **Priority 2 Technical Debt**
   - Extracted 18 mutable globals into unified `game` state object
   - Unified category data model with `displayType` property
   - Stopped mutating data layer (store shuffled items in `game.activeItems`)

4. **UX Improvements**
   - Added "Go to Menu" navigation buttons to level-up and cycle-complete overlays
   - Users can now exit to menu at any point, not just auto-continue

**Commits This Session:**
- `cb1a034` - feat(overlay): add "Go to Menu" navigation buttons
- `3c478fd` - Focus first button when pause and stats overlays shown
- `b9bfaa6` - Add overlay focus accessibility item to roadmap
- `4df11ee` - Stop mutating data layer
- `4a1d819` - Unify category data model
- `d760482` - Extract game state object
- `6c5abdb` - Guard against timer race conditions
- `167cd33` - Add ARIA labels
- `0bcff79` - Restore visible focus indicators
- `2f01b75` - Mark mastery-based level progression as complete

**Current State:**
- All changes committed, pushed, and merged to master
- ROADMAP.md updated with completed items
- Working tree clean, in sync with origin/master
- No uncommitted changes

**Next Steps:**
Priority 3 technical debt remains in ROADMAP.md:
- Split app.js into ES modules (state.js, timer.js, speech.js, ui.js, game.js)
- Extract utilities and name magic numbers
- Consolidate language data into unified objects
- Refactor CSS with base/modifier pattern

Future features from ROADMAP.md:
- Add typing phase before speech output
- Level selection for new languages
- Expand vocabulary in each set
- Introduce articles and plurals at higher levels

**Technical Notes:**
- The `game.activeItems` approach cleanly separates presentation state from source data
- Focus management uses `setTimeout(..., 100)` to ensure DOM is ready before focusing
- Race condition guards are critical due to overlapping timer callbacks
- Mastery tracking persists only within current level (resets on level-up)

### 2026-02-16 - Major Feature Sprint (18 Features + 3 Bug Fixes)

**Work Completed:**

All 18 planned features from the feature roadmap were successfully implemented, committed, and merged to master in this session:

1. **Phase Selection (Level Picker)** - `feature/phase-selection`
   - Added clickable journey phase dots to jump to any unlocked phase
   - Visual indicators show current phase and locked/unlocked states
   - Smooth navigation between Learning, Practice, Speed, and Speech phases

2. **Expand Vocabulary** - `feature/expand-vocabulary`
   - Added 2 new items per category (animals, food, numbers, colors, clothes, feelings)
   - Total vocabulary increased from 48 to 60 items
   - Maintains balanced progression across all categories

3. **Fix Uncountable Noun Plurals** - `feature/plurals-and-articles`
   - Removed "rice" from plural forms ("rices" doesn't exist in French)
   - Updated data model to handle uncountable nouns correctly

4. **Feminine Adjective Forms** - `feature/adjective-gender-forms`
   - Added gendered prompts for feelings category (How does **he** feel? / How does **she** feel?)
   - Visual gender indicators (Mars/Venus symbols)
   - Dynamically switches between masculine/feminine adjective forms

5. **Speed Round Mercy** - `feature/speed-round-mercy`
   - Added rescue options when timer hits 2 seconds: Retry / Add 5s / End Round
   - Prevents frustration while maintaining speed challenge
   - Clean overlay UI with icon-based buttons

6. **Typing Mobile UX** - `feature/typing-mobile-ux`
   - Reduced emoji/color display size for compact mobile layout
   - Added accent button row (é è ê ë à â ç î ï ô ù û ü ÿ) below input
   - Repositioned timer to top-right for better visibility
   - Added keyboard hint: "Tap buttons for accents"

7. **Correct Answer Sound Pitch Increase** - `feature/correct-sound-pitch`
   - Progression tone pitch increases with each consecutive correct answer
   - Pitch resets at the start of each level
   - Creates satisfying escalating feedback within a level

8. **Remove Mastered Items from Pool** - `feature/remove-mastered-items`
   - Items are excluded from question pool after 3 consecutive correct answers
   - Mastered items remain visible as answer options
   - Smart handling: if all items mastered, resets mastery to continue gameplay

9. **Speech Wrong Attempts History** - `feature/speech-wrong-attempts`
   - Scrolling list of failed speech attempts with red cross marks
   - Helps users see pronunciation patterns and learn from mistakes
   - Auto-scrolls to show latest attempt

10. **Smooth Vertical Progress Bar** - `fix/smooth-progress-bar`
    - Added 0.8s cubic-bezier transition to progress bar height changes
    - Eliminated jarring jumps during level progression
    - Smooth, polished animation feel

11. **Keep Mastered Buttons Visible** - `feature/visible-mastered-buttons`
    - Mastered items no longer grey out or get disabled
    - All buttons remain fully interactive and visible
    - Items are simply excluded from being asked as questions

12. **Silent Visual-Only Rounds** - `feature/silent-visual-round`
    - Last 2 levels of Learning phase play no audio
    - Forces users to rely on visual recognition alone
    - Prepares for transition to output phases

13. **Centre Lone Button on Odd Rows** - `fix/centre-lone-button`
    - Applied flexbox centering to answer button grid
    - Single remaining buttons on odd rows are now centered
    - Cleaner, more balanced layout

14. **Fix Button Overflow on Mobile** - `fix/button-overflow-mobile`
    - Made answer button container scrollable with `overflow-y: auto`
    - Removed minimum width constraints causing horizontal overflow
    - Buttons now stack vertically on narrow screens

15. **Fix Progression Tone Reset** - `fix/progression-tone-reset`
    - Separated pitch progression from overall streak tracking
    - Created dedicated `pitchStreak` counter that resets per level
    - Progression sounds now correctly restart at base pitch each level

16. **Mute Button for Progression Sounds** - `feature/mute-progression-sounds`
    - Added SFX toggle button above progress bar
    - Mutes/unmutes progression tone sounds
    - Speech audio and voice feedback remain unaffected

17. **Progressive Button Count** - `feature/progressive-button-count`
    - Start with 4 answer buttons at Level 1
    - Add 1 button every 2 levels (4→5→6...)
    - Gradually increases difficulty as vocabulary expands

18. **Redesign Pause/Cancel Buttons** - `feature/redesign-pause-cancel-buttons`
    - Changed from thin header bar to rounded 44px boxes
    - Bold symbols (❚❚ for pause, ✕ for cancel)
    - Improved touch target size and visual hierarchy

**Bug Fixes Completed:**
- **Mastered items asked as questions** - Fixed deleted key evaluation in question selection logic
- **Button layout single-column** - Removed min-width constraints causing overflow on narrow screens
- **Mastery greying** - Removed opacity reduction on mastered buttons per user preference

**Branches Cleaned Up:**
Deleted 46 merged local branches including all feature/fix/refactor branches from this session and previous sessions.

**Current State:**
- All 18 features committed, pushed, and merged to master
- Working tree clean, fully synchronized with origin/master
- No unpushed commits, no uncommitted changes
- No open PRs
- All merged branches deleted locally

**Remaining Roadmap (Code Quality Only):**
All user-facing features are complete. Only technical debt remains:
- Split app.js into ES modules (state.js, timer.js, speech.js, ui.js, game.js)
- Extract utilities and name magic numbers
- Consolidate language data into unified objects
- Split data.js into per-language files
- Refactor CSS with base/modifier classes

**Next Steps:**
1. Begin modularization sprint: extract ES modules from monolithic app.js
2. Define clear module boundaries (state, timer, speech recognition, UI rendering, game logic)
3. Extract magic numbers into named constants
4. Split multi-language data into separate files

**Technical Notes:**
- Pitch progression uses `pitchStreak` counter separate from overall `correctStreak`
- Mastered items tracked with `masteredItems` Set, excluded from question pool
- Gender indicator stored per round: `currentGenderIndicator` state variable
- Accent buttons use `insertAtCursor()` helper to inject characters at caret position
- Progressive button count formula: `Math.min(4 + Math.floor((currentLevel - 1) / 2), activeItems.length)`
- Speech wrong attempts stored as array, rendered as scrolling list with CSS flexbox column-reverse
- Mobile-specific layout uses media queries at 480px breakpoint for compact UI

### 2026-02-20 - Pronouns as Full Category + Button Fixes

**Work Completed:**

1. **PR #53 — feat: make pronouns a full game category with 4 learning phases** (MERGED)
   - Added `isVerbLikeMode()` and `getPronounTranslation()` helper functions
   - Replaced `isVerbMode()` with `isVerbLikeMode()` at 8 infrastructure locations (shared verb/pronoun logic)
   - Added `isPronounMode()` branches at 12+ verb-specific locations for pronoun-specific text/logic
   - Fixed start button flow: intro shown once for first-timers, then `startGame()` directly
   - Fixed intro display: English label below emoji (not uppercase above)
   - Journey tracker now shown for pronouns (was hidden)
   - Start button text shows phase-based text like other categories

2. **PR #54 — fix: disambiguate duplicate pronoun buttons and eliminate button flicker** (MERGED)
   - `getPronounButtonText()` disambiguates duplicate translations with emoji (e.g. German "Sie 👩" / "Sie 👥")
   - Eliminated button flicker: shuffle items once at level start, skip per-round DOM reorder for verb-like modes, skip button content update loop when text doesn't change
   - Removed `transform: scale(1.05)` from button hover; changed `overflow-y: hidden` to `overflow: hidden` on button container
   - Verb/pronoun buttons use 3-column grid with 1.3rem font (`.verb-mode` class)
   - Pronoun emoji stacks above English label via `flex-direction: column` (`.pronoun-display` class)
   - ROADMAP.md updated: daily streaks marked complete, new completed item for pronouns-as-full-category

**PRs Merged This Session:**
- #53 - feat: make pronouns a full game category with 4 learning phases
- #54 - fix: disambiguate duplicate pronoun buttons and eliminate button flicker

**Branches Cleaned Up:**
- `fix/pronoun-duplicates-and-flicker` (deleted locally after merge)

**Current State:**
- Working tree clean, fully synchronized with origin/master (commit `cb1855d`)
- No unpushed commits, no uncommitted changes
- One legacy open PR remaining (see below)

**Unfinished Git Workflows:**
- **PR #45** (`fix/button-layout`) is OPEN and superseded. It contains a single commit from 2026-02-18 that addressed the same scrollbar and verb layout issues later handled more completely by PR #54. This PR should be reviewed and closed as superseded, or cherry-picked if any unique changes remain. It has no CI checks configured, no reviews, and has not been merged.

**Next Steps:**
1. Close PR #45 (`fix/button-layout`) — its changes are superseded by PR #54 which is now merged
2. Add emojis for "I" (🙋) and "You" (🫵) in `PRONOUN_EMOJIS` — currently blank in display
3. Disable `text-transform: capitalize` for verb-like buttons (German capitalization matters — "Sie" must stay capitalised, but "ich" must not be capitalised)
4. Consider highlighting the correct answer button in the Learning phase for pronouns (guided reinforcement)
5. Test longer verb conjugations in 3-column layout on mobile — may need a 2-column fallback for verbs with long text

**Technical Notes:**
- `isVerbLikeMode()` returns true for both verb mode and pronoun mode — use this for shared infrastructure (button grid, shuffle behaviour, no per-round reorder)
- `isPronounMode()` is the narrower check for pronoun-specific logic (display layout, button text via `getPronounButtonText()`, intro text)
- `getPronounButtonText()` detects duplicates by checking if any other active key shares the same foreign translation — only appends emoji when a clash exists
- Stash `stash@{0}` ("WIP: stash before creating feature/pronouns-full-category branch") is likely obsolete; safe to drop after confirming it contains no unique work
