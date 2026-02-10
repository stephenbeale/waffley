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
                    return {
                        languages: {
                            es: { totalAnswers: data.totalAnswers || 0, currentCycle: data.currentCycle || 1 }
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
            return allProgress.languages[key];
        }
        return { totalAnswers: 0, currentCycle: 1 };
    }

    // Save progress for the current language + category to localStorage
    function saveProgress() {
        const key = getProgressKey(selectedLanguage, selectedCategory);
        const allProgress = loadAllProgress();
        if (!allProgress.languages) {
            allProgress.languages = {};
        }
        allProgress.languages[key] = {
            totalAnswers: totalCorrectAnswers,
            currentCycle: currentCycle
        };
        localStorage.setItem('waffley_progress', JSON.stringify(allProgress));
    }

    // Switch to a different language - load that language's saved progress
    function switchLanguageProgress(newLang) {
        // Save current language + category progress first
        saveProgress();
        // Load the new language's progress for current category
        const newProgress = getLanguageProgress(newLang, selectedCategory);
        totalCorrectAnswers = newProgress.totalAnswers;
        currentCycle = newProgress.currentCycle;
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
        if (currentCycle > stats.highestCycle) {
            stats.highestCycle = currentCycle;
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

    // Reset all statistics
    function resetStats() {
        stats = getDefaultStats();
        saveStats();
        updateStatsDisplay();
    }

    // Reset level progress for current language (back to Level 1)
    function resetProgress() {
        totalCorrectAnswers = 0;
        currentCycle = 1;
        saveProgress();
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
    }

    // Hide statistics overlay
    function hideStats() {
        document.getElementById('stats-overlay').classList.remove('active');
    }

    // Statistics state
    let stats = loadStats();

    // Get current cycle number from total answers
    function getCycleFromAnswers(answers) {
        return Math.floor(answers / ANSWERS_PER_CYCLE) + 1;
    }

    // Get colours available for a given cycle
    function getActiveColors(cycle) {
        if (cycle >= MAX_CYCLE_WITH_NEW_COLORS) {
            return CYCLE_COLORS[MAX_CYCLE_WITH_NEW_COLORS].slice();
        }
        return CYCLE_COLORS[cycle].slice();
    }

    // Randomly select new items from the full pool
    function randomizeActiveColors() {
        const count = activeColors.length;
        const pool = ALL_COLORS.slice();
        // Fisher-Yates shuffle the pool
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        activeColors = pool.slice(0, count);

        // Also shuffle emoji items if in emoji mode
        if (selectedCategory !== 'colours' && EMOJI_DATA[selectedCategory]) {
            const emojiPool = EMOJI_DATA[selectedCategory].items.slice();
            for (let i = emojiPool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [emojiPool[i], emojiPool[j]] = [emojiPool[j], emojiPool[i]];
            }
            EMOJI_DATA[selectedCategory].items = emojiPool;
        }
    }

    // Check if cycle just completed
    function checkCycleComplete(previousAnswers, currentAnswers) {
        const previousCycle = getCycleFromAnswers(previousAnswers);
        const newCycle = getCycleFromAnswers(currentAnswers);
        return newCycle > previousCycle;
    }

    // Calculate level from total answers (1-based, 1 level = 10 answers)
    function getLevel(answers) {
        return Math.floor(answers / ANSWERS_PER_LEVEL) + 1;
    }

    // Get level within current cycle (1-30)
    function getLevelWithinCycle(answers) {
        const answersInCycle = answers % ANSWERS_PER_CYCLE;
        return Math.floor(answersInCycle / ANSWERS_PER_LEVEL) + 1;
    }

    // Calculate phase from level within cycle (0=Learning, 1=Practice, 2=Speech)
    function getPhase(levelInCycle) {
        return Math.floor((levelInCycle - 1) / LEVELS_PER_PHASE) % 3;
    }

    // Get phase name
    function getPhaseName(levelInCycle) {
        return PHASES[getPhase(levelInCycle)];
    }

    // Get progress within current level (0-9)
    function getLevelProgress(answers) {
        return answers % ANSWERS_PER_LEVEL;
    }

    // Get level within current phase (1-10)
    // Each phase has 10 levels (100 answers)
    function getLevelWithinPhase(answers) {
        const answersInCycle = answers % ANSWERS_PER_CYCLE;
        const answersInPhase = answersInCycle % (LEVELS_PER_PHASE * ANSWERS_PER_LEVEL);
        return Math.floor(answersInPhase / ANSWERS_PER_LEVEL) + 1;
    }

    // Calculate time limit based on level within phase
    // Time resets to 10s at start of each phase (Learning, Practice, Speech)
    // Level 1 = 10s, Level 2 = 8s, Level 3 = 6s, Level 4 = 4s, Level 5+ = 2s
    function getTimeLimit(answers) {
        const levelInPhase = getLevelWithinPhase(answers);
        const timeInSeconds = Math.max(MIN_TIME, MAX_TIME - (levelInPhase - 1) * 2);
        return timeInSeconds * 1000; // return in milliseconds
    }

    // Get time limit in seconds for display
    function getTimeLimitSeconds(answers) {
        return getTimeLimit(answers) / 1000;
    }

    // Check if we just leveled up
    function checkLevelUp(previousAnswers, currentAnswers) {
        const previousLevel = getLevel(previousAnswers);
        const currentLevel = getLevel(currentAnswers);
        return currentLevel > previousLevel;
    }

    // Check if time changed between levels
    function didTimeChange(previousAnswers, currentAnswers) {
        return getTimeLimit(previousAnswers) !== getTimeLimit(currentAnswers);
    }

    // Web Speech API setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSupported = !!SpeechRecognition;
    let recognition = null;
    let isListening = false;

    // ========== GAME STATE ==========
    let selectedLanguage = 'es';
    let activeColors = [];
    let currentColor = '';
    let score = 0;
    let totalQuestions = 0;
    let timerStart = 0;
    let timerRAF = 0;
    let timeout = 0;
    let timeLimit = 10000;
    let responseTimes = [];

    // Category must be declared before getLanguageProgress (which uses it as default)
    let selectedCategory = 'colours';

    // Level system state - load progress for default language (Spanish)
    const savedProgress = getLanguageProgress(selectedLanguage);
    let totalCorrectAnswers = savedProgress.totalAnswers;
    let currentCycle = savedProgress.currentCycle;
    let levelUpPending = false;
    let cycleCompletePending = false;

    // Helper: get current items and translations based on category
    function getCategoryItems() {
        if (selectedCategory === 'colours') {
            return activeColors;
        }
        return EMOJI_DATA[selectedCategory].items.slice(0, activeColors.length);
    }

    function getCategoryTranslation(item) {
        if (selectedCategory === 'colours') {
            return TRANSLATIONS[selectedLanguage][item];
        }
        return EMOJI_DATA[selectedCategory].translations[selectedLanguage][item];
    }

    function getCategoryDisplay(item) {
        if (selectedCategory === 'colours') {
            return null; // use CSS background color
        }
        return EMOJI_DATA[selectedCategory].emojis[item];
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
        // Don't speak in Speech Mode (would give away the answer)
        const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
        if (getPhase(levelInCycle) === 2) return;

        const word = getCategoryTranslation(color);
        if (!word) return;

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const langCode = SPEECH_LANG_CODES[language] || 'es-ES';
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = langCode;
        utterance.rate = 0.85;

        speechSynthesis.speak(utterance);
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
    const startLevelEl = document.getElementById('start-level');
    const startPhaseEl = document.getElementById('start-phase');
    const startTotalAnswersEl = document.getElementById('start-total-answers');
    const startTimeLimitEl = document.getElementById('start-time-limit');
    const startCycleEl = document.getElementById('start-cycle');
    const startColorsEl = document.getElementById('start-colors');

    // Cycle complete elements
    const cycleCompleteOverlay = document.getElementById('cycle-complete-overlay');
    const cycleCompleteMessage = document.getElementById('cycle-complete-message');
    const cycleCompleteColors = document.getElementById('cycle-complete-colors');
    const newColorBadges = document.getElementById('new-color-badges');
    const cycleCompleteCountdown = document.getElementById('cycle-complete-countdown');

    // Speech mode elements
    const promptLabel = document.getElementById('prompt-label');
    const speechUI = document.getElementById('speech-ui');
    const micIcon = document.getElementById('mic-icon');
    const micStatus = document.getElementById('mic-status');
    const voiceFeedback = document.getElementById('voice-feedback');
    const speechWarning = document.getElementById('speech-warning');

    // ========== SPEECH RECOGNITION FUNCTIONS ==========

    function initSpeechRecognition() {
        if (!speechSupported) return null;

        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = SPEECH_LANG_CODES[selectedLanguage] || 'es-ES';

        recog.onresult = (event) => {
            if (levelUpPending || cycleCompletePending) return;

            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript.trim().toLowerCase();
            const lastWord = transcript.split(' ').pop();

            voiceFeedback.textContent = `Heard: "${lastWord}"`;

            if (result.isFinal) {
                const matchedColor = matchColorFromSpeech(lastWord);
                if (matchedColor) {
                    handleAnswer(matchedColor);
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
            const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
            const phase = getPhase(levelInCycle);
            if (phase === 2 && gameScreen.classList.contains('active') && !levelUpPending && !cycleCompletePending) {
                setTimeout(() => {
                    if (gameScreen.classList.contains('active') && !isListening) {
                        startListening();
                    }
                }, 100);
            }
        };

        return recog;
    }

    function matchColorFromSpeech(word) {
        const items = getCategoryItems();
        const lowerWord = word.toLowerCase();

        // For colours, check the dedicated aliases first
        if (selectedCategory === 'colours') {
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
        buttonsContainer.style.display = 'grid';
        promptLabel.textContent = 'What colour is this?';
    }

    function isSpeechMode() {
        const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
        return getPhase(levelInCycle) === 2;
    }

    // ========== UI UPDATE FUNCTIONS ==========

    // Update start screen progress display
    function updateStartScreenProgress() {
        const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
        startLevelEl.textContent = levelInCycle;
        startPhaseEl.textContent = getPhaseName(levelInCycle);
        startTotalAnswersEl.textContent = totalCorrectAnswers;
        startTimeLimitEl.textContent = getTimeLimitSeconds(totalCorrectAnswers);
        startCycleEl.textContent = currentCycle;
        startColorsEl.textContent = getActiveColors(currentCycle).length;
    }

    // Update game screen level display
    function updateLevelDisplay() {
        const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
        const phase = getPhase(levelInCycle);
        const progress = getLevelProgress(totalCorrectAnswers);

        currentLevelEl.textContent = levelInCycle;

        // Update vertical progress bar
        verticalProgressBar.style.height = (progress / ANSWERS_PER_LEVEL * 100) + '%';
        verticalProgressLabel.textContent = `${progress}/${ANSWERS_PER_LEVEL}`;

        timeDisplayEl.textContent = getTimeLimitSeconds(totalCorrectAnswers);

        // Update phase badge
        phaseBadge.textContent = PHASES[phase];
        phaseBadge.className = 'phase-badge ' + PHASE_CLASSES[phase];
    }

    // Show level-up overlay
    function showLevelUp(newLevelInCycle, previousAnswers, currentAnswers) {
        levelUpPending = true;

        // Stop listening during overlay
        if (recognition) {
            stopListening();
        }

        const phase = getPhase(newLevelInCycle);
        const previousLevelInCycle = getLevelWithinCycle(previousAnswers);
        const previousPhase = getPhase(previousLevelInCycle);
        const phaseChanged = phase !== previousPhase;
        const timeChanged = didTimeChange(previousAnswers, currentAnswers);
        const newTimeSeconds = getTimeLimitSeconds(currentAnswers);

        levelUpTitle.textContent = phaseChanged ? 'Phase Complete!' : 'Level Up!';
        levelUpMessage.textContent = `You reached Level ${newLevelInCycle}`;

        if (phaseChanged) {
            levelUpPhase.textContent = `Welcome to ${PHASES[phase]} Mode!`;
            // Add extra info for speech mode
            if (phase === 2) {
                levelUpPhase.textContent += speechSupported
                    ? ' Speak the colour words to answer!'
                    : ' (Voice not supported - using buttons)';
            }
        } else {
            levelUpPhase.textContent = '';
        }

        // Always show info about colors shuffling
        levelUpInfo.textContent = 'New colours selected!';

        // Always show current time limit, highlight if changed
        if (timeChanged) {
            levelUpTime.textContent = `Time: ${newTimeSeconds}s (-2 seconds)`;
        } else {
            levelUpTime.textContent = `Time: ${newTimeSeconds}s`;
        }

        levelUpOverlay.classList.add('active');

        // Countdown
        let count = 3;
        levelUpCountdown.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                levelUpCountdown.textContent = count;
            } else {
                clearInterval(countdownInterval);
                levelUpOverlay.classList.remove('active');
                levelUpPending = false;

                // Regenerate buttons if phase changed (Learning -> Practice -> Speech styling)
                if (phaseChanged) {
                    // Initialize speech recognition when entering speech phase
                    if (phase === 2 && speechSupported && !recognition) {
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
        cycleCompletePending = true;

        // Stop listening during overlay
        if (recognition) {
            stopListening();
            recognition = null; // Reset for new cycle
        }

        cycleCompleteMessage.textContent = `You finished Cycle ${completedCycle}!`;

        // Show new colours if applicable
        const newColors = NEW_COLORS_PER_CYCLE[newCycle];
        if (newColors) {
            cycleCompleteColors.textContent = 'New colours unlocked!';
            newColorBadges.innerHTML = '';
            newColors.forEach(color => {
                const badge = document.createElement('span');
                badge.className = 'color-badge';
                badge.style.backgroundColor = COLOR_CSS[color];
                badge.style.color = (color === 'yellow' || color === 'white') ? '#222' : '#fff';
                badge.textContent = TRANSLATIONS[selectedLanguage][color];
                newColorBadges.appendChild(badge);
            });
        } else {
            cycleCompleteColors.textContent = 'All colours mastered!';
            newColorBadges.innerHTML = '';
        }

        cycleCompleteOverlay.classList.add('active');

        // Longer countdown for cycle complete (5 seconds)
        let count = 5;
        cycleCompleteCountdown.textContent = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                cycleCompleteCountdown.textContent = count;
            } else {
                clearInterval(countdownInterval);
                cycleCompleteOverlay.classList.remove('active');
                cycleCompletePending = false;

                // Update cycle and regenerate with new colours
                currentCycle = newCycle;
                activeColors = getActiveColors(currentCycle);
                saveProgress();
                generateButtons();
                updateLevelDisplay();

                nextRound();
            }
        }, 1000);
    }

    // ========== INITIALIZATION ==========
    updateStartScreenProgress();

    // Initialize audio toggle from saved setting
    audioToggleInput.checked = audioEnabled;
    audioToggleInput.addEventListener('change', function() {
        saveAudioSetting(this.checked);
    });

    // Refresh progress from localStorage to ensure time display is current
    function refreshProgressFromStorage() {
        const freshProgress = getLanguageProgress(selectedLanguage);
        totalCorrectAnswers = freshProgress.totalAnswers;
        currentCycle = freshProgress.currentCycle;
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
            updateStartScreenProgress();
            show(topicScreen);
        });
    });

    // Category selection
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newCategory = btn.dataset.category;
            if (newCategory !== selectedCategory) {
                // Save current category progress, switch, load new
                saveProgress();
                selectedCategory = newCategory;
                const newProgress = getLanguageProgress(selectedLanguage, newCategory);
                totalCorrectAnswers = newProgress.totalAnswers;
                currentCycle = newProgress.currentCycle;
                updateStartScreenProgress();
            }
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    document.getElementById('start-btn').addEventListener('click', startGame);
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

    // ========== GAME FUNCTIONS ==========

    function startGame() {
        activeColors = getActiveColors(currentCycle);
        timeLimit = getTimeLimit(totalCorrectAnswers);
        score = 0;
        totalQuestions = 0;
        responseTimes = [];
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

    function generateButtons() {
        buttonsContainer.innerHTML = '';
        const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
        const phase = getPhase(levelInCycle);
        const items = getCategoryItems();
        const isEmojiMode = selectedCategory !== 'colours';
        const promptText = isEmojiMode ? 'What does this emoji mean?' : 'What colour is this?';
        const speechPrompt = isEmojiMode ? 'Say the word!' : 'Say the colour!';

        // Speech mode: hide buttons and show speech UI
        if (phase === 2) {
            if (speechSupported) {
                buttonsContainer.style.display = 'none';
                speechUI.classList.add('active');
                speechWarning.classList.remove('visible');
                promptLabel.textContent = speechPrompt;
            } else {
                // Fall back to Practice mode if speech not supported
                showSpeechFallback();
            }
        } else {
            buttonsContainer.style.display = 'flex';
            speechUI.classList.remove('active');
            speechWarning.classList.remove('visible');
            promptLabel.textContent = promptText;
        }

        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.dataset.color = item;
            btn.textContent = getCategoryTranslation(item);

            // Apply styling based on current phase and category
            if (phase === 0 && !isEmojiMode) {
                // Learning mode: show colored backgrounds (colours only)
                btn.classList.add('learning-mode');
                btn.style.backgroundColor = COLOR_CSS[item];
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
        // Update time limit based on current level
        timeLimit = getTimeLimit(totalCorrectAnswers);

        // Pick a random item different from current
        const items = getCategoryItems();
        let newColor;
        do {
            newColor = items[Math.floor(Math.random() * items.length)];
        } while (newColor === currentColor && items.length > 1);

        currentColor = newColor;

        // Display: emoji or colour
        const emoji = getCategoryDisplay(currentColor);
        if (emoji) {
            colorDisplay.style.backgroundColor = 'transparent';
            colorDisplay.textContent = emoji;
            colorDisplay.classList.add('emoji-display');
        } else {
            colorDisplay.textContent = '';
            colorDisplay.classList.remove('emoji-display');
            colorDisplay.style.backgroundColor = COLOR_CSS[currentColor];
        }

        // Show reinforcement label in level 1 of learning phase for non-colour categories
        const levelInCycle = getLevelWithinCycle(totalCorrectAnswers);
        if (selectedCategory !== 'colours' && getPhase(levelInCycle) === 0 && getLevelWithinPhase(totalCorrectAnswers) === 1) {
            reinforcementLabel.textContent = getCategoryTranslation(currentColor);
        } else {
            reinforcementLabel.textContent = '';
        }

        // Speak the word if audio is enabled
        speakColor(currentColor, selectedLanguage);

        shuffleButtons();

        // Timer setup
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        timerBar.classList.remove('warning');
        void timerBar.offsetWidth;
        timerBar.style.transition = `width ${timeLimit}ms linear, background 0.3s linear`;
        timerBar.style.width = '0%';

        timerStart = performance.now();
        cancelAnimationFrame(timerRAF);
        clearTimeout(timeout);

        timerRAF = requestAnimationFrame(function tick() {
            const elapsed = performance.now() - timerStart;
            if (elapsed > timeLimit * 0.6) timerBar.classList.add('warning');
            if (elapsed < timeLimit) timerRAF = requestAnimationFrame(tick);
        });

        timeout = setTimeout(() => {
            totalQuestions++;
            endGame();
        }, timeLimit);

        // Start listening in speech mode
        if (isSpeechMode() && speechSupported && recognition) {
            startListening();
        }
    }

    function handleAnswer(chosen) {
        if (!gameScreen.classList.contains('active')) return;
        if (levelUpPending || cycleCompletePending) return;

        clearTimeout(timeout);
        cancelAnimationFrame(timerRAF);
        totalQuestions++;

        if (chosen === currentColor) {
            responseTimes.push(performance.now() - timerStart);
            score++;
            currentScoreEl.textContent = score;

            // Track total correct answers and check for level-up or cycle completion
            const previousAnswers = totalCorrectAnswers;
            totalCorrectAnswers++;
            saveProgress();
            updateLevelDisplay();

            // Check for cycle completion first (takes priority)
            if (checkCycleComplete(previousAnswers, totalCorrectAnswers)) {
                const completedCycle = getCycleFromAnswers(previousAnswers);
                const newCycle = getCycleFromAnswers(totalCorrectAnswers);
                showCycleComplete(completedCycle, newCycle);
            } else if (checkLevelUp(previousAnswers, totalCorrectAnswers)) {
                // Randomize which colors appear on level-up for variety
                randomizeActiveColors();
                generateButtons();
                showLevelUp(getLevelWithinCycle(totalCorrectAnswers), previousAnswers, totalCorrectAnswers);
            } else {
                nextRound();
            }
        } else {
            endGame();
        }
    }

    function endGame() {
        clearTimeout(timeout);
        cancelAnimationFrame(timerRAF);

        // Stop speech recognition
        if (recognition) {
            stopListening();
        }

        const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        const avgTime = responseTimes.length > 0
            ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000).toFixed(1)
            : '0.0';

        // Check for personal best before updating stats
        const isNewBest = isNewPersonalBest(score);
        const previousBest = stats.bestStreak;

        // Update statistics
        updateStatsAfterGame(score, selectedLanguage);

        finalScore.textContent = score;
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

        if (score === 0) {
            const answerWord = getCategoryTranslation(currentColor);
            const answerEmoji = getCategoryDisplay(currentColor);
            endMessage.textContent = answerEmoji
                ? `The answer was ${answerWord} ${answerEmoji} (${currentColor})`
                : `The colour was ${answerWord} (${currentColor})`;
        } else if (score < 5) {
            endMessage.textContent = 'Good start! Keep practising!';
        } else if (score < 10) {
            endMessage.textContent = 'Nice work! You\'re getting the hang of it!';
        } else if (score < 20) {
            endMessage.textContent = 'Excellent! Your vocabulary is growing!';
        } else {
            endMessage.textContent = 'Amazing! You\'re a colour word master!';
        }

        show(endScreen);
    }
