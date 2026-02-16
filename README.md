# Waffley

An interactive language learning game that teaches vocabulary through progressive stages. Pick a language, choose a topic, and match images or colours to words — building from recognition to spoken production.

## How to Play

1. **Choose a language** — Spanish, French, German, Italian, Welsh, or Portuguese
2. **Pick a category** — Colours, Adjectives, Animals, Food, or Weather
3. **Progress through four phases:**
   - **Learning** — words shown on the answer buttons
   - **Practice** — answer from memory
   - **Typing** — type the answer (accents optional)
   - **Speech** — speak the answer aloud (requires microphone)

Each level requires mastering every item (answering each correctly at least twice). The timer gets faster as you progress. Complete all four phases to finish a cycle, then start the next with new vocabulary.

### Articles & Plurals (Noun Categories)

For Animals, Food, and Weather:
- **Cycle 2+** — article forms are introduced (e.g. "El Perro", "Die Katze")
- **Cycle 3+** — plural forms are added (e.g. "Los Perros", "Die Katzen"), shown with repeated emojis

Each form is tracked independently for mastery.

## Features

- 6 languages, 5 categories, 11 items per category
- Phase selection — jump to any learning stage
- Mastery-based level progression
- Accent-tolerant typing input
- Text-to-speech pronunciation
- Speech recognition input (Chrome/Edge)
- Persistent per-language, per-category progress
- Statistics tracking (streaks, accuracy, games played)
- Sound effects for correct/incorrect answers
- Pause, quit, and menu navigation during gameplay
- Accessible: ARIA labels, keyboard navigation, focus management

## Running Locally

Open `index.html` in a browser. No build step or server required.

For speech recognition, use Chrome or Edge and allow microphone access.

## Project Structure

```
index.html   — Application markup
styles.css   — Styling
data.js      — Category data, translations, forms, speech config
app.js       — Game logic, state management, UI updates
ROADMAP.md   — Feature roadmap and technical debt tracking
CLAUDE.md    — Project documentation for AI-assisted development
```
