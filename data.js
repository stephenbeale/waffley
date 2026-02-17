import es from './lang/es.js';
import fr from './lang/fr.js';
import de from './lang/de.js';
import it from './lang/it.js';
import cy from './lang/cy.js';
import pt from './lang/pt.js';

const LANG_DATA = { es, fr, de, it, cy, pt };

// ========== LEVEL SYSTEM CONSTANTS ==========
export const MASTERY_THRESHOLD = 2;
export const REMOVAL_STREAK = 3;      // consecutive correct answers to remove item from pool
export const LEVELS_PER_PHASE = 10;
export const LEVELS_PER_CYCLE = LEVELS_PER_PHASE * 4; // 40
export const PHASES = ['Learning', 'Practice', 'Typing', 'Speech'];
export const PHASE_CLASSES = ['learning', 'practice', 'typing', 'speech'];
export const MAX_TIME = 10;           // seconds
export const MIN_TIME = 2;            // seconds (floor for time limit)

// ========== UI / GAMEPLAY CONSTANTS ==========
export const TIMER_WARNING_RATIO = 0.6;       // show warning when 60% of time elapsed
export const LEVEL_UP_COUNTDOWN = 3;           // seconds before auto-continuing after level-up
export const CYCLE_COMPLETE_COUNTDOWN = 5;     // seconds before auto-continuing after cycle complete
export const STARTING_BUTTON_COUNT = 4;        // answer buttons at level 1 of each phase
export const BUTTONS_ADD_INTERVAL = 2;         // add 1 button every N levels
export const MAX_PITCH_SEMITONES = 12;         // max pitch increase for correct answer streak
export const TTS_SPEECH_RATE = 0.85;           // text-to-speech playback rate
export const SPEECH_RESTART_DELAY = 100;       // ms delay before restarting speech recognition
export const SILENT_LEVEL_THRESHOLD = 9;       // learning phase level where audio stops

// Colour pools by cycle - 2 new colours added each cycle
export const CYCLE_COLORS = {
    1: ['red', 'green', 'blue', 'yellow', 'orange'],
    2: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple'],
    3: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey'],
    4: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'black', 'white']
};
// Full pool of colours to randomly select from each level
export const ALL_COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey'];
export const MAX_CYCLE_WITH_NEW_COLORS = 4;
export const NEW_COLORS_PER_CYCLE = {
    2: ['pink', 'purple'],
    3: ['brown', 'grey'],
    4: ['black', 'white']
};

// Noun categories that support articles and plurals
export const NOUN_CATEGORIES = ['animals', 'food', 'weather'];
// Adjective category supports feminine forms
export const ADJECTIVE_CATEGORY = 'adjectives';
export const ARTICLE_CYCLE = 2;
export const PLURAL_CYCLE = 3;
export const FEMININE_CYCLE = 2;

// ========== LANGUAGE DEFINITIONS ==========
export const LANGUAGES = {
    es: { name: 'Spanish', flag: '🇪🇸', speechCode: 'es-ES' },
    fr: { name: 'French',  flag: '🇫🇷', speechCode: 'fr-FR' },
    de: { name: 'German',  flag: '🇩🇪', speechCode: 'de-DE' },
    it: { name: 'Italian', flag: '🇮🇹', speechCode: 'it-IT' },
    cy: { name: 'Welsh',   flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', speechCode: 'cy-GB' },
    pt: { name: 'Portuguese', flag: '🇵🇹', speechCode: 'pt-PT' }
};

export const LANGUAGE_NAMES = Object.fromEntries(Object.entries(LANGUAGES).map(([k, v]) => [k, v.name]));
export const LANGUAGE_FLAGS = Object.fromEntries(Object.entries(LANGUAGES).map(([k, v]) => [k, v.flag]));

// ========== COLOUR DATA (assembled from language files) ==========
export const TRANSLATIONS = Object.fromEntries(
    Object.entries(LANG_DATA).map(([code, lang]) => [code, lang.colours])
);

export const COLOR_CSS = {
    red: '#dc3545', green: '#28a745', blue: '#007bff', yellow: '#ffc107',
    orange: '#fd7e14', pink: '#e83e8c', purple: '#6f42c1', brown: '#795548',
    grey: '#6c757d', black: '#212529', white: '#f8f9fa'
};

// ========== CATEGORIES ==========
export const CATEGORIES = {
    colours: { label: 'Colours', icon: '🎨' },
    adjectives: { label: 'Adjectives', icon: '😊' },
    animals: { label: 'Animals', icon: '🐾' },
    food: { label: 'Food', icon: '🍎' },
    weather: { label: 'Weather', icon: '☀️' }
};

// Helper: build translations object for a category from all language files
function buildTranslations(category) {
    return Object.fromEntries(
        Object.entries(LANG_DATA).map(([code, lang]) => [code, lang[category].translations])
    );
}

// Helper: build forms object for a category from all language files
function buildForms(category) {
    const forms = {};
    for (const [code, lang] of Object.entries(LANG_DATA)) {
        if (lang[category].forms) {
            forms[code] = lang[category].forms;
        }
    }
    return Object.keys(forms).length > 0 ? forms : undefined;
}

export const CATEGORY_DATA = {
    colours: {
        displayType: 'color',
        items: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'black', 'white'],
        display: COLOR_CSS,
        translations: TRANSLATIONS
    },
    adjectives: {
        displayType: 'emoji',
        items: ['happy', 'sad', 'angry', 'tired', 'surprised', 'scared', 'excited', 'bored', 'cold', 'sick', 'strong'],
        display: {
            happy: '😊', sad: '😢', angry: '😠', tired: '😴',
            surprised: '😮', scared: '😨', excited: '🤩', bored: '😑', cold: '🥶',
            sick: '🤒', strong: '💪'
        },
        translations: buildTranslations('adjectives'),
        forms: buildForms('adjectives')
    },
    animals: {
        displayType: 'emoji',
        items: ['dog', 'cat', 'elephant', 'bird', 'fish', 'horse', 'rabbit', 'bear', 'monkey', 'cow', 'pig'],
        display: {
            dog: '🐕', cat: '🐈', elephant: '🐘', bird: '🐦',
            fish: '🐟', horse: '🐴', rabbit: '🐇', bear: '🐻', monkey: '🐒',
            cow: '🐄', pig: '🐷'
        },
        translations: buildTranslations('animals'),
        forms: buildForms('animals')
    },
    food: {
        displayType: 'emoji',
        items: ['apple', 'pizza', 'bread', 'cheese', 'egg', 'cake', 'grape', 'banana', 'rice', 'tomato', 'carrot'],
        display: {
            apple: '🍎', pizza: '🍕', bread: '🍞', cheese: '🧀',
            egg: '🥚', cake: '🎂', grape: '🍇', banana: '🍌', rice: '🍚',
            tomato: '🍅', carrot: '🥕'
        },
        translations: buildTranslations('food'),
        forms: buildForms('food')
    },
    weather: {
        displayType: 'emoji',
        items: ['sunny', 'rainy', 'snowy', 'windy', 'cloudy', 'stormy', 'hot', 'foggy', 'rainbow', 'lightning', 'tornado'],
        display: {
            sunny: '☀️', rainy: '🌧️', snowy: '❄️', windy: '💨',
            cloudy: '☁️', stormy: '⛈️', hot: '🔥', foggy: '🌫️', rainbow: '🌈',
            lightning: '⚡', tornado: '🌪️'
        },
        translations: buildTranslations('weather'),
        forms: buildForms('weather')
    }
};

// ========== VERB DATA ==========
export const VERB_LIST = ['be', 'have', 'go', 'do', 'want', 'can', 'know', 'eat', 'speak', 'live'];
export const PRONOUN_KEYS = ['I', 'you', 'he', 'we', 'you_pl', 'they'];

export const VERB_ENGLISH = {
    be:    { emoji: '🌟', I: 'I am',    you: 'You are',   he: 'He/She is',    we: 'We are',   you_pl: 'You are',   they: 'They are' },
    have:  { emoji: '🤲', I: 'I have',  you: 'You have',  he: 'He/She has',   we: 'We have',  you_pl: 'You have',  they: 'They have' },
    go:    { emoji: '🚶', I: 'I go',    you: 'You go',    he: 'He/She goes',  we: 'We go',    you_pl: 'You go',    they: 'They go' },
    do:    { emoji: '⚡', I: 'I do',    you: 'You do',    he: 'He/She does',  we: 'We do',    you_pl: 'You do',    they: 'They do' },
    want:  { emoji: '💭', I: 'I want',  you: 'You want',  he: 'He/She wants', we: 'We want',  you_pl: 'You want',  they: 'They want' },
    can:   { emoji: '💪', I: 'I can',   you: 'You can',   he: 'He/She can',   we: 'We can',   you_pl: 'You can',   they: 'They can' },
    know:  { emoji: '🧠', I: 'I know',  you: 'You know',  he: 'He/She knows', we: 'We know',  you_pl: 'You know',  they: 'They know' },
    eat:   { emoji: '🍴', I: 'I eat',   you: 'You eat',   he: 'He/She eats',  we: 'We eat',   you_pl: 'You eat',   they: 'They eat' },
    speak: { emoji: '💬', I: 'I speak', you: 'You speak', he: 'He/She speaks', we: 'We speak', you_pl: 'You speak', they: 'They speak' },
    live:  { emoji: '🏠', I: 'I live',  you: 'You live',  he: 'He/She lives', we: 'We live',  you_pl: 'You live',  they: 'They live' },
};

export const PRONOUN_LABELS = {
    I: 'I', you: 'You', he: 'He/She', we: 'We', you_pl: 'You (pl)', they: 'They'
};

// Assemble verb conjugations from language files
export const VERB_CONJUGATIONS = {};
export const VERB_PRONOUNS = {};
for (const [code, lang] of Object.entries(LANG_DATA)) {
    if (lang.verbs) {
        VERB_CONJUGATIONS[code] = lang.verbs.present;
        VERB_PRONOUNS[code] = lang.verbs.pronouns;
    }
}

// Languages that support verbs
export const VERB_LANGUAGES = Object.keys(VERB_CONJUGATIONS);

// ========== SPEECH RECOGNITION ==========
export const SPEECH_LANG_CODES = Object.fromEntries(Object.entries(LANGUAGES).map(([k, v]) => [k, v.speechCode]));

// Aliases assembled from language files
export const COLOR_ALIASES = Object.fromEntries(
    Object.entries(LANG_DATA).map(([code, lang]) => [code, lang.aliases])
);
