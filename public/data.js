import es from './lang/es.js';
import fr from './lang/fr.js';
import de from './lang/de.js';
import it from './lang/it.js';
import cy from './lang/cy.js';
import pt from './lang/pt.js';
import ja from './lang/ja.js';
import hr from './lang/hr.js';

const LANG_DATA = { es, fr, de, it, cy, pt, ja, hr };

// ========== LEVEL SYSTEM CONSTANTS ==========
export const MASTERY_THRESHOLD = 2;
export const REMOVAL_STREAK = 3;      // consecutive correct answers to remove item from pool
export const LEVELS_PER_PHASE = 5;
export const LEVELS_PER_CYCLE = LEVELS_PER_PHASE * 4; // 20
export const PHASES = ['Learning', 'Practice', 'Typing', 'Speech'];
export const PHASE_CLASSES = ['learning', 'practice', 'typing', 'speech'];
export const MAX_TIME = 10;           // seconds
export const MIN_TIME = 2;            // seconds (floor for time limit)
export const MIN_TIME_TYPING = 4;     // seconds (floor for typing phase — typing needs more time)

// ========== UI / GAMEPLAY CONSTANTS ==========
export const TIMER_WARNING_RATIO = 0.6;       // show warning when 60% of time elapsed
export const LEVEL_UP_COUNTDOWN = 3;           // seconds before auto-continuing after level-up
export const CYCLE_COMPLETE_COUNTDOWN = 5;     // seconds before auto-continuing after cycle complete
export const STARTING_BUTTON_COUNT = 4;        // answer buttons at level 1 of each phase
export const BUTTONS_ADD_INTERVAL = 2;         // add 1 button every N levels
export const MAX_PITCH_SEMITONES = 12;         // max pitch increase for correct answer streak
export const TTS_SPEECH_RATE = 0.85;           // text-to-speech playback rate
export const SPEECH_RESTART_DELAY = 100;       // ms delay before restarting speech recognition
export const SILENT_LEVEL_THRESHOLD = 4;       // learning phase level where audio stops

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
export const NOUN_CATEGORIES = ['animals', 'food', 'weather', 'body', 'clothing', 'home', 'family', 'professions'];
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
    pt: { name: 'Portuguese', flag: '🇵🇹', speechCode: 'pt-PT' },
    ja: { name: 'Japanese',   flag: '🇯🇵', speechCode: 'ja-JP' },
    hr: { name: 'Croatian',   flag: '🇭🇷', speechCode: 'hr-HR' }
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
    weather: { label: 'Weather', icon: '☀️' },
    body: { label: 'Body', icon: '🫀' },
    clothing: { label: 'Clothing', icon: '👕' },
    home: { label: 'Home', icon: '🏠' },
    numbers: { label: 'Numbers', icon: '🔢' },
    family: { label: 'Family', icon: '👨‍👩‍👧' },
    professions: { label: 'Jobs', icon: '💼' },
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
    },
    body: {
        displayType: 'emoji',
        items: ['eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'heart', 'bone', 'brain', 'tooth', 'tongue'],
        display: {
            eye: '👁️', ear: '👂', nose: '👃', mouth: '👄', hand: '✋',
            foot: '🦶', heart: '❤️', bone: '🦴', brain: '🧠', tooth: '🦷', tongue: '👅'
        },
        translations: buildTranslations('body'),
        forms: buildForms('body')
    },
    clothing: {
        displayType: 'emoji',
        items: ['shirt', 'trousers', 'dress', 'shoe', 'hat', 'sock', 'glove', 'scarf', 'jacket', 'tie', 'boot'],
        display: {
            shirt: '👕', trousers: '👖', dress: '👗', shoe: '👟', hat: '🎩',
            sock: '🧦', glove: '🧤', scarf: '🧣', jacket: '🧥', tie: '👔', boot: '👢'
        },
        translations: buildTranslations('clothing'),
        forms: buildForms('clothing')
    },
    home: {
        displayType: 'emoji',
        items: ['chair', 'bed', 'door', 'lamp', 'clock', 'key', 'book', 'cup', 'phone', 'television', 'window'],
        display: {
            chair: '🪑', bed: '🛏️', door: '🚪', lamp: '💡', clock: '🕐',
            key: '🔑', book: '📖', cup: '☕', phone: '📱', television: '📺', window: '🪟'
        },
        translations: buildTranslations('home'),
        forms: buildForms('home')
    },
    numbers: {
        displayType: 'emoji',
        items: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        display: {
            zero: '0️⃣', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣',
            five: '5️⃣', six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟'
        },
        translations: buildTranslations('numbers'),
        forms: buildForms('numbers')
    },
    family: {
        displayType: 'emoji',
        items: ['mother', 'father', 'baby', 'daughter', 'son', 'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin', 'friend'],
        display: {
            mother: '👩', father: '👨', baby: '👶', daughter: '👧', son: '👦',
            grandmother: '👵', grandfather: '👴', aunt: '👩‍🦰', uncle: '🧔', cousin: '🧑', friend: '🤝'
        },
        translations: buildTranslations('family'),
        forms: buildForms('family')
    },
    professions: {
        displayType: 'emoji',
        items: ['doctor', 'teacher', 'chef', 'firefighter', 'police', 'farmer', 'pilot', 'builder', 'singer', 'dancer', 'scientist'],
        display: {
            doctor: '👨‍⚕️', teacher: '👩‍🏫', chef: '👨‍🍳', firefighter: '👨‍🚒', police: '👮',
            farmer: '👨‍🌾', pilot: '👨‍✈️', builder: '👷', singer: '🎤', dancer: '💃', scientist: '🔬'
        },
        translations: buildTranslations('professions'),
        forms: buildForms('professions')
    },
};

// ========== VERB DATA ==========
export const VERB_LIST = ['be', 'have', 'go', 'do', 'want', 'can', 'know', 'eat', 'speak', 'live'];

// Language-specific verb ordering for pedagogical progression.
// One verb is practiced for an entire cycle (all 4 phases) before advancing.
// Spanish: ser first (permanent "to be"), hablar earlier as a core conversational verb.
// Languages not listed use VERB_LIST as the default order.
export const VERB_ORDER = {
    es: ['be', 'have', 'go', 'speak', 'do', 'want', 'can', 'know', 'eat', 'live'],
};
export const PRONOUN_KEYS = ['I', 'you', 'he', 'she', 'we', 'you_pl', 'they'];

export const VERB_ENGLISH = {
    present: {
        be:    { emoji: '🌟', I: 'I am',    you: 'You are',   he: 'He is',      she: 'She is',      we: 'We are',   you_pl: 'You (all) are',   they: 'They are' },
        have:  { emoji: '🤲', I: 'I have',  you: 'You have',  he: 'He has',     she: 'She has',     we: 'We have',  you_pl: 'You (all) have',  they: 'They have' },
        go:    { emoji: '🚶', I: 'I go',    you: 'You go',    he: 'He goes',    she: 'She goes',    we: 'We go',    you_pl: 'You (all) go',    they: 'They go' },
        do:    { emoji: '⚡', I: 'I do',    you: 'You do',    he: 'He does',    she: 'She does',    we: 'We do',    you_pl: 'You (all) do',    they: 'They do' },
        want:  { emoji: '💭', I: 'I want',  you: 'You want',  he: 'He wants',   she: 'She wants',   we: 'We want',  you_pl: 'You (all) want',  they: 'They want' },
        can:   { emoji: '💪', I: 'I can',   you: 'You can',   he: 'He can',     she: 'She can',     we: 'We can',   you_pl: 'You (all) can',   they: 'They can' },
        know:  { emoji: '🧠', I: 'I know',  you: 'You know',  he: 'He knows',   she: 'She knows',   we: 'We know',  you_pl: 'You (all) know',  they: 'They know' },
        eat:   { emoji: '🍴', I: 'I eat',   you: 'You eat',   he: 'He eats',    she: 'She eats',    we: 'We eat',   you_pl: 'You (all) eat',   they: 'They eat' },
        speak: { emoji: '💬', I: 'I speak', you: 'You speak', he: 'He speaks',  she: 'She speaks',  we: 'We speak', you_pl: 'You (all) speak', they: 'They speak' },
        live:  { emoji: '🏠', I: 'I live',  you: 'You live',  he: 'He lives',   she: 'She lives',   we: 'We live',  you_pl: 'You (all) live',  they: 'They live' },
    },
    past: {
        be:    { I: 'I was',      you: 'You were',    he: 'He was',      she: 'She was',      we: 'We were',    you_pl: 'You (all) were',    they: 'They were' },
        have:  { I: 'I had',      you: 'You had',     he: 'He had',      she: 'She had',      we: 'We had',     you_pl: 'You (all) had',     they: 'They had' },
        go:    { I: 'I went',     you: 'You went',    he: 'He went',     she: 'She went',     we: 'We went',    you_pl: 'You (all) went',    they: 'They went' },
        do:    { I: 'I did',      you: 'You did',     he: 'He did',      she: 'She did',      we: 'We did',     you_pl: 'You (all) did',     they: 'They did' },
        want:  { I: 'I wanted',   you: 'You wanted',  he: 'He wanted',   she: 'She wanted',   we: 'We wanted',  you_pl: 'You (all) wanted',  they: 'They wanted' },
        can:   { I: 'I could',    you: 'You could',   he: 'He could',    she: 'She could',    we: 'We could',   you_pl: 'You (all) could',   they: 'They could' },
        know:  { I: 'I knew',     you: 'You knew',    he: 'He knew',     she: 'She knew',     we: 'We knew',    you_pl: 'You (all) knew',    they: 'They knew' },
        eat:   { I: 'I ate',      you: 'You ate',     he: 'He ate',      she: 'She ate',      we: 'We ate',     you_pl: 'You (all) ate',     they: 'They ate' },
        speak: { I: 'I spoke',    you: 'You spoke',   he: 'He spoke',    she: 'She spoke',    we: 'We spoke',   you_pl: 'You (all) spoke',   they: 'They spoke' },
        live:  { I: 'I lived',    you: 'You lived',   he: 'He lived',    she: 'She lived',    we: 'We lived',   you_pl: 'You (all) lived',   they: 'They lived' },
    },
    perfect: {
        be:    { I: 'I have been',    you: 'You have been',    he: 'He has been',    she: 'She has been',    we: 'We have been',    you_pl: 'You (all) have been',    they: 'They have been' },
        have:  { I: 'I have had',     you: 'You have had',     he: 'He has had',     she: 'She has had',     we: 'We have had',     you_pl: 'You (all) have had',     they: 'They have had' },
        go:    { I: 'I have gone',    you: 'You have gone',    he: 'He has gone',    she: 'She has gone',    we: 'We have gone',    you_pl: 'You (all) have gone',    they: 'They have gone' },
        do:    { I: 'I have done',    you: 'You have done',    he: 'He has done',    she: 'She has done',    we: 'We have done',    you_pl: 'You (all) have done',    they: 'They have done' },
        want:  { I: 'I have wanted',  you: 'You have wanted',  he: 'He has wanted',  she: 'She has wanted',  we: 'We have wanted',  you_pl: 'You (all) have wanted',  they: 'They have wanted' },
        can:   { I: 'I have been able', you: 'You have been able', he: 'He has been able', she: 'She has been able', we: 'We have been able', you_pl: 'You (all) have been able', they: 'They have been able' },
        know:  { I: 'I have known',   you: 'You have known',   he: 'He has known',   she: 'She has known',   we: 'We have known',   you_pl: 'You (all) have known',   they: 'They have known' },
        eat:   { I: 'I have eaten',   you: 'You have eaten',   he: 'He has eaten',   she: 'She has eaten',   we: 'We have eaten',   you_pl: 'You (all) have eaten',   they: 'They have eaten' },
        speak: { I: 'I have spoken',  you: 'You have spoken',  he: 'He has spoken',  she: 'She has spoken',  we: 'We have spoken',  you_pl: 'You (all) have spoken',  they: 'They have spoken' },
        live:  { I: 'I have lived',   you: 'You have lived',   he: 'He has lived',   she: 'She has lived',   we: 'We have lived',   you_pl: 'You (all) have lived',   they: 'They have lived' },
    },
    conditional: {
        be:    { I: 'I would be',     you: 'You would be',     he: 'He would be',     she: 'She would be',     we: 'We would be',     you_pl: 'You (all) would be',     they: 'They would be' },
        have:  { I: 'I would have',   you: 'You would have',   he: 'He would have',   she: 'She would have',   we: 'We would have',   you_pl: 'You (all) would have',   they: 'They would have' },
        go:    { I: 'I would go',     you: 'You would go',     he: 'He would go',     she: 'She would go',     we: 'We would go',     you_pl: 'You (all) would go',     they: 'They would go' },
        do:    { I: 'I would do',     you: 'You would do',     he: 'He would do',     she: 'She would do',     we: 'We would do',     you_pl: 'You (all) would do',     they: 'They would do' },
        want:  { I: 'I would want',   you: 'You would want',   he: 'He would want',   she: 'She would want',   we: 'We would want',   you_pl: 'You (all) would want',   they: 'They would want' },
        can:   { I: 'I could',        you: 'You could',        he: 'He could',        she: 'She could',        we: 'We could',        you_pl: 'You (all) could',        they: 'They could' },
        know:  { I: 'I would know',   you: 'You would know',   he: 'He would know',   she: 'She would know',   we: 'We would know',   you_pl: 'You (all) would know',   they: 'They would know' },
        eat:   { I: 'I would eat',    you: 'You would eat',    he: 'He would eat',    she: 'She would eat',    we: 'We would eat',    you_pl: 'You (all) would eat',    they: 'They would eat' },
        speak: { I: 'I would speak',  you: 'You would speak',  he: 'He would speak',  she: 'She would speak',  we: 'We would speak',  you_pl: 'You (all) would speak',  they: 'They would speak' },
        live:  { I: 'I would live',   you: 'You would live',   he: 'He would live',   she: 'She would live',   we: 'We would live',   you_pl: 'You (all) would live',   they: 'They would live' },
    },
};

export const PRONOUN_LABELS = {
    I: 'I', you: 'You', he: 'He', she: 'She', we: 'We', you_pl: 'You (all)', they: 'They'
};

// Emoji icons for pronouns shown in the display area and intro card.
export const PRONOUN_EMOJIS = {
    I: '🙋',
    you: '🫵',
    he: '👨',
    she: '👩',
    we: '👫',
    you_pl: '👥',
    they: '👥',
};

// Tense labels for UI
export const TENSE_LABELS = {
    present:     { label: 'Present',         icon: '🕐' },
    past:        { label: 'Past',            icon: '⏪' },
    perfect:     { label: 'Present Perfect', icon: '✅' },
    conditional: { label: 'Conditional',     icon: '🤔' },
};

// Assemble verb conjugations from language files (nested by tense)
export const VERB_CONJUGATIONS = {};
export const VERB_PRONOUNS = {};
export const VERB_TENSES = {};
const ALL_TENSE_KEYS = ['present', 'past', 'perfect', 'conditional'];
for (const [code, lang] of Object.entries(LANG_DATA)) {
    if (lang.verbs) {
        VERB_CONJUGATIONS[code] = {};
        const tenses = [];
        for (const tense of ALL_TENSE_KEYS) {
            if (lang.verbs[tense]) {
                VERB_CONJUGATIONS[code][tense] = lang.verbs[tense];
                tenses.push(tense);
            }
        }
        VERB_PRONOUNS[code] = lang.verbs.pronouns;
        VERB_TENSES[code] = tenses;
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
