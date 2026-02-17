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

- [ ] **Refactor CSS with base/modifier classes**
  Create `.btn` base class with `.btn--primary`, `.btn--secondary` modifiers. Create `.overlay` base class. Cuts ~100 lines of duplication.
