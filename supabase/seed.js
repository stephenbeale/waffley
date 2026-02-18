/**
 * Waffley Supabase Seed Script
 *
 * Populates all content tables from the existing JS data files.
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.
 *
 * Usage:
 *   cp .env.example .env  # fill in your credentials
 *   npm install
 *   npm run seed
 *
 * The script is fully idempotent — safe to run multiple times.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ---------------------------------------------------------------------------
// Load .env manually (no dotenv dependency needed)
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
try {
    const envFile = readFileSync(envPath, 'utf8');
    for (const line of envFile.split('\n')) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) process.env[match[1].trim()] = match[2].trim();
    }
} catch { /* .env not found — rely on actual env vars */ }

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Use service role key so seed bypasses RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// Import game data (ES modules from existing source)
// ---------------------------------------------------------------------------
const rootDir = join(__dirname, '..');
const [es, fr, de, it, cy, pt] = await Promise.all([
    import(join(rootDir, 'lang', 'es.js')).then(m => m.default),
    import(join(rootDir, 'lang', 'fr.js')).then(m => m.default),
    import(join(rootDir, 'lang', 'de.js')).then(m => m.default),
    import(join(rootDir, 'lang', 'it.js')).then(m => m.default),
    import(join(rootDir, 'lang', 'cy.js')).then(m => m.default),
    import(join(rootDir, 'lang', 'pt.js')).then(m => m.default),
]);

// ---------------------------------------------------------------------------
// Static configuration (mirrors data.js constants)
// ---------------------------------------------------------------------------
const LANGUAGE_DEFS = [
    { code: 'es', name: 'Spanish',    flag: '🇪🇸', speech_code: 'es-ES', supports_verbs: true,  sort_order: 0 },
    { code: 'fr', name: 'French',     flag: '🇫🇷', speech_code: 'fr-FR', supports_verbs: true,  sort_order: 1 },
    { code: 'de', name: 'German',     flag: '🇩🇪', speech_code: 'de-DE', supports_verbs: true,  sort_order: 2 },
    { code: 'it', name: 'Italian',    flag: '🇮🇹', speech_code: 'it-IT', supports_verbs: true,  sort_order: 3 },
    { code: 'cy', name: 'Welsh',      flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', speech_code: 'cy-GB', supports_verbs: false, sort_order: 4 },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', speech_code: 'pt-PT', supports_verbs: true,  sort_order: 5 },
];

const LANG_DATA = { es, fr, de, it, cy, pt };

const CATEGORY_DEFS = [
    { slug: 'colours',    label: 'Colours',    icon: '🎨', display_type: 'color', is_noun: false, is_adjective: false, sort_order: 0 },
    { slug: 'adjectives', label: 'Feelings',   icon: '😊', display_type: 'emoji', is_noun: false, is_adjective: true,  sort_order: 1 },
    { slug: 'animals',    label: 'Animals',    icon: '🐾', display_type: 'emoji', is_noun: true,  is_adjective: false, sort_order: 2 },
    { slug: 'food',       label: 'Food',       icon: '🍎', display_type: 'emoji', is_noun: true,  is_adjective: false, sort_order: 3 },
    { slug: 'weather',    label: 'Weather',    icon: '☀️', display_type: 'emoji', is_noun: true,  is_adjective: false, sort_order: 4 },
];

const COLOUR_ITEMS = [
    { key: 'red',    display: '#dc3545' }, { key: 'green',  display: '#28a745' },
    { key: 'blue',   display: '#007bff' }, { key: 'yellow', display: '#ffc107' },
    { key: 'orange', display: '#fd7e14' }, { key: 'pink',   display: '#e83e8c' },
    { key: 'purple', display: '#6f42c1' }, { key: 'brown',  display: '#795548' },
    { key: 'grey',   display: '#6c757d' }, { key: 'black',  display: '#212529' },
    { key: 'white',  display: '#f8f9fa' },
];

const EMOJI_ITEMS = {
    adjectives: {
        happy: '😊', sad: '😢', angry: '😠', tired: '😴', surprised: '😮',
        scared: '😨', excited: '🤩', bored: '😑', cold: '🥶', sick: '🤒', strong: '💪',
    },
    animals: {
        dog: '🐕', cat: '🐈', elephant: '🐘', bird: '🐦', fish: '🐟',
        horse: '🐴', rabbit: '🐇', bear: '🐻', monkey: '🐒', cow: '🐄', pig: '🐷',
    },
    food: {
        apple: '🍎', pizza: '🍕', bread: '🍞', cheese: '🧀', egg: '🥚',
        cake: '🎂', grape: '🍇', banana: '🍌', rice: '🍚', tomato: '🍅', carrot: '🥕',
    },
    weather: {
        sunny: '☀️', rainy: '🌧️', snowy: '❄️', windy: '💨', cloudy: '☁️',
        stormy: '⛈️', hot: '🔥', foggy: '🌫️', rainbow: '🌈', lightning: '⚡', tornado: '🌪️',
    },
};

// Colour cycle pools (which colours unlock in each cycle)
const CYCLE_POOLS = [
    { cycle: 1, keys: ['red', 'green', 'blue', 'yellow', 'orange'] },
    { cycle: 2, keys: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple'] },
    { cycle: 3, keys: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey'] },
    { cycle: 4, keys: ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'brown', 'grey', 'black', 'white'] },
];

const PRONOUN_DEFS = [
    { key: 'I',      label: 'I',         sort_order: 0 },
    { key: 'you',    label: 'You',       sort_order: 1 },
    { key: 'he',     label: 'He',        sort_order: 2 },
    { key: 'she',    label: 'She',       sort_order: 3 },
    { key: 'we',     label: 'We',        sort_order: 4 },
    { key: 'you_pl', label: 'You (all)', sort_order: 5 },
    { key: 'they',   label: 'They',      sort_order: 6 },
];

const VERB_ENGLISH = {
    be:    { emoji: '🌟', I: 'I am',    you: 'You are',      he: 'He is',       she: 'She is',       we: 'We are',      you_pl: 'You (all) are',   they: 'They are' },
    have:  { emoji: '🤲', I: 'I have',  you: 'You have',     he: 'He has',      she: 'She has',      we: 'We have',     you_pl: 'You (all) have',  they: 'They have' },
    go:    { emoji: '🚶', I: 'I go',    you: 'You go',       he: 'He goes',     she: 'She goes',     we: 'We go',       you_pl: 'You (all) go',    they: 'They go' },
    do:    { emoji: '⚡', I: 'I do',    you: 'You do',       he: 'He does',     she: 'She does',     we: 'We do',       you_pl: 'You (all) do',    they: 'They do' },
    want:  { emoji: '💭', I: 'I want',  you: 'You want',     he: 'He wants',    she: 'She wants',    we: 'We want',     you_pl: 'You (all) want',  they: 'They want' },
    can:   { emoji: '💪', I: 'I can',   you: 'You can',      he: 'He can',      she: 'She can',      we: 'We can',      you_pl: 'You (all) can',   they: 'They can' },
    know:  { emoji: '🧠', I: 'I know',  you: 'You know',     he: 'He knows',    she: 'She knows',    we: 'We know',     you_pl: 'You (all) know',  they: 'They know' },
    eat:   { emoji: '🍴', I: 'I eat',   you: 'You eat',      he: 'He eats',     she: 'She eats',     we: 'We eat',      you_pl: 'You (all) eat',   they: 'They eat' },
    speak: { emoji: '💬', I: 'I speak', you: 'You speak',    he: 'He speaks',   she: 'She speaks',   we: 'We speak',    you_pl: 'You (all) speak', they: 'They speak' },
    live:  { emoji: '🏠', I: 'I live',  you: 'You live',     he: 'He lives',    she: 'She lives',    we: 'We live',     you_pl: 'You (all) live',  they: 'They live' },
};

const VERB_SORT = ['be', 'have', 'go', 'do', 'want', 'can', 'know', 'eat', 'speak', 'live'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function ok(label, { error, data }) {
    if (error) { console.error(`  ✗ ${label}:`, error.message); process.exit(1); }
    const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
    console.log(`  ✓ ${label} (${count} rows)`);
    return data;
}

async function upsert(table, rows, conflict) {
    if (!rows.length) return [];
    const { data, error } = await supabase
        .from(table)
        .upsert(rows, { onConflict: conflict, ignoreDuplicates: false })
        .select();
    ok(`${table} (${rows.length})`, { data, error });
    return data;
}

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------
async function seedLanguages() {
    console.log('\n📍 Languages');
    return upsert('languages', LANGUAGE_DEFS, 'code');
}

async function seedCategories() {
    console.log('\n📍 Categories');
    return upsert('categories', CATEGORY_DEFS, 'slug');
}

async function seedVocabulary(langRows, catRows) {
    console.log('\n📍 Vocabulary items');

    const catMap = Object.fromEntries(catRows.map(c => [c.slug, c.id]));
    const langMap = Object.fromEntries(langRows.map(l => [l.code, l.id]));

    // --- Items ---
    const items = [];
    // Colours
    COLOUR_ITEMS.forEach((c, i) =>
        items.push({ category_id: catMap['colours'], item_key: c.key, display_value: c.display, sort_order: i })
    );
    // Emoji categories
    for (const [catSlug, emojiMap] of Object.entries(EMOJI_ITEMS)) {
        Object.entries(emojiMap).forEach(([key, emoji], i) =>
            items.push({ category_id: catMap[catSlug], item_key: key, display_value: emoji, sort_order: i })
        );
    }
    const itemRows = await upsert('vocabulary_items', items, 'category_id,item_key');

    // Build item lookup: category_slug + item_key → id
    const itemMap = {};
    for (const row of itemRows) {
        const cat = catRows.find(c => c.id === row.category_id);
        if (cat) itemMap[`${cat.slug}:${row.item_key}`] = row.id;
    }

    // --- Translations ---
    console.log('\n📍 Translations');
    const translations = [];
    for (const [langCode, langData] of Object.entries(LANG_DATA)) {
        const langId = langMap[langCode];

        // Colours
        if (langData.colours) {
            for (const [key, text] of Object.entries(langData.colours)) {
                const itemId = itemMap[`colours:${key}`];
                if (itemId) translations.push({ item_id: itemId, language_id: langId, text });
            }
        }
        // Emoji categories
        for (const cat of ['adjectives', 'animals', 'food', 'weather']) {
            const catData = langData[cat];
            if (!catData?.translations) continue;
            for (const [key, text] of Object.entries(catData.translations)) {
                const itemId = itemMap[`${cat}:${key}`];
                if (itemId) translations.push({ item_id: itemId, language_id: langId, text });
            }
        }
    }
    await upsert('translations', translations, 'item_id,language_id');

    // --- Word forms ---
    console.log('\n📍 Word forms');
    const forms = [];
    for (const [langCode, langData] of Object.entries(LANG_DATA)) {
        const langId = langMap[langCode];
        for (const cat of ['adjectives', 'animals', 'food', 'weather']) {
            const catData = langData[cat];
            if (!catData?.forms) continue;
            for (const [key, formData] of Object.entries(catData.forms)) {
                const itemId = itemMap[`${cat}:${key}`];
                if (!itemId) continue;
                if (formData.article)       forms.push({ item_id: itemId, language_id: langId, form_type: 'article',       text: formData.article });
                if (formData.plural)        forms.push({ item_id: itemId, language_id: langId, form_type: 'plural',        text: formData.plural });
                if (formData.pluralArticle) forms.push({ item_id: itemId, language_id: langId, form_type: 'plural_article', text: formData.pluralArticle });
                if (formData.feminine)      forms.push({ item_id: itemId, language_id: langId, form_type: 'feminine',      text: formData.feminine });
            }
        }
    }
    await upsert('word_forms', forms, 'item_id,language_id,form_type');

    // --- Speech aliases ---
    console.log('\n📍 Speech aliases');
    const aliases = [];
    for (const [langCode, langData] of Object.entries(LANG_DATA)) {
        const langId = langMap[langCode];
        if (!langData.aliases) continue;
        for (const [key, aliasList] of Object.entries(langData.aliases)) {
            const itemId = itemMap[`colours:${key}`];
            if (!itemId) continue;
            for (const alias of aliasList) {
                aliases.push({ item_id: itemId, language_id: langId, alias });
            }
        }
    }
    await upsert('speech_aliases', aliases, 'item_id,language_id,alias');

    // --- Colour cycle pools ---
    console.log('\n📍 Colour cycle pools');
    const pools = [];
    for (const { cycle, keys } of CYCLE_POOLS) {
        for (const key of keys) {
            const itemId = itemMap[`colours:${key}`];
            if (itemId) pools.push({ cycle, item_id: itemId });
        }
    }
    await upsert('colour_cycle_pools', pools, 'cycle,item_id');

    return { itemMap, langMap, catMap };
}

async function seedVerbs(langRows) {
    console.log('\n📍 Pronouns');
    const pronounRows = await upsert('pronouns', PRONOUN_DEFS.map(p => ({
        pronoun_key: p.key, label: p.label, sort_order: p.sort_order
    })), 'pronoun_key');
    const pronounMap = Object.fromEntries(pronounRows.map(p => [p.pronoun_key, p.id]));
    const langMap = Object.fromEntries(langRows.map(l => [l.code, l.id]));

    console.log('\n📍 Tenses');
    const tenseRows = await upsert('tenses', [
        { tense_key: 'present', label: 'Present', sort_order: 0 },
    ], 'tense_key');
    const presentTenseId = tenseRows[0].id;

    console.log('\n📍 Verbs');
    const verbRows = await upsert('verbs', VERB_SORT.map((key, i) => ({
        verb_key: key, emoji: VERB_ENGLISH[key].emoji, sort_order: i
    })), 'verb_key');
    const verbMap = Object.fromEntries(verbRows.map(v => [v.verb_key, v.id]));

    // --- Verb English phrases ---
    console.log('\n📍 Verb English');
    const verbEnglish = [];
    for (const [verbKey, phrases] of Object.entries(VERB_ENGLISH)) {
        const verbId = verbMap[verbKey];
        for (const pronoun of PRONOUN_DEFS) {
            const text = phrases[pronoun.key];
            if (text) verbEnglish.push({ verb_id: verbId, pronoun_id: pronounMap[pronoun.key], text });
        }
    }
    await upsert('verb_english', verbEnglish, 'verb_id,pronoun_id');

    // --- Pronoun translations + verb infinitives + conjugations ---
    console.log('\n📍 Pronoun translations');
    const pronounTranslations = [];
    console.log('\n📍 Verb infinitives');
    const verbInfinitives = [];
    console.log('\n📍 Verb conjugations');
    const verbConjugations = [];

    for (const [langCode, langData] of Object.entries(LANG_DATA)) {
        const langId = langMap[langCode];
        if (!langData.verbs) continue;  // Welsh has no verbs

        // Pronoun translations
        for (const [pKey, text] of Object.entries(langData.verbs.pronouns)) {
            const pronounId = pronounMap[pKey];
            if (pronounId) pronounTranslations.push({ pronoun_id: pronounId, language_id: langId, text });
        }

        // Infinitives + conjugations
        for (const [verbKey, conjugationData] of Object.entries(langData.verbs.present)) {
            const verbId = verbMap[verbKey];
            if (!verbId) continue;

            // Infinitive
            if (conjugationData.infinitive) {
                verbInfinitives.push({ verb_id: verbId, language_id: langId, infinitive: conjugationData.infinitive });
            }

            // Conjugations for each pronoun
            for (const pronoun of PRONOUN_DEFS) {
                const conjugation = conjugationData[pronoun.key];
                if (conjugation) {
                    verbConjugations.push({
                        verb_id: verbId,
                        language_id: langId,
                        tense_id: presentTenseId,
                        pronoun_id: pronounMap[pronoun.key],
                        conjugation,
                    });
                }
            }
        }
    }

    await upsert('pronoun_translations', pronounTranslations, 'pronoun_id,language_id');
    await upsert('verb_infinitives', verbInfinitives, 'verb_id,language_id');
    await upsert('verb_conjugations', verbConjugations, 'verb_id,language_id,tense_id,pronoun_id');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    console.log('🌍 Waffley Supabase Seed');
    console.log(`   URL: ${SUPABASE_URL}\n`);

    const langRows = await seedLanguages();
    const catRows  = await seedCategories();
    await seedVocabulary(langRows, catRows);
    await seedVerbs(langRows);

    console.log('\n✅ Seed complete!\n');
}

main().catch(err => { console.error(err); process.exit(1); });
