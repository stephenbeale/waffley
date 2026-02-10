    // ========== LEVEL SYSTEM CONSTANTS ==========
    const ANSWERS_PER_LEVEL = 10;
    const LEVELS_PER_PHASE = 10;
    const ANSWERS_PER_CYCLE = 300;
    const PHASES = ['Learning', 'Practice', 'Speech'];
    const PHASE_CLASSES = ['learning', 'practice', 'speech'];
    const MAX_TIME = 10; // seconds
    const MIN_TIME = 2;  // seconds (floor for time limit)

    // Colour pools by cycle - 2 new colours added each cycle
    const CYCLE_COLORS = {
        1: ['red', 'green', 'blue', 'yellow', 'orange'],
        2: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple'],
        3: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey'],
        4: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'black', 'white']
    };
    // Full pool of colours to randomly select from each level
    const ALL_COLORS = ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey'];
    const MAX_CYCLE_WITH_NEW_COLORS = 4;
    const NEW_COLORS_PER_CYCLE = {
        2: ['pink', 'purple'],
        3: ['brown', 'grey'],
        4: ['black', 'white']
    };

    // Language display names
    const LANGUAGE_NAMES = {
        es: 'Spanish', fr: 'French', de: 'German',
        it: 'Italian', cy: 'Welsh', pt: 'Portuguese'
    };

    const LANGUAGE_FLAGS = {
        es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪',
        it: '🇮🇹', cy: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', pt: '🇵🇹'
    };

    // ========== COLOUR DATA ==========
    const TRANSLATIONS = {
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

    const COLOR_CSS = {
        red: '#dc3545', green: '#28a745', blue: '#007bff', yellow: '#ffc107',
        orange: '#fd7e14', pink: '#e83e8c', purple: '#6f42c1', brown: '#795548',
        grey: '#6c757d', black: '#212529', white: '#f8f9fa'
    };

    // ========== EMOJI CATEGORIES ==========
    const CATEGORIES = {
        colours: { label: 'Colours', icon: '🎨' },
        adjectives: { label: 'Adjectives', icon: '😊' },
        animals: { label: 'Animals', icon: '🐾' },
        food: { label: 'Food', icon: '🍎' },
        weather: { label: 'Weather', icon: '☀️' }
    };

    const EMOJI_DATA = {
        adjectives: {
            items: ['happy', 'sad', 'angry', 'tired', 'surprised', 'scared', 'excited', 'bored', 'cold'],
            emojis: {
                happy: '😊', sad: '😢', angry: '😠', tired: '😴',
                surprised: '😮', scared: '😨', excited: '🤩', bored: '😑', cold: '🥶'
            },
            translations: {
                es: {
                    happy: 'Feliz', sad: 'Triste', angry: 'Enfadado', tired: 'Cansado',
                    surprised: 'Sorprendido', scared: 'Asustado', excited: 'Emocionado', bored: 'Aburrido', cold: 'Frío'
                },
                fr: {
                    happy: 'Heureux', sad: 'Triste', angry: 'En colère', tired: 'Fatigué',
                    surprised: 'Surpris', scared: 'Effrayé', excited: 'Excité', bored: 'Ennuyé', cold: 'Froid'
                },
                de: {
                    happy: 'Glücklich', sad: 'Traurig', angry: 'Wütend', tired: 'Müde',
                    surprised: 'Überrascht', scared: 'Ängstlich', excited: 'Aufgeregt', bored: 'Gelangweilt', cold: 'Kalt'
                },
                it: {
                    happy: 'Felice', sad: 'Triste', angry: 'Arrabbiato', tired: 'Stanco',
                    surprised: 'Sorpreso', scared: 'Spaventato', excited: 'Entusiasta', bored: 'Annoiato', cold: 'Freddo'
                },
                cy: {
                    happy: 'Hapus', sad: 'Trist', angry: 'Blin', tired: 'Blinedig',
                    surprised: 'Syn', scared: 'Ofnus', excited: 'Cyffrous', bored: 'Diflas', cold: 'Oer'
                },
                pt: {
                    happy: 'Feliz', sad: 'Triste', angry: 'Zangado', tired: 'Cansado',
                    surprised: 'Surpreso', scared: 'Assustado', excited: 'Entusiasmado', bored: 'Aborrecido', cold: 'Frio'
                }
            }
        },
        animals: {
            items: ['dog', 'cat', 'elephant', 'bird', 'fish', 'horse', 'rabbit', 'bear', 'monkey'],
            emojis: {
                dog: '🐕', cat: '🐈', elephant: '🐘', bird: '🐦',
                fish: '🐟', horse: '🐴', rabbit: '🐇', bear: '🐻', monkey: '🐒'
            },
            translations: {
                es: {
                    dog: 'Perro', cat: 'Gato', elephant: 'Elefante', bird: 'Pájaro',
                    fish: 'Pez', horse: 'Caballo', rabbit: 'Conejo', bear: 'Oso', monkey: 'Mono'
                },
                fr: {
                    dog: 'Chien', cat: 'Chat', elephant: 'Éléphant', bird: 'Oiseau',
                    fish: 'Poisson', horse: 'Cheval', rabbit: 'Lapin', bear: 'Ours', monkey: 'Singe'
                },
                de: {
                    dog: 'Hund', cat: 'Katze', elephant: 'Elefant', bird: 'Vogel',
                    fish: 'Fisch', horse: 'Pferd', rabbit: 'Kaninchen', bear: 'Bär', monkey: 'Affe'
                },
                it: {
                    dog: 'Cane', cat: 'Gatto', elephant: 'Elefante', bird: 'Uccello',
                    fish: 'Pesce', horse: 'Cavallo', rabbit: 'Coniglio', bear: 'Orso', monkey: 'Scimmia'
                },
                cy: {
                    dog: 'Ci', cat: 'Cath', elephant: 'Eliffant', bird: 'Aderyn',
                    fish: 'Pysgodyn', horse: 'Ceffyl', rabbit: 'Cwningen', bear: 'Arth', monkey: 'Mwnci'
                },
                pt: {
                    dog: 'Cão', cat: 'Gato', elephant: 'Elefante', bird: 'Pássaro',
                    fish: 'Peixe', horse: 'Cavalo', rabbit: 'Coelho', bear: 'Urso', monkey: 'Macaco'
                }
            }
        },
        food: {
            items: ['apple', 'pizza', 'bread', 'cheese', 'egg', 'cake', 'grape', 'banana', 'rice'],
            emojis: {
                apple: '🍎', pizza: '🍕', bread: '🍞', cheese: '🧀',
                egg: '🥚', cake: '🎂', grape: '🍇', banana: '🍌', rice: '🍚'
            },
            translations: {
                es: {
                    apple: 'Manzana', pizza: 'Pizza', bread: 'Pan', cheese: 'Queso',
                    egg: 'Huevo', cake: 'Pastel', grape: 'Uva', banana: 'Plátano', rice: 'Arroz'
                },
                fr: {
                    apple: 'Pomme', pizza: 'Pizza', bread: 'Pain', cheese: 'Fromage',
                    egg: 'Œuf', cake: 'Gâteau', grape: 'Raisin', banana: 'Banane', rice: 'Riz'
                },
                de: {
                    apple: 'Apfel', pizza: 'Pizza', bread: 'Brot', cheese: 'Käse',
                    egg: 'Ei', cake: 'Kuchen', grape: 'Traube', banana: 'Banane', rice: 'Reis'
                },
                it: {
                    apple: 'Mela', pizza: 'Pizza', bread: 'Pane', cheese: 'Formaggio',
                    egg: 'Uovo', cake: 'Torta', grape: 'Uva', banana: 'Banana', rice: 'Riso'
                },
                cy: {
                    apple: 'Afal', pizza: 'Pizza', bread: 'Bara', cheese: 'Caws',
                    egg: 'Wy', cake: 'Cacen', grape: 'Grawnwin', banana: 'Banana', rice: 'Reis'
                },
                pt: {
                    apple: 'Maçã', pizza: 'Pizza', bread: 'Pão', cheese: 'Queijo',
                    egg: 'Ovo', cake: 'Bolo', grape: 'Uva', banana: 'Banana', rice: 'Arroz'
                }
            }
        },
        weather: {
            items: ['sunny', 'rainy', 'snowy', 'windy', 'cloudy', 'stormy', 'hot', 'foggy', 'rainbow'],
            emojis: {
                sunny: '☀️', rainy: '🌧️', snowy: '❄️', windy: '💨',
                cloudy: '☁️', stormy: '⛈️', hot: '🔥', foggy: '🌫️', rainbow: '🌈'
            },
            translations: {
                es: {
                    sunny: 'Soleado', rainy: 'Lluvioso', snowy: 'Nevado', windy: 'Ventoso',
                    cloudy: 'Nublado', stormy: 'Tormentoso', hot: 'Caliente', foggy: 'Neblinoso', rainbow: 'Arcoíris'
                },
                fr: {
                    sunny: 'Ensoleillé', rainy: 'Pluvieux', snowy: 'Neigeux', windy: 'Venteux',
                    cloudy: 'Nuageux', stormy: 'Orageux', hot: 'Chaud', foggy: 'Brumeux', rainbow: 'Arc-en-ciel'
                },
                de: {
                    sunny: 'Sonnig', rainy: 'Regnerisch', snowy: 'Schneeig', windy: 'Windig',
                    cloudy: 'Bewölkt', stormy: 'Stürmisch', hot: 'Heiß', foggy: 'Neblig', rainbow: 'Regenbogen'
                },
                it: {
                    sunny: 'Soleggiato', rainy: 'Piovoso', snowy: 'Nevoso', windy: 'Ventoso',
                    cloudy: 'Nuvoloso', stormy: 'Tempestoso', hot: 'Caldo', foggy: 'Nebbioso', rainbow: 'Arcobaleno'
                },
                cy: {
                    sunny: 'Heulog', rainy: 'Glawog', snowy: 'Eirlyd', windy: 'Gwyntog',
                    cloudy: 'Cymylog', stormy: 'Stormus', hot: 'Poeth', foggy: 'Niwlog', rainbow: 'Enfys'
                },
                pt: {
                    sunny: 'Ensolarado', rainy: 'Chuvoso', snowy: 'Nevado', windy: 'Ventoso',
                    cloudy: 'Nublado', stormy: 'Tempestuoso', hot: 'Quente', foggy: 'Nevoeiro', rainbow: 'Arco-íris'
                }
            }
        }
    };

    // ========== SPEECH RECOGNITION ==========
    const SPEECH_LANG_CODES = {
        es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        it: 'it-IT', cy: 'cy-GB', pt: 'pt-PT'
    };

    // Aliases for voice recognition to handle accents and pronunciation variations
    const COLOR_ALIASES = {
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
