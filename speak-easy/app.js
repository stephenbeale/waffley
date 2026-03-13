// Speak Easy - Core Game Engine
// This module is imported by each language page with a lang code.

import {
    CATEGORIES, CATEGORY_DATA, COLOR_CSS, PHASES, ACCENT_CHARS,
    MASTERY_THRESHOLD, REMOVAL_STREAK, LEVELS_PER_PHASE, LEVELS_PER_CYCLE,
    MAX_TIME, MIN_TIME, MIN_TIME_TYPING, TIMER_WARNING_RATIO,
    STARTING_BUTTON_COUNT, BUTTONS_ADD_INTERVAL, TTS_SPEECH_RATE,
} from './data.js';

// ========== GAME STATE ==========
const game = {
    langCode: null,
    langData: null,
    speechCode: null,

    // Round state
    activeItems: [],
    currentItem: null,
    currentCategory: 'animals',
    roundActive: false,
    score: 0,
    totalQuestions: 0,
    responseTimes: [],

    // Timer
    timerStart: 0,
    timerRAF: 0,
    timeout: 0,
    timeLimit: MAX_TIME * 1000,

    // Progress (persisted per language)
    levelsCompleted: 0,
    totalCorrectAnswers: 0,

    // Mastery
    levelMastery: {},
    sessionStreak: {},
    masteredItems: new Set(),

    // Phase
    get currentPhase() { return Math.floor(this.levelsCompleted / LEVELS_PER_PHASE) % 4; },
    get currentLevel() { return Math.floor(this.levelsCompleted / LEVELS_PER_PHASE) + 1; },
    get levelInPhase() { return (this.levelsCompleted % LEVELS_PER_PHASE) + 1; },
    get currentCycle() { return Math.floor(this.levelsCompleted / LEVELS_PER_CYCLE) + 1; },

    // UI state
    audioEnabled: true,
};

// ========== DOM REFS ==========
let els = {};

// ========== INIT ==========
export function init(langCode, langData, speechCode) {
    game.langCode = langCode;
    game.langData = langData;
    game.speechCode = speechCode;
    game.audioEnabled = localStorage.getItem('speakeasy_audio') !== 'off';

    loadProgress();
    cacheDom();
    bindEvents();
    renderCategories();
    renderJourney();
    updateStartButton();
}

function cacheDom() {
    els = {
        // Topic screen
        categoryGrid: document.getElementById('category-grid'),
        journeyPhases: document.querySelectorAll('.journey-phase'),
        journeyStats: {
            cycle: document.getElementById('journey-cycle'),
            answers: document.getElementById('journey-answers'),
            time: document.getElementById('journey-time'),
        },
        startBtn: document.getElementById('start-btn'),
        topicScreen: document.getElementById('topic-screen'),

        // Game screen
        gameScreen: document.getElementById('game-screen'),
        pauseBtn: document.getElementById('pause-btn'),
        quitBtn: document.getElementById('quit-btn'),
        phaseBadge: document.getElementById('phase-badge'),
        levelDisplay: document.getElementById('level-display'),
        timeDisplay: document.getElementById('time-display'),
        scoreDisplay: document.getElementById('score-display'),
        promptLabel: document.getElementById('prompt-label'),
        promptDisplay: document.getElementById('prompt-display'),
        reinforcementLabel: document.getElementById('reinforcement-label'),
        timerBar: document.getElementById('timer-bar'),
        answersContainer: document.getElementById('answers-container'),

        // Typing
        typingUI: document.getElementById('typing-ui'),
        typingInput: document.getElementById('typing-input'),
        accentRow: document.getElementById('accent-row'),
        typingFeedback: document.getElementById('typing-feedback'),

        // Speech
        speechUI: document.getElementById('speech-ui'),
        voiceFeedback: document.getElementById('voice-feedback'),
        speechAttempts: document.getElementById('speech-attempts'),

        // Overlays
        pauseOverlay: document.getElementById('pause-overlay'),
        levelUpOverlay: document.getElementById('level-up-overlay'),
        levelUpMessage: document.getElementById('level-up-message'),
        levelUpCountdown: document.getElementById('level-up-countdown'),

        // End screen
        endScreen: document.getElementById('end-screen'),
        finalScore: document.getElementById('final-score'),
        accuracyStat: document.getElementById('accuracy-stat'),
        avgTimeStat: document.getElementById('avg-time-stat'),
        continueBtn: document.getElementById('continue-btn'),

        // Resume / quit from pause
        resumeBtn: document.getElementById('resume-btn'),
        quitFromPauseBtn: document.getElementById('quit-from-pause-btn'),
    };
}

function bindEvents() {
    els.startBtn.addEventListener('click', startGame);
    els.pauseBtn.addEventListener('click', pauseGame);
    els.quitBtn.addEventListener('click', endGame);
    els.resumeBtn.addEventListener('click', resumeGame);
    els.quitFromPauseBtn.addEventListener('click', () => { showScreen('topic'); });
    els.continueBtn.addEventListener('click', () => { showScreen('topic'); });

    // Category selection
    els.categoryGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;
        els.categoryGrid.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        game.currentCategory = btn.dataset.category;
        renderJourney();
        updateStartButton();
    });

    // Typing input
    if (els.typingInput) {
        els.typingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleTypingSubmit();
        });
    }
}

// ========== SCREENS ==========
function showScreen(name) {
    els.topicScreen.classList.remove('active');
    els.gameScreen.classList.remove('active');
    els.endScreen.classList.remove('active');
    els.pauseOverlay.classList.remove('active');
    els.levelUpOverlay.classList.remove('active');

    if (name === 'topic') {
        els.topicScreen.classList.add('active');
        renderJourney();
        updateStartButton();
    } else if (name === 'game') {
        els.gameScreen.classList.add('active');
    } else if (name === 'end') {
        els.endScreen.classList.add('active');
    }
}

// ========== CATEGORIES ==========
function renderCategories() {
    els.categoryGrid.innerHTML = '';
    for (const [key, cat] of Object.entries(CATEGORIES)) {
        const btn = document.createElement('button');
        btn.className = 'category-btn' + (key === game.currentCategory ? ' selected' : '');
        btn.dataset.category = key;
        btn.innerHTML = `<span class="category-btn-icon">${cat.icon}</span><span class="category-btn-label">${cat.label}</span>`;
        els.categoryGrid.appendChild(btn);
    }
}

// ========== JOURNEY ==========
function renderJourney() {
    const catProgress = getProgress(game.currentCategory);
    const phase = Math.floor(catProgress / LEVELS_PER_PHASE) % 4;

    els.journeyPhases.forEach((el, i) => {
        el.classList.remove('current', 'completed');
        if (i < phase) el.classList.add('completed');
        if (i === phase) el.classList.add('current');
    });

    const cycle = Math.floor(catProgress / LEVELS_PER_CYCLE) + 1;
    const timeLimit = calcTimeLimit(catProgress);
    els.journeyStats.cycle.textContent = cycle;
    els.journeyStats.answers.textContent = getCatTotalCorrect(game.currentCategory);
    els.journeyStats.time.textContent = timeLimit;
}

function updateStartButton() {
    const phase = PHASES[game.currentPhase];
    els.startBtn.textContent = `Start ${phase}`;
}

// ========== PROGRESS ==========
function getStorageKey() {
    return `speakeasy_${game.langCode}`;
}

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
        game.levelsCompleted = saved.levelsCompleted || 0;
        game.totalCorrectAnswers = saved.totalCorrectAnswers || 0;
        game.categoryProgress = saved.categoryProgress || {};
    } catch {
        game.levelsCompleted = 0;
        game.totalCorrectAnswers = 0;
        game.categoryProgress = {};
    }
}

function saveProgress() {
    localStorage.setItem(getStorageKey(), JSON.stringify({
        levelsCompleted: game.levelsCompleted,
        totalCorrectAnswers: game.totalCorrectAnswers,
        categoryProgress: game.categoryProgress,
    }));
}

function getProgress(category) {
    return game.categoryProgress[category] || 0;
}

function setProgress(category, val) {
    game.categoryProgress[category] = val;
}

function getCatTotalCorrect(category) {
    return game.categoryProgress[`${category}_correct`] || 0;
}

function addCatCorrect(category) {
    game.categoryProgress[`${category}_correct`] = (game.categoryProgress[`${category}_correct`] || 0) + 1;
}

// ========== TIME LIMIT ==========
function calcTimeLimit(levelsCompleted) {
    const levelInPhase = (levelsCompleted % LEVELS_PER_PHASE) + 1;
    const phase = Math.floor(levelsCompleted / LEVELS_PER_PHASE) % 4;
    const minTime = phase === 2 ? MIN_TIME_TYPING : MIN_TIME;
    return Math.max(minTime, MAX_TIME - (levelInPhase - 1) * 2);
}

// ========== BUTTON COUNT ==========
function getButtonCount() {
    return Math.min(
        STARTING_BUTTON_COUNT + Math.floor((game.currentLevel - 1) / BUTTONS_ADD_INTERVAL),
        game.activeItems.length
    );
}

// ========== START GAME ==========
function startGame() {
    const catData = CATEGORY_DATA[game.currentCategory];
    const catProgress = getProgress(game.currentCategory);
    game.levelsCompleted = catProgress;
    game.timeLimit = calcTimeLimit(catProgress) * 1000;
    game.score = 0;
    game.totalQuestions = 0;
    game.responseTimes = [];
    game.levelMastery = {};
    game.sessionStreak = {};
    game.masteredItems = new Set();

    // Shuffle items
    game.activeItems = shuffle([...catData.items]);

    showScreen('game');
    renderGameUI();
    nextRound();
}

// ========== RENDER GAME UI ==========
function renderGameUI() {
    const phase = game.currentPhase;
    els.phaseBadge.textContent = PHASES[phase];
    els.levelDisplay.textContent = `Level ${game.levelInPhase}`;
    els.timeDisplay.textContent = `${game.timeLimit / 1000}s`;
    els.scoreDisplay.textContent = game.score;

    // Show/hide typing and speech UIs
    els.answersContainer.classList.toggle('hidden', phase === 2 || phase === 3);
    els.typingUI.classList.toggle('active', phase === 2);
    els.speechUI.classList.toggle('active', phase === 3);

    // Accent buttons for typing
    if (phase === 2) {
        renderAccentButtons();
    }
}

function renderAccentButtons() {
    els.accentRow.innerHTML = '';
    const chars = ACCENT_CHARS[game.langCode] || [];
    for (const ch of chars) {
        const btn = document.createElement('button');
        btn.className = 'accent-btn';
        btn.textContent = ch;
        btn.type = 'button';
        btn.addEventListener('click', () => insertAccent(ch));
        els.accentRow.appendChild(btn);
    }
}

function insertAccent(ch) {
    const input = els.typingInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.slice(0, start) + ch + val.slice(end);
    input.selectionStart = input.selectionEnd = start + ch.length;
    input.focus();
}

// ========== NEXT ROUND ==========
function nextRound() {
    if (!els.gameScreen.classList.contains('active')) return;

    // Pick item from pool (exclude mastered)
    const pool = game.activeItems.filter(i => !game.masteredItems.has(i));
    if (pool.length === 0) {
        // All mastered — reset
        game.masteredItems.clear();
        nextRound();
        return;
    }

    // Avoid repeating the same item
    let item;
    if (pool.length > 1) {
        do { item = pool[Math.floor(Math.random() * pool.length)]; }
        while (item === game.currentItem);
    } else {
        item = pool[0];
    }

    game.currentItem = item;
    game.roundActive = true;
    game.totalQuestions++;

    renderPrompt();
    renderAnswers();
    startTimer();

    // TTS in learning phase
    if (game.currentPhase === 0 && game.audioEnabled) {
        speak(getTranslation(item));
    }

    // Focus input for typing phase
    if (game.currentPhase === 2) {
        els.typingInput.value = '';
        els.typingFeedback.textContent = '';
        els.typingFeedback.className = 'typing-feedback';
        setTimeout(() => els.typingInput.focus(), 100);
    }
}

// ========== PROMPT ==========
function renderPrompt() {
    const catData = CATEGORY_DATA[game.currentCategory];
    const item = game.currentItem;

    if (catData.displayType === 'color') {
        els.promptDisplay.className = 'prompt-display color-mode';
        els.promptDisplay.style.backgroundColor = COLOR_CSS[item];
        els.promptDisplay.textContent = '';
        els.promptLabel.textContent = 'What colour is this?';
    } else {
        els.promptDisplay.className = 'prompt-display';
        els.promptDisplay.style.backgroundColor = '';
        els.promptDisplay.textContent = catData.display[item];
        els.promptLabel.textContent = 'What is this?';
    }

    // Show reinforcement label in learning phase
    if (game.currentPhase === 0) {
        els.reinforcementLabel.textContent = getTranslation(item);
    } else {
        els.reinforcementLabel.textContent = '';
    }
}

// ========== ANSWERS ==========
function renderAnswers() {
    els.answersContainer.innerHTML = '';
    const count = getButtonCount();
    const catData = CATEGORY_DATA[game.currentCategory];

    // Build answer set: correct + random distractors
    const answers = [game.currentItem];
    const others = game.activeItems.filter(i => i !== game.currentItem);
    const shuffledOthers = shuffle([...others]);
    for (let i = 0; i < count - 1 && i < shuffledOthers.length; i++) {
        answers.push(shuffledOthers[i]);
    }
    const shuffledAnswers = shuffle(answers);

    for (const item of shuffledAnswers) {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dataset.item = item;
        btn.textContent = getTranslation(item);
        btn.addEventListener('click', () => handleAnswer(item));
        els.answersContainer.appendChild(btn);
    }
}

// ========== TRANSLATION ==========
function getTranslation(item) {
    const cat = game.currentCategory;
    const langData = game.langData;

    if (cat === 'colours') {
        return langData.colours[item] || item;
    }
    return (langData[cat] && langData[cat][item]) || item;
}

// ========== TIMER ==========
function startTimer() {
    game.timerStart = performance.now();
    els.timerBar.style.width = '100%';
    els.timerBar.classList.remove('warning');

    cancelAnimationFrame(game.timerRAF);
    clearTimeout(game.timeout);

    const tick = () => {
        if (!game.roundActive) return;
        const elapsed = performance.now() - game.timerStart;
        const remaining = Math.max(0, 1 - elapsed / game.timeLimit);
        els.timerBar.style.width = (remaining * 100) + '%';

        if (remaining < (1 - TIMER_WARNING_RATIO)) {
            els.timerBar.classList.add('warning');
        }

        if (remaining > 0) {
            game.timerRAF = requestAnimationFrame(tick);
        }
    };
    game.timerRAF = requestAnimationFrame(tick);

    game.timeout = setTimeout(() => {
        if (game.roundActive) handleAnswer(null);
    }, game.timeLimit);
}

function stopTimer() {
    cancelAnimationFrame(game.timerRAF);
    clearTimeout(game.timeout);
}

// ========== HANDLE ANSWER ==========
function handleAnswer(chosen) {
    if (!game.roundActive) return;
    game.roundActive = false;
    stopTimer();

    const elapsed = performance.now() - game.timerStart;
    game.responseTimes.push(elapsed);

    const correct = chosen === game.currentItem;

    if (correct) {
        game.score++;
        game.totalCorrectAnswers++;
        addCatCorrect(game.currentCategory);

        // Mastery tracking
        game.levelMastery[game.currentItem] = (game.levelMastery[game.currentItem] || 0) + 1;
        game.sessionStreak[game.currentItem] = (game.sessionStreak[game.currentItem] || 0) + 1;

        // Remove from pool after consecutive correct
        if (game.sessionStreak[game.currentItem] >= REMOVAL_STREAK) {
            game.masteredItems.add(game.currentItem);
        }

        // Play correct sound
        playCorrectSound();
    } else {
        game.sessionStreak[game.currentItem] = 0;
    }

    // Highlight buttons
    highlightButtons(chosen, correct);

    // Update score
    els.scoreDisplay.textContent = game.score;

    // Check level mastery
    setTimeout(() => {
        if (checkLevelMastery()) {
            levelUp();
        } else {
            nextRound();
        }
    }, correct ? 400 : 1000);
}

function highlightButtons(chosen, correct) {
    const buttons = els.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        if (btn.dataset.item === game.currentItem) {
            btn.classList.add('correct');
        } else if (btn.dataset.item === chosen && !correct) {
            btn.classList.add('wrong');
        }
    });
}

// ========== TYPING ==========
function handleTypingSubmit() {
    if (!game.roundActive) return;
    const typed = els.typingInput.value.trim();
    if (!typed) return;

    const expected = getTranslation(game.currentItem);
    const isCorrect = normalize(typed) === normalize(expected);

    if (isCorrect) {
        els.typingFeedback.textContent = 'Correct!';
        els.typingFeedback.className = 'typing-feedback correct';
    } else {
        els.typingFeedback.textContent = `Expected: ${expected}`;
        els.typingFeedback.className = 'typing-feedback wrong';
    }

    handleAnswer(isCorrect ? game.currentItem : null);
}

function normalize(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

// ========== SPEECH ==========
let recognition = null;

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return false;

    recognition = new SpeechRecognition();
    recognition.lang = game.speechCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
        const spoken = e.results[0][0].transcript;
        const expected = getTranslation(game.currentItem);
        const isCorrect = normalize(spoken) === normalize(expected);

        els.voiceFeedback.textContent = spoken;
        handleAnswer(isCorrect ? game.currentItem : null);
    };

    recognition.onerror = () => {
        els.voiceFeedback.textContent = 'Could not hear you, try again';
    };

    return true;
}

// ========== LEVEL MASTERY ==========
function checkLevelMastery() {
    const catData = CATEGORY_DATA[game.currentCategory];
    return catData.items.every(item => (game.levelMastery[item] || 0) >= MASTERY_THRESHOLD);
}

function levelUp() {
    const catProgress = getProgress(game.currentCategory) + 1;
    setProgress(game.currentCategory, catProgress);
    game.levelsCompleted = catProgress;
    saveProgress();

    // Reset mastery for next level
    game.levelMastery = {};
    game.masteredItems.clear();

    // Update time limit
    game.timeLimit = calcTimeLimit(catProgress) * 1000;

    // Check if cycle complete (20 levels)
    if (catProgress % LEVELS_PER_CYCLE === 0) {
        showEndScreen();
        return;
    }

    // Show level up overlay
    showLevelUp();
}

function showLevelUp() {
    const phase = game.currentPhase;
    els.levelUpMessage.textContent = `Level ${game.levelInPhase} - ${PHASES[phase]}`;
    els.levelUpOverlay.classList.add('active');

    let count = 3;
    els.levelUpCountdown.textContent = count;
    const interval = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(interval);
            els.levelUpOverlay.classList.remove('active');
            renderGameUI();
            game.activeItems = shuffle([...CATEGORY_DATA[game.currentCategory].items]);
            nextRound();
        } else {
            els.levelUpCountdown.textContent = count;
        }
    }, 1000);
}

// ========== END GAME / SCREEN ==========
function endGame() {
    game.roundActive = false;
    stopTimer();
    saveProgress();
    showEndScreen();
}

function showEndScreen() {
    showScreen('end');
    els.finalScore.textContent = game.score;

    const accuracy = game.totalQuestions > 0
        ? Math.round((game.score / game.totalQuestions) * 100)
        : 0;
    els.accuracyStat.textContent = accuracy + '%';

    const avgTime = game.responseTimes.length > 0
        ? (game.responseTimes.reduce((a, b) => a + b, 0) / game.responseTimes.length / 1000).toFixed(1)
        : '0.0';
    els.avgTimeStat.textContent = avgTime + 's';
}

// ========== PAUSE ==========
function pauseGame() {
    game.roundActive = false;
    stopTimer();
    els.pauseOverlay.classList.add('active');
}

function resumeGame() {
    els.pauseOverlay.classList.remove('active');
    game.roundActive = true;
    startTimer();
}

// ========== TTS ==========
function speak(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = game.speechCode;
    utterance.rate = TTS_SPEECH_RATE;
    window.speechSynthesis.speak(utterance);
}

// ========== SOUND ==========
function playCorrectSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 523.25; // C5
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch {
        // Audio not available
    }
}

// ========== UTILITY ==========
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
