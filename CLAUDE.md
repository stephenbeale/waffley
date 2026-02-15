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
