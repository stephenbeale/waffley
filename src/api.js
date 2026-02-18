/**
 * Waffley API Client
 *
 * Thin wrapper around the Supabase JS client.
 * Import this module in app.js when migrating from localStorage.
 *
 * Configuration: set SUPABASE_URL and SUPABASE_ANON_KEY as global
 * constants in index.html before this module loads, or replace the
 * values below with your project credentials.
 *
 * Usage:
 *   import { getVocabulary, getVerbs, getProgress, upsertProgress, recordSession } from './src/api.js';
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---------------------------------------------------------------------------
// Client initialisation
// ---------------------------------------------------------------------------
// These will be replaced with real values when the frontend migration happens.
// For now, they are set here as placeholders; use environment injection or
// a config block in index.html to supply the real values at runtime.
const SUPABASE_URL      = window.SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let _client = null;

function client() {
    if (!_client) {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            throw new Error('Supabase credentials not configured. Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY.');
        }
        _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _client;
}

// ---------------------------------------------------------------------------
// Anonymous session management
// ---------------------------------------------------------------------------

/**
 * Ensure the user has a session (anonymous if not signed in).
 * Returns the user object.
 */
export async function ensureSession() {
    const { data: { session } } = await client().auth.getSession();
    if (session) return session.user;

    // Sign in anonymously
    const { data, error } = await client().auth.signInAnonymously();
    if (error) throw error;
    return data.user;
}

/**
 * Sign in with Google OAuth.
 */
export async function signInWithGoogle() {
    const { error } = await client().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
}

/**
 * Sign in with Apple OAuth.
 */
export async function signInWithApple() {
    const { error } = await client().auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
}

/**
 * Sign out.
 */
export async function signOut() {
    const { error } = await client().auth.signOut();
    if (error) throw error;
}

// ---------------------------------------------------------------------------
// Content — vocabulary
// ---------------------------------------------------------------------------

/**
 * Get full vocabulary for a category in a given language.
 * Returns an array of { item_key, display_value, translation, form_type, form_text, alias }
 * (multiple rows per item when forms/aliases exist).
 *
 * Results are cached in memory for the session lifetime.
 */
const _vocabCache = new Map();

export async function getVocabulary(langCode, categorySlug) {
    const cacheKey = `${langCode}:${categorySlug}`;
    if (_vocabCache.has(cacheKey)) return _vocabCache.get(cacheKey);

    const { data, error } = await client().rpc('get_category_vocab', {
        p_lang: langCode,
        p_category: categorySlug,
    });
    if (error) throw error;

    // Normalise: group forms and aliases per item
    const itemMap = new Map();
    for (const row of data) {
        if (!itemMap.has(row.item_key)) {
            itemMap.set(row.item_key, {
                item_key:      row.item_key,
                display_value: row.display_value,
                translation:   row.translation,
                forms:         {},
                aliases:       [],
            });
        }
        const item = itemMap.get(row.item_key);
        if (row.form_type && row.form_text) item.forms[row.form_type] = row.form_text;
        if (row.alias && !item.aliases.includes(row.alias)) item.aliases.push(row.alias);
    }

    const result = Array.from(itemMap.values());
    _vocabCache.set(cacheKey, result);
    return result;
}

// ---------------------------------------------------------------------------
// Content — verbs
// ---------------------------------------------------------------------------

/**
 * Get all verb conjugations for a language.
 * Returns an array of { verb_key, emoji, infinitive, pronoun_key, conjugation, english }
 *
 * Results are cached in memory for the session lifetime.
 */
const _verbCache = new Map();

export async function getVerbs(langCode) {
    if (_verbCache.has(langCode)) return _verbCache.get(langCode);

    const { data, error } = await client().rpc('get_verb_conjugations', { p_lang: langCode });
    if (error) throw error;

    // Normalise: nest by verb_key → pronoun_key
    const verbMap = new Map();
    for (const row of data) {
        if (!verbMap.has(row.verb_key)) {
            verbMap.set(row.verb_key, {
                verb_key:   row.verb_key,
                emoji:      row.emoji,
                infinitive: row.infinitive,
                pronouns:   {},
                english:    {},
            });
        }
        const verb = verbMap.get(row.verb_key);
        verb.pronouns[row.pronoun_key] = row.conjugation;
        verb.english[row.pronoun_key]  = row.english;
    }

    const result = Object.fromEntries(verbMap);
    _verbCache.set(langCode, result);
    return result;
}

/**
 * Get pronoun translations for a language.
 * Returns { pronoun_key → translation } map.
 */
const _pronounCache = new Map();

export async function getPronounTranslations(langCode) {
    if (_pronounCache.has(langCode)) return _pronounCache.get(langCode);

    const { data, error } = await client().rpc('get_pronoun_translations', { p_lang: langCode });
    if (error) throw error;

    const result = Object.fromEntries(data.map(r => [r.pronoun_key, r.translation]));
    _pronounCache.set(langCode, result);
    return result;
}

// ---------------------------------------------------------------------------
// User progress
// ---------------------------------------------------------------------------

/**
 * Get all progress rows for the current user.
 * Returns { categoryProgress: [...], verbProgress: [...] }
 */
export async function getProgress() {
    const user = await ensureSession();

    const [catRes, verbRes] = await Promise.all([
        client()
            .from('user_category_progress')
            .select('language_id, category_id, total_correct_answers, current_cycle, levels_completed, updated_at')
            .eq('user_id', user.id),
        client()
            .from('user_verb_progress')
            .select('language_id, tense_id, total_correct_answers, levels_completed, current_cycle, updated_at')
            .eq('user_id', user.id),
    ]);

    if (catRes.error)  throw catRes.error;
    if (verbRes.error) throw verbRes.error;

    return { categoryProgress: catRes.data, verbProgress: verbRes.data };
}

/**
 * Upsert a category progress row.
 * @param {string} langCode - 'es', 'fr', etc.
 * @param {string} categorySlug - 'colours', 'animals', etc.
 * @param {object} progress - { totalAnswers, currentCycle, levelsCompleted }
 */
export async function upsertCategoryProgress(langCode, categorySlug, progress) {
    const user = await ensureSession();

    // Resolve IDs
    const [langRes, catRes] = await Promise.all([
        client().from('languages').select('id').eq('code', langCode).single(),
        client().from('categories').select('id').eq('slug', categorySlug).single(),
    ]);
    if (langRes.error) throw langRes.error;
    if (catRes.error)  throw catRes.error;

    const { error } = await client()
        .from('user_category_progress')
        .upsert({
            user_id:               user.id,
            language_id:           langRes.data.id,
            category_id:           catRes.data.id,
            total_correct_answers: progress.totalAnswers,
            current_cycle:         progress.currentCycle,
            levels_completed:      progress.levelsCompleted,
            updated_at:            new Date().toISOString(),
        }, { onConflict: 'user_id,language_id,category_id' });

    if (error) throw error;
}

/**
 * Record a completed game session.
 * @param {object} session - { langCode, categorySlug, mode, phase, score, totalQuestions, avgResponseMs }
 */
export async function recordSession(session) {
    const user = await ensureSession();

    const langRes = await client().from('languages').select('id').eq('code', session.langCode).single();
    if (langRes.error) throw langRes.error;

    let categoryId = null;
    if (session.categorySlug) {
        const catRes = await client().from('categories').select('id').eq('slug', session.categorySlug).single();
        if (!catRes.error) categoryId = catRes.data.id;
    }

    const { error } = await client().from('game_sessions').insert({
        user_id:         user.id,
        language_id:     langRes.data.id,
        category_id:     categoryId,
        mode:            session.mode,
        phase:           session.phase,
        score:           session.score,
        total_questions: session.totalQuestions,
        avg_response_ms: session.avgResponseMs ?? null,
        ended_at:        new Date().toISOString(),
    });

    if (error) throw error;
}

/**
 * Update user stats after a game.
 * @param {object} stats - { bestStreak, highestCycle, gamesPlayed }
 */
export async function upsertUserStats(stats) {
    const user = await ensureSession();

    const { error } = await client()
        .from('user_stats')
        .upsert({
            user_id:       user.id,
            best_streak:   stats.bestStreak,
            highest_cycle: stats.highestCycle,
            games_played:  stats.gamesPlayed,
            updated_at:    new Date().toISOString(),
        }, { onConflict: 'user_id' });

    if (error) throw error;
}
