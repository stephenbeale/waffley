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
