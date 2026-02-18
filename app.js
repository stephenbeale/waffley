import {
    MASTERY_THRESHOLD, REMOVAL_STREAK, LEVELS_PER_PHASE, LEVELS_PER_CYCLE,
    PHASES, PHASE_CLASSES, MAX_TIME, MIN_TIME, MIN_TIME_TYPING,
    TIMER_WARNING_RATIO, LEVEL_UP_COUNTDOWN, CYCLE_COMPLETE_COUNTDOWN,
    STARTING_BUTTON_COUNT, BUTTONS_ADD_INTERVAL, MAX_PITCH_SEMITONES,
    TTS_SPEECH_RATE, SPEECH_RESTART_DELAY, SILENT_LEVEL_THRESHOLD,
    CYCLE_COLORS, ALL_COLORS, MAX_CYCLE_WITH_NEW_COLORS, NEW_COLORS_PER_CYCLE,
    NOUN_CATEGORIES, ADJECTIVE_CATEGORY, ARTICLE_CYCLE, PLURAL_CYCLE, FEMININE_CYCLE,
    LANGUAGES, LANGUAGE_NAMES, LANGUAGE_FLAGS, TRANSLATIONS, COLOR_CSS,
    CATEGORIES, CATEGORY_DATA,
    SPEECH_LANG_CODES, COLOR_ALIASES,
    VERB_LIST, VERB_ORDER, PRONOUN_KEYS, VERB_ENGLISH, PRONOUN_LABELS, PRONOUN_EMOJIS,
    VERB_CONJUGATIONS, VERB_PRONOUNS, VERB_LANGUAGES
} from './data.js';

    // ========== LEVEL SYSTEM FUNCTIONS ==========

    // Load all language progress from localStorage
    function loadAllProgress() {
        const saved = localStorage.getItem('waffley_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Handle migration from old single-language format
                if (data.totalAnswers !== undefined && !data.languages) {
                    // Migrate old format: assign old progress to Spanish (default)
                    const totalAnswers = data.totalAnswers || 0;
                    return {
                        languages: {
                            es: {
                                totalAnswers: totalAnswers,
                                currentCycle: data.currentCycle || 1,
                                levelsCompleted: Math.floor(totalAnswers / 10) % 30
                            }
                        }
                    };
                }
                return data;
            } catch (e) {
                return { languages: {} };
            }
        }
        return { languages: {} };
    }

    // Progress key combines language + category for separate tracking
    function getProgressKey(lang, category) {
        return category === 'colours' ? lang : `${lang}_${category}`;
    }

    // Get progress for a specific language and category
    function getLanguageProgress(lang, category) {
        const key = getProgressKey(lang, category || selectedCategory);
        const allProgress = loadAllProgress();
        if (allProgress.languages && allProgress.languages[key]) {
            const prog = allProgress.languages[key];
            // Migration: derive levelsCompleted from totalAnswers if missing
            if (prog.levelsCompleted === undefined) {
                prog.levelsCompleted = Math.floor((prog.totalAnswers || 0) / 10) % 30;
            }
            return prog;
        }
        return { totalAnswers: 0, currentCycle: 1, levelsCompleted: 0 };
    }

    // Save progress for the current language + category to localStorage
    function saveProgress() {
        const key = getProgressKey(selectedLanguage, selectedCategory);
        const allProgress = loadAllProgress();
        if (!allProgress.languages) {
            allProgress.languages = {};
        }
        allProgress.languages[key] = {
            totalAnswers: game.totalCorrectAnswers,
            currentCycle: game.currentCycle,
            levelsCompleted: game.levelsCompleted
        };
        localStorage.setItem('waffley_progress', JSON.stringify(allProgress));
    }

    // Switch to a different language - load that language's saved progress
    function switchLanguageProgress(newLang) {
        // Save current language + category progress first
        saveProgress();
        // Load the new language's progress for current category
        const newProgress = getLanguageProgress(newLang, selectedCategory);
        game.totalCorrectAnswers = newProgress.totalAnswers;
        game.currentCycle = newProgress.currentCycle;
        game.levelsCompleted = newProgress.levelsCompleted || 0;
    }

    // ========== STATISTICS SYSTEM ==========

    // Load statistics from localStorage
    function loadStats() {
        const saved = localStorage.getItem('waffley_stats');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return getDefaultStats();
            }
        }
        return getDefaultStats();
    }

    function getDefaultStats() {
        return {
            bestStreak: 0,
            highestCycle: 1,
            gamesPlayed: 0,
            languageStats: {}
        };
    }

    // Save statistics to localStorage
    function saveStats() {
        localStorage.setItem('waffley_stats', JSON.stringify(stats));
    }

    // Update statistics after a game ends
    function updateStatsAfterGame(sessionScore, language) {
        stats.gamesPlayed++;

        // Update best streak
        if (sessionScore > stats.bestStreak) {
            stats.bestStreak = sessionScore;
        }

        // Update highest cycle
        if (game.currentCycle > stats.highestCycle) {
            stats.highestCycle = game.currentCycle;
        }

        // Update language stats
        if (!stats.languageStats[language]) {
            stats.languageStats[language] = { correct: 0, games: 0 };
        }
        stats.languageStats[language].correct += sessionScore;
        stats.languageStats[language].games++;

        saveStats();
    }

    // Check if this is a new personal best
    function isNewPersonalBest(sessionScore) {
        return sessionScore > 0 && sessionScore > stats.bestStreak;
    }

    // Reset all statistics and all progress
    function resetStats() {
        stats = getDefaultStats();
        saveStats();
        // Also clear all progress for all languages/categories
        localStorage.removeItem('waffley_progress');
        game.totalCorrectAnswers = 0;
        game.currentCycle = 1;
        game.levelsCompleted = 0;
        updateStartScreenProgress();
        updateStatsDisplay();
    }

    // Reset level progress for current language (all categories back to Level 1)
    function resetProgress() {
        const allProgress = loadAllProgress();
        if (allProgress.languages) {
            // Remove all keys for the selected language
            const categories = ['colours', 'adjectives', 'animals', 'food', 'weather'];
            categories.forEach(cat => {
                const key = getProgressKey(selectedLanguage, cat);
                delete allProgress.languages[key];
            });
            localStorage.setItem('waffley_progress', JSON.stringify(allProgress));
        }
        game.totalCorrectAnswers = 0;
        game.currentCycle = 1;
        game.levelsCompleted = 0;
        updateStartScreenProgress();
        updateStatsDisplay();
    }

    // Get total correct answers across all languages
    function getTotalCorrectAllLanguages() {
        const allProgress = loadAllProgress();
        let total = 0;
        if (allProgress.languages) {
            Object.values(allProgress.languages).forEach(langProgress => {
                total += langProgress.totalAnswers || 0;
            });
        }
        return total;
    }

    // Update the statistics overlay display
    function updateStatsDisplay() {
        document.getElementById('stats-total-correct').textContent = getTotalCorrectAllLanguages();
        document.getElementById('stats-highest-cycle').textContent = stats.highestCycle;
        document.getElementById('stats-best-streak').textContent = stats.bestStreak;
        document.getElementById('stats-games-played').textContent = stats.gamesPlayed;

        // Language stats
        const langList = document.getElementById('language-stats-list');
        langList.innerHTML = '';

        Object.keys(LANGUAGE_NAMES).forEach(lang => {
            const langStats = stats.languageStats[lang];
            const row = document.createElement('div');
            row.className = 'language-stat-row';

            const name = document.createElement('span');
            name.className = 'language-stat-name';
            name.textContent = LANGUAGE_NAMES[lang];

            const data = document.createElement('span');
            data.className = 'language-stat-data';
            if (langStats && langStats.games > 0) {
                const avg = Math.round(langStats.correct / langStats.games);
                data.textContent = `${langStats.correct} correct (${langStats.games} games, avg ${avg})`;
            } else {
                data.textContent = 'No games yet';
            }

            row.appendChild(name);
            row.appendChild(data);
            langList.appendChild(row);
        });
    }

    // Show statistics overlay
    function showStats() {
        updateStatsDisplay();
        document.getElementById('stats-overlay').classList.add('active');
        document.getElementById('close-stats-btn').focus();
    }

    // Hide statistics overlay
    function hideStats() {
        document.getElementById('stats-overlay').classList.remove('active');
    }

    // Statistics state
    let stats = loadStats();



    // Get colours available for a given cycle
    function getActiveColors(cycle) {
        if (cycle >= MAX_CYCLE_WITH_NEW_COLORS) {
            return CYCLE_COLORS[MAX_CYCLE_WITH_NEW_COLORS].slice();
        }
        return CYCLE_COLORS[cycle].slice();
    }

    // Shuffle helper (Fisher-Yates on a copy)
    function shuffle(arr) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // Get number of visible buttons based on level within phase
    function getButtonCount() {
        // Verb mode: always 6 buttons (one per pronoun)
        if (isVerbMode()) return PRONOUN_KEYS.length;
        const maxCount = game.activeColors.length;
        const levelInPhase = getLevelInPhase();
        // Start with 4 buttons (or max if fewer), add 1 every 2 levels
        const base = Math.min(STARTING_BUTTON_COUNT, maxCount);
        const extra = Math.floor((levelInPhase - 1) / BUTTONS_ADD_INTERVAL);
        return Math.min(base + extra, maxCount);
    }

    // Randomly select new items from the full pool
    function randomizeActiveColors() {
        if (isVerbMode()) {
            game.currentVerb = getCurrentVerb();
            game.activeItems = [...PRONOUN_KEYS];
            return;
        }
        const count = getButtonCount();
        if (isColorCategory()) {
            game.activeItems = shuffle(ALL_COLORS).slice(0, count);
        } else {
            game.activeItems = shuffle(getCategoryData().items).slice(0, count);
        }
    }

    // ========== MASTERY-BASED LEVEL FUNCTIONS ==========

    // Get current phase (0=Learning, 1=Practice, 2=Typing, 3=Speech) from levelsCompleted
    function getPhaseFromProgress() {
        return Math.floor(game.levelsCompleted / LEVELS_PER_PHASE) % 4;
    }

    // Get level within current phase (1-10)
    function getLevelInPhase() {
        return (game.levelsCompleted % LEVELS_PER_PHASE) + 1;
    }

    // Get level within current cycle (1-30)
    function getLevelInCycle() {
        return (game.levelsCompleted % LEVELS_PER_CYCLE) + 1;
    }

    // Calculate time limit based on level within phase
    // Time resets to 10s at start of each phase (Learning, Practice, Speech)
    // Level 1 = 10s, Level 2 = 8s, Level 3 = 6s, Level 4 = 4s, Level 5+ = 2s
    function getTimeLimit() {
        const levelInPhase = getLevelInPhase();
        const minTime = getPhaseFromProgress() === 2 ? MIN_TIME_TYPING : MIN_TIME;
        const timeInSeconds = Math.max(minTime, MAX_TIME - (levelInPhase - 1) * 2) + game.timeBonus;
        return timeInSeconds * 1000;
    }

    function isAtMinTime() {
        const levelInPhase = getLevelInPhase();
        const minTime = getPhaseFromProgress() === 2 ? MIN_TIME_TYPING : MIN_TIME;
        return Math.max(minTime, MAX_TIME - (levelInPhase - 1) * 2) <= minTime;
    }

    // Get time limit in seconds for display
    function getTimeLimitSeconds() {
        return getTimeLimit() / 1000;
    }

    // Build mastery map from current category items (with form variants)
    function initLevelMastery() {
        game.levelMastery = {};
        const items = getCategoryItems();
        const forms = getAvailableForms();
        items.forEach(item => {
            forms.forEach(form => {
                // Skip article/plural forms for items without form data (e.g. uncountable nouns)
                if (form !== 'base' && !isVerbMode()) {
                    const formData = getCategoryData().forms?.[selectedLanguage]?.[item];
                    if (!formData) return;
                }
                const key = form === 'base' ? item : `${item}:${form}`;
                game.levelMastery[key] = 0;
            });
        });
    }

    // Record a correct answer for mastery tracking
    function recordMasteryAnswer(item) {
        const form = game.currentForm || 'base';
        const key = form === 'base' ? item : `${item}:${form}`;
        if (game.levelMastery[key] !== undefined) {
            game.levelMastery[key]++;
        }

        // Track session streak for pool removal
        game.sessionStreak[key] = (game.sessionStreak[key] || 0) + 1;
        if (game.sessionStreak[key] >= REMOVAL_STREAK) {
            removeItemFromPool(item, form);
        }
    }

    // Reset session streak for the current item+form on wrong answer
    function resetSessionStreak() {
        const form = game.currentForm || 'base';
        const key = form === 'base' ? game.currentColor : `${game.currentColor}:${form}`;
        game.sessionStreak[key] = 0;
    }

    // Remove a mastered item+form from the active pool (button stays visible)
    function removeItemFromPool(item, form) {
        const key = form === 'base' ? item : `${item}:${form}`;
        // Remove from level mastery so it's no longer asked as a question
        delete game.levelMastery[key];
    }

    // Check if all items in the current level have been mastered
    // Also true if all items were removed from the pool via session streaks
    function isLevelMastered() {
        const keys = Object.keys(game.levelMastery);
        if (keys.length === 0) return true;
        return Object.values(game.levelMastery).every(c => c >= MASTERY_THRESHOLD);
    }

    // Get mastery progress for UI display
    function getMasteryProgress() {
        const values = Object.values(game.levelMastery);
        const mastered = values.filter(c => c >= MASTERY_THRESHOLD).length;
        return { mastered, total: values.length };
    }

    // Check if levelling up would change the time limit
    function willTimeChange() {
        const currentTime = getTimeLimit();
        // Temporarily compute what time would be after levelling up
        game.levelsCompleted++;
        const newTime = getTimeLimit();
        game.levelsCompleted--;
        return currentTime !== newTime;
    }

    // Web Speech API setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSupported = !!SpeechRecognition;
    let recognition = null;
    let isListening = false;

    // ========== GAME STATE ==========
    let selectedLanguage = 'es';
    let selectedCategory = 'colours';
    let selectedMode = 'words'; // 'words' | 'verbs'

    const savedProgress = getLanguageProgress(selectedLanguage);
    const game = {
        // Session state
        activeColors: [],   // pool of colour keys for this cycle
        activeItems: [],    // shuffled subset for current level (colours or emoji items)
        currentColor: '',
        currentForm: 'base',
        score: 0,
        totalQuestions: 0,
        responseTimes: [],
        roundActive: false,
        paused: false,
        pausedTimeRemaining: 0,

        // Timer
        timerStart: 0,
        timerRAF: 0,
        timeout: 0,
        timeLimit: 10000,

        // Progress (persisted to localStorage)
        totalCorrectAnswers: savedProgress.totalAnswers,
        currentCycle: savedProgress.currentCycle,
        levelsCompleted: savedProgress.levelsCompleted || 0,

        // Mastery
        levelMastery: {},
        sessionStreak: {},  // consecutive correct per item+form (persists across levels)
        pitchStreak: 0,     // correct answers in current level (resets on level-up)

        // Overlay flags
        levelUpPending: false,
        cycleCompletePending: false,

        // Speed mercy: extra seconds added by player
        timeBonus: 0,
        mercyUsed: false,

        // Gameplay variation
        isReverseRound: false,  // true = show foreign word, pick emoji/colour

        // Verb mode
        currentVerb: null,
    };

    // Helper: get current category data
    function getCategoryData() {
        return CATEGORY_DATA[selectedCategory];
    }

    function isColorCategory() {
        if (isVerbMode()) return false;
        return getCategoryData().displayType === 'color';
    }

    function isNounCategory() {
        return NOUN_CATEGORIES.includes(selectedCategory);
    }

    function isAdjectiveCategory() {
        return selectedCategory === ADJECTIVE_CATEGORY;
    }

    function getAvailableForms() {
        if (isVerbMode()) return ['base'];
        if (isAdjectiveCategory()) {
            if (game.currentCycle >= FEMININE_CYCLE) return ['base', 'feminine'];
            return ['base'];
        }
        if (!isNounCategory()) return ['base'];
        if (game.currentCycle >= PLURAL_CYCLE) return ['base', 'article', 'plural'];
        if (game.currentCycle >= ARTICLE_CYCLE) return ['base', 'article'];
        return ['base'];
    }

    function getFormTranslation(item, form) {
        // Verb mode: item is a pronoun key, return conjugation
        if (isVerbMode()) {
            return getVerbTranslation(item);
        }
        const baseWord = getCategoryTranslation(item);
        if (form === 'base') return baseWord;
        const formData = getCategoryData().forms?.[selectedLanguage]?.[item];
        if (!formData) return baseWord;
        if (form === 'feminine') return formData.feminine || baseWord;
        if (form === 'article') return formData.article + ' ' + baseWord;
        if (form === 'plural') return formData.pluralArticle + ' ' + formData.plural;
        return baseWord;
    }

    function getCategoryItems() {
        return game.activeItems;
    }

    function getCategoryTranslation(item) {
        return getCategoryData().translations[selectedLanguage][item];
    }

    function getCategoryDisplay(item) {
        const data = getCategoryData();
        if (data.displayType === 'color') {
            return null; // use CSS background color
        }
        return data.display[item];
    }

    // ========== VERB MODE HELPERS ==========

    function isVerbMode() {
        return selectedMode === 'verbs';
    }

    function isVerbSupported() {
        return VERB_LANGUAGES.includes(selectedLanguage);
    }

    // Get current verb — one verb per full cycle (all 4 phases), then advance to the next.
    // Uses a language-specific ordering where defined (e.g. Spanish: ser first),
    // falling back to the default VERB_LIST order.
    function getCurrentVerb() {
        const order = VERB_ORDER[selectedLanguage] || VERB_LIST;
        return order[(game.currentCycle - 1) % order.length];
    }

    // Get verb conjugation translation for a pronoun key
    function getVerbTranslation(pronounKey) {
        const verb = game.currentVerb;
        const phase = getPhaseFromProgress();
        const conjugations = VERB_CONJUGATIONS[selectedLanguage]?.[verb];
        if (!conjugations) return '';
        const conjugation = conjugations[pronounKey] || '';

        // Learning phase: prepend target-language pronoun for full phrase
        if (phase === 0) {
            const pronoun = VERB_PRONOUNS[selectedLanguage]?.[pronounKey] || '';
            return pronoun + ' ' + conjugation;
        }
        // Practice+ phases: just the conjugation
        return conjugation;
    }

    // ========== PRONOUN INTRO ==========

    const PRONOUN_INTRO_KEY = 'waffley_pronoun_intro';

    function hasPronounIntroCompleted(lang) {
        try {
            const saved = JSON.parse(localStorage.getItem(PRONOUN_INTRO_KEY) || '{}');
            return !!saved[lang];
        } catch { return false; }
    }

    function markPronounIntroCompleted(lang) {
        try {
            const saved = JSON.parse(localStorage.getItem(PRONOUN_INTRO_KEY) || '{}');
            saved[lang] = true;
            localStorage.setItem(PRONOUN_INTRO_KEY, JSON.stringify(saved));
        } catch {}
    }

    function showPronounIntro(onConfirm) {
        const overlay   = document.getElementById('pronoun-intro-overlay');
        const titleEl   = document.getElementById('pronoun-intro-title');
        const subtitleEl= document.getElementById('pronoun-intro-subtitle');
        const tableEl   = document.getElementById('pronoun-table');
        const btn       = document.getElementById('pronoun-intro-btn');

        const langName  = LANGUAGE_NAMES[selectedLanguage] || selectedLanguage;
        const pronouns  = VERB_PRONOUNS[selectedLanguage] || {};

        titleEl.textContent    = `${langName} Pronouns`;
        subtitleEl.textContent = 'Learn these before your first verb session';

        // Build the pronoun table rows
        tableEl.innerHTML = PRONOUN_KEYS.map(key => {
            const english  = PRONOUN_LABELS[key] || key;
            const emoji    = PRONOUN_EMOJIS[key] || '';
            const target   = pronouns[key] || '';
            return `<tr>
                <td>${english}</td>
                <td>${emoji}</td>
                <td>${target}</td>
            </tr>`;
        }).join('');

        overlay.classList.add('active');
        btn.focus();

        function handleConfirm() {
            btn.removeEventListener('click', handleConfirm);
            overlay.classList.remove('active');
            markPronounIntroCompleted(selectedLanguage);
            onConfirm();
        }
        btn.addEventListener('click', handleConfirm);
    }

    // ========== AUDIO PRONUNCIATION ==========
    const savedAudio = localStorage.getItem('waffley_audio');
    let audioEnabled = savedAudio === null ? true : savedAudio === 'true';
    const speechSynthesis = window.speechSynthesis;
    const ttsSupported = 'speechSynthesis' in window;

    function saveAudioSetting(enabled) {
        localStorage.setItem('waffley_audio', enabled ? 'true' : 'false');
        audioEnabled = enabled;
    }

    function speakColor(color, language) {
        if (!audioEnabled || !ttsSupported) return;
        // Don't speak in Typing or Speech mode (would give away the answer)
        if (getPhaseFromProgress() >= 2) return;
        // Silent visual-only rounds: last levels of Learning phase
        if (getPhaseFromProgress() === 0 && getLevelInPhase() >= SILENT_LEVEL_THRESHOLD) return;

        let word;
        if (isVerbMode()) {
            const conjugations = VERB_CONJUGATIONS[selectedLanguage]?.[game.currentVerb];
            const pronoun = VERB_PRONOUNS[selectedLanguage]?.[color] || '';
            const conjugation = conjugations?.[color] || '';
            // Learning: speak full phrase so user hears the pronoun too
            // Practice: pronoun is on screen already — speak only the conjugation (faster)
            word = getPhaseFromProgress() === 0
                ? pronoun + ' ' + conjugation
                : conjugation;
        } else {
            word = getFormTranslation(color, game.currentForm || 'base');
        }
        if (!word) return;

        const langCode = SPEECH_LANG_CODES[language] || 'es-ES';

        const doSpeak = () => {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = langCode;
            utterance.rate = TTS_SPEECH_RATE;
            speechSynthesis.speak(utterance);
        };

        // If TTS hasn't warmed up yet, wait briefly for the engine to be ready
        if (!speechWarmedUp) {
            setTimeout(doSpeak, 150);
        } else {
            doSpeak();
        }
    }

    let speechWarmedUp = false;

    function warmUpSpeech() {
        if (!ttsSupported) return;
        // Use a real short word — some TTS engines skip empty utterances
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('.');
        utterance.lang = SPEECH_LANG_CODES[selectedLanguage] || 'es-ES';
        utterance.volume = 0;
        utterance.onend = () => { speechWarmedUp = true; };
        speechSynthesis.speak(utterance);
    }

    // ========== SOUND EFFECTS (Web Audio API) ==========
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function playCorrectSound() {
        if (!audioEnabled || sfxMuted) return;
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        // Pitch rises by a semitone per correct answer in this level (capped at +12)
        const semitones = Math.min(game.pitchStreak, MAX_PITCH_SEMITONES);
        const pitchMultiplier = Math.pow(2, semitones / 12);
        const baseFreq = 523 * pitchMultiplier;  // C5 + streak offset
        const peakFreq = 659 * pitchMultiplier;   // E5 + streak offset
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.setValueAtTime(peakFreq, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    }

    function playWrongSound() {
        if (!audioEnabled || sfxMuted) return;
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }

    function playLevelUpSound() {
        if (!audioEnabled || sfxMuted) return;
        const ctx = getAudioContext();
        // Short ascending fanfare: C5 → E5 → G5 → C6
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            const t = ctx.currentTime + i * 0.12;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
            osc.start(t);
            osc.stop(t + 0.18);
        });
    }

    // ========== DOM ELEMENTS ==========
    const languageScreen = document.getElementById('language-screen');
    const topicScreen = document.getElementById('topic-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const topicHeader = document.getElementById('topic-header');
    const colorDisplay = document.getElementById('color-display');
    const timerBar = document.getElementById('timer-bar');
    const buttonsContainer = document.getElementById('buttons-container');
    const currentScoreEl = document.getElementById('current-score');
    const finalScore = document.getElementById('final-score');
    const endMessage = document.getElementById('end-message');
    const audioToggleInput = document.getElementById('audio-toggle-input');
    const gameLangFlag = document.getElementById('game-language-flag');
    const reinforcementLabel = document.getElementById('reinforcement-label');

    // Level system elements
    const phaseBadge = document.getElementById('phase-badge');
    const currentLevelEl = document.getElementById('current-level');
    const verticalProgressBar = document.getElementById('vertical-progress-bar');
    const verticalProgressLabel = document.getElementById('vertical-progress-label');
    const timeDisplayEl = document.getElementById('time-display');
    const levelUpOverlay = document.getElementById('level-up-overlay');
    const levelUpTitle = document.getElementById('level-up-title');
    const levelUpMessage = document.getElementById('level-up-message');
    const levelUpPhase = document.getElementById('level-up-phase');
    const levelUpInfo = document.getElementById('level-up-info');
    const levelUpTime = document.getElementById('level-up-time');
    const levelUpCountdown = document.getElementById('level-up-countdown');
    const journeyTracker = document.getElementById('journey-tracker');
    const startTotalAnswersEl = document.getElementById('start-total-answers');
    const startTimeLimitEl = document.getElementById('start-time-limit');
    const startCycleEl = document.getElementById('start-cycle');

    // Cycle complete elements
    const cycleCompleteOverlay = document.getElementById('cycle-complete-overlay');
    const cycleCompleteMessage = document.getElementById('cycle-complete-message');
    const cycleCompleteColors = document.getElementById('cycle-complete-colors');
    const newColorBadges = document.getElementById('new-color-badges');
    const cycleCompleteCountdown = document.getElementById('cycle-complete-countdown');

    // Start button
    const startBtn = document.getElementById('start-btn');

    // Mode toggle elements
    const modeSelector = document.getElementById('mode-selector');
    const wordsSettingLabel = document.getElementById('words-setting-label');
    const wordsSelector = document.getElementById('words-selector');
    const verbSettingLabel = document.getElementById('verb-setting-label');
    const verbSelector = document.getElementById('verb-selector');

    // Game control elements
    const pauseBtn = document.getElementById('pause-btn');
    const quitBtn = document.getElementById('quit-btn');
    const pauseOverlay = document.getElementById('pause-overlay');
    const resumeBtn = document.getElementById('resume-btn');
    const quitFromPauseBtn = document.getElementById('quit-from-pause-btn');

    // Speech mode elements
    const promptLabel = document.getElementById('prompt-label');
    const speechUI = document.getElementById('speech-ui');
    const micIcon = document.getElementById('mic-icon');
    const micStatus = document.getElementById('mic-status');
    const voiceFeedback = document.getElementById('voice-feedback');
    const speechAttempts = document.getElementById('speech-attempts');
    const speechWarning = document.getElementById('speech-warning');

    // Typing mode elements
    const typingUI = document.getElementById('typing-ui');
    const typingInput = document.getElementById('typing-input');
    const typingFeedback = document.getElementById('typing-feedback');
    const accentButtons = document.getElementById('accent-buttons');
    const typingHint = document.getElementById('typing-hint');

    // Accent characters per language (only chars used in translations)
    const ACCENT_CHARS = {
        es: ['á', 'é', 'í', 'ó', 'ú', 'ñ'],
        fr: ['é', 'è', 'ê', 'à', 'â', 'ç', 'œ'],
        de: ['ä', 'ö', 'ü', 'ß'],
        it: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
        cy: ['â', 'ê', 'î', 'ô', 'û', 'ŵ', 'ŷ'],
        pt: ['á', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ô', 'ú', 'ç']
    };

    // Speed mercy overlay
    const sfxMuteBtn = document.getElementById('sfx-mute-btn');
    let sfxMuted = false;

    sfxMuteBtn.addEventListener('click', () => {
        sfxMuted = !sfxMuted;
        sfxMuteBtn.textContent = sfxMuted ? '🔕' : '🔔';
        sfxMuteBtn.classList.toggle('muted', sfxMuted);
        sfxMuteBtn.title = sfxMuted ? 'Unmute sound effects' : 'Mute sound effects';
    });

    const speedMercyOverlay = document.getElementById('speed-mercy-overlay');
    const speedMercyMessage = document.getElementById('speed-mercy-message');
    const speedMercyStreak = document.getElementById('speed-mercy-streak');

    // ========== SPEECH RECOGNITION FUNCTIONS ==========

    function initSpeechRecognition() {
        if (!speechSupported) return null;

        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = SPEECH_LANG_CODES[selectedLanguage] || 'es-ES';

        recog.onresult = (event) => {
            if (game.levelUpPending || game.cycleCompletePending) return;

            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript.trim().toLowerCase();
            const words = transcript.split(' ');
            const lastWord = words[words.length - 1];

            // Show exactly what was heard — one live line, updated each interim result
            voiceFeedback.textContent = `Heard: "${transcript}"`;

            if (result.isFinal) {
                const matchedColor = matchColorFromSpeech(lastWord, transcript);
                if (matchedColor) {
                    handleAnswer(matchedColor);
                } else {
                    // Log wrong attempt — show full transcript so user can see what was heard
                    const entry = document.createElement('div');
                    entry.className = 'speech-attempt';
                    entry.textContent = transcript;
                    speechAttempts.appendChild(entry);
                    speechAttempts.scrollTop = speechAttempts.scrollHeight;
                }
            }
        };

        recog.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                micStatus.textContent = 'No speech detected...';
            } else if (event.error === 'not-allowed') {
                micStatus.textContent = 'Microphone blocked';
                stopListening();
                // Fall back to Practice mode
                showSpeechFallback();
            }
        };

        recog.onend = () => {
            isListening = false;
            // Restart if still in speech mode and game is active
            if (getPhaseFromProgress() === 3 && gameScreen.classList.contains('active') && !game.levelUpPending && !game.cycleCompletePending) {
                setTimeout(() => {
                    if (gameScreen.classList.contains('active') && !isListening) {
                        startListening();
                    }
                }, SPEECH_RESTART_DELAY);
            }
        };

        return recog;
    }

    function matchColorFromSpeech(word, fullTranscript) {
        const items = getCategoryItems();
        const lowerWord = word.toLowerCase();

        // Verb mode: match against conjugations
        if (isVerbMode()) {
            for (const pronoun of items) {
                const conjugation = getVerbTranslation(pronoun);
                if (conjugation && normalizeForComparison(conjugation) === normalizeForComparison(word)) {
                    return pronoun;
                }
            }
            return null;
        }

        // For colours, check the dedicated aliases first
        if (isColorCategory()) {
            const aliases = COLOR_ALIASES[selectedLanguage];
            if (aliases) {
                for (const color of items) {
                    const colorAliases = aliases[color];
                    if (colorAliases && colorAliases.some(alias => alias.toLowerCase() === lowerWord)) {
                        return color;
                    }
                }
            }
        }

        // Match against form translation (e.g. "El Perro", "Los Perros")
        const currentForm = game.currentForm || 'base';
        if (currentForm !== 'base' && fullTranscript) {
            const lowerTranscript = fullTranscript.toLowerCase();
            for (const item of items) {
                const formTranslation = getFormTranslation(item, currentForm);
                if (formTranslation && lowerTranscript.endsWith(formTranslation.toLowerCase())) {
                    return item;
                }
            }
        }

        // Match against category translations (works for all categories)
        for (const item of items) {
            const translation = getCategoryTranslation(item);
            if (translation && translation.toLowerCase() === lowerWord) {
                return item;
            }
        }
        return null;
    }

    function startListening() {
        if (!recognition || isListening) return;
        try {
            recognition.lang = SPEECH_LANG_CODES[selectedLanguage] || 'es-ES';
            recognition.start();
            isListening = true;
            micIcon.classList.add('listening');
            micStatus.textContent = 'Listening...';
            voiceFeedback.textContent = '';
            // speechAttempts is cleared per-round in nextRound(), not per restart
        } catch (e) {
            console.log('Speech recognition start error:', e);
        }
    }

    function stopListening() {
        if (!recognition) return;
        try {
            recognition.stop();
        } catch (e) {
            // Ignore
        }
        isListening = false;
        micIcon.classList.remove('listening');
    }

    function showSpeechFallback() {
        speechWarning.classList.add('visible');
        speechUI.classList.remove('active');
        typingUI.classList.remove('active');
        buttonsContainer.style.display = 'flex';
        promptLabel.textContent = getPromptText(game.currentForm || 'base');
    }

    function isSpeechMode() {
        return getPhaseFromProgress() === 3;
    }

    function isTypingMode() {
        return getPhaseFromProgress() === 2;
    }

    function normalizeForComparison(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u00df/g, 'ss').toLowerCase().trim();
    }

    // ========== UI UPDATE FUNCTIONS ==========

    // Update start screen progress display
    function updateStartScreenProgress() {
        const currentPhase = getPhaseFromProgress();
        const levelInPhase = getLevelInPhase();

        const phases = journeyTracker.querySelectorAll('.journey-phase');
        phases.forEach(el => {
            const p = parseInt(el.dataset.phase);
            el.classList.remove('active', 'completed');
            const progressEl = el.querySelector('.journey-phase-progress');
            if (p < currentPhase) {
                el.classList.add('completed');
                progressEl.textContent = `${LEVELS_PER_PHASE} of ${LEVELS_PER_PHASE} levels`;
            } else if (p === currentPhase) {
                el.classList.add('active');
                progressEl.textContent = `Level ${levelInPhase} of ${LEVELS_PER_PHASE}`;
            } else {
                progressEl.textContent = '';
            }
        });

        startTotalAnswersEl.textContent = game.totalCorrectAnswers;
        startTimeLimitEl.textContent = getTimeLimitSeconds();
        startCycleEl.textContent = game.currentCycle;
        updateStartButtonText();
    }

    // Update start button text based on current phase
    function updateStartButtonText() {
        const phase = getPhaseFromProgress();
        const levelInPhase = getLevelInPhase();
        const phaseName = PHASES[phase];
        if (levelInPhase === 1 && phase === 0) {
            startBtn.textContent = 'Start Learning';
        } else {
            startBtn.textContent = `Start from ${phaseName}`;
        }
    }

    // Jump to a specific phase within the current cycle
    function jumpToPhase(targetPhase) {
        const cycleBase = (game.currentCycle - 1) * LEVELS_PER_CYCLE;
        game.levelsCompleted = cycleBase + targetPhase * LEVELS_PER_PHASE;
        saveProgress();
        updateStartScreenProgress();
    }

    // Update game screen level display
    function updateLevelDisplay() {
        const phase = getPhaseFromProgress();
        const { mastered, total } = getMasteryProgress();

        currentLevelEl.textContent = getLevelInCycle();

        // Update vertical progress bar with mastery progress
        const pct = total > 0 ? (mastered / total * 100) : 0;
        verticalProgressBar.style.height = pct + '%';
        verticalProgressLabel.textContent = `${mastered}/${total}`;

        // Update ARIA attributes on progress container
        const progressContainer = document.getElementById('vertical-progress-container');
        progressContainer.setAttribute('aria-valuemax', total);
        progressContainer.setAttribute('aria-valuenow', mastered);

        timeDisplayEl.textContent = getTimeLimitSeconds();

        // Update phase badge
        phaseBadge.textContent = PHASES[phase];
        phaseBadge.className = 'phase-badge ' + PHASE_CLASSES[phase];
    }

    // Track overlay countdown intervals so nav buttons can cancel them
    let levelUpCountdownInterval = null;
    let cycleCompleteCountdownInterval = null;

    // Show level-up overlay
    function showLevelUp(newLevelInCycle, previousPhase, timeChanged) {
        game.levelUpPending = true;

        // Stop listening during overlay
        if (recognition) {
            stopListening();
        }

        const phase = getPhaseFromProgress();
        const phaseChanged = phase !== previousPhase;
        const newTimeSeconds = getTimeLimitSeconds();

        levelUpTitle.textContent = phaseChanged ? 'Phase Complete!' : 'Level Up!';
        document.getElementById('level-up-streak').textContent = 'Current streak: ' + game.score;
        levelUpMessage.textContent = `You reached Level ${newLevelInCycle}`;

        const phaseBadgeOverlay = document.getElementById('level-up-phase-badge');
        if (phaseChanged) {
            phaseBadgeOverlay.textContent = PHASES[phase];
            phaseBadgeOverlay.className = 'phase-badge ' + PHASE_CLASSES[phase];
            phaseBadgeOverlay.style.display = '';
            if (phase === 1) {
                levelUpPhase.textContent = 'Now try without the words!';
            } else if (phase === 2) {
                levelUpPhase.textContent = 'Now type the answer! Tip: hold a key for accents';
            } else if (phase === 3) {
                const item = isVerbMode() ? 'the conjugation' : isColorCategory() ? 'the colour' : 'the word';
                levelUpPhase.textContent = speechSupported
                    ? `Now it's your turn to speak ${item}!`
                    : `Speech mode (voice not supported - using buttons)`;
            } else {
                levelUpPhase.textContent = `Welcome to ${PHASES[phase]} Mode!`;
            }
        } else {
            phaseBadgeOverlay.style.display = 'none';
            // Hint when entering silent visual-only levels
            if (getPhaseFromProgress() === 0 && getLevelInPhase() === SILENT_LEVEL_THRESHOLD) {
                levelUpPhase.textContent = 'No audio now — recognise by sight!';
            } else {
                levelUpPhase.textContent = '';
            }
        }

        // Show info about what's active
        if (isVerbMode() && game.currentVerb) {
            const verbData = VERB_CONJUGATIONS[selectedLanguage]?.[game.currentVerb];
            const infinitive = verbData?.infinitive || '';
            const englishVerb = VERB_ENGLISH[game.currentVerb]?.I?.replace('I ', '') || '';
            levelUpInfo.textContent = `Next verb: ${infinitive} (to ${englishVerb})`;
        } else {
            const forms = getAvailableForms();
            if (forms.length > 1) {
                const formLabels = { article: 'Articles', plural: 'Plurals', feminine: 'Feminine forms' };
                const formNames = forms.filter(f => f !== 'base').map(f => formLabels[f] || f);
                levelUpInfo.textContent = `New items selected! (${formNames.join(' & ')} active)`;
            } else {
                levelUpInfo.textContent = 'New items selected!';
            }
        }

        // Always show current time limit, highlight if changed
        if (timeChanged) {
            levelUpTime.textContent = `Time: ${newTimeSeconds}s (-2 seconds)`;
        } else {
            levelUpTime.textContent = `Time: ${newTimeSeconds}s`;
        }

        playLevelUpSound();

        // Announce phase change via TTS in English
        if (phaseChanged && ttsSupported) {
            const announcements = ['Learning mode', 'Practice mode', 'Typing phase', 'Speech mode'];
            const msg = new SpeechSynthesisUtterance(announcements[phase] || PHASES[phase]);
            msg.lang = 'en-GB';
            msg.rate = 1;
            msg.volume = 0.8;
            speechSynthesis.cancel();
            speechSynthesis.speak(msg);
        }

        levelUpOverlay.classList.add('active');

        // Countdown
        let count = LEVEL_UP_COUNTDOWN;
        levelUpCountdown.textContent = count;

        levelUpCountdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                levelUpCountdown.textContent = count;
                if (count === 1) warmUpSpeech();
            } else {
                clearInterval(levelUpCountdownInterval);
                levelUpCountdownInterval = null;
                levelUpOverlay.classList.remove('active');
                game.levelUpPending = false;

                // Regenerate buttons if phase changed (Learning -> Practice -> Typing -> Speech)
                if (phaseChanged) {
                    // Initialize speech recognition when entering speech phase
                    if (phase === 3 && speechSupported && !recognition) {
                        recognition = initSpeechRecognition();
                    }
                    generateButtons();
                }

                nextRound();
            }
        }, 1000);
    }

    // Show cycle complete overlay
    function showCycleComplete(completedCycle, newCycle) {
        game.cycleCompletePending = true;

        // Stop listening during overlay
        if (recognition) {
            stopListening();
            recognition = null; // Reset for new cycle
        }

        cycleCompleteMessage.textContent = `You finished Cycle ${completedCycle}!`;

        // Verb mode: simple cycle complete message
        if (isVerbMode()) {
            cycleCompleteColors.textContent = 'All verbs mastered! Starting again with faster time.';
            newColorBadges.innerHTML = '';
        }

        // Show new colours if applicable
        else if (NEW_COLORS_PER_CYCLE[newCycle]) {
            const newColors = NEW_COLORS_PER_CYCLE[newCycle];
            cycleCompleteColors.textContent = 'New colours unlocked!';
            newColorBadges.innerHTML = '';
            newColors.forEach(color => {
                const badge = document.createElement('span');
                badge.className = 'color-badge';
                badge.style.backgroundColor = CATEGORY_DATA.colours.display[color];
                badge.style.color = (color === 'yellow' || color === 'white') ? '#222' : '#fff';
                badge.textContent = CATEGORY_DATA.colours.translations[selectedLanguage][color];
                newColorBadges.appendChild(badge);
            });
        } else {
            cycleCompleteColors.textContent = 'All colours mastered!';
            newColorBadges.innerHTML = '';
        }

        // Announce new form types for noun categories
        if (isNounCategory()) {
            if (newCycle === ARTICLE_CYCLE) {
                cycleCompleteColors.textContent = 'Articles unlocked!';
                newColorBadges.innerHTML = '';
            } else if (newCycle === PLURAL_CYCLE) {
                cycleCompleteColors.textContent = 'Plurals unlocked!';
                newColorBadges.innerHTML = '';
            }
        }

        // Announce feminine forms for adjective category
        if (isAdjectiveCategory() && newCycle === FEMININE_CYCLE) {
            cycleCompleteColors.textContent = 'Feminine forms unlocked!';
            newColorBadges.innerHTML = '';
        }

        cycleCompleteOverlay.classList.add('active');

        // Longer countdown for cycle complete
        let count = CYCLE_COMPLETE_COUNTDOWN;
        cycleCompleteCountdown.textContent = count;

        cycleCompleteCountdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                cycleCompleteCountdown.textContent = count;
                if (count === 1) warmUpSpeech();
            } else {
                clearInterval(cycleCompleteCountdownInterval);
                cycleCompleteCountdownInterval = null;
                cycleCompleteOverlay.classList.remove('active');
                game.cycleCompletePending = false;

                // Update cycle and regenerate
                game.currentCycle = newCycle;
                if (isVerbMode()) {
                    game.currentVerb = getCurrentVerb();
                    game.activeItems = [...PRONOUN_KEYS];
                } else {
                    game.activeColors = getActiveColors(game.currentCycle);
                    const cycleCount = getButtonCount();
                    if (isColorCategory()) {
                        game.activeItems = shuffle(game.activeColors).slice(0, cycleCount);
                    } else {
                        game.activeItems = shuffle(getCategoryData().items).slice(0, cycleCount);
                    }
                }
                initLevelMastery();
                saveProgress();
                generateButtons();
                updateLevelDisplay();

                nextRound();
            }
        }, 1000);
    }

    // ========== INITIALIZATION ==========
    updateModeUI();
    updateStartScreenProgress();

    // Journey phase click handlers — let users jump to any phase
    journeyTracker.querySelectorAll('.journey-phase').forEach(el => {
        el.addEventListener('click', () => {
            const targetPhase = parseInt(el.dataset.phase);
            jumpToPhase(targetPhase);
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetPhase = parseInt(el.dataset.phase);
                jumpToPhase(targetPhase);
            }
        });
    });

    // Initialize audio toggle from saved setting
    audioToggleInput.checked = audioEnabled;
    audioToggleInput.addEventListener('change', function() {
        saveAudioSetting(this.checked);
    });

    // Refresh progress from localStorage to ensure time display is current
    function refreshProgressFromStorage() {
        const freshProgress = getLanguageProgress(selectedLanguage);
        game.totalCorrectAnswers = freshProgress.totalAnswers;
        game.currentCycle = freshProgress.currentCycle;
        game.levelsCompleted = freshProgress.levelsCompleted || 0;
        updateStartScreenProgress();
    }

    // Handle page restoration from bfcache (back-forward cache)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            refreshProgressFromStorage();
        }
    });

    // Refresh when user tabs back to the page
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && topicScreen.classList.contains('active')) {
            refreshProgressFromStorage();
        }
    });

    // Language selection - clicking a language advances to topic screen
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            if (newLang !== selectedLanguage) {
                switchLanguageProgress(newLang);
                selectedLanguage = newLang;
            }
            document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            // Update topic screen header with selected language
            topicHeader.textContent = `${LANGUAGE_FLAGS[selectedLanguage]} ${LANGUAGE_NAMES[selectedLanguage]}`;
            updateModeToggleVisibility();
            updateStartScreenProgress();
            // Warm up TTS engine early so first question audio isn't delayed
            warmUpSpeech();
            show(topicScreen);
        });
    });

    // Mode toggle (Words / Verbs)
    function updateModeUI() {
        document.querySelectorAll('.mode-btn').forEach(b => {
            b.classList.toggle('selected', b.dataset.mode === selectedMode);
        });
        if (selectedMode === 'words') {
            wordsSettingLabel.style.display = '';
            wordsSelector.style.display = '';
            verbSettingLabel.style.display = 'none';
            verbSelector.style.display = 'none';
        } else {
            wordsSettingLabel.style.display = 'none';
            wordsSelector.style.display = 'none';
            verbSettingLabel.style.display = '';
            verbSelector.style.display = '';
        }
    }

    function updateModeToggleVisibility() {
        // Hide mode toggle for Welsh (no verb support)
        if (!isVerbSupported()) {
            modeSelector.style.display = 'none';
            // Force words mode if currently in verbs
            if (selectedMode === 'verbs') {
                selectedMode = 'words';
                selectedCategory = 'colours';
                const newProgress = getLanguageProgress(selectedLanguage, selectedCategory);
                game.totalCorrectAnswers = newProgress.totalAnswers;
                game.currentCycle = newProgress.currentCycle;
                game.levelsCompleted = newProgress.levelsCompleted || 0;
                updateModeUI();
            }
        } else {
            modeSelector.style.display = '';
        }
    }

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newMode = btn.dataset.mode;
            if (newMode === selectedMode) return;
            saveProgress();
            selectedMode = newMode;
            updateModeUI();
            // Switch category context
            if (newMode === 'verbs') {
                selectedCategory = 'verbs_present';
            } else {
                // Restore to whatever word category is selected
                const selectedWordBtn = wordsSelector.querySelector('.category-btn.selected');
                selectedCategory = selectedWordBtn ? selectedWordBtn.dataset.category : 'colours';
            }
            const newProgress = getLanguageProgress(selectedLanguage, selectedCategory);
            game.totalCorrectAnswers = newProgress.totalAnswers;
            game.currentCycle = newProgress.currentCycle;
            game.levelsCompleted = newProgress.levelsCompleted || 0;
            updateStartScreenProgress();
        });
    });

    // Category selection (words mode)
    wordsSelector.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newCategory = btn.dataset.category;
            if (newCategory !== selectedCategory) {
                // Save current category progress, switch, load new
                saveProgress();
                selectedCategory = newCategory;
                const newProgress = getLanguageProgress(selectedLanguage, newCategory);
                game.totalCorrectAnswers = newProgress.totalAnswers;
                game.currentCycle = newProgress.currentCycle;
                game.levelsCompleted = newProgress.levelsCompleted || 0;
                updateStartScreenProgress();
            }
            wordsSelector.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Verb tense selection (verbs mode)
    verbSelector.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newCategory = btn.dataset.category;
            if (newCategory !== selectedCategory) {
                saveProgress();
                selectedCategory = newCategory;
                const newProgress = getLanguageProgress(selectedLanguage, newCategory);
                game.totalCorrectAnswers = newProgress.totalAnswers;
                game.currentCycle = newProgress.currentCycle;
                game.levelsCompleted = newProgress.levelsCompleted || 0;
                updateStartScreenProgress();
            }
            verbSelector.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    startBtn.addEventListener('click', () => {
        warmUpSpeech();
        if (isVerbMode() && !hasPronounIntroCompleted(selectedLanguage)) {
            showPronounIntro(() => startGame());
        } else {
            startGame();
        }
    });
    document.getElementById('restart-btn').addEventListener('click', () => {
        // Clean up speech recognition
        if (recognition) {
            stopListening();
            recognition = null;
        }
        // Refresh progress from storage to ensure time is current
        refreshProgressFromStorage();
        show(topicScreen);
    });

    // Statistics button handlers
    document.getElementById('stats-btn').addEventListener('click', showStats);
    document.getElementById('close-stats-btn').addEventListener('click', hideStats);
    document.getElementById('reset-stats-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            resetStats();
        }
    });

    // Back button on topic screen
    document.getElementById('back-btn').addEventListener('click', () => {
        show(languageScreen);
    });

    document.getElementById('reset-progress-btn').addEventListener('click', () => {
        const langName = LANGUAGE_NAMES[selectedLanguage];
        if (confirm(`Are you sure you want to reset your ${langName} progress? You will start back at Level 1 with 10 seconds. Other languages are not affected.`)) {
            resetProgress();
            hideStats();
        }
    });

    function show(screen) {
        [languageScreen, topicScreen, gameScreen, endScreen].forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    // ========== PAUSE / QUIT ==========

    function pauseGame() {
        if (game.paused || !gameScreen.classList.contains('active')) return;
        if (game.levelUpPending || game.cycleCompletePending) return;

        game.paused = true;
        game.pausedTimeRemaining = game.timeLimit - (performance.now() - game.timerStart);
        if (game.pausedTimeRemaining < 0) game.pausedTimeRemaining = 0;

        clearTimeout(game.timeout);
        cancelAnimationFrame(game.timerRAF);

        // Freeze the timer bar at its current position
        const computed = timerBar.getBoundingClientRect().width;
        const containerWidth = timerBar.parentElement.getBoundingClientRect().width;
        const pct = containerWidth > 0 ? (computed / containerWidth * 100) : 0;
        timerBar.style.transition = 'none';
        timerBar.style.width = pct + '%';

        // Stop speech recognition if active
        if (recognition && isListening) {
            stopListening();
        }

        pauseOverlay.classList.add('active');
        resumeBtn.focus();
    }

    function resumeGame() {
        if (!game.paused) return;

        game.paused = false;
        pauseOverlay.classList.remove('active');

        // Restart timer bar from frozen position
        void timerBar.offsetWidth; // force reflow
        timerBar.style.transition = `width ${game.pausedTimeRemaining}ms linear, background 0.3s linear`;
        timerBar.style.width = '0%';

        // Reset timer tracking with remaining time
        game.timerStart = performance.now();
        game.timeLimit = game.pausedTimeRemaining;

        game.timeout = setTimeout(() => {
            if (!game.roundActive) return;
            game.roundActive = false;
            game.totalQuestions++;
            if (isAtMinTime() && !game.mercyUsed) {
                showSpeedMercy();
            } else {
                endGame();
            }
        }, game.pausedTimeRemaining);

        cancelAnimationFrame(game.timerRAF);
        game.timerRAF = requestAnimationFrame(function tick() {
            const elapsed = performance.now() - game.timerStart;
            if (elapsed > game.timeLimit * TIMER_WARNING_RATIO) timerBar.classList.add('warning');
            if (elapsed < game.timeLimit) game.timerRAF = requestAnimationFrame(tick);
        });

        // Resume speech listening if in speech mode
        if (isSpeechMode() && speechSupported && recognition) {
            startListening();
        }

        // Refocus typing input if in typing mode
        if (isTypingMode()) {
            typingInput.focus();
        }
    }

    function quitGame() {
        clearTimeout(game.timeout);
        cancelAnimationFrame(game.timerRAF);

        // Stop speech recognition
        if (recognition) {
            stopListening();
            recognition = null;
        }

        // Hide pause overlay if visible
        if (game.paused) {
            pauseOverlay.classList.remove('active');
            game.paused = false;
        }

        show(topicScreen);
        updateStartScreenProgress();
    }

    pauseBtn.addEventListener('click', pauseGame);
    quitBtn.addEventListener('click', quitGame);
    resumeBtn.addEventListener('click', resumeGame);
    quitFromPauseBtn.addEventListener('click', quitGame);

    // Overlay nav buttons — quit to menu from level-up or cycle-complete
    document.getElementById('level-up-menu-btn').addEventListener('click', function() {
        if (levelUpCountdownInterval) {
            clearInterval(levelUpCountdownInterval);
            levelUpCountdownInterval = null;
        }
        levelUpOverlay.classList.remove('active');
        game.levelUpPending = false;
        quitGame();
    });

    document.getElementById('cycle-complete-menu-btn').addEventListener('click', function() {
        if (cycleCompleteCountdownInterval) {
            clearInterval(cycleCompleteCountdownInterval);
            cycleCompleteCountdownInterval = null;
        }
        cycleCompleteOverlay.classList.remove('active');
        game.cycleCompletePending = false;
        quitGame();
    });

    // ========== SPEED MERCY HANDLERS ==========

    document.getElementById('speed-mercy-retry').addEventListener('click', function() {
        speedMercyOverlay.classList.remove('active');
        game.mercyUsed = true;
        game.roundActive = true;
        // Re-show typing UI if in typing mode
        if (isTypingMode()) {
            typingUI.classList.add('active');
        }
        generateButtons();
        nextRound();
    });

    document.getElementById('speed-mercy-add-time').addEventListener('click', function() {
        speedMercyOverlay.classList.remove('active');
        game.mercyUsed = true;
        game.timeBonus += 2;
        game.roundActive = true;
        // Re-show typing UI if in typing mode
        if (isTypingMode()) {
            typingUI.classList.add('active');
        }
        updateLevelDisplay();
        generateButtons();
        nextRound();
    });

    document.getElementById('speed-mercy-end').addEventListener('click', function() {
        speedMercyOverlay.classList.remove('active');
        endGame();
    });

    // ========== TYPING MODE HANDLERS ==========

    function populateAccentButtons() {
        accentButtons.innerHTML = '';
        const chars = ACCENT_CHARS[selectedLanguage] || [];
        chars.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'accent-btn';
            btn.type = 'button';
            btn.textContent = ch;
            btn.addEventListener('click', () => {
                // Insert accent character at cursor position
                const start = typingInput.selectionStart;
                const end = typingInput.selectionEnd;
                const val = typingInput.value;
                typingInput.value = val.slice(0, start) + ch + val.slice(end);
                typingInput.selectionStart = typingInput.selectionEnd = start + ch.length;
                typingInput.focus();
            });
            accentButtons.appendChild(btn);
        });
    }

    function matchItemFromTyping(typed) {
        const items = getCategoryItems();
        const currentForm = game.currentForm || 'base';
        const normalizedTyped = normalizeForComparison(typed);
        for (const item of items) {
            const translation = getFormTranslation(item, currentForm);
            if (normalizeForComparison(translation) === normalizedTyped) {
                return item;
            }
        }
        return null;
    }

    function handleTypingSubmit() {
        if (!game.roundActive || !isTypingMode()) return;
        const typed = typingInput.value;
        if (!typed.trim()) return;

        const matched = matchItemFromTyping(typed);
        if (matched) {
            typingFeedback.textContent = '';
            handleAnswer(matched);
        } else {
            // Wrong answer — end the game
            typingFeedback.textContent = '';
            handleAnswer('__wrong__');
        }
    }

    typingInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTypingSubmit();
        }
    });

    // ========== GAME FUNCTIONS ==========

    function startGame() {
        if (isVerbMode()) {
            game.currentVerb = getCurrentVerb();
            game.activeItems = [...PRONOUN_KEYS];
            game.activeColors = [];
        } else {
            game.activeColors = getActiveColors(game.currentCycle);
            const count = getButtonCount();
            if (isColorCategory()) {
                game.activeItems = shuffle(game.activeColors).slice(0, count);
            } else {
                game.activeItems = shuffle(getCategoryData().items).slice(0, count);
            }
        }
        initLevelMastery();
        game.currentForm = 'base';
        game.timeLimit = getTimeLimit();
        game.score = 0;
        game.totalQuestions = 0;
        game.responseTimes = [];
        game.timeBonus = 0;
        game.mercyUsed = false;
        game.sessionStreak = {};
        game.pitchStreak = 0;
        currentScoreEl.textContent = '0';

        // Initialize speech recognition if entering speech mode
        if (isSpeechMode() && speechSupported) {
            recognition = initSpeechRecognition();
        }

        gameLangFlag.textContent = LANGUAGE_FLAGS[selectedLanguage] || '';
        generateButtons();
        updateLevelDisplay();
        show(gameScreen);
        nextRound();
    }

    function getPromptText(form) {
        if (isVerbMode()) {
            const phase = getPhaseFromProgress();
            return phase === 0 ? 'Match the translation' : 'What is the conjugation?';
        }
        if (game.isReverseRound) {
            return isColorCategory() ? 'Which colour is this?' : 'Which one matches?';
        }
        const isEmojiMode = !isColorCategory();
        if (form === 'feminine') return 'How does she feel?';
        if (form === 'article') return 'What is this with its article?';
        if (form === 'plural') return 'What are these?';
        if (isAdjectiveCategory() && getAvailableForms().includes('feminine')) return 'How does he feel?';
        return isEmojiMode ? 'What does this emoji mean?' : 'What colour is this?';
    }

    function getTypingPrompt(form) {
        if (isVerbMode()) return 'Type the conjugation!';
        if (form === 'feminine') return 'Type the feminine!';
        if (form === 'article') return 'Type it with the article!';
        if (form === 'plural') return 'Type the plural!';
        const isEmojiMode = !isColorCategory();
        return isEmojiMode ? 'Type the word!' : 'Type the colour!';
    }

    function getSpeechPrompt(form) {
        if (isVerbMode()) return 'Say the conjugation!';
        if (form === 'feminine') return 'Say the feminine!';
        if (form === 'article') return 'Say it with the article!';
        if (form === 'plural') return 'Say the plural!';
        const isEmojiMode = !isColorCategory();
        return isEmojiMode ? 'Say the word!' : 'Say the colour!';
    }

    function generateButtons() {
        buttonsContainer.innerHTML = '';
        const phase = getPhaseFromProgress();
        const items = getCategoryItems();
        const currentForm = game.currentForm || 'base';
        const promptText = getPromptText(currentForm);
        const speechPrompt = getSpeechPrompt(currentForm);

        const typingPrompt = getTypingPrompt(currentForm);

        // Speech mode: hide buttons and show speech UI
        if (phase === 3) {
            gameScreen.classList.remove('typing-active');
            if (speechSupported) {
                buttonsContainer.style.display = 'none';
                speechUI.classList.add('active');
                typingUI.classList.remove('active');
                speechWarning.classList.remove('visible');
                promptLabel.textContent = speechPrompt;
            } else {
                // Fall back to Practice mode if speech not supported
                showSpeechFallback();
            }
        } else if (phase === 2) {
            // Typing mode: hide buttons and speech UI, show typing input
            buttonsContainer.style.display = 'none';
            speechUI.classList.remove('active');
            typingUI.classList.add('active');
            speechWarning.classList.remove('visible');
            promptLabel.textContent = typingPrompt;
            typingInput.value = '';
            typingFeedback.textContent = '';
            gameScreen.classList.add('typing-active');
            populateAccentButtons();
        } else {
            buttonsContainer.style.display = 'flex';
            speechUI.classList.remove('active');
            typingUI.classList.remove('active');
            speechWarning.classList.remove('visible');
            promptLabel.textContent = promptText;
            gameScreen.classList.remove('typing-active');
        }

        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.dataset.color = item;
            btn.textContent = getFormTranslation(item, currentForm);

            // Apply styling based on current phase and category
            if (phase === 0 && isColorCategory()) {
                // Learning mode: show colored backgrounds (colours only)
                btn.classList.add('learning-mode');
                btn.style.backgroundColor = getCategoryData().display[item];
                // Ensure text is readable on light colors
                if (item === 'yellow' || item === 'white') {
                    btn.style.color = '#222';
                    btn.style.textShadow = 'none';
                }
            } else {
                // Practice mode, Speech fallback, or emoji categories: neutral backgrounds
                btn.classList.add('practice-mode');
            }

            btn.addEventListener('click', () => handleAnswer(item));
            buttonsContainer.appendChild(btn);
        });
    }

    function shuffleButtons() {
        const btns = Array.from(buttonsContainer.children);
        for (let i = btns.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [btns[i], btns[j]] = [btns[j], btns[i]];
        }
        btns.forEach(btn => buttonsContainer.appendChild(btn));
    }

    function nextRound() {
        game.roundActive = true;
        // Update time limit based on current level
        game.timeLimit = getTimeLimit();

        // Build list of unmastered {item, form} pairs (skip removed items)
        const items = getCategoryItems();
        const forms = getAvailableForms();
        const unmasteredPairs = [];
        items.forEach(item => {
            forms.forEach(form => {
                const key = form === 'base' ? item : `${item}:${form}`;
                if (key in game.levelMastery && game.levelMastery[key] < MASTERY_THRESHOLD) {
                    unmasteredPairs.push({ item, form });
                }
            });
        });

        // Pick randomly from unmastered pairs, avoiding same item as last round
        const pool = unmasteredPairs.length > 0 ? unmasteredPairs : items.map(item => ({ item, form: 'base' }));
        // Filter out previous item if possible
        const filteredPool = pool.filter(p => p.item !== game.currentColor);
        const pickPool = filteredPool.length > 0 ? filteredPool : pool;
        const pick = pickPool[Math.floor(Math.random() * pickPool.length)];

        game.currentColor = pick.item;
        game.currentForm = pick.form;

        // Reverse mode: ~30% of rounds in Practice phase flip display
        // (show foreign word as question; user picks emoji/colour)
        const phaseNow = getPhaseFromProgress();
        game.isReverseRound = !isVerbMode() && phaseNow === 1 && Math.random() < 0.3;
        buttonsContainer.classList.toggle('reverse-mode', game.isReverseRound);

        // Display: verb text, emoji, or colour swatch
        if (isVerbMode()) {
            const verb = game.currentVerb;
            const pronoun = game.currentColor; // pronoun key
            const phase = getPhaseFromProgress();
            colorDisplay.style.backgroundColor = 'transparent';
            colorDisplay.classList.remove('plural-display');
            colorDisplay.classList.add('emoji-display');

            if (phase === 0) {
                // Learning: show English phrase e.g. "I go"
                const englishPhrase = VERB_ENGLISH[verb]?.[pronoun] || '';
                colorDisplay.innerHTML = `<div class="verb-display">${englishPhrase}</div>`;
            } else {
                // Practice+: show target-language pronoun + verb context
                const targetPronoun = VERB_PRONOUNS[selectedLanguage]?.[pronoun] || '';
                const infinitive = VERB_CONJUGATIONS[selectedLanguage]?.[verb]?.infinitive || '';
                const englishVerb = VERB_ENGLISH[verb]?.I?.replace('I ', '') || '';
                colorDisplay.innerHTML = `<div class="verb-display">${targetPronoun}</div><div class="verb-context">${infinitive} (to ${englishVerb})</div>`;
            }
        } else if (game.isReverseRound) {
            // Reverse mode: show the foreign word as the question
            const foreignWord = getFormTranslation(game.currentColor, game.currentForm);
            colorDisplay.style.backgroundColor = 'transparent';
            colorDisplay.classList.remove('plural-display');
            colorDisplay.classList.add('emoji-display');
            colorDisplay.innerHTML = `<div class="verb-display">${foreignWord}</div>`;
        } else {
            const emoji = getCategoryDisplay(game.currentColor);
            if (emoji) {
                colorDisplay.style.backgroundColor = 'transparent';
                if (game.currentForm === 'plural') {
                    colorDisplay.textContent = emoji + emoji;
                    colorDisplay.classList.add('emoji-display', 'plural-display');
                } else if (game.currentForm === 'feminine') {
                    colorDisplay.textContent = '👩 ' + emoji;
                    colorDisplay.classList.add('emoji-display');
                    colorDisplay.classList.remove('plural-display');
                } else if (isAdjectiveCategory() && getAvailableForms().includes('feminine')) {
                    colorDisplay.textContent = '👨 ' + emoji;
                    colorDisplay.classList.add('emoji-display');
                    colorDisplay.classList.remove('plural-display');
                } else {
                    colorDisplay.textContent = emoji;
                    colorDisplay.classList.add('emoji-display');
                    colorDisplay.classList.remove('plural-display');
                }
            } else {
                colorDisplay.textContent = '';
                colorDisplay.classList.remove('emoji-display', 'plural-display');
                colorDisplay.style.backgroundColor = getCategoryData().display[game.currentColor];
            }
        }

        // Update prompt label per form
        const currentForm = game.currentForm || 'base';
        if (isSpeechMode()) {
            promptLabel.textContent = getSpeechPrompt(currentForm);
        } else if (isTypingMode()) {
            promptLabel.textContent = getTypingPrompt(currentForm);
        } else {
            promptLabel.textContent = getPromptText(currentForm);
        }

        // Update button content for current round (text or visual in reverse mode)
        const btns = buttonsContainer.querySelectorAll('.answer-btn');
        btns.forEach(btn => {
            const item = btn.dataset.color;
            if (game.isReverseRound) {
                if (isColorCategory()) {
                    // Show colour swatch — empty text, coloured background
                    btn.textContent = '';
                    btn.className = 'answer-btn learning-mode';
                    btn.style.backgroundColor = getCategoryData().display[item];
                    btn.style.color = (item === 'yellow' || item === 'white') ? '#222' : '';
                    btn.style.textShadow = (item === 'yellow' || item === 'white') ? 'none' : '';
                } else {
                    // Show emoji as the visual answer option
                    btn.textContent = getCategoryDisplay(item) || item;
                    btn.className = 'answer-btn practice-mode';
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.textShadow = '';
                }
            } else {
                btn.textContent = getFormTranslation(item, currentForm);
                btn.className = 'answer-btn practice-mode';
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.textShadow = '';
            }
        });

        // Show reinforcement label in level 1 of learning phase for non-colour categories
        if (!isColorCategory() && !isVerbMode() && getPhaseFromProgress() === 0 && getLevelInPhase() === 1) {
            reinforcementLabel.textContent = getFormTranslation(game.currentColor, currentForm);
        } else {
            reinforcementLabel.textContent = '';
        }

        // Speak the word if audio is enabled
        speakColor(game.currentColor, selectedLanguage);

        // Clear speech wrong attempts for the new round
        speechAttempts.innerHTML = '';

        shuffleButtons();

        // Timer setup
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        timerBar.classList.remove('warning');
        void timerBar.offsetWidth;
        timerBar.style.transition = `width ${game.timeLimit}ms linear, background 0.3s linear`;
        timerBar.style.width = '0%';

        game.timerStart = performance.now();
        cancelAnimationFrame(game.timerRAF);
        clearTimeout(game.timeout);

        game.timerRAF = requestAnimationFrame(function tick() {
            const elapsed = performance.now() - game.timerStart;
            if (elapsed > game.timeLimit * TIMER_WARNING_RATIO) timerBar.classList.add('warning');
            if (elapsed < game.timeLimit) game.timerRAF = requestAnimationFrame(tick);
        });

        game.timeout = setTimeout(() => {
            if (!game.roundActive) return;
            game.roundActive = false;
            game.totalQuestions++;
            if (isAtMinTime() && !game.mercyUsed) {
                showSpeedMercy();
            } else {
                endGame();
            }
        }, game.timeLimit);

        // Start listening in speech mode
        if (isSpeechMode() && speechSupported && recognition) {
            startListening();
        }

        // Clear and focus input in typing mode
        if (isTypingMode()) {
            typingInput.value = '';
            typingFeedback.textContent = '';
            typingInput.focus();
        }
    }

    function handleAnswer(chosen) {
        if (!gameScreen.classList.contains('active')) return;
        if (game.levelUpPending || game.cycleCompletePending || game.paused) return;
        if (!game.roundActive) return;
        game.roundActive = false;

        clearTimeout(game.timeout);
        cancelAnimationFrame(game.timerRAF);
        game.totalQuestions++;

        if (chosen === game.currentColor) {
            game.responseTimes.push(performance.now() - game.timerStart);
            game.score++;
            game.pitchStreak++;
            currentScoreEl.textContent = game.score;
            playCorrectSound();

            // Track total correct answers (for stats) and mastery
            game.totalCorrectAnswers++;
            recordMasteryAnswer(chosen);
            saveProgress();
            updateLevelDisplay();

            // Check if all items in this level are mastered
            if (isLevelMastered()) {
                const previousPhase = getPhaseFromProgress();
                const timeChanged = willTimeChange();
                game.levelsCompleted++;
                saveProgress();

                // Check for cycle completion (levelsCompleted crossed a cycle boundary)
                if (game.levelsCompleted % LEVELS_PER_CYCLE === 0) {
                    const completedCycle = game.currentCycle;
                    const newCycle = game.currentCycle + 1;
                    showCycleComplete(completedCycle, newCycle);
                } else {
                    // Normal level-up: randomize items and reset mastery
                    randomizeActiveColors();
                    initLevelMastery();
                    game.pitchStreak = 0;
                    generateButtons();
                    updateLevelDisplay();
                    showLevelUp(getLevelInCycle(), previousPhase, timeChanged);
                }
            } else {
                nextRound();
            }
        } else {
            resetSessionStreak();
            // Show mercy overlay at min time if not already used this session
            if (isAtMinTime() && !game.mercyUsed) {
                showSpeedMercy();
            } else {
                endGame();
            }
        }
    }

    function showSpeedMercy() {
        playWrongSound();
        clearTimeout(game.timeout);
        cancelAnimationFrame(game.timerRAF);

        // Stop speech/typing
        if (recognition) stopListening();
        typingUI.classList.remove('active');

        const timeSeconds = getTimeLimitSeconds();
        speedMercyMessage.textContent = timeSeconds <= MIN_TIME
            ? "That 2-second timer is no joke!"
            : `Tricky at ${timeSeconds} seconds!`;
        speedMercyStreak.textContent = `Current streak: ${game.score}`;

        speedMercyOverlay.classList.add('active');
        document.getElementById('speed-mercy-retry').focus();
    }

    function endGame() {
        playWrongSound();
        clearTimeout(game.timeout);
        cancelAnimationFrame(game.timerRAF);

        // Hide typing UI
        typingUI.classList.remove('active');

        // Stop speech recognition
        if (recognition) {
            stopListening();
        }

        const accuracy = game.totalQuestions > 0 ? Math.round((game.score / game.totalQuestions) * 100) : 0;
        const avgTime = game.responseTimes.length > 0
            ? (game.responseTimes.reduce((a, b) => a + b, 0) / game.responseTimes.length / 1000).toFixed(1)
            : '0.0';

        // Check for personal best before updating stats
        const isNewBest = isNewPersonalBest(game.score);
        const previousBest = stats.bestStreak;

        // Update statistics
        updateStatsAfterGame(game.score, selectedLanguage);

        finalScore.textContent = game.score;
        document.getElementById('accuracy-stat').textContent = accuracy + '%';
        document.getElementById('avg-time-stat').textContent = avgTime + 's';

        // Show personal best indicator
        const personalBestEl = document.getElementById('personal-best');
        const bestStreakDisplay = document.getElementById('best-streak-display');

        if (isNewBest) {
            personalBestEl.classList.add('visible');
            bestStreakDisplay.textContent = `Previous best: ${previousBest}`;
        } else {
            personalBestEl.classList.remove('visible');
            if (stats.bestStreak > 0) {
                bestStreakDisplay.textContent = `Your best: ${stats.bestStreak}`;
            } else {
                bestStreakDisplay.textContent = '';
            }
        }

        if (game.score === 0) {
            if (isVerbMode()) {
                const answerWord = getVerbTranslation(game.currentColor);
                const pronoun = PRONOUN_LABELS[game.currentColor] || game.currentColor;
                endMessage.textContent = `The answer was "${answerWord}" (${pronoun})`;
            } else {
                const currentForm = game.currentForm || 'base';
                const answerWord = getFormTranslation(game.currentColor, currentForm);
                const answerEmoji = getCategoryDisplay(game.currentColor);
                const emojiDisplay = answerEmoji ? (currentForm === 'plural' ? answerEmoji + answerEmoji : answerEmoji) : null;
                endMessage.textContent = emojiDisplay
                    ? `The answer was ${answerWord} ${emojiDisplay} (${game.currentColor})`
                    : `The colour was ${answerWord} (${game.currentColor})`;
            }
        } else if (game.score < 5) {
            endMessage.textContent = 'Good start! Keep practising!';
        } else if (game.score < 10) {
            endMessage.textContent = 'Nice work! You\'re getting the hang of it!';
        } else if (game.score < 20) {
            endMessage.textContent = 'Excellent! Your vocabulary is growing!';
        } else {
            endMessage.textContent = 'Amazing! You\'re a colour word master!';
        }

        show(endScreen);
    }
