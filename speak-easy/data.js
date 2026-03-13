// Speak Easy - Shared data layer

// ========== LEVEL SYSTEM CONSTANTS ==========
export const MASTERY_THRESHOLD = 2;
export const REMOVAL_STREAK = 3;
export const LEVELS_PER_PHASE = 5;
export const LEVELS_PER_CYCLE = LEVELS_PER_PHASE * 4; // 20
export const PHASES = ['Learning', 'Practice', 'Typing', 'Speech'];
export const MAX_TIME = 10;
export const MIN_TIME = 2;
export const MIN_TIME_TYPING = 4;
export const TIMER_WARNING_RATIO = 0.6;
export const STARTING_BUTTON_COUNT = 4;
export const BUTTONS_ADD_INTERVAL = 2;
export const TTS_SPEECH_RATE = 0.85;

// ========== LANGUAGE DEFINITIONS ==========
export const LANGUAGES = {
    es: { name: 'Spanish', flag: '🇪🇸', native: 'Español', speechCode: 'es-ES', page: 'spanish.html' },
    fr: { name: 'French',  flag: '🇫🇷', native: 'Français', speechCode: 'fr-FR', page: 'french.html' },
    de: { name: 'German',  flag: '🇩🇪', native: 'Deutsch', speechCode: 'de-DE', page: 'german.html' },
    it: { name: 'Italian', flag: '🇮🇹', native: 'Italiano', speechCode: 'it-IT', page: 'italian.html' },
    cy: { name: 'Welsh',   flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', native: 'Cymraeg', speechCode: 'cy-GB', page: 'welsh.html' },
    pt: { name: 'Portuguese', flag: '🇵🇹', native: 'Português', speechCode: 'pt-PT', page: 'portuguese.html' },
};

// ========== COLOUR CSS ==========
export const COLOR_CSS = {
    red: '#dc3545', green: '#28a745', blue: '#007bff', yellow: '#ffc107',
    orange: '#fd7e14', pink: '#e83e8c', purple: '#6f42c1', brown: '#795548',
    grey: '#6c757d', black: '#212529', white: '#f8f9fa'
};

// ========== CATEGORIES ==========
export const CATEGORIES = {
    colours:     { label: 'Colours',    icon: '🎨' },
    animals:     { label: 'Animals',    icon: '🐾' },
    food:        { label: 'Food',       icon: '🍎' },
    numbers:     { label: 'Numbers',    icon: '🔢' },
    family:      { label: 'Family',     icon: '👨‍👩‍👧' },
    body:        { label: 'Body',       icon: '🫀' },
    clothing:    { label: 'Clothing',   icon: '👕' },
    home:        { label: 'Home',       icon: '🏠' },
    weather:     { label: 'Weather',    icon: '☀️' },
    adjectives:  { label: 'Feelings',   icon: '😊' },
    professions: { label: 'Jobs',       icon: '💼' },
};

// ========== CATEGORY DISPLAY DATA ==========
export const CATEGORY_DATA = {
    colours: {
        displayType: 'color',
        items: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'black', 'white'],
        display: COLOR_CSS,
    },
    adjectives: {
        displayType: 'emoji',
        items: ['happy', 'sad', 'angry', 'tired', 'surprised', 'scared', 'excited', 'bored', 'cold', 'sick', 'strong'],
        display: {
            happy: '😊', sad: '😢', angry: '😠', tired: '😴',
            surprised: '😮', scared: '😨', excited: '🤩', bored: '😑', cold: '🥶',
            sick: '🤒', strong: '💪'
        },
    },
    animals: {
        displayType: 'emoji',
        items: ['dog', 'cat', 'elephant', 'bird', 'fish', 'horse', 'rabbit', 'bear', 'monkey', 'cow', 'pig'],
        display: {
            dog: '🐕', cat: '🐈', elephant: '🐘', bird: '🐦',
            fish: '🐟', horse: '🐴', rabbit: '🐇', bear: '🐻', monkey: '🐒',
            cow: '🐄', pig: '🐷'
        },
    },
    food: {
        displayType: 'emoji',
        items: ['apple', 'pizza', 'bread', 'cheese', 'egg', 'cake', 'grape', 'banana', 'rice', 'tomato', 'carrot'],
        display: {
            apple: '🍎', pizza: '🍕', bread: '🍞', cheese: '🧀',
            egg: '🥚', cake: '🎂', grape: '🍇', banana: '🍌', rice: '🍚',
            tomato: '🍅', carrot: '🥕'
        },
    },
    weather: {
        displayType: 'emoji',
        items: ['sunny', 'rainy', 'snowy', 'windy', 'cloudy', 'stormy', 'hot', 'foggy', 'rainbow', 'lightning', 'tornado'],
        display: {
            sunny: '☀️', rainy: '🌧️', snowy: '❄️', windy: '💨',
            cloudy: '☁️', stormy: '⛈️', hot: '🔥', foggy: '🌫️', rainbow: '🌈',
            lightning: '⚡', tornado: '🌪️'
        },
    },
    body: {
        displayType: 'emoji',
        items: ['eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'heart', 'bone', 'brain', 'tooth', 'tongue'],
        display: {
            eye: '👁️', ear: '👂', nose: '👃', mouth: '👄', hand: '✋',
            foot: '🦶', heart: '❤️', bone: '🦴', brain: '🧠', tooth: '🦷', tongue: '👅'
        },
    },
    clothing: {
        displayType: 'emoji',
        items: ['shirt', 'trousers', 'dress', 'shoe', 'hat', 'sock', 'glove', 'scarf', 'jacket', 'tie', 'boot'],
        display: {
            shirt: '👕', trousers: '👖', dress: '👗', shoe: '👟', hat: '🎩',
            sock: '🧦', glove: '🧤', scarf: '🧣', jacket: '🧥', tie: '👔', boot: '👢'
        },
    },
    home: {
        displayType: 'emoji',
        items: ['chair', 'bed', 'door', 'lamp', 'clock', 'key', 'book', 'cup', 'phone', 'television', 'window'],
        display: {
            chair: '🪑', bed: '🛏️', door: '🚪', lamp: '💡', clock: '🕐',
            key: '🔑', book: '📖', cup: '☕', phone: '📱', television: '📺', window: '🪟'
        },
    },
    numbers: {
        displayType: 'emoji',
        items: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        display: {
            zero: '0️⃣', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣',
            five: '5️⃣', six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟'
        },
    },
    family: {
        displayType: 'emoji',
        items: ['mother', 'father', 'baby', 'daughter', 'son', 'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin', 'friend'],
        display: {
            mother: '👩', father: '👨', baby: '👶', daughter: '👧', son: '👦',
            grandmother: '👵', grandfather: '👴', aunt: '👩‍🦰', uncle: '🧔', cousin: '🧑', friend: '🤝'
        },
    },
    professions: {
        displayType: 'emoji',
        items: ['doctor', 'teacher', 'chef', 'firefighter', 'police', 'farmer', 'pilot', 'builder', 'singer', 'dancer', 'scientist'],
        display: {
            doctor: '👨‍⚕️', teacher: '👩‍🏫', chef: '👨‍🍳', firefighter: '👨‍🚒', police: '👮',
            farmer: '👨‍🌾', pilot: '👨‍✈️', builder: '👷', singer: '🎤', dancer: '💃', scientist: '🔬'
        },
    },
};

// Accent characters by language (for typing phase)
export const ACCENT_CHARS = {
    es: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'],
    fr: ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'ü', 'ÿ'],
    de: ['ä', 'ö', 'ü', 'ß'],
    it: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
    cy: ['â', 'ê', 'î', 'ô', 'û', 'ŵ', 'ŷ'],
    pt: ['á', 'â', 'ã', 'à', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'],
};
