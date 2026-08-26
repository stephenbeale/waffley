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

### 2026-02-18 - Pronoun Learning, Daily Streaks, and Game Polish Sprint

**Work Completed:**

All 5 PRs were merged to master in this session. Summary by PR:

1. **PR #48 — Daily streak tracking and auth error feedback** (`feature/daily-streaks`)
   - Added `dailyStreak`, `bestDailyStreak`, and `lastPlayedDate` fields to user stats
   - Streak badge displayed on topic screen with current streak count
   - Two new stats cards: current streak and best streak
   - Auth error feedback shown with 5-second auto-dismiss banner

2. **PR #49 — Stats button contrast, pronoun reset, and pronoun learning access** (`fix/stats-button-pronoun-access`)
   - Stats button text changed to white for sufficient contrast against dark background
   - `resetProgress()` and `resetStats()` now also clear `waffley_pronoun_intro` localStorage key
   - Pronouns added as a selectable learning level
   - Pronoun mode is always re-triggerable (not gated behind one-time completion)

3. **PR #50 — Pronoun learning screen matches standard game UI** (`fix/pronoun-game-ui`)
   - Pronoun learning now uses the full standard game layout
   - Removed `pronoun-intro-mode` CSS class entirely

4. **PR #51 — 13 code review fixes** (`fix/code-review-issues`)
   - Speech recognition pause guard, speed mercy double-fire guard, session streak reset fix
   - Focus management, vertical progress bar clamp, accessibility improvements

5. **PR #52 — Removed persistent pronoun encouragement label** (`fix/pronoun-reinforcement-label`)
   - Label element now cleared before each game start

**Technical Notes:**
- `waffley_pronoun_intro` is the localStorage key that gates whether pronoun intro has been seen
- Pronoun mode deliberately bypasses the journey tracker
- The `pronoun-intro-mode` CSS class no longer exists

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

### 2026-02-21 - XP and Levelling System

**Work Completed:**

1. **XP and Levelling System** (Feature from roadmap, Complexity: M)
   - Added XP constants: base 10 XP per correct, phase multipliers (1x/2x/3x/4x for Learning/Practice/Typing/Speech), +25 perfect accuracy bonus
   - Quadratic level formula: `50 * n * (n - 1)` cumulative XP per level
   - 6 cosmetic level titles: Beginner (1-4), Learner (5-9), Intermediate (10-14), Advanced (15-24), Expert (25-49), Master (50+)
   - XP awarded in `updateStatsAfterGame()` with level-up detection
   - Two toast types: XP earned (green, 2s) and level-up (purple-red gradient, 3.5s)
   - Stats overlay XP section: level number, title, progress bar, total XP
   - End screen shows XP earned per game
   - 5 new achievements: Rising Star (1K XP), Shining Bright (5K XP), Superstar (25K XP), Double Digits (Level 10), Quarter Century (Level 25)
   - `totalXP: 0` added to `getDefaultStats()` — no migration needed
   - Achievement toast timing updated to avoid overlap with XP toasts
   - ROADMAP.md marked complete

2. **End screen simplification** (external user edit)
   - Share button and end-screen-actions wrapper removed
   - Simpler layout with direct Continue button
   - Progress sharing unchecked in ROADMAP.md

**Files Modified:**
- `app.js` — XP system (constants, formulas, calculation, toasts, stats display, achievements, hook into updateStatsAfterGame)
- `index.html` — XP section in stats overlay, XP earned on end screen, toast containers, end screen simplified
- `styles.css` — XP progress bar, level title, XP/level-up toasts, end screen XP badge
- `ROADMAP.md` — XP and levelling marked complete, Progress sharing unchecked

**Current State:**
- Branch `feature/xp-and-levelling` — PR being created (push + PR in parallel)
- All changes committed

**Next Steps:**
- Merge PR after review
- Consider spaced repetition scheduling (next P2 roadmap item)
- Remaining P2 items: expand vocabulary categories, expand verb tenses, iOS/Android native apps, push notifications, user profiles, etc.

### 2026-02-22 - Expand Vocabulary Categories + Domain Purchase

**Work Completed:**

1. **Expand Vocabulary Categories** (PR #74 — MERGED to master, commit `66149f2`)
   - Added 6 new vocabulary categories: Body, Clothing, Home, Numbers (0-10), Family, Professions/Jobs
   - Each category has 11 items with full translations in all 6 languages: Spanish, French, German, Italian, Welsh, Portuguese
   - Noun categories (Body, Clothing, Home, Family, Professions) include article and plural forms
   - Numbers category excluded from noun/article forms (non-applicable)
   - Supabase seed script updated and run successfully: 121 items, 726 translations, 1596 word forms
   - Repository made public: `gh repo edit --visibility public`

2. **Spaced Repetition Scheduling** (PR #73 — MERGED, commit `07153c9`, completed in immediately prior session)
   - Simplified SM-2 algorithm tracking per-item ease, interval, and due date
   - Items scheduled according to recall difficulty

**Files Modified in This Session:**
- `data.js` — Added to CATEGORIES, NOUN_CATEGORIES, and CATEGORY_DATA
- `lang/es.js`, `lang/fr.js`, `lang/de.js`, `lang/it.js`, `lang/cy.js`, `lang/pt.js` — Added 6 category sections with translations and word forms
- `index.html` — Added 6 category buttons
- `app.js` — Updated DB_CATEGORIES and resetProgress() arrays
- `supabase/seed.js` — Added CATEGORY_DEFS and EMOJI_ITEMS entries, updated iteration loops
- `ROADMAP.md` — Marked "Expand vocabulary categories" as complete

**PRs Merged This Session:**
- #74 - feat(vocab): add 6 new vocabulary categories

**Current State:**
- Branch: master, clean, fully synchronized with origin/master (commit `9273757`)
- No unpushed commits, no uncommitted changes
- No stale local branches from this session

**Unfinished Git Workflows:**
The following PRs from prior sessions remain open. They were NOT touched in this session. All have CodeRabbit review comments only (no blocking approvals required). All CI checks pass.

- **PR #70** (`feature/progress-sharing`) — "Add shareable result card with Web Share API"
  - CodeRabbit flagged 2 actionable issues in `app.js`: phase label reading `PHASES[game.currentPhase]` (often undefined), and `isNewBest` treating ties as new bests
  - Status: checks pass, not merged, awaiting decision

- **PR #68** (`feature/daily-challenges`) — "feat: add daily challenge system"
  - CodeRabbit flagged several nitpicks: missing `waffley_theme` removal on data delete, unguarded `statusEl` in `renderChallengeProgress`, unconditional `saveStats()` on page load, duplicated UTC date logic in `updateDailyStreak`, hardcoded dark-mode colors in daily challenge components
  - Status: checks pass, not merged, awaiting decision

- **PR #58** (`fix/debounce-api-saves`) — "fix: debounce syncStatsToDb with 400ms timer"
  - No CodeRabbit actionable issues. Clean PR.
  - Status: checks pass, no reviews, oldest open PR — likely safe to merge

**Stashes (pre-existing, not from this session):**
- `stash@{0}` — ROADMAP.md checkbox updates from `feature/sentry-error-tracking` (likely obsolete)
- `stash@{1}` — WIP before `feature/pronouns-full-category` branch (likely obsolete)
- `stash@{2}` — WIP word-stats spaced-repetition system (may have been superseded by PR #73)
- `stash@{3}` — TTS revert changes on `fix/tts-voice-quality-v2` (likely obsolete)
- `stash@{4}`, `stash@{5}` — WIP from old feature branches (obsolete)

**Domain and Hosting (In Progress):**
- User purchased `waffley.app` domain from Namecheap
- Existing SiteGround hosting will be used
- Steps remaining:
  1. Log in to SiteGround cPanel, add `waffley.app` as an addon domain
  2. Point Namecheap nameservers to SiteGround nameservers
  3. Get SFTP credentials from SiteGround
  4. Upload all repo files to the `waffley.app/public_html` directory via SFTP
  5. Install Let's Encrypt SSL certificate (mandatory — `.app` is HSTS-preloaded, requires HTTPS)
  6. Update Supabase project URL allowlist to include `https://waffley.app`

**Next Steps:**
1. Decide whether to merge PR #58 (`fix/debounce-api-saves`) — clean PR, no issues flagged
2. Review and address CodeRabbit comments on PR #68 and PR #70 before merging
3. Complete domain hosting setup (see steps above)
4. Drop stale stashes after confirming none contain unique work: `git stash drop stash@{0}` through `stash@{5}`
5. Next roadmap features to consider: verb tense expansion, user profiles, push notifications

**Technical Notes:**
- `waffley.app` requires HTTPS — Let's Encrypt via SiteGround cPanel is the expected path
- Supabase `site_url` and redirect URL allowlist must be updated after domain goes live
- The 6 new categories bring the total from the original set to a significantly expanded vocabulary base; seed script is the source of truth for the database state
- Numbers category intentionally has no article/plural forms — iteration in seed.js skips word-form generation for this category

### 2026-02-22 (continued) - PR Cleanup, Daily Challenges, Progress Sharing, Domain

**Work Completed:**

1. **PR #74 — feat(vocab): add 6 new vocabulary categories** (MERGED, from prior sub-session)
   - 6 new categories: Body, Clothing, Home, Numbers (0-10), Family, Professions/Jobs
   - 11 items each, full translations in all 6 languages
   - Supabase seed run: 121 items, 726 translations, 1596 word forms
   - ROADMAP.md marked complete

2. **Repository made public** — `gh repo edit --visibility public`

3. **PR #58 — fix: debounce syncStatsToDb with 400ms timer** (MERGED)
   - Resolved merge conflicts in ROADMAP.md and app.js (debounce + Sentry error reporting)
   - Rebased on master and force-pushed

4. **PR #68 — feat: add daily challenge system** (CLOSED as superseded)
   - Created PR #75 to address CodeRabbit review comments:
     - Guard `statusEl` in `renderChallengeProgress`
     - Only call `saveStats()` when daily challenge date actually changed
     - Reuse `getTodayUTC()` instead of duplicating UTC date logic
     - Add ARIA `role="progressbar"` attributes to progress bars
   - PR #75 MERGED, PR #68 CLOSED

5. **PR #70 — feat(share): add share card generation and Web Share API** (MERGED)
   - Fixed phase label: `PHASES[getPhaseFromProgress()]` replacing undefined `game.currentPhase`
   - Fixed `isNewBest`: strict `>` instead of `>=` to prevent ties triggering "new personal best"
   - Rebased on master, amended commit, force-pushed and merged

6. **Domain purchase** — `waffley.app` purchased from Namecheap
   - Hosting: existing SiteGround account
   - Deployment not yet completed (see Next Steps)

**PRs Merged This Session:**
- #74 — feat(vocab): add 6 new vocabulary categories
- #58 — fix: debounce syncStatsToDb with 400ms timer
- #75 — fix: address CodeRabbit review comments on daily challenges
- #70 — feat(share): add share card generation and Web Share API

**Current State:**
- Branch: master, clean, fully synchronized with origin/master
- No open PRs
- No uncommitted changes
- All local feature branches from this session cleaned up

**Unfinished Git Workflows:**
- None — all PRs resolved, working tree clean

**Stashes (pre-existing, not from this session — candidates for deletion):**
- `stash@{0}` — ROADMAP.md checkbox updates from `feature/sentry-error-tracking` (likely obsolete)
- `stash@{1}` — WIP before `feature/pronouns-full-category` branch (likely obsolete)
- `stash@{2}` — WIP word-stats spaced-repetition system (likely superseded by merged PR #73)
- `stash@{3}` — TTS revert changes on `fix/tts-voice-quality-v2` (likely obsolete)
- `stash@{4}`, `stash@{5}` — WIP from old feature branches (obsolete)
- To drop all: `git stash drop stash@{5}` through `stash@{0}` (drop highest index first)

**Domain and Hosting (In Progress):**
- `waffley.app` purchased from Namecheap — nameservers not yet pointed
- Steps remaining for next session:
  1. Log in to SiteGround cPanel, add `waffley.app` as an addon domain
  2. Point Namecheap nameservers to SiteGround nameservers
  3. Obtain SFTP credentials from SiteGround
  4. Upload all repo files to `waffley.app/public_html` via SFTP
  5. Install Let's Encrypt SSL certificate (mandatory — `.app` is HSTS-preloaded, HTTPS required)
  6. Update Supabase project URL allowlist to include `https://waffley.app`

**Next Steps:**
1. Complete `waffley.app` deployment (priority — domain is live but not deployed)
2. Drop stale stashes: `git stash drop stash@{5}` through `stash@{0}`
3. Next roadmap features: expand verb tenses (L), iOS/Android apps (M), or CI/CD pipeline (M)

**Technical Notes:**
- `.app` TLD is HSTS-preloaded — HTTPS is not optional, must be installed before the site can load
- Supabase `site_url` and redirect URL allowlist must be updated after domain goes live
- `PHASES[getPhaseFromProgress()]` is the correct pattern for reading current phase label (not `game.currentPhase` which is undefined after the game object refactor)
- `isNewBest` strict `>` change means ties do not trigger the "new personal best" toast

### 2026-02-23 - PR Cleanup Sprint + Domain Purchase

**Work Completed:**

1. **PR #76 — fix: pronoun highlight, verb layout, speed mercy complete, verb button dedup** (MERGED)
   - Removed green highlight from verbs/pronouns in the Learning phase (was inappropriate for guided recognition rounds)
   - Fixed verb Practice+ layout to use pronoun emoji consistently across all phases
   - Added "Mark Level Complete" option when speed round timer hits 2 seconds (mercy mechanic)
   - Deduplicated identical verb conjugation answer buttons using translation-based matching

2. **PR #75 — fix: address CodeRabbit review comments on daily challenges** (MERGED, from prior sub-session)
   - Guard `statusEl` in `renderChallengeProgress`
   - Only call `saveStats()` when daily challenge date actually changed
   - Reuse `getTodayUTC()` instead of duplicating UTC date logic
   - Add ARIA `role="progressbar"` attributes to progress bars

3. **PR #70 — feat(share): add share card generation and Web Share API** (MERGED, from prior sub-session)
   - Fixed phase label: `PHASES[getPhaseFromProgress()]` replacing undefined `game.currentPhase`
   - Fixed `isNewBest`: strict `>` instead of `>=` to prevent ties triggering "new personal best"

4. **PR #58 — fix: debounce syncStatsToDb with 400ms timer** (MERGED, from prior sub-session)
   - Resolved merge conflicts, kept Sentry error reporting alongside debounce logic

5. **PR #74 — feat(vocab): add 6 new vocabulary categories** (MERGED, from prior sub-session)
   - Added 6 new categories: Body, Clothing, Home, Numbers (0-10), Family, Professions/Jobs
   - 11 items each, full translations in all 6 languages
   - Supabase seed run: 121 items, 726 translations, 1596 word forms

6. **Repository made public** — `gh repo edit --visibility public`
   - Remote: https://github.com/stephenbeale/waffley (now public)

7. **Domain purchase** — `waffley.app` purchased from Namecheap
   - Hosting: existing SiteGround account
   - Deployment not yet started (awaiting SFTP credentials)

**PRs Merged This Session:**
- #74 — feat(vocab): add 6 new vocabulary categories
- #58 — fix: debounce syncStatsToDb with 400ms timer
- #75 — fix: address CodeRabbit review comments on daily challenges
- #70 — feat(share): add share card generation and Web Share API
- #76 — fix: pronoun highlight, verb layout, speed mercy complete, verb button dedup

**Current State:**
- Branch: master, clean, fully synchronized with origin/master
- No open PRs
- No uncommitted changes
- PR #68 (`feature/daily-challenges`) was closed as superseded — its work landed via PR #75

**Stale Local Branches (not yet deleted — candidates for cleanup):**
- `feature/db-migration`
- `feature/sentence-building-mode`
- `feature/xp-and-levelling`
- `fix/button-two-columns`
- `fix/pronoun-reinforcement-label`
- `fix/stats-button-pronoun-access`
- `refactor/consolidate-language-data`
- `refactor/es-modules`
- `refactor/extract-utilities`
- `refactor/per-language-files`
- To verify all are merged before deleting: `git branch --merged master`
- To delete all merged branches in one pass: `git branch --merged master | grep -v '^\* ' | xargs git branch -d`

**Stashes (pre-existing — candidates for deletion):**
- `stash@{0}` — ROADMAP.md checkbox updates from `feature/sentry-error-tracking` (likely obsolete)
- `stash@{1}` — WIP before `feature/pronouns-full-category` branch (likely obsolete)
- `stash@{2}` — WIP word-stats spaced-repetition system (likely superseded by merged PR #73)
- `stash@{3}` — TTS revert changes on `fix/tts-voice-quality-v2` (likely obsolete)
- `stash@{4}`, `stash@{5}` — WIP from old feature branches (obsolete)
- To drop all: `git stash drop stash@{5}` through `stash@{0}` (drop highest index first)

**Domain and Hosting (In Progress):**
- `waffley.app` purchased from Namecheap — nameservers not yet pointed to SiteGround
- Steps remaining for next session:
  1. Log in to SiteGround cPanel, add `waffley.app` as an addon domain
  2. Point Namecheap nameservers to SiteGround nameservers
  3. Obtain SFTP credentials from SiteGround
  4. Upload all repo files to `waffley.app/public_html` via SFTP
  5. Install Let's Encrypt SSL certificate (mandatory — `.app` is HSTS-preloaded, HTTPS required)
  6. Update Supabase project URL allowlist to include `https://waffley.app`

**Next Steps:**
1. Deploy `waffley.app` on SiteGround — highest priority, domain is live but nothing is served
2. Drop stale stashes: `git stash drop stash@{5}` through `stash@{0}`
3. Delete stale local branches (verify merged first, then batch delete)
4. Next roadmap features: expand verb tenses (L), iOS/Android apps (M), CI/CD pipeline (M)

**Technical Notes:**
- `.app` TLD is HSTS-preloaded — HTTPS is mandatory before the site can load in any browser
- Supabase `site_url` and redirect URL allowlist must be updated after domain goes live
- PR #76 dedup logic uses translation-based matching: two buttons with identical foreign-language text are collapsed into one, preventing confusing duplicate answer options for verb conjugations
- `PHASES[getPhaseFromProgress()]` is the correct pattern for reading the current phase label

### 2026-02-23 (continued) - Buy Me a Coffee Nudge + Roadmap Cleanup

**Work Completed:**

1. **PR #77 — feat: add Buy Me a Coffee nudge at key touchpoints** (MERGED to master, commit `eb1f090`)
   - Added a non-intrusive coffee nudge link at 4 locations: home screen footer, end screen, stats overlay, cycle-complete overlay
   - URL: https://buymeacoffee.com/stephenbeale
   - Styled at 0.75rem, 60% opacity, gold accent link color (#f0a500)
   - Overlay instances (stats overlay, cycle-complete overlay) include a subtle top border separator for visual separation
   - Commit: `a0fca89` - feat: add Buy Me a Coffee nudge at key touchpoints

2. **Roadmap cleanup** — Marked 4 bugs as complete (all fixed in PR #76):
   - Pronouns round green highlight removed
   - Level 6 pronoun-verb layout fixed
   - 2-second speed round mark-as-complete added
   - Duplicate pronoun answer buttons deduplicated
   - Commit: `f17ee69` - docs: mark 4 bug fixes as complete in roadmap

**PRs Merged This Session:**
- #77 — feat: add Buy Me a Coffee nudge at key touchpoints

**Current State:**
- Branch: master, clean, fully synchronized with origin/master (commit `f17ee69`)
- No open PRs
- No uncommitted changes
- No unpushed commits

**Unfinished Git Workflows:**
- None — working tree clean, all PRs resolved

**Pending Cleanup (carried over from earlier today):**
- Stale git stashes (`stash@{0}` through `stash@{5}`) — all likely obsolete, see descriptions in prior session notes
  - To drop all: `git stash drop stash@{5}` through `stash@{0}` (drop highest index first)
- Stale local branches not yet deleted:
  - `feature/db-migration`, `feature/sentence-building-mode`, `feature/xp-and-levelling`
  - `fix/button-two-columns`, `fix/pronoun-reinforcement-label`, `fix/stats-button-pronoun-access`
  - `refactor/consolidate-language-data`, `refactor/es-modules`, `refactor/extract-utilities`, `refactor/per-language-files`
  - To delete all merged: `git branch --merged master | grep -v '^\* ' | xargs git branch -d`

**Domain and Hosting (In Progress):**
- `waffley.app` purchased from Namecheap — nameservers not yet pointed to SiteGround
- Steps remaining:
  1. Log in to SiteGround cPanel, add `waffley.app` as an addon domain
  2. Point Namecheap nameservers to SiteGround nameservers
  3. Obtain SFTP credentials from SiteGround
  4. Upload all repo files to `waffley.app/public_html` via SFTP
  5. Install Let's Encrypt SSL certificate (mandatory — `.app` is HSTS-preloaded, HTTPS required)
  6. Update Supabase project URL allowlist to include `https://waffley.app`

**Next Steps:**
1. Deploy `waffley.app` on SiteGround — highest priority, domain is purchased but nothing is served
2. Drop stale stashes: `git stash drop stash@{5}` through `stash@{0}`
3. Delete stale local branches: `git branch --merged master | grep -v '^\* ' | xargs git branch -d`
4. Next roadmap features: expand verb tenses (L), iOS/Android apps (M), CI/CD pipeline (M)

**Technical Notes:**
- Buy Me a Coffee nudge is intentionally low-visibility — small text, muted opacity, no button or banner
- Overlay instances use a `border-top: 1px solid rgba(255,255,255,0.1)` separator to visually detach the nudge from game content
- `.app` TLD is HSTS-preloaded — HTTPS is mandatory before the site will load in any browser
- Supabase `site_url` and redirect URL allowlist must be updated after the domain goes live

### 2026-03-04 - Personalised Weakness Report for Stats Overlay

**Work Completed:**

1. **feat: add personalised weakness report to stats overlay** (PR #82 — OPEN, awaiting merge)
   - Branch: `feature/weakness-report` (commit `89a68b1`)
   - Adds a collapsible "Weakness Report" section to the stats overlay
   - `generateWeaknessReport()` in `app.js` analyses `game.stats.wordStats` to compute per-item accuracy, then groups items into weak (bottom 3 by accuracy, min 5 attempts), strong (top 3 by accuracy, min 5 attempts), and weak categories
   - Stats overlay in `index.html` gains a collapsible `<section id="weakness-content">` with `<ul>` lists for weak items, weak categories, and strong items — toggle button `#weakness-toggle` controls `aria-expanded`
   - `styles.css` gains accuracy bar styles (`.accuracy-bar-bg`, `.accuracy-bar-fill`, `.weakness-item`, `.weakness-item-label`, `.weakness-item-stats`), collapsible header (`.weakness-section-header`), and item row layout

**Files Modified:**
- `app.js` — `generateWeaknessReport()` function, rendering logic for the three lists, toggle button wiring in `showStats()`
- `index.html` — collapsible weakness report section inside stats overlay
- `styles.css` — accuracy bar components, item rows, collapsible header

**PR Status:**
- PR #82: https://github.com/stephenbeale/waffley/pull/82
- CodeRabbit check: PASSING (review completed)
- Mergeability: MERGEABLE but BLOCKED by branch protection (requires human review/approval)
- CodeRabbit actionable comments (2):
  1. `app.js` line 365: accuracy rounding edge case — numerator shows 200/200 for 199/200; fix by checking actual error count rather than rounded accuracy in the ternary
  2. `app.js` lines 336-368: innerHTML XSS surface — `itemRow` builds HTML strings for `weakness-weak-list`, `weakness-cat-list`, `weakness-strong-list`; CodeRabbit recommends DOM-safe construction via `createElement`/`textContent`/`appendChild`
  - Nitpick: `index.html` toggle button missing `aria-controls="weakness-content"` attribute (add to `<button id="weakness-toggle">`)

**Unfinished Git Workflows:**
- PR #82 needs to be merged — branch protection blocks `--merge` without human approval
- Options: (a) approve and merge via GitHub UI, (b) address CodeRabbit actionable comments first then merge, (c) use `gh pr merge 82 --admin` if admin override is acceptable

**Next Steps:**
1. Review and merge PR #82 — optionally address the 2 CodeRabbit actionable comments first (XSS fix and accuracy rounding are worthwhile improvements)
2. After merge: delete `feature/weakness-report` branch locally (`git branch -d feature/weakness-report`) and pull master
3. Deploy `waffley.app` on SiteGround — domain purchased but not yet served; see deployment steps in prior session notes
4. Drop stale stashes if not yet done: `git stash list` to confirm, then `git stash drop stash@{N}` for each obsolete entry
5. Italki affiliate programme: already signed up (Awin account) — use link builder at https://ui.awin.com/link-builder/en/awin/publisher/1971095 to generate deep links for waffley.app content
6. Remaining affiliate sign-ups blocking Tier 3 monetisation: Preply and Babbel (via Awin)

**Technical Notes:**
- `generateWeaknessReport()` requires at least 5 attempts per item before including it in weak/strong lists — prevents noise from items seen only once or twice
- Accuracy is stored as a decimal (0–1) in `wordStats`; multiply by 100 for display
- The toggle wiring uses a `click` listener on `#weakness-toggle` that toggles `aria-expanded` and CSS class on `#weakness-content`
- If CodeRabbit XSS fix is applied, replace the `itemRow` template literal with DOM element creation and set text via `textContent`, width via `style.width`

### 2026-03-05 - uTalk Affiliate Nudge + PR #82 CodeRabbit Fixes

**Work Completed:**

1. **fix: replace innerHTML with DOM-safe element creation in weakness report** (commit `0d5fe26`, on `feature/weakness-report`)
   - Addressed CodeRabbit XSS actionable comment: `itemRow` builder in `generateWeaknessReport()` now uses `createElement`/`textContent`/`appendChild` instead of template-literal innerHTML for `weakness-weak-list`, `weakness-cat-list`, and `weakness-strong-list`

2. **fix: add aria-controls to weakness report toggle button** (commit `1951e80`, on `feature/weakness-report`)
   - Addressed CodeRabbit nitpick: `<button id="weakness-toggle">` in `index.html` now carries `aria-controls="weakness-content"` for correct screen-reader linkage

3. **feat: add uTalk affiliate nudge to home screen footer** (PR #83 — OPEN, awaiting review)
   - Branch: `feature/utalk-nudge`
   - Adds a second affiliate nudge line below the existing italki line on the home screen footer
   - Copy: "Prefer to learn at your own pace? Try uTalk for self-paced vocabulary"
   - Links via Awin affiliate ID 1971095 to the uTalk merchant profile (`awinmid=59791`)
   - PR: https://github.com/stephenbeale/waffley/pull/83

4. **uTalk affiliate research** (via site-promoter agent)
   - Confirmed uTalk is available through the existing Awin account (merchant ID 59791)
   - Join link: https://ui.awin.com/awin/affiliate/1971095/merchant-profile/59791
   - uTalk nudge also planned for verbio (Home.jsx + VerbDetail.jsx) once the Awin application is approved
   - Memory updated: uTalk row in affiliate tracking table marked as "Yes" for waffley

**Open PRs at End of Session:**
- PR #82: `feature/weakness-report` — https://github.com/stephenbeale/waffley/pull/82
  - CodeRabbit: PASSING (all actionable comments addressed in commits `0d5fe26` and `1951e80`)
  - Mergeability: MERGEABLE
  - Blocked: REVIEW_REQUIRED (branch protection — needs human approval)
  - Remaining CodeRabbit nitpick: attempt-weighted category accuracy in `app.js` lines 269-280 (optional improvement)
- PR #83: `feature/utalk-nudge` — https://github.com/stephenbeale/waffley/pull/83
  - CodeRabbit: PASSING
  - Mergeability: MERGEABLE
  - Blocked: REVIEW_REQUIRED (branch protection — needs human approval)
  - No actionable review comments

**Git State at Session End:**
- Current branch: `feature/weakness-report` — clean, up to date with origin
- All commits pushed — no unpushed local work
- Stashes: `stash@{0}` (master: WIP CLAUDE.md+ROADMAP), `stash@{1}` (master: word-stats spaced-repetition WIP) — both intentionally retained from prior sessions
- Local-only unmerged branch: `feature/sentence-building-mode` — intentionally kept

**Unfinished Git Workflows:**
- PR #82 needs human approval before merge — cannot be merged via `--admin` without explicit authorisation
- PR #83 needs human approval before merge — same constraint

**Next Steps:**
1. Approve and merge PR #82 via GitHub UI (weakness report — all CodeRabbit fixes shipped)
2. Approve and merge PR #83 via GitHub UI (uTalk affiliate nudge)
3. After both merges: switch to master, pull, delete `feature/weakness-report` and `feature/utalk-nudge` locally
4. Sign up for uTalk via Awin: https://ui.awin.com/awin/affiliate/1971095/merchant-profile/59791 — once approved, replace generic nudge link with a deep link to the relevant language page
5. Add uTalk affiliate nudge to verbio (`Home.jsx` and `VerbDetail.jsx`) — same pattern as waffley footer
6. Deploy `waffley.app` on SiteGround — domain purchased, not yet served (see deployment checklist in 2026-02-27 session notes)
7. Remaining affiliate sign-ups: Preply (https://preply.com/en/affiliate), Babbel (via Awin), eBay Partner Network (https://partnernetwork.ebay.co.uk), CV-Library

**Technical Notes:**
- uTalk Awin merchant ID: 59791; publisher ID: 1971095
- uTalk nudge copy: "Prefer to learn at your own pace? Try uTalk for self-paced vocabulary"
- PR #82 CodeRabbit nitpick (attempt-weighted category accuracy) is optional — current implementation averages per-item rounded accuracy, which may skew category ranking when attempt counts differ significantly; the fix aggregates totalCorrect/totalAttempts per category and rounds once

### 2026-03-18 - One-Letter Hint, Kanban Layout Fixes, Design Polish, Full Deploy

**Work Completed:**

1. **PR #96 — fix(sw): add lang/hr.js to SW precache, bump cache version** (MERGED)
   - Croatian language file was missing from service worker precache list
   - Bumped SW cache version to force asset refresh after previous deploy

2. **PR #94 — feat: automated GitHub Pages deploy workflow** (MERGED)
   - Added `.github/workflows/pages.yml` for automated GitHub Pages deployment
   - Deploys on push to master

3. **PR #87 — refactor: simplify SFTP deploy workflow using public/ directory** (MERGED)
   - Simplified `.github/workflows/deploy.yml` to target `public/` directory
   - Cleaner deploy path aligned with `feature/public-deploy-dir` restructure

4. **PR #98 — feat: one-letter hint in typing mode** (MERGED)
   - When a typed answer is exactly 1 edit distance (Levenshtein) from the correct answer, instead of ending the game it shows: "1 letter wrong — quick, change it!" with a shake animation on the input
   - Prevents unfair game-overs for near-miss typos
   - Does not affect scoring — only gives the user a second chance to correct a single-character error

5. **PR #99 — fix(sw): bump cache to v7 for full SiteGround redeploy** (MERGED)
   - Full file upload to SiteGround `public_html/` (all files from PRs merged this session)
   - Dynamic Cache purged; SW cache bumped to v7 to force client-side cache bust

6. **PR #100 — fix/kanban-mobile-layout** (MERGED)
   - Mobile kanban now uses a 2-column grid on screens ≤480px
   - Category pills displayed as horizontal scrollable row on mobile (not a grid)
   - SW cache bumped to v8 (commit `eebe2d5`) for deploy

7. **PR #101 — feature/design-polish** (MERGED)
   - Bolder titles, waffle accents, warmer colour palette
   - Horizontal pill flow layout + 40vh max-height scroll cap on kanban for all screen sizes (applied in two commits: `1b60d77` + `6469560`)
   - SW cache bumped to v9 before final deploy

8. **Three SiteGround deploys this session** (all manual via File Manager)
   - Deploy 1 (after PRs #96, #94, #87, #98, #99): SW v7 — full redeploy
   - Deploy 2 (after PR #100): SW v8 — mobile kanban fix
   - Deploy 3 (after PR #101): SW v9 — design polish + desktop kanban fix
   - Dynamic Cache purged after each deploy

9. **Memory and documentation updated**
   - Created `feedback_waffley-deploy-table.md` — numbered deploy table for SiteGround reference
   - Updated MEMORY.md: waffley open PRs section cleaned up; SiteGround Dynamic Cache URL added
   - CLAUDE.md session entry for 2026-03-18 written and pushed

**PRs Merged This Session:**
- #96 — fix(sw): add lang/hr.js to SW precache, bump cache version
- #94 — feat: automated GitHub Pages deploy workflow
- #87 — refactor: simplify SFTP deploy workflow using public/ directory
- #98 — feat: one-letter hint in typing mode (1 edit distance check)
- #99 — fix(sw): bump cache to v7 for full SiteGround redeploy
- #100 — fix: compact kanban layout on mobile with 2-col grid and horizontal pills
- #101 — feat(ui): design polish — bolder titles, waffle accents, warmer colours + horizontal pill/scroll kanban

**Current State:**
- Branch: master, clean, up to date with origin/master (HEAD: `3a502dc`)
- SW cache: v9
- Site live at: https://waffley.app — all changes deployed and cache purged
- No open PRs
- No uncommitted changes
- No unpushed commits

**CRITICAL: TTS Bug to Investigate**
User reports text-to-speech broken across all browsers and all languages. Investigation not yet started.
- None of the session PRs touched TTS code — not caused by this session's changes
- Likely a service worker cache issue or browser voice pack loading problem

**Debugging steps for next session:**
1. Open https://waffley.app in Chrome DevTools > Console — capture any JS errors
2. Check Application > Service Workers — confirm SW v9 is activated (not stuck in "waiting")
3. Open DevTools Console and run: `speechSynthesis.getVoices()` — confirm voices list is populated
4. Test in a fresh incognito window (rules out stale SW)
5. Hard-reload with Ctrl+Shift+R or disable SW in DevTools and test without caching
6. If SW is stuck in "waiting": click "skipWaiting" in DevTools, or clear site data and reload
7. Verify `lang/` directory files are correctly present on SiteGround (all 7: es, fr, de, it, cy, pt, hr)
8. Distinguish: TTS not triggering at all vs. TTS triggering but producing no audio — different root causes

**Stashes (review next session):**
- `stash@{0}` — "WIP: stash before creating feature/pronouns-full-category branch" — CLAUDE.md + ROADMAP.md WIP; review content before dropping
- `stash@{1}` — "WIP: word-stats spaced-repetition system" — 43-line `app.js` change; spaced repetition work from a prior session, likely superseded by merged PR #73; compare against master before dropping

**Unfinished Git Workflows:**
- None — working tree clean, all PRs resolved

**Next Steps:**
1. **PRIORITY 1: Investigate TTS bug** — see debugging steps above
2. Review stash@{0} (CLAUDE.md + ROADMAP WIP) — apply or drop
3. Review stash@{1} (spaced repetition WIP) — compare against master; drop if superseded
4. OAuth providers: Google Sign-In and Apple Sign-In still need Supabase credentials
5. Affiliate sign-ups still blocking Tier 3: Preply, uTalk (pending Awin approval), CV-Library, TopCV, LiveCareer

**Technical Notes:**
- One-letter hint uses Levenshtein distance = 1 check; the shake animation is a CSS class toggled on the input element
- SW cache version must be incremented in `sw.js` before every deploy to bust cached assets for existing users
- SiteGround Dynamic Cache URL: https://tools.siteground.com/cacher?siteId=SndEeFpITUZJQT09
- SiteGround File Manager URL: https://tools.siteground.com/filemanager?siteId=SndEeFpITUZJQT09
- Do NOT upload: `.git/`, `node_modules/`, `supabase/`, `docs/`, `scripts/`, `.env`, `*.md`, `package.json`

### 2026-03-23 - Supabase, TTS, and Auth Fixes

**Work Completed:**
- PR #105 merged: three fixes — Supabase singleton client (prevents multiple GoTrueClient instances), graceful anonymous auth failure (catches HTTP 422, logs once, continues offline), TTS voice detection (calls `getVoices()` before playback; skips languages with no available voice such as Welsh and Croatian)
- PR #106 merged: follow-up fixes — TTS unavailable banner when no voices are detected, prevent Supabase client race condition on rapid page load

**Work In Progress:**
- SW cache bumped to v11 on branch `fix/sw-cache-v11` — deploy to SiteGround still pending
- Branch `fix/sw-cache-v11` has not yet been merged to master — deploy prep only

**Unfinished Git Workflows:**
- `fix/sw-cache-v11` branch: one commit (`0b7eda3` — SW cache v11) needs to be included in the SiteGround deploy, then merged back to master

**Next Steps:**
1. Deploy to SiteGround: upload `public/` contents, increment SW cache is already v11 (done)
2. After deploy: merge `fix/sw-cache-v11` into master and delete branch
3. Purge SiteGround Dynamic Cache: https://tools.siteground.com/cacher?siteId=SndEeFpITUZJQT09
4. Add `SUPABASE_ANON_KEY` secret for the daily keep-alive action: https://github.com/stephenbeale/waffley/settings/secrets/actions
5. OAuth providers: Google Sign-In and Apple Sign-In still need Supabase credentials

**Technical Notes:**
- Supabase singleton pattern: client is created once and exported from a shared module; importing twice no longer creates a second GoTrueClient
- TTS voice detection: `speechSynthesis.getVoices()` may return empty array on first call (async population); code must listen for `voiceschanged` event or retry
- SW cache is now v11 — must match the version in `public/sw.js` when deploying

### 2026-08-26 - Supabase Incident Response + Backlog Triage (First Session Back After ~4 Months Inactivity)

**Work Completed:**

1. **Supabase outage investigated and resolved** — project ref `yqgrmpewmrmcajbdjaem` appeared deleted/unreachable via DNS. User logged into the dashboard and confirmed/restored it themselves: https://supabase.com/dashboard/project/yqgrmpewmrmcajbdjaem
2. **PR #109 — docs: add Supabase dashboard link and restore note** (MERGED) — documented the dashboard URL and the incident in `supabase/README.md`
3. **PR #110 — docs(changelog): remove doc-only Supabase README entry** (MERGED) — reverted an incidental CHANGELOG.md entry a sub-agent had added alongside the PR #109 docs change; CHANGELOG.md is reserved for user-facing changes only, not doc/meta changes
4. **Supabase Keep-Alive workflow re-enabled** (`gh workflow enable supabase-keepalive.yml`) — it had been auto-disabled by GitHub due to ~4 months of repo inactivity, NOT a missing secret. Confirmed `SUPABASE_ANON_KEY` has been present since 2026-03-31 (an earlier agent's theory that the secret was missing was checked and disproven). The workflow's 5xx failures visible in its run history from May correctly reflect the then-paused Supabase project, not a workflow bug.
5. **Memory saved**: `waffley-supabase-dashboard.md` (reference) with the dashboard URL and restore context, indexed in MEMORY.md
6. **Branch cleanup**: deleted local `fix/track-package-lock-json` — confirmed merged into master (its commit `eb6f0c3` landed via PR #108, already on master before this session)

**PRs Merged This Session:**
- #109 — docs: add Supabase dashboard link and restore note
- #110 — docs(changelog): remove doc-only Supabase README entry

**Current State:**
- Branch: master, clean, fully synchronized with origin/master (commit `fa0f518`)
- No open PRs
- No uncommitted changes, no unpushed commits, no stashes
- Supabase Keep-Alive workflow: re-enabled but **not yet verified green** — no scheduled run has fired since re-enable; last visible runs (2026-05-20 through 2026-05-24) all show `failure`, but those predate both the re-enable and the Supabase restore, so they don't indicate a current problem

**Unfinished Git Workflows / Open Items:**
- **Deploy automation still broken** — `.github/workflows/deploy.yml` (SFTP to SiteGround) has never worked; `SFTP_HOST`/`SFTP_USER`/`SFTP_PASSWORD` repo secrets were never configured. All live deploys to date have been manual SiteGround File Manager uploads. Untouched this session. See secrets page: https://github.com/stephenbeale/waffley/settings/secrets/actions
- **5 local branches have unmerged, unreviewed commits** and need a keep-or-abandon decision (none are safe to delete as-is):
  - `feature/japanese-language` (`7ba0a4a`) — fix: remove verb conjugations from Japanese
  - `feature/public-deploy-dir` (`43ef906`) — refactor: move deployable files into public/ directory
  - `feature/sentence-building-mode` (`0f5d38a`) — docs(roadmap): add verb learning path items and Brave TTS bug
  - `feature/utalk-nudge` (`48625c1`) — feat: add uTalk affiliate nudge to home screen footer
  - `feature/weakness-report` (`4946f81`) — docs: add session notes for 2026-03-05 uTalk nudge and PR #82 fixes
  - `fix/brave-tts-warning` (`dede98f`) — fix: recommend Chrome/Edge only in Brave TTS banner
  - Note: an earlier project-manager report this session claimed 6 branches (including `fix/track-package-lock-json`) were all stale/already-merged; a direct `git branch --merged master` check found only `fix/track-package-lock-json` actually was — it's been deleted. Treat any future "safe to delete" branch claims with a direct merge check before deleting.
- **`feature/japanese-language` discrepancy needs investigating**: CHANGELOG.md's `[Unreleased]` section already credits Japanese language support as shipped, but the `feature/japanese-language` branch is NOT merged into master. This suggests Japanese language support may not actually be live despite the changelog entry — verify what's actually on master/deployed vs. what the changelog claims before trusting that entry.

**Next Steps:**
1. Configure `SFTP_HOST`/`SFTP_USER`/`SFTP_PASSWORD` repo secrets so `.github/workflows/deploy.yml` can finally automate deploys (currently 100% manual) — see website-deployer agent for guidance
2. Verify Supabase Keep-Alive workflow goes green on its next scheduled run (06:00 UTC daily) — check `gh run list --workflow=supabase-keepalive.yml`
3. Investigate the `feature/japanese-language` vs CHANGELOG.md discrepancy — confirm whether Japanese language support is actually live on master/deployed
4. Triage the 5 unmerged branches listed above — for each, decide: finish and PR, or abandon and delete
5. Once branches are triaged, re-run `git branch --merged master` to confirm what's safe to clean up

**Technical Notes:**
- GitHub auto-disables scheduled workflows after 60 days of repo inactivity — this is why Supabase Keep-Alive stopped running; re-enabling requires `gh workflow enable <file>` (or the Actions UI) and does not require any code or secret change
- CHANGELOG.md is reserved for user-facing changes only — doc-only or meta changes (like the Supabase README note) should not get a changelog entry; PR #110 reverted one that a sub-agent added incorrectly
- Supabase dashboard for this project: https://supabase.com/dashboard/project/yqgrmpewmrmcajbdjaem
