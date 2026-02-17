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

// Language display names
export const LANGUAGE_NAMES = {
        es: 'Spanish', fr: 'French', de: 'German',
        it: 'Italian', cy: 'Welsh', pt: 'Portuguese'
    };

export const LANGUAGE_FLAGS = {
        es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪',
        it: '🇮🇹', cy: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', pt: '🇵🇹'
    };

// ========== COLOUR DATA ==========
export const TRANSLATIONS = {
        es: { // Spanish
            red: 'Rojo', green: 'Verde', blue: 'Azul', yellow: 'Amarillo',
            orange: 'Naranja', pink: 'Rosa', purple: 'Morado', brown: 'Marrón',
            grey: 'Gris', black: 'Negro', white: 'Blanco'
        },
        fr: { // French
            red: 'Rouge', green: 'Vert', blue: 'Bleu', yellow: 'Jaune',
            orange: 'Orange', pink: 'Rose', purple: 'Violet', brown: 'Marron',
            grey: 'Gris', black: 'Noir', white: 'Blanc'
        },
        de: { // German
            red: 'Rot', green: 'Grün', blue: 'Blau', yellow: 'Gelb',
            orange: 'Orange', pink: 'Rosa', purple: 'Lila', brown: 'Braun',
            grey: 'Grau', black: 'Schwarz', white: 'Weiß'
        },
        it: { // Italian
            red: 'Rosso', green: 'Verde', blue: 'Blu', yellow: 'Giallo',
            orange: 'Arancione', pink: 'Rosa', purple: 'Viola', brown: 'Marrone',
            grey: 'Grigio', black: 'Nero', white: 'Bianco'
        },
        cy: { // Welsh
            red: 'Coch', green: 'Gwyrdd', blue: 'Glas', yellow: 'Melyn',
            orange: 'Oren', pink: 'Pinc', purple: 'Porffor', brown: 'Brown',
            grey: 'Llwyd', black: 'Du', white: 'Gwyn'
        },
        pt: { // Portuguese
            red: 'Vermelho', green: 'Verde', blue: 'Azul', yellow: 'Amarelo',
            orange: 'Laranja', pink: 'Rosa', purple: 'Roxo', brown: 'Castanho',
            grey: 'Cinzento', black: 'Preto', white: 'Branco'
        }
    };

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
            translations: {
                es: {
                    happy: 'Feliz', sad: 'Triste', angry: 'Enfadado', tired: 'Cansado',
                    surprised: 'Sorprendido', scared: 'Asustado', excited: 'Emocionado', bored: 'Aburrido', cold: 'Frío',
                    sick: 'Enfermo', strong: 'Fuerte'
                },
                fr: {
                    happy: 'Heureux', sad: 'Triste', angry: 'En colère', tired: 'Fatigué',
                    surprised: 'Surpris', scared: 'Effrayé', excited: 'Excité', bored: 'Ennuyé', cold: 'Froid',
                    sick: 'Malade', strong: 'Fort'
                },
                de: {
                    happy: 'Glücklich', sad: 'Traurig', angry: 'Wütend', tired: 'Müde',
                    surprised: 'Überrascht', scared: 'Ängstlich', excited: 'Aufgeregt', bored: 'Gelangweilt', cold: 'Kalt',
                    sick: 'Krank', strong: 'Stark'
                },
                it: {
                    happy: 'Felice', sad: 'Triste', angry: 'Arrabbiato', tired: 'Stanco',
                    surprised: 'Sorpreso', scared: 'Spaventato', excited: 'Entusiasta', bored: 'Annoiato', cold: 'Freddo',
                    sick: 'Malato', strong: 'Forte'
                },
                cy: {
                    happy: 'Hapus', sad: 'Trist', angry: 'Blin', tired: 'Blinedig',
                    surprised: 'Syn', scared: 'Ofnus', excited: 'Cyffrous', bored: 'Diflas', cold: 'Oer',
                    sick: 'Sâl', strong: 'Cryf'
                },
                pt: {
                    happy: 'Feliz', sad: 'Triste', angry: 'Zangado', tired: 'Cansado',
                    surprised: 'Surpreso', scared: 'Assustado', excited: 'Entusiasmado', bored: 'Aborrecido', cold: 'Frio',
                    sick: 'Doente', strong: 'Forte'
                }
            },
            forms: {
                es: {
                    angry: { feminine: 'Enfadada' },
                    tired: { feminine: 'Cansada' },
                    surprised: { feminine: 'Sorprendida' },
                    scared: { feminine: 'Asustada' },
                    excited: { feminine: 'Emocionada' },
                    bored: { feminine: 'Aburrida' },
                    cold: { feminine: 'Fría' },
                    sick: { feminine: 'Enferma' }
                },
                fr: {
                    happy: { feminine: 'Heureuse' },
                    tired: { feminine: 'Fatiguée' },
                    surprised: { feminine: 'Surprise' },
                    scared: { feminine: 'Effrayée' },
                    excited: { feminine: 'Excitée' },
                    bored: { feminine: 'Ennuyée' },
                    cold: { feminine: 'Froide' },
                    strong: { feminine: 'Forte' }
                },
                it: {
                    angry: { feminine: 'Arrabbiata' },
                    tired: { feminine: 'Stanca' },
                    surprised: { feminine: 'Sorpresa' },
                    scared: { feminine: 'Spaventata' },
                    bored: { feminine: 'Annoiata' },
                    cold: { feminine: 'Fredda' },
                    sick: { feminine: 'Malata' }
                },
                pt: {
                    angry: { feminine: 'Zangada' },
                    tired: { feminine: 'Cansada' },
                    surprised: { feminine: 'Surpresa' },
                    scared: { feminine: 'Assustada' },
                    excited: { feminine: 'Entusiasmada' },
                    bored: { feminine: 'Aborrecida' },
                    sick: { feminine: 'Doente' }
                }
            }
        },
        animals: {
            displayType: 'emoji',
            items: ['dog', 'cat', 'elephant', 'bird', 'fish', 'horse', 'rabbit', 'bear', 'monkey', 'cow', 'pig'],
            display: {
                dog: '🐕', cat: '🐈', elephant: '🐘', bird: '🐦',
                fish: '🐟', horse: '🐴', rabbit: '🐇', bear: '🐻', monkey: '🐒',
                cow: '🐄', pig: '🐷'
            },
            translations: {
                es: {
                    dog: 'Perro', cat: 'Gato', elephant: 'Elefante', bird: 'Pájaro',
                    fish: 'Pez', horse: 'Caballo', rabbit: 'Conejo', bear: 'Oso', monkey: 'Mono',
                    cow: 'Vaca', pig: 'Cerdo'
                },
                fr: {
                    dog: 'Chien', cat: 'Chat', elephant: 'Éléphant', bird: 'Oiseau',
                    fish: 'Poisson', horse: 'Cheval', rabbit: 'Lapin', bear: 'Ours', monkey: 'Singe',
                    cow: 'Vache', pig: 'Cochon'
                },
                de: {
                    dog: 'Hund', cat: 'Katze', elephant: 'Elefant', bird: 'Vogel',
                    fish: 'Fisch', horse: 'Pferd', rabbit: 'Kaninchen', bear: 'Bär', monkey: 'Affe',
                    cow: 'Kuh', pig: 'Schwein'
                },
                it: {
                    dog: 'Cane', cat: 'Gatto', elephant: 'Elefante', bird: 'Uccello',
                    fish: 'Pesce', horse: 'Cavallo', rabbit: 'Coniglio', bear: 'Orso', monkey: 'Scimmia',
                    cow: 'Mucca', pig: 'Maiale'
                },
                cy: {
                    dog: 'Ci', cat: 'Cath', elephant: 'Eliffant', bird: 'Aderyn',
                    fish: 'Pysgodyn', horse: 'Ceffyl', rabbit: 'Cwningen', bear: 'Arth', monkey: 'Mwnci',
                    cow: 'Buwch', pig: 'Mochyn'
                },
                pt: {
                    dog: 'Cão', cat: 'Gato', elephant: 'Elefante', bird: 'Pássaro',
                    fish: 'Peixe', horse: 'Cavalo', rabbit: 'Coelho', bear: 'Urso', monkey: 'Macaco',
                    cow: 'Vaca', pig: 'Porco'
                }
            },
            forms: {
                es: {
                    dog: { article: 'El', plural: 'Perros', pluralArticle: 'Los' },
                    cat: { article: 'El', plural: 'Gatos', pluralArticle: 'Los' },
                    elephant: { article: 'El', plural: 'Elefantes', pluralArticle: 'Los' },
                    bird: { article: 'El', plural: 'Pájaros', pluralArticle: 'Los' },
                    fish: { article: 'El', plural: 'Peces', pluralArticle: 'Los' },
                    horse: { article: 'El', plural: 'Caballos', pluralArticle: 'Los' },
                    rabbit: { article: 'El', plural: 'Conejos', pluralArticle: 'Los' },
                    bear: { article: 'El', plural: 'Osos', pluralArticle: 'Los' },
                    monkey: { article: 'El', plural: 'Monos', pluralArticle: 'Los' },
                    cow: { article: 'La', plural: 'Vacas', pluralArticle: 'Las' },
                    pig: { article: 'El', plural: 'Cerdos', pluralArticle: 'Los' }
                },
                fr: {
                    dog: { article: 'Le', plural: 'Chiens', pluralArticle: 'Les' },
                    cat: { article: 'Le', plural: 'Chats', pluralArticle: 'Les' },
                    elephant: { article: "L'", plural: 'Éléphants', pluralArticle: 'Les' },
                    bird: { article: "L'", plural: 'Oiseaux', pluralArticle: 'Les' },
                    fish: { article: 'Le', plural: 'Poissons', pluralArticle: 'Les' },
                    horse: { article: 'Le', plural: 'Chevaux', pluralArticle: 'Les' },
                    rabbit: { article: 'Le', plural: 'Lapins', pluralArticle: 'Les' },
                    bear: { article: "L'", plural: 'Ours', pluralArticle: 'Les' },
                    monkey: { article: 'Le', plural: 'Singes', pluralArticle: 'Les' },
                    cow: { article: 'La', plural: 'Vaches', pluralArticle: 'Les' },
                    pig: { article: 'Le', plural: 'Cochons', pluralArticle: 'Les' }
                },
                de: {
                    dog: { article: 'Der', plural: 'Hunde', pluralArticle: 'Die' },
                    cat: { article: 'Die', plural: 'Katzen', pluralArticle: 'Die' },
                    elephant: { article: 'Der', plural: 'Elefanten', pluralArticle: 'Die' },
                    bird: { article: 'Der', plural: 'Vögel', pluralArticle: 'Die' },
                    fish: { article: 'Der', plural: 'Fische', pluralArticle: 'Die' },
                    horse: { article: 'Das', plural: 'Pferde', pluralArticle: 'Die' },
                    rabbit: { article: 'Das', plural: 'Kaninchen', pluralArticle: 'Die' },
                    bear: { article: 'Der', plural: 'Bären', pluralArticle: 'Die' },
                    monkey: { article: 'Der', plural: 'Affen', pluralArticle: 'Die' },
                    cow: { article: 'Die', plural: 'Kühe', pluralArticle: 'Die' },
                    pig: { article: 'Das', plural: 'Schweine', pluralArticle: 'Die' }
                },
                it: {
                    dog: { article: 'Il', plural: 'Cani', pluralArticle: 'I' },
                    cat: { article: 'Il', plural: 'Gatti', pluralArticle: 'I' },
                    elephant: { article: "L'", plural: 'Elefanti', pluralArticle: 'Gli' },
                    bird: { article: "L'", plural: 'Uccelli', pluralArticle: 'Gli' },
                    fish: { article: 'Il', plural: 'Pesci', pluralArticle: 'I' },
                    horse: { article: 'Il', plural: 'Cavalli', pluralArticle: 'I' },
                    rabbit: { article: 'Il', plural: 'Conigli', pluralArticle: 'I' },
                    bear: { article: "L'", plural: 'Orsi', pluralArticle: 'Gli' },
                    monkey: { article: 'La', plural: 'Scimmie', pluralArticle: 'Le' },
                    cow: { article: 'La', plural: 'Mucche', pluralArticle: 'Le' },
                    pig: { article: 'Il', plural: 'Maiali', pluralArticle: 'I' }
                },
                cy: {
                    dog: { article: 'Y', plural: 'Cŵn', pluralArticle: 'Y' },
                    cat: { article: 'Y', plural: 'Cathod', pluralArticle: 'Y' },
                    elephant: { article: 'Yr', plural: 'Eliffantod', pluralArticle: 'Yr' },
                    bird: { article: 'Yr', plural: 'Adar', pluralArticle: 'Yr' },
                    fish: { article: 'Y', plural: 'Pysgod', pluralArticle: 'Y' },
                    horse: { article: 'Y', plural: 'Ceffylau', pluralArticle: 'Y' },
                    rabbit: { article: 'Y', plural: 'Cwningod', pluralArticle: 'Y' },
                    bear: { article: 'Yr', plural: 'Eirth', pluralArticle: 'Yr' },
                    monkey: { article: 'Y', plural: 'Mwnciod', pluralArticle: 'Y' },
                    cow: { article: 'Y', plural: 'Buchod', pluralArticle: 'Y' },
                    pig: { article: 'Y', plural: 'Moch', pluralArticle: 'Y' }
                },
                pt: {
                    dog: { article: 'O', plural: 'Cães', pluralArticle: 'Os' },
                    cat: { article: 'O', plural: 'Gatos', pluralArticle: 'Os' },
                    elephant: { article: 'O', plural: 'Elefantes', pluralArticle: 'Os' },
                    bird: { article: 'O', plural: 'Pássaros', pluralArticle: 'Os' },
                    fish: { article: 'O', plural: 'Peixes', pluralArticle: 'Os' },
                    horse: { article: 'O', plural: 'Cavalos', pluralArticle: 'Os' },
                    rabbit: { article: 'O', plural: 'Coelhos', pluralArticle: 'Os' },
                    bear: { article: 'O', plural: 'Ursos', pluralArticle: 'Os' },
                    monkey: { article: 'O', plural: 'Macacos', pluralArticle: 'Os' },
                    cow: { article: 'A', plural: 'Vacas', pluralArticle: 'As' },
                    pig: { article: 'O', plural: 'Porcos', pluralArticle: 'Os' }
                }
            }
        },
        food: {
            displayType: 'emoji',
            items: ['apple', 'pizza', 'bread', 'cheese', 'egg', 'cake', 'grape', 'banana', 'rice', 'tomato', 'carrot'],
            display: {
                apple: '🍎', pizza: '🍕', bread: '🍞', cheese: '🧀',
                egg: '🥚', cake: '🎂', grape: '🍇', banana: '🍌', rice: '🍚',
                tomato: '🍅', carrot: '🥕'
            },
            translations: {
                es: {
                    apple: 'Manzana', pizza: 'Pizza', bread: 'Pan', cheese: 'Queso',
                    egg: 'Huevo', cake: 'Pastel', grape: 'Uva', banana: 'Plátano', rice: 'Arroz',
                    tomato: 'Tomate', carrot: 'Zanahoria'
                },
                fr: {
                    apple: 'Pomme', pizza: 'Pizza', bread: 'Pain', cheese: 'Fromage',
                    egg: 'Œuf', cake: 'Gâteau', grape: 'Raisin', banana: 'Banane', rice: 'Riz',
                    tomato: 'Tomate', carrot: 'Carotte'
                },
                de: {
                    apple: 'Apfel', pizza: 'Pizza', bread: 'Brot', cheese: 'Käse',
                    egg: 'Ei', cake: 'Kuchen', grape: 'Traube', banana: 'Banane', rice: 'Reis',
                    tomato: 'Tomate', carrot: 'Karotte'
                },
                it: {
                    apple: 'Mela', pizza: 'Pizza', bread: 'Pane', cheese: 'Formaggio',
                    egg: 'Uovo', cake: 'Torta', grape: 'Uva', banana: 'Banana', rice: 'Riso',
                    tomato: 'Pomodoro', carrot: 'Carota'
                },
                cy: {
                    apple: 'Afal', pizza: 'Pizza', bread: 'Bara', cheese: 'Caws',
                    egg: 'Wy', cake: 'Cacen', grape: 'Grawnwin', banana: 'Banana', rice: 'Reis',
                    tomato: 'Tomato', carrot: 'Moronen'
                },
                pt: {
                    apple: 'Maçã', pizza: 'Pizza', bread: 'Pão', cheese: 'Queijo',
                    egg: 'Ovo', cake: 'Bolo', grape: 'Uva', banana: 'Banana', rice: 'Arroz',
                    tomato: 'Tomate', carrot: 'Cenoura'
                }
            },
            forms: {
                es: {
                    apple: { article: 'La', plural: 'Manzanas', pluralArticle: 'Las' },
                    pizza: { article: 'La', plural: 'Pizzas', pluralArticle: 'Las' },
                    bread: { article: 'El', plural: 'Panes', pluralArticle: 'Los' },
                    cheese: { article: 'El', plural: 'Quesos', pluralArticle: 'Los' },
                    egg: { article: 'El', plural: 'Huevos', pluralArticle: 'Los' },
                    cake: { article: 'El', plural: 'Pasteles', pluralArticle: 'Los' },
                    grape: { article: 'La', plural: 'Uvas', pluralArticle: 'Las' },
                    banana: { article: 'El', plural: 'Plátanos', pluralArticle: 'Los' },
                    tomato: { article: 'El', plural: 'Tomates', pluralArticle: 'Los' },
                    carrot: { article: 'La', plural: 'Zanahorias', pluralArticle: 'Las' }
                },
                fr: {
                    apple: { article: 'La', plural: 'Pommes', pluralArticle: 'Les' },
                    pizza: { article: 'La', plural: 'Pizzas', pluralArticle: 'Les' },
                    bread: { article: 'Le', plural: 'Pains', pluralArticle: 'Les' },
                    cheese: { article: 'Le', plural: 'Fromages', pluralArticle: 'Les' },
                    egg: { article: "L'", plural: 'Œufs', pluralArticle: 'Les' },
                    cake: { article: 'Le', plural: 'Gâteaux', pluralArticle: 'Les' },
                    grape: { article: 'Le', plural: 'Raisins', pluralArticle: 'Les' },
                    banana: { article: 'La', plural: 'Bananes', pluralArticle: 'Les' },
                    tomato: { article: 'La', plural: 'Tomates', pluralArticle: 'Les' },
                    carrot: { article: 'La', plural: 'Carottes', pluralArticle: 'Les' }
                },
                de: {
                    apple: { article: 'Der', plural: 'Äpfel', pluralArticle: 'Die' },
                    pizza: { article: 'Die', plural: 'Pizzen', pluralArticle: 'Die' },
                    bread: { article: 'Das', plural: 'Brote', pluralArticle: 'Die' },
                    cheese: { article: 'Der', plural: 'Käse', pluralArticle: 'Die' },
                    egg: { article: 'Das', plural: 'Eier', pluralArticle: 'Die' },
                    cake: { article: 'Der', plural: 'Kuchen', pluralArticle: 'Die' },
                    grape: { article: 'Die', plural: 'Trauben', pluralArticle: 'Die' },
                    banana: { article: 'Die', plural: 'Bananen', pluralArticle: 'Die' },
                    tomato: { article: 'Die', plural: 'Tomaten', pluralArticle: 'Die' },
                    carrot: { article: 'Die', plural: 'Karotten', pluralArticle: 'Die' }
                },
                it: {
                    apple: { article: 'La', plural: 'Mele', pluralArticle: 'Le' },
                    pizza: { article: 'La', plural: 'Pizze', pluralArticle: 'Le' },
                    bread: { article: 'Il', plural: 'Pani', pluralArticle: 'I' },
                    cheese: { article: 'Il', plural: 'Formaggi', pluralArticle: 'I' },
                    egg: { article: "L'", plural: 'Uova', pluralArticle: 'Le' },
                    cake: { article: 'La', plural: 'Torte', pluralArticle: 'Le' },
                    grape: { article: "L'", plural: 'Uve', pluralArticle: 'Le' },
                    banana: { article: 'La', plural: 'Banane', pluralArticle: 'Le' },
                    tomato: { article: 'Il', plural: 'Pomodori', pluralArticle: 'I' },
                    carrot: { article: 'La', plural: 'Carote', pluralArticle: 'Le' }
                },
                cy: {
                    apple: { article: 'Yr', plural: 'Afalau', pluralArticle: 'Yr' },
                    pizza: { article: 'Y', plural: 'Pizzas', pluralArticle: 'Y' },
                    bread: { article: 'Y', plural: 'Barâu', pluralArticle: 'Y' },
                    cheese: { article: 'Y', plural: 'Cawsiau', pluralArticle: 'Y' },
                    egg: { article: 'Yr', plural: 'Wyau', pluralArticle: 'Yr' },
                    cake: { article: 'Y', plural: 'Cacennau', pluralArticle: 'Y' },
                    grape: { article: 'Y', plural: 'Grawnwin', pluralArticle: 'Y' },
                    banana: { article: 'Y', plural: 'Bananas', pluralArticle: 'Y' },
                    tomato: { article: 'Y', plural: 'Tomatos', pluralArticle: 'Y' },
                    carrot: { article: 'Y', plural: 'Moron', pluralArticle: 'Y' }
                },
                pt: {
                    apple: { article: 'A', plural: 'Maçãs', pluralArticle: 'As' },
                    pizza: { article: 'A', plural: 'Pizzas', pluralArticle: 'As' },
                    bread: { article: 'O', plural: 'Pães', pluralArticle: 'Os' },
                    cheese: { article: 'O', plural: 'Queijos', pluralArticle: 'Os' },
                    egg: { article: 'O', plural: 'Ovos', pluralArticle: 'Os' },
                    cake: { article: 'O', plural: 'Bolos', pluralArticle: 'Os' },
                    grape: { article: 'A', plural: 'Uvas', pluralArticle: 'As' },
                    banana: { article: 'A', plural: 'Bananas', pluralArticle: 'As' },
                    tomato: { article: 'O', plural: 'Tomates', pluralArticle: 'Os' },
                    carrot: { article: 'A', plural: 'Cenouras', pluralArticle: 'As' }
                }
            }
        },
        weather: {
            displayType: 'emoji',
            items: ['sunny', 'rainy', 'snowy', 'windy', 'cloudy', 'stormy', 'hot', 'foggy', 'rainbow', 'lightning', 'tornado'],
            display: {
                sunny: '☀️', rainy: '🌧️', snowy: '❄️', windy: '💨',
                cloudy: '☁️', stormy: '⛈️', hot: '🔥', foggy: '🌫️', rainbow: '🌈',
                lightning: '⚡', tornado: '🌪️'
            },
            translations: {
                es: {
                    sunny: 'Soleado', rainy: 'Lluvioso', snowy: 'Nevado', windy: 'Ventoso',
                    cloudy: 'Nublado', stormy: 'Tormentoso', hot: 'Caliente', foggy: 'Neblinoso', rainbow: 'Arcoíris',
                    lightning: 'Relámpago', tornado: 'Tornado'
                },
                fr: {
                    sunny: 'Ensoleillé', rainy: 'Pluvieux', snowy: 'Neigeux', windy: 'Venteux',
                    cloudy: 'Nuageux', stormy: 'Orageux', hot: 'Chaud', foggy: 'Brumeux', rainbow: 'Arc-en-ciel',
                    lightning: 'Éclair', tornado: 'Tornade'
                },
                de: {
                    sunny: 'Sonnig', rainy: 'Regnerisch', snowy: 'Schneeig', windy: 'Windig',
                    cloudy: 'Bewölkt', stormy: 'Stürmisch', hot: 'Heiß', foggy: 'Neblig', rainbow: 'Regenbogen',
                    lightning: 'Blitz', tornado: 'Tornado'
                },
                it: {
                    sunny: 'Soleggiato', rainy: 'Piovoso', snowy: 'Nevoso', windy: 'Ventoso',
                    cloudy: 'Nuvoloso', stormy: 'Tempestoso', hot: 'Caldo', foggy: 'Nebbioso', rainbow: 'Arcobaleno',
                    lightning: 'Fulmine', tornado: 'Tornado'
                },
                cy: {
                    sunny: 'Heulog', rainy: 'Glawog', snowy: 'Eirlyd', windy: 'Gwyntog',
                    cloudy: 'Cymylog', stormy: 'Stormus', hot: 'Poeth', foggy: 'Niwlog', rainbow: 'Enfys',
                    lightning: 'Mellt', tornado: 'Corwynt'
                },
                pt: {
                    sunny: 'Ensolarado', rainy: 'Chuvoso', snowy: 'Nevado', windy: 'Ventoso',
                    cloudy: 'Nublado', stormy: 'Tempestuoso', hot: 'Quente', foggy: 'Nevoeiro', rainbow: 'Arco-íris',
                    lightning: 'Relâmpago', tornado: 'Tornado'
                }
            },
            forms: {
                es: {
                    sunny: { article: 'El', plural: 'Soles', pluralArticle: 'Los' },
                    rainy: { article: 'La', plural: 'Lluvias', pluralArticle: 'Las' },
                    snowy: { article: 'La', plural: 'Nieves', pluralArticle: 'Las' },
                    windy: { article: 'El', plural: 'Vientos', pluralArticle: 'Los' },
                    cloudy: { article: 'La', plural: 'Nubes', pluralArticle: 'Las' },
                    stormy: { article: 'La', plural: 'Tormentas', pluralArticle: 'Las' },
                    hot: { article: 'El', plural: 'Calores', pluralArticle: 'Los' },
                    foggy: { article: 'La', plural: 'Nieblas', pluralArticle: 'Las' },
                    rainbow: { article: 'El', plural: 'Arcoíris', pluralArticle: 'Los' },
                    lightning: { article: 'El', plural: 'Relámpagos', pluralArticle: 'Los' },
                    tornado: { article: 'El', plural: 'Tornados', pluralArticle: 'Los' }
                },
                fr: {
                    sunny: { article: 'Le', plural: 'Soleils', pluralArticle: 'Les' },
                    rainy: { article: 'La', plural: 'Pluies', pluralArticle: 'Les' },
                    snowy: { article: 'La', plural: 'Neiges', pluralArticle: 'Les' },
                    windy: { article: 'Le', plural: 'Vents', pluralArticle: 'Les' },
                    cloudy: { article: 'Le', plural: 'Nuages', pluralArticle: 'Les' },
                    stormy: { article: "L'", plural: 'Orages', pluralArticle: 'Les' },
                    hot: { article: 'La', plural: 'Chaleurs', pluralArticle: 'Les' },
                    foggy: { article: 'Le', plural: 'Brouillards', pluralArticle: 'Les' },
                    rainbow: { article: "L'", plural: 'Arcs-en-ciel', pluralArticle: 'Les' },
                    lightning: { article: "L'", plural: 'Éclairs', pluralArticle: 'Les' },
                    tornado: { article: 'La', plural: 'Tornades', pluralArticle: 'Les' }
                },
                de: {
                    sunny: { article: 'Die', plural: 'Sonnen', pluralArticle: 'Die' },
                    rainy: { article: 'Der', plural: 'Regen', pluralArticle: 'Die' },
                    snowy: { article: 'Der', plural: 'Schnee', pluralArticle: 'Die' },
                    windy: { article: 'Der', plural: 'Winde', pluralArticle: 'Die' },
                    cloudy: { article: 'Die', plural: 'Wolken', pluralArticle: 'Die' },
                    stormy: { article: 'Der', plural: 'Stürme', pluralArticle: 'Die' },
                    hot: { article: 'Die', plural: 'Hitze', pluralArticle: 'Die' },
                    foggy: { article: 'Der', plural: 'Nebel', pluralArticle: 'Die' },
                    rainbow: { article: 'Der', plural: 'Regenbögen', pluralArticle: 'Die' },
                    lightning: { article: 'Der', plural: 'Blitze', pluralArticle: 'Die' },
                    tornado: { article: 'Der', plural: 'Tornados', pluralArticle: 'Die' }
                },
                it: {
                    sunny: { article: 'Il', plural: 'Soli', pluralArticle: 'I' },
                    rainy: { article: 'La', plural: 'Piogge', pluralArticle: 'Le' },
                    snowy: { article: 'La', plural: 'Nevi', pluralArticle: 'Le' },
                    windy: { article: 'Il', plural: 'Venti', pluralArticle: 'I' },
                    cloudy: { article: 'La', plural: 'Nuvole', pluralArticle: 'Le' },
                    stormy: { article: 'La', plural: 'Tempeste', pluralArticle: 'Le' },
                    hot: { article: 'Il', plural: 'Calori', pluralArticle: 'I' },
                    foggy: { article: 'La', plural: 'Nebbie', pluralArticle: 'Le' },
                    rainbow: { article: "L'", plural: 'Arcobaleni', pluralArticle: 'Gli' },
                    lightning: { article: 'Il', plural: 'Fulmini', pluralArticle: 'I' },
                    tornado: { article: 'Il', plural: 'Tornado', pluralArticle: 'I' }
                },
                cy: {
                    sunny: { article: 'Yr', plural: 'Heuliau', pluralArticle: 'Yr' },
                    rainy: { article: 'Y', plural: 'Glawogydd', pluralArticle: 'Y' },
                    snowy: { article: 'Yr', plural: 'Eira', pluralArticle: 'Yr' },
                    windy: { article: 'Y', plural: 'Gwyntoedd', pluralArticle: 'Y' },
                    cloudy: { article: 'Y', plural: 'Cymylau', pluralArticle: 'Y' },
                    stormy: { article: 'Y', plural: 'Stormydd', pluralArticle: 'Y' },
                    hot: { article: 'Y', plural: 'Gwres', pluralArticle: 'Y' },
                    foggy: { article: 'Y', plural: 'Niwloedd', pluralArticle: 'Y' },
                    rainbow: { article: 'Yr', plural: 'Enfysau', pluralArticle: 'Yr' },
                    lightning: { article: 'Y', plural: 'Mellt', pluralArticle: 'Y' },
                    tornado: { article: 'Y', plural: 'Corwyntoedd', pluralArticle: 'Y' }
                },
                pt: {
                    sunny: { article: 'O', plural: 'Sóis', pluralArticle: 'Os' },
                    rainy: { article: 'A', plural: 'Chuvas', pluralArticle: 'As' },
                    snowy: { article: 'A', plural: 'Neves', pluralArticle: 'As' },
                    windy: { article: 'O', plural: 'Ventos', pluralArticle: 'Os' },
                    cloudy: { article: 'A', plural: 'Nuvens', pluralArticle: 'As' },
                    stormy: { article: 'A', plural: 'Tempestades', pluralArticle: 'As' },
                    hot: { article: 'O', plural: 'Calores', pluralArticle: 'Os' },
                    foggy: { article: 'O', plural: 'Nevoeiros', pluralArticle: 'Os' },
                    rainbow: { article: 'O', plural: 'Arco-íris', pluralArticle: 'Os' },
                    lightning: { article: 'O', plural: 'Relâmpagos', pluralArticle: 'Os' },
                    tornado: { article: 'O', plural: 'Tornados', pluralArticle: 'Os' }
                }
            }
        }
    };

// ========== SPEECH RECOGNITION ==========
export const SPEECH_LANG_CODES = {
        es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        it: 'it-IT', cy: 'cy-GB', pt: 'pt-PT'
    };

// Aliases for voice recognition to handle accents and pronunciation variations
export const COLOR_ALIASES = {
        es: {
            red: ['rojo'], green: ['verde'], blue: ['azul'], yellow: ['amarillo'],
            orange: ['naranja'], pink: ['rosa'], purple: ['morado'],
            brown: ['marron', 'marrón'], grey: ['gris'], black: ['negro'], white: ['blanco']
        },
        fr: {
            red: ['rouge'], green: ['vert', 'verte'], blue: ['bleu', 'bleue'], yellow: ['jaune'],
            orange: ['orange'], pink: ['rose'], purple: ['violet', 'violette'],
            brown: ['marron', 'brun', 'brune'], grey: ['gris', 'grise'], black: ['noir', 'noire'], white: ['blanc', 'blanche']
        },
        de: {
            red: ['rot', 'rote'], green: ['grun', 'grün', 'grune', 'grüne'], blue: ['blau', 'blaue'], yellow: ['gelb', 'gelbe'],
            orange: ['orange'], pink: ['rosa'], purple: ['lila'],
            brown: ['braun', 'braune'], grey: ['grau', 'graue'], black: ['schwarz', 'schwarze'], white: ['weiss', 'weiß', 'weise', 'weiße']
        },
        it: {
            red: ['rosso'], green: ['verde'], blue: ['blu'], yellow: ['giallo'],
            orange: ['arancione'], pink: ['rosa'], purple: ['viola'],
            brown: ['marrone'], grey: ['grigio'], black: ['nero'], white: ['bianco']
        },
        cy: {
            red: ['coch', 'goch'], green: ['gwyrdd', 'wyrdd'], blue: ['glas', 'las'], yellow: ['melyn', 'felyn'],
            orange: ['oren'], pink: ['pinc'], purple: ['porffor'],
            brown: ['brown'], grey: ['llwyd', 'lwyd'], black: ['du'], white: ['gwyn', 'wyn']
        },
        pt: {
            red: ['vermelho'], green: ['verde'], blue: ['azul'], yellow: ['amarelo'],
            orange: ['laranja'], pink: ['rosa'], purple: ['roxo'],
            brown: ['castanho'], grey: ['cinzento'], black: ['preto'], white: ['branco']
        }
    };
