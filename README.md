# Waffley

An interactive language learning game that teaches vocabulary through progressive stages. Pick a language, choose a topic, and match images or colours to words — building from recognition to spoken production.

## How to Play

1. **Choose a language** — Spanish, French, German, Italian, Welsh, Portuguese, or Japanese (romaji)
2. **Choose a mode** — Words (vocabulary) or Verbs (conjugation; not available for Welsh or Japanese)
3. **Pick a category** — Colours, Adjectives, Animals, Food, Weather, Body, Clothing, Home, Numbers, Family, or Jobs (Words) or a verb tense (Verbs)
4. **Progress through four phases:**
   - **Learning** — words shown on the answer buttons
   - **Practice** — answer from memory
   - **Typing** — type the answer (accents optional)
   - **Speech** — speak the answer aloud (requires microphone)

Each level requires mastering every item (answering each correctly at least twice). The timer gets faster as you progress. Complete all four phases to finish a cycle, then start the next with new vocabulary.

### Articles & Plurals (Noun Categories)

For noun categories (Animals, Food, Weather, Body, Clothing, Home, Family, Professions):
- **Cycle 2+** — article forms are introduced (e.g. "El Perro", "Die Katze")
- **Cycle 3+** — plural forms are added (e.g. "Los Perros", "Die Katzen"), shown with repeated emojis

Each form is tracked independently for mastery.

## Features

- 7 languages, 11 categories, 11 items per category (Words mode)
- Verb conjugation mode with 10 verbs across 4 tenses in 6 languages (ES, FR, DE, IT, CY, PT)
- Phase selection — jump to any learning stage
- Mastery-based level progression with progressive button count
- Session mastery — items answered 3 times correctly are excluded from questions
- Silent visual-only rounds in later Learning levels
- Accent-tolerant typing input with accent shortcut buttons
- Escalating correct-answer pitch (resets each level)
- SFX mute toggle on the progress bar
- Text-to-speech pronunciation
- Speech recognition input with wrong-attempt history (Chrome/Edge)
- XP and levelling system with 6 titles (Beginner to Master)
- Daily challenges with progress tracking
- Day streaks and achievements
- Personalised weakness report in stats overlay
- Persistent per-language, per-category progress
- Statistics tracking (streaks, accuracy, games played)
- Optional sign-in (Google/Apple) to sync progress across devices
- Sound effects for correct/incorrect answers
- Pause, quit, and menu navigation with large, bold control buttons
- Accessible: ARIA labels, keyboard navigation, focus management
- Mobile-responsive button layout

## Running Locally

Serve the project root (or `public/` if PR #85 is merged) via HTTP. No build step required.

**Note:** Uses ES modules — must be served via HTTP (e.g. `npx serve .` or VS Code Live Server). Opening `index.html` directly as a file won't work due to CORS restrictions on module imports.

For speech recognition, use Chrome or Edge and allow microphone access.

## Project Structure

```
index.html   — Application markup (single module entry point)
styles.css   — Styling
data.js      — Constants, category structure, assembles language data (ES module)
app.js       — Game logic, state management, UI updates (ES module, imports data.js)
sw.js        — Service worker for offline PWA support
manifest.json— PWA manifest
lang/        — Per-language translation files
  es.js      — Spanish translations, forms, aliases
  fr.js      — French
  de.js      — German
  it.js      — Italian
  cy.js      — Welsh
  pt.js      — Portuguese
  ja.js      — Japanese (romaji)
src/
  api.js     — Supabase client, auth, and cloud sync
ROADMAP.md   — Feature roadmap and technical debt tracking
CLAUDE.md    — Project documentation for AI-assisted development
```
