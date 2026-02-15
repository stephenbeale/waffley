# Roadmap

Planned features and improvements for Waffley.

---

- [ ] **Sound effects for correct/incorrect answers**
  Play a positive sound effect for every correct answer and a buzzer sound for incorrect answers.

- [x] **Fix audio delay on first question of each level**
  The pronunciation audio for the first question after a level-up has a noticeable delay compared to subsequent questions. Add an earlier offset/pre-trigger for the first round's audio so it fires promptly.

- [ ] **Clearer level-up cards**
  Make the cards shown between levels clearer and more informative.

- [ ] **Show the user the plan and progress**
  Tell the user what the learning plan is and make their progression through it clearer.

- [ ] **Make the 3 stages clearer**
  Make the 3 stages of Learning, Practising and Output (speech) clearer to the user so they understand the journey.

- [ ] **Level selection for new languages**
  Give users the option to choose their starting level when beginning a new language or when continuing.

---

## Code Quality & Architecture

### Priority 1 — Fix what's broken

- [ ] **Restore focus indicators**
  Replace `outline: none` on `.answer-btn:focus` with a visible custom focus style for keyboard users.

- [ ] **Add ARIA labels to interactive elements**
  Add `role="dialog"` on overlays, `aria-label` on the colour display, `role="progressbar"` with value attributes on progress bars.

- [ ] **Guard against timer race conditions**
  Add a `roundActive` flag checked by both `handleAnswer` and the timeout callback to prevent `endGame()` firing twice.

### Priority 2 — Reduce technical debt

- [ ] **Extract game state into a state object**
  Replace 15 mutable global variables with a single `gameState` object or simple state machine (`IDLE -> PLAYING -> LEVEL_UP -> GAME_OVER`).

- [ ] **Unify category data model**
  Make colours an entry in `EMOJI_DATA` (or a unified `CATEGORY_DATA`) with a `displayType: 'color'` property. Eliminate all `selectedCategory === 'colours'` conditionals.

- [ ] **Stop mutating the data layer**
  Clone data before shuffling. Never write back into `EMOJI_DATA`.

### Priority 3 — Improve maintainability

- [ ] **Split app.js into modules**
  Use ES modules (`<script type="module">`) to split into logical files: `state.js`, `timer.js`, `speech.js`, `stats.js`, `ui.js`, `game.js`.

- [ ] **Extract utilities and name magic numbers**
  Create `utils.js` with `shuffle()` (currently duplicated). Add named constants for `WARNING_THRESHOLD`, `LEVEL_UP_COUNTDOWN`, `CYCLE_COMPLETE_COUNTDOWN`, etc.

- [ ] **Consolidate language data**
  Define each language as a single object (`{ code, name, flag, speechCode, translations, aliases }`) instead of 7 separate lookup objects.

- [ ] **Refactor CSS with base/modifier classes**
  Create `.btn` base class with `.btn--primary`, `.btn--secondary` modifiers. Create `.overlay` base class. Cuts ~100 lines of duplication.
