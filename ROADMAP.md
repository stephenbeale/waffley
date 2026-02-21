# Roadmap

Planned features and improvements for Waffley.

---

- [x] **Sound effects for correct/incorrect answers**
  Play a positive sound effect for every correct answer and a buzzer sound for incorrect answers.

- [x] **Fix audio delay on first question of each level**
  The pronunciation audio for the first question after a level-up has a noticeable delay compared to subsequent questions. Add an earlier offset/pre-trigger for the first round's audio so it fires promptly.

- [x] **Clearer level-up cards**
  Make the cards shown between levels clearer and more informative.

- [x] **Mastery-based level progression**
  Level-up should only happen once every word in the current set has been answered correctly at least twice, however long it takes. Remove the fixed answer-count threshold and instead track per-word correct counts within the level. The timer still applies per round, but the level continues until mastery is achieved.

- [x] **Show the user the plan and progress**
  Tell the user what the learning plan is and make their progression through it clearer.

- [x] **Make the 3 stages clearer**
  Make the 3 stages of Learning, Practising and Output (speech) clearer to the user so they understand the journey.

- [x] **Add a Typing phase before Speech**
  Introduce a new phase between Practice and Speech where users type the answer instead of selecting it. This bridges the gap between recognition (picking from options) and production (speaking aloud), reinforcing spelling and recall before the user is asked to speak.

- [x] **Level selection for new languages**
  Give users the option to choose their starting level when beginning a new language or when continuing.

- [x] **Expand vocabulary items in each set**
  Add more items to each category so there is greater variety as the user progresses.

- [x] **Introduce articles at higher levels**
  At higher levels, require the article with the noun (e.g. "la torta", "el plátano", "die Katze"). Teaches gender alongside vocabulary.

- [x] **Add plurals with and without articles**
  Introduce plural forms at higher levels, with and without articles (e.g. "dos plátanos", "due torte", "una torta"). Display quantities using repeated emojis (e.g. two emojis for plural).

- [x] **Add back and pause buttons to game UI**
  Add a back button during gameplay so users can exit to the menu without having to lose. Add a pause button that stops the timer. Users should never feel trapped in a round.

- [x] **Add navigation options to level-up and cycle-complete cards**
  On the overlay cards shown between rounds (level-up, cycle complete), give users options to quit to menu, change language, or change category — not just auto-continue. Users should be able to choose where they go at all times.

- [x] **Remove mastered items from the active pool**
  After 3 consecutive correct answers for an item within a session, remove it from the available options. This narrows the pool to only unlearned items, making it clear what remains to be mastered and focusing practice where it's needed.

- [x] **Improve typing mode for mobile**
  Make emoji/colour display smaller so the keyboard overlay doesn't obscure the text input. Move the timer bar between the display and the input. Add accent shortcut buttons above the text input for easy character entry. Show a hint on typing phase start and level-up cards that accents can be found by holding the relevant key on keyboard.

- [x] **Show wrong attempts in speech mode**
  When the user gets a speech recognition answer wrong, show a scrolling record of past attempts with a cross next to each, so they can see what was heard and adjust their pronunciation.

- [x] **Smooth vertical progress bar**
  The mastery progress bar jumps between values instead of animating smoothly. Add a CSS transition so it rises gradually when items are mastered.

- [x] **Correct answer sound pitch increase**
  Make the correct answer sound slightly higher pitch with each consecutive correct answer, resetting on a wrong answer. Creates a satisfying escalation effect.

- [x] **Keep mastered item buttons visible but exclude from questions**
  Instead of hiding buttons after 3 consecutive correct answers, keep them visible but ensure they can't be selected as the question. This keeps all options in view for a more natural feel.

- [x] **Silent visual-only round after pronunciation**
  After pronunciation has been on, add a round of purely visual answers with no sound, so the user must recognise the emoji without an audio prompt.

- [x] **Fix button overflow on mobile**
  Button options spill off the screen on mobile devices. Ensure all buttons fit within the viewport.

- [x] **Centre lone button on odd-count rows**
  When displayed as an odd number, the single button on the last row should be centred rather than aligned to one side.

- [x] **Fix progression tone reset between rounds**
  Check that the escalating correct-answer pitch resets properly each round. Currently it may carry over incorrectly.

- [x] **Mute button for progression sounds**
  Give the user an option to mute progression sounds with a mute button at the top of the progression bar.

- [x] **Progressively add more answer buttons as difficulty increases**
  As a more difficult round, increase the number of answer buttons rather than reducing them.

- [x] **Redesign pause/cancel buttons**
  Replace the small outlined pause and cancel buttons with bold, large symbols in a big box. The current outline is too small and hard to see, especially on mobile.

---

## Code Quality & Architecture

### Priority 1 — Fix what's broken

- [x] **Restore focus indicators**
  Replace `outline: none` on `.answer-btn:focus` with a visible custom focus style for keyboard users.

- [x] **Add ARIA labels to interactive elements**
  Add `role="dialog"` on overlays, `aria-label` on the colour display, `role="progressbar"` with value attributes on progress bars.

- [x] **Guard against timer race conditions**
  Add a `roundActive` flag checked by both `handleAnswer` and the timeout callback to prevent `endGame()` firing twice.

- [x] **Focus overlay buttons when shown**
  When the pause overlay (and other dialog overlays) appear, move focus to the first button inside. Currently focus remains on the game buttons in the background, which is poor for accessibility and keyboard navigation.

### Priority 2 — Reduce technical debt

- [x] **Extract game state into a state object**
  Replace 15 mutable global variables with a single `gameState` object or simple state machine (`IDLE -> PLAYING -> LEVEL_UP -> GAME_OVER`).

- [x] **Unify category data model**
  Make colours an entry in `EMOJI_DATA` (or a unified `CATEGORY_DATA`) with a `displayType: 'color'` property. Eliminate all `selectedCategory === 'colours'` conditionals.

- [x] **Stop mutating the data layer**
  Clone data before shuffling. Never write back into `EMOJI_DATA`.

### Priority 3 — Improve maintainability

- [x] **Split app.js into modules**
  Use ES modules (`<script type="module">`) to split into logical files. data.js exports all constants, app.js imports them.

- [x] **Extract utilities and name magic numbers**
  Add named constants for `TIMER_WARNING_RATIO`, `LEVEL_UP_COUNTDOWN`, `CYCLE_COMPLETE_COUNTDOWN`, `STARTING_BUTTON_COUNT`, `MAX_PITCH_SEMITONES`, `TTS_SPEECH_RATE`, `SILENT_LEVEL_THRESHOLD`, etc.

- [x] **Consolidate language data**
  Define each language as a single object (`{ code, name, flag, speechCode }`) with derived lookups for backward compatibility.

- [x] **Split data.js into per-language files**
  Move vocabulary and translations out of data.js into separate files per language (e.g. `lang/es.js`, `lang/fr.js`). Each file owns its translations, article/plural forms, and speech aliases. Keeps data.js for shared constants and category structure. Makes it easy to add new languages or let contributors work on one language independently.

- [x] **Refactor CSS with base/modifier classes**
  Create `.btn` base class with `.btn--primary`, `.btn--secondary` modifiers. Create `.overlay` base class. Cuts ~100 lines of duplication.

---

## Bugs & Fixes

- [x] **Fix first question audio delay**
  The pronunciation audio for the very first question of a session still fires too slowly. The existing `warmUpSpeech()` call isn't sufficient. Investigate whether a longer pre-warm or a silent utterance queued earlier (e.g. on language select) resolves the delay. This must be fixed.

- [x] **Never repeat the same answer in consecutive rounds**
  The same item can currently be asked twice in a row, which feels confusing and broken. The `nextRound()` pick loop already attempts to avoid repeats, but it's not working reliably. Investigate and fix the deduplication logic so consecutive questions always show a different item.

- [x] **Fix answer buttons overflowing off-screen on mobile**
  Despite earlier fixes, some answer buttons are still rendered off-screen on smaller mobile viewports. Investigate which screen sizes and button counts trigger this. Ensure buttons are always fully visible and scrollable within the viewport.

- [x] **Fix button container overflow on portrait mobile**
  `.buttons` had `width: 95vw` which overflows when `#game-screen` has `padding: 2rem` on each side. Fixed by using `width: 100%` so the container respects the parent's padding.

- [x] **Verb cycle completes → return to topic screen**
  After mastering all 4 phases of a verb, the game was automatically continuing to the next verb in the same session. Changed so that verb cycle completion returns to the topic screen, ensuring each verb is always started as a fresh session.

- [x] **Timer always resets to MAX_TIME at session start**
  Resuming a game mid-phase previously threw the user straight into a fast timer (e.g. 4s if at level 4). Now the first level of every new session always runs at 10s regardless of progress, so the timer only accelerates within the current session.

- [x] **Reverse-mode emoji buttons: 3-column grid with larger emoji**
  Emoji/colour swatch buttons were shown 2-per-row at small size. Since emojis are compact, changed to a 3-column grid with `font-size: 2.2rem` and `min-height: 72px` for comfortable, clearly visible tap targets.

---

## Gameplay & UX Improvements

- [x] **Reduce levels per phase from 10 to 5**
  The current 10 levels per phase feels too long and repetitive. Reduce to 5 levels per phase (20 per cycle instead of 40). This makes progression feel snappier and more rewarding. Evaluate whether mastery thresholds need adjusting to compensate.

- [x] **Reduce typing phase minimum time to 4 seconds**
  The 2-second floor is too aggressive for typing. Set a separate minimum of 4 seconds for the Typing phase, since typing inherently requires more time than tapping a button. The speed curve should still decrease but bottom out at 4s.

- [x] **Use TTS to announce phase transitions**
  When the user moves between phases (Learning -> Practice -> Typing -> Speech), use text-to-speech to announce the change (e.g. "Practice mode" or "Now type the answer"). Gives clear audio feedback about what's changed, especially useful when the visual level-up card auto-dismisses.

- [x] **Add a triumphant sound on level completion**
  Play a short celebratory sound effect (fanfare or chime) when the user completes a level. Distinct from the per-answer correct sound. Provides a satisfying reward moment at each level-up.

- [x] **Improve end-game flow — return to language home page**
  The current "Play Again" end screen is confusing. After a game ends, the user should be returned to the topic screen for their selected language (not the language picker). Make the flow: end game -> show score -> "Continue" returns to topic screen with progress updated.

- [x] **Add gameplay variations to reduce repetitiveness**
  The level-to-level experience feels samey. Consider small variations as the user progresses within a phase, such as: timed bonus rounds, reverse mode (show the foreign word, pick the English), "pick the odd one out", or brief review rounds that mix items from earlier levels. Even subtle changes like shuffling the display format or adding streak challenges would help.

---

## Database & Backend

- [x] **Design database schema**
  Designed a comprehensive, normalised PostgreSQL schema covering all vocabulary data (languages, categories, items, translations, word forms, verb conjugations), user progress, statistics, and session tracking. Schema supports offline-first mobile architecture with sync capabilities. See `docs/db-schema.md`.

- [x] **Implement database and seed data**
  Stand up a PostgreSQL instance (Supabase or similar), run the schema DDL, and write seed scripts to populate content tables from the existing JS data files. Schema at `supabase/schema.sql`, seed at `supabase/seed.js`, setup guide at `supabase/README.md`.

- [x] **Build API layer**
  Created `src/api.js` — a thin browser ES module wrapper around the Supabase JS client. Exports `ensureSession`, `signInWithGoogle`, `signInWithApple`, `signOut`, `getVocabulary`, `getVerbs`, `getPronounTranslations`, `getProgress`, `upsertCategoryProgress`, `recordSession`, `upsertUserStats`. In-memory caching for content. Ready to be imported in `app.js` when frontend migration starts.

- [x] **Migrate from localStorage to database**
  Replace localStorage reads/writes with API calls. Support offline fallback for web app.

- [x] **Fix reverse-mode emoji buttons too small on mobile**
  In reverse mode (Practice phase), answer buttons display emoji/colour swatches instead of text. On mobile the buttons are too small for comfortable tapping. Either increase the emoji font size and button height dynamically when in reverse mode, or convert reverse rounds to a dedicated round type where the layout is designed specifically for emoji/colour choices (e.g. a 2×3 or 3×2 grid with large tap targets).

---

## Auth & User Accounts

- [x] **Add Google / Apple OAuth via Supabase Auth**
  Use Supabase Auth with Google and Apple as providers. Anonymous sessions should be created automatically on first visit (no sign-up wall). On login, migrate the anonymous user's progress to the authenticated account. Apple Sign-In is required for iOS app submissions; Google for Android and web. Use Supabase's built-in JWT handling — do not roll custom auth. Row Level Security (RLS) on all user tables so each user can only read/write their own data.

---

## Verb Learning Path — Future Improvements

- [x] **One verb per full cycle — master it before moving on**
  Currently the active verb rotates every 5 levels (once per phase). Instead, a single verb should be practiced through all 4 phases (Learning → Practice → Typing → Speech, 20 levels total) before the next verb is introduced. This gives the learner time to truly internalise each conjugation set before layering a new one.

  **Verb ordering by language:**
  - **Spanish**: ser → estar → tener → ir → hablar → hacer → querer → poder → saber → comer → vivir (ser and estar both mean "to be" — teach ser first as permanent state, then estar as temporary)
  - **Italian**: essere → avere → andare → fare → volere → potere → sapere → mangiare → parlare → vivere (essere = permanent, followed by avere etc.)
  - Other languages: be → have → go → do → want → can → know → eat → speak → live (existing order)

  Implementation: replace the rotating `getCurrentVerb()` level-index formula with a persistent `currentVerbIndex` stored alongside `levelsCompleted` in progress. Advance the index only on full cycle completion (after all 4 phases for that verb).

- [x] **Teach subject pronouns before conjugations**
  Before showing verb conjugations, run a short pronoun introduction phase: teach "Yo = I", "Tú = You", etc. as a prerequisite mini-game. Only needs to pass once per language. I and You are unambiguous — only he/she/we/they need gendered emojis to disambiguate:
  - He → 👨
  - She → 👩
  - We → 👨‍👩 (mixed, default nosotros) / 👩👩 (nosotras, where applicable)
  - You (all) → 👥 (vosotros mixed) / 👩👩 (vosotras, where applicable)
  - They → 👨👩 (mixed, ellos) / 👩👩 (ellas, where applicable)
  For Spanish/Italian specifically, surface nosotras/vosotras/ellas variants as additional pronouns with their own emoji groupings (two 👩 for all-female groups, one 👨 + one 👩 for mixed).

- [x] **Make pronouns a full game category with 4 learning phases**
  Pronouns now follow the same 4-phase pattern (Learning → Practice → Typing → Speech) as all other vocabulary categories instead of being a passive tap-through walkthrough. Intro remains obligatory for first-timers. Journey tracker shows phase/level progress. Duplicate pronoun translations (e.g. German "Sie" for she/they) are disambiguated with emoji on buttons. Verb/pronoun buttons use 3-column grid with larger text. Button flicker eliminated by shuffling items once at level start instead of per-round DOM reorder.

---

## Pronoun & Verb UX Polish

- [x] **Add emojis for "I" and "You" pronouns**
  Added 🙋 for I and 🫵 for You in `PRONOUN_EMOJIS` so all 7 pronouns have visual icons.
  - Complexity: S

- [x] **Disable text-transform: capitalize for verb/pronoun buttons**
  Added `text-transform: none` to `.verb-mode .answer-btn` so German "Sie" vs "ich" capitalisation is preserved from data.
  - Complexity: S

- [x] **Highlight correct button in pronoun Learning phase**
  In Learning phase for verb-like modes, the correct answer button gets a green border glow (`.learning-highlight`). Removed on other phases.
  - Complexity: S

- [ ] **Responsive verb button layout — 2-column fallback for long conjugations**
  The 3-column grid works well for short pronoun words but longer verb conjugations (e.g. Spanish "nosotros hablamos") may overflow on mobile. Add a media query or content-based fallback to 2 columns for verb mode when text is too long.
  - Complexity: S

- [x] **Balance 7-button grid layout**
  Last button on an orphaned row (7th of 7 in 3-column grid) now gets `flex: 50%` via `:last-child:nth-child(3n+1)` selector.
  - Complexity: S

- [x] **Ordered pronoun rounds for first 2 passes per level**
  Pronoun challenges now go through all 7 pronouns in canonical order (I, you, he, she, we, you_pl, they) for the first 2 complete passes at each level, then switch to random picking. Duplicate translations (e.g. German "Sie") are handled by showing one button per unique translation with translation-based matching.
  - Complexity: S

---

## Future Roadmap

### P1 — Must Have Soon

- [x] **Daily streaks**
  Track consecutive days of practice with a streak counter and calendar. Resets if a day is missed. Core retention mechanic — most impactful engagement driver.
  - Complexity: M

- [ ] **Offline-first architecture**
  Full gameplay with no network required. Vocabulary and progress cached locally; background sync when online. Essential before mobile app submission.
  - Complexity: L

- [ ] **GDPR / CCPA compliance**
  Right to access, portability, and erasure. Clear privacy policy and terms of service in-app. Required before any public launch.
  - Complexity: M

- [ ] **Debounce API saves** *(in progress)*
  Collapse rapid back-to-back `saveProgress()` calls (e.g. answer → level-up within ms) into a single DB write per 400ms window. Prevents double-writes and race conditions.
  - Complexity: S

### P2 — Should Have

- [ ] **Achievement badges**
  Trophies for milestones: first correct answer, mastering a category, 7-day streak, 100 rounds, perfect accuracy. Displayed on a profile/stats screen.
  - Complexity: M

- [ ] **Daily challenges**
  One optional themed daily quest per language (e.g. "20 correct answers", "finish level 3 in verbs") with bonus XP reward. Resets at midnight UTC.
  - Complexity: M

- [ ] **XP and levelling**
  Award XP per correct answer scaled by phase difficulty. Visual level bar on profile. Unlocks cosmetic rewards at thresholds. Feeds into streaks and achievements.
  - Complexity: M

- [ ] **Spaced repetition scheduling**
  Surface vocabulary items at scientifically optimal intervals based on performance history. Background algorithm schedules review rounds automatically.
  - Complexity: L

- [ ] **Expand vocabulary categories**
  Add 5+ new categories: body parts, clothing, household objects, numbers 0–100, family members, professions.
  - Complexity: M

- [ ] **Expand verb tenses**
  Add past tense, present perfect, and conditional for Spanish and Italian. Requires updated schema and per-tense conjugation data.
  - Complexity: L

- [ ] **iOS & Android native apps**
  Package as a Capacitor app with native splash screen, icons, and offline support. Publish to App Store and Google Play.
  - Complexity: M

- [ ] **Push notifications**
  Daily practice reminders, streak alerts, and friend challenge notifications via Firebase Cloud Messaging.
  - Complexity: M

- [ ] **User profiles**
  Shareable profiles showing total XP, languages studied, highest cycle per language, and achievement badges.
  - Complexity: M

- [ ] **Proficiency placement test**
  Optional 10-question initial assessment to place users at an appropriate starting level, skipping early repetition for those with existing knowledge.
  - Complexity: M

- [ ] **Screen reader & WCAG 2.1 AA audit**
  Full accessibility audit with NVDA/JAWS. Fix missing labels, improve heading hierarchy, add live regions for game state announcements.
  - Complexity: M

- [ ] **Keyboard-only navigation**
  Full Tab/arrow key support throughout, including button grids. Currently OK but needs a targeted audit for edge cases.
  - Complexity: S

- [ ] **Dark/light mode toggle**
  User preference for light mode (currently dark-only). Reduces eye strain and broadens accessibility.
  - Complexity: S

- [ ] **Error tracking (Sentry)**
  Capture JavaScript errors, API failures, and performance issues in production. Set up alerts for error rate spikes.
  - Complexity: S

- [ ] **CI/CD pipeline**
  Automated lint, test, and deploy on PRs via GitHub Actions. Auto-deploy to staging on merge to master.
  - Complexity: M

- [ ] **Neural TTS voices**
  Replace browser TTS with higher-quality neural speech (Google Cloud TTS or Azure Neural) for more natural pronunciation.
  - Complexity: S

- [ ] **Progress visualisation**
  Charts showing accuracy over time, items mastered, vocabulary growth curve, and phase difficulty by category.
  - Complexity: M

- [ ] **Personalised weakness report**
  Weekly digest showing categories with lowest accuracy, items failed most frequently, and what to focus on next.
  - Complexity: M

- [ ] **Data export / backup**
  One-click export of all progress as JSON. GDPR-compliant and gives users confidence their data is portable.
  - Complexity: S

- [ ] **Add more languages**
  Expand beyond current 6 languages. Priority: Japanese, Mandarin, Arabic, Russian — each requiring per-language data files and speech code mapping.
  - Complexity: L per language

- [ ] **Modularise app.js**
  Split monolithic app.js into ES modules: `state.js`, `game.js`, `ui.js`, `speech.js`, `timer.js`. Prerequisite for unit testing.
  - Complexity: M

- [ ] **Unit & integration test suite**
  Jest tests for core game logic (scoring, mastery, level-up). Cypress e2e tests for critical user flows. Target 70%+ logic coverage.
  - Complexity: L

- [ ] **Admin dashboard**
  Internal panel showing active users, new sign-ups, top languages, error logs, and user lookup. Role-gated via Supabase RLS.
  - Complexity: M

### P3 — Nice to Have

- [ ] **Leaderboards**
  Global and friends rankings by XP, streak, or languages mastered. Optional privacy controls.
  - Complexity: M

- [ ] **Friend challenges**
  Challenge a friend to beat your score in a specific category. Async result comparison with bonus XP for winner.
  - Complexity: M

- [ ] **Progress sharing**
  One-tap generation of a shareable result card for social media (round score, streak milestone, category mastered).
  - Complexity: S

- [ ] **Exam prep mode**
  Curated vocabulary and timed drills for DELE, DELF, TELC etc. Score analytics and targeted weak-area revision.
  - Complexity: L

- [ ] **Business language track**
  Specialist vocabulary for meetings, emails, and negotiations per language.
  - Complexity: M

- [ ] **AI conversation partner**
  Claude/GPT-powered free-form dialogue practice with grammar and vocabulary correction feedback.
  - Complexity: XL

- [ ] **Pronunciation scoring AI**
  ML-based pronunciation evaluation that scores user speech beyond binary right/wrong and highlights specific phonemes to improve.
  - Complexity: L

- [ ] **User-created flashcard decks**
  Advanced users can create and share custom vocabulary sets. Community voting on quality.
  - Complexity: M

- [ ] **UI localisation**
  Translate the app UI into 10+ languages so non-English speakers can learn their target language with a native-language interface.
  - Complexity: L

- [ ] **TypeScript migration**
  Gradual migration of JS to TypeScript starting with the data layer and API client. Improves refactoring safety and IDE support.
  - Complexity: L

- [ ] **A/B testing framework**
  Infrastructure to run controlled experiments on timer values, button layouts, onboarding flows, and pricing.
  - Complexity: L

- [ ] **Home screen widgets**
  iOS/Android widgets showing current streak, today's XP, and a quick-launch button.
  - Complexity: M

- [ ] **Premium subscription tier**
  "Waffley Pro" with ad-free experience, early language access, XP boosts, and exclusive cosmetics. Stripe/RevenueCat integration.
  - Complexity: L

