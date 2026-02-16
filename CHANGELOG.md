# Changelog

All notable changes to Waffley are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Expanded vocabulary: 2 new items per category (sick/strong, cow/pig, tomato/carrot, lightning/tornado)
- Phase selection on topic screen — click any journey phase to start from that point
- Typing phase between Practice and Speech (4-phase, 40-level cycle)
- Accent-tolerant typing input (e.g. "Marron" accepted for "Marrón")
- Form-aware typing prompts for articles and plurals
- Article forms for noun categories (animals, food, weather) from Cycle 2 onwards
- Plural forms with repeated emoji display from Cycle 3 onwards
- Independent mastery tracking per form variant (base, article, plural)
- Form-aware prompts, speech recognition, TTS, and button text

### Changed
- Audio pronunciation suppressed in both Typing and Speech phases

## 2026-02-15

### Added
- "Go to Menu" navigation buttons on level-up and cycle-complete overlays
- Overlay focus management for keyboard accessibility
- ARIA labels on overlays, colour display, progress bars, and game controls
- Timer race condition guard with `roundActive` flag
- CLAUDE.md project documentation

### Changed
- Extracted 18 mutable globals into unified `game` state object
- Unified category data model with `displayType` property in `CATEGORY_DATA`
- Stopped mutating data layer (shuffled items stored in `game.activeItems`)
- Restored visible focus indicators on answer buttons

### Fixed
- Focus now moves to first button when overlays appear

## 2026-02-14

### Added
- Mastery-based level progression (each item must be answered correctly twice)
- Vertical journey stepper on start screen showing Learning/Practice/Speech phases
- Pause and quit buttons during gameplay
- Sound effects for correct and incorrect answers (Web Audio API)
- Clearer level-up overlays with streak, phase, and time info

### Changed
- Level-up messages replaced with action-oriented prompts

## 2026-02-13

### Added
- Split start screen into language selection and topic selection steps
- Reinforcement label showing foreign word under emoji in Level 1
- Flag emojis for language selection and in-game display
- Best available TTS voice selection per language

### Fixed
- Audio toggle made keyboard-focusable
- Home screen instructions updated for multi-category support
- Reinforcement label spacing with timer bar

## 2026-02-12

### Added
- Animals, Food, and Weather emoji categories
- Adjectives emoji learning mode
- Per-language, per-category progress tracking
- Voice recognition for all emoji categories

### Fixed
- Category initialisation order bug
- Progress tracked separately per language and category

## 2026-02-11

### Added
- Text-to-speech pronunciation with audio toggle
- Language-specific progress tracking and persistence
- Colour expansion system (new colours unlocked each cycle)
- Speech Mode with Web Speech API recognition
- Persistent statistics system (streaks, accuracy, games played)
- Reset Progress button

### Changed
- Difficulty scaling improved with colour shuffling per level
- Level-up overlay enhanced with colour shuffle info and time display

### Fixed
- Time limit resets to 10s at start of each phase
- Mobile overflow and focus highlight issues
- Stale time display when returning to start screen
- Colour selection randomised instead of just shuffled positions

## 2026-02-10

### Added
- Initial release as "Chromalingo"
- Level system with Learning, Practice, and Speech phases
- 6 languages: Spanish, French, German, Italian, Welsh, Portuguese
- Colour vocabulary (5 base colours, expanding per cycle)
- Timer-based gameplay with progressive difficulty

### Changed
- Renamed from Chromalingo to Waffley

### Refactored
- Split monolithic index.html into separate CSS, data.js, and app.js files
