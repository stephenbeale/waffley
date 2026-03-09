# Changelog

All notable changes to Waffley are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Japanese language (romaji) — 7th language, words only (no verb conjugation)

## 2026-03-09

### Added
- Deployed to https://waffley.app on SiteGround
- Pre-deploy SEO: meta description, Open Graph tags, canonical URL
- `robots.txt` and `sitemap.xml`
- Personalised weakness report in stats overlay (PR #82) — collapsible section showing weak/strong items by accuracy
- uTalk affiliate nudge in home screen footer (PR #83)
- Buy Me a Coffee, italki, SiteGround, and cross-promotion links in footer

### Changed
- Title updated from "Learn Colour Words" to "Learn Languages Through Play"
- Manifest name updated to match

### Removed
- Broken Sentry integration (placeholder DSN)

## 2026-03-05

### Added
- Verb tense expansion — past, present perfect, and conditional tenses for ES, FR, DE, IT, PT
- Pronouns as full game category with 4 learning phases
- XP and levelling system with 6 cosmetic titles (Beginner to Master)
- Daily challenge system with progress tracking
- Day streaks and 5 new achievements
- Spaced repetition scheduling (simplified SM-2 algorithm)
- 6 new vocabulary categories: Body, Clothing, Home, Numbers (0-10), Family, Professions
- Supabase cloud sync with Google/Apple sign-in (optional)
- Privacy Policy and Terms of Service overlays
- Data export and account deletion from stats screen
- Shareable result card with Web Share API
- Speed round "Mark Level Complete" option at 2-second timer
- Duplicate verb conjugation button dedup

### Fixed
- Pronoun highlight removed from Learning phase verbs/pronouns
- Verb Practice+ layout uses pronoun emoji consistently
- Debounced Supabase sync to prevent rapid duplicate writes

## 2026-02-16

### Added
- Verb conjugation learning path — parallel "Verbs" mode alongside existing "Words" mode
- Present tense matching exercises for 10 common irregular verbs (ES, FR, DE, IT, PT)
- Mode toggle (Words/Verbs) and verb tense selector in UI
- Verb-specific game loop with pronoun prompts, speech/typing support, and progress tracking
- Welsh excluded from verb support (words-only language)
- Progressive button count — start with 4 buttons, add 1 every 2 levels up to cycle max
- SFX mute button above the progress bar — toggle correct/wrong sound effects independently of TTS
- Silent visual-only rounds — last 2 levels of Learning phase suppress audio for sight-only recognition
- Redesigned pause/cancel buttons — larger 44px rounded boxes with bold symbols for mobile visibility
- Speech wrong attempts history — scrolling list of failed speech recognition attempts with cross marks
- Session mastery removal — items excluded from questions after 3 consecutive correct, restored at next level
- Speed round mercy — when failing at 2-second speed, choose to retry, add 2 seconds, or end game
- Feminine adjective forms from Cycle 2 — gendered prompts with indicators (ES, FR, IT, PT)
- Expanded vocabulary: 2 new items per category (sick/strong, cow/pig, tomato/carrot, lightning/tornado)
- Typing mode mobile UX — smaller display, accent shortcut buttons, timer repositioned, keyboard hint
- Phase selection on topic screen — click any journey phase to start from that point
- Typing phase between Practice and Speech (4-phase, 40-level cycle)
- Accent-tolerant typing input (e.g. "Marron" accepted for "Marron")
- Form-aware typing prompts for articles and plurals
- Article forms for noun categories (animals, food, weather) from Cycle 2 onwards
- Plural forms with repeated emoji display from Cycle 3 onwards
- Independent mastery tracking per form variant (base, article, plural)
- Form-aware prompts, speech recognition, TTS, and button text

### Changed
- Correct answer sound pitch rises per level (resets on level-up, capped at +1 octave)
- Audio pronunciation suppressed in both Typing and Speech phases
- Smooth vertical progress bar animation (0.8s cubic-bezier easing)
- Buttons use flexbox layout — centred lone button on odd-count rows
- Mobile-responsive buttons — compact padding and gap on small viewports
- Mastered items stay visible (no greying) but excluded from questions

### Refactored
- Converted to ES modules — data.js exports all constants, app.js imports them, single module entry point

### Fixed
- Button overflow on mobile — screens now scroll, compact layout on small viewports
- Progression tone pitch carried over between levels — now resets each level-up
- Mastered items were still asked as questions due to deleted key evaluation bug

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
