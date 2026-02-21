/**
 * Waffley API Client
 *
 * Thin wrapper around the Supabase JS client with offline-first support.
 * The Supabase SDK is loaded lazily via dynamic import so the app can
 * start and run gameplay entirely offline.
 *
 * Failed DB writes are queued in localStorage and replayed when
 * connectivity returns.
 */

// ---------------------------------------------------------------------------
// Client initialisation — lazy dynamic import
// ---------------------------------------------------------------------------
const SUPABASE_URL      = window.SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let _createClient = null;
let _client = null;
let _supabaseLoadFailed = false;

export function isConfigured() {
    return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}

async function loadSupabase() {
    if (_createClient) return _createClient;
    try {
        const mod = await import('https://esm.sh/@supabase/supabase-js@2');
        _createClient = mod.createClient;
        _supabaseLoadFailed = false;
        return _createClient;
    } catch (e) {
        _supabaseLoadFailed = true;
        console.debug('[waffley] Supabase SDK failed to load:', e.message);
        window.Sentry?.captureException(e);
        return null;
    }
}

async function getClient() {
    if (_client) return _client;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    const create = await loadSupabase();
    if (!create) return null;
    _client = create(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _client;
}

// Retry loading SDK when coming back online
if (typeof window !== 'undefined') {
    window.addEventListener('online', async () => {
        if (_supabaseLoadFailed) {
            const create = await loadSupabase();
            if (create) {
                await getClient();
                flushSyncQueue();
            }
        }
    });
}

// ---------------------------------------------------------------------------
// Sync retry queue — localStorage-based
// ---------------------------------------------------------------------------
const SYNC_QUEUE_KEY = 'waffley_sync_queue';
const SYNC_QUEUE_MAX = 50;
const SYNC_QUEUE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function readQueue() {
    try {
        return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    } catch { return []; }
}

function writeQueue(queue) {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

function enqueue(fn, args) {
    const queue = readQueue();

    // Deduplicate: for category progress and stats, keep only the latest per key
    if (fn === 'upsertCategoryProgress') {
        const dedupeKey = `${args[0]}:${args[1]}`;
        const idx = queue.findIndex(e => e.fn === fn && `${e.args[0]}:${e.args[1]}` === dedupeKey);
        if (idx !== -1) queue.splice(idx, 1);
    } else if (fn === 'upsertUserStats') {
        const idx = queue.findIndex(e => e.fn === fn);
        if (idx !== -1) queue.splice(idx, 1);
    }

    queue.push({ fn, args, ts: Date.now() });

    // Cap queue size
    while (queue.length > SYNC_QUEUE_MAX) queue.shift();

    writeQueue(queue);
}

async function flushSyncQueue() {
    const cl = await getClient();
    if (!cl) return;

    const queue = readQueue();
    if (!queue.length) return;

    const now = Date.now();
    const keep = [];

    for (const entry of queue) {
        // Drop entries older than TTL
        if (now - entry.ts > SYNC_QUEUE_TTL) continue;

        try {
            if (entry.fn === 'upsertCategoryProgress') {
                await _doUpsertCategoryProgress(...entry.args);
            } else if (entry.fn === 'upsertUserStats') {
                await _doUpsertUserStats(...entry.args);
            } else if (entry.fn === 'recordSession') {
                await _doRecordSession(...entry.args);
            } else if (entry.fn === 'upsertAchievements') {
                await _doUpsertAchievements(...entry.args);
            }
        } catch (e) {
            window.Sentry?.captureException(e);
            keep.push(entry); // retry next time
        }
    }

    writeQueue(keep);
}

// ---------------------------------------------------------------------------
// ID-lookup caches (eliminates repeated round-trips per upsert)
// ---------------------------------------------------------------------------

let _langMap = null;
let _catMap  = null;

async function getLangMap() {
    if (!_langMap) {
        const cl = await getClient();
        if (!cl) return null;
        const { data } = await cl.from('languages').select('id, code');
        _langMap = {
            toId:   Object.fromEntries(data.map(r => [r.code, r.id])),
            toCode: Object.fromEntries(data.map(r => [r.id, r.code])),
        };
    }
    return _langMap;
}

async function getCatMap() {
    if (!_catMap) {
        const cl = await getClient();
        if (!cl) return null;
        const { data } = await cl.from('categories').select('id, slug');
        _catMap = {
            toId:   Object.fromEntries(data.map(r => [r.slug, r.id])),
            toSlug: Object.fromEntries(data.map(r => [r.id, r.slug])),
        };
    }
    return _catMap;
}

// ---------------------------------------------------------------------------
// Anonymous session management
// ---------------------------------------------------------------------------

export async function ensureSession() {
    const cl = await getClient();
    if (!cl) return null;
    const { data: { session } } = await cl.auth.getSession();
    if (session) return session.user;

    const { data, error } = await cl.auth.signInAnonymously();
    if (error) throw error;
    return data.user;
}

export async function signInWithGoogle() {
    const cl = await getClient();
    if (!cl) return;
    const { error } = await cl.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
}

export async function signInWithApple() {
    const cl = await getClient();
    if (!cl) return;
    const { error } = await cl.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
}

export async function signOut() {
    const cl = await getClient();
    if (!cl) return;
    const { error } = await cl.auth.signOut();
    if (error) throw error;
}

export async function getUser() {
    const cl = await getClient();
    if (!cl) return null;
    const { data: { session } } = await cl.auth.getSession();
    return session?.user ?? null;
}

export function onAuthChange(callback) {
    // Callers expect a synchronous return. If client is already loaded, subscribe
    // immediately. Otherwise, defer subscription setup until the client is ready.
    let _sub = null;
    const wrapper = {
        unsubscribe() { if (_sub) _sub.unsubscribe(); },
    };
    if (_client) {
        const { data: { subscription } } = _client.auth.onAuthStateChange((event, session) => {
            callback(event, session?.user ?? null);
        });
        _sub = subscription;
    } else {
        getClient().then((cl) => {
            if (!cl) return;
            const { data: { subscription } } = cl.auth.onAuthStateChange((event, session) => {
                callback(event, session?.user ?? null);
            });
            _sub = subscription;
        });
    }
    return wrapper;
}

// ---------------------------------------------------------------------------
// Content — vocabulary
// ---------------------------------------------------------------------------

const _vocabCache = new Map();

export async function getVocabulary(langCode, categorySlug) {
    const cacheKey = `${langCode}:${categorySlug}`;
    if (_vocabCache.has(cacheKey)) return _vocabCache.get(cacheKey);

    const cl = await getClient();
    if (!cl) return [];

    const { data, error } = await cl.rpc('get_category_vocab', {
        p_lang: langCode,
        p_category: categorySlug,
    });
    if (error) throw error;

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

const _verbCache = new Map();

export async function getVerbs(langCode) {
    if (_verbCache.has(langCode)) return _verbCache.get(langCode);

    const cl = await getClient();
    if (!cl) return {};

    const { data, error } = await cl.rpc('get_verb_conjugations', { p_lang: langCode });
    if (error) throw error;

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

const _pronounCache = new Map();

export async function getPronounTranslations(langCode) {
    if (_pronounCache.has(langCode)) return _pronounCache.get(langCode);

    const cl = await getClient();
    if (!cl) return {};

    const { data, error } = await cl.rpc('get_pronoun_translations', { p_lang: langCode });
    if (error) throw error;

    const result = Object.fromEntries(data.map(r => [r.pronoun_key, r.translation]));
    _pronounCache.set(langCode, result);
    return result;
}

// ---------------------------------------------------------------------------
// User progress
// ---------------------------------------------------------------------------

export async function getProgress() {
    const cl = await getClient();
    if (!cl) return { categoryProgress: [], verbProgress: [] };
    const user = await ensureSession();
    if (!user) return { categoryProgress: [], verbProgress: [] };

    const [catRes, verbRes] = await Promise.all([
        cl.from('user_category_progress')
            .select('language_id, category_id, total_correct_answers, current_cycle, levels_completed, updated_at')
            .eq('user_id', user.id),
        cl.from('user_verb_progress')
            .select('language_id, tense_id, total_correct_answers, levels_completed, current_cycle, updated_at')
            .eq('user_id', user.id),
    ]);

    if (catRes.error)  throw catRes.error;
    if (verbRes.error) throw verbRes.error;

    return { categoryProgress: catRes.data, verbProgress: verbRes.data };
}

export async function getProgressMap() {
    const cl = await getClient();
    if (!cl) return {};
    const user = await ensureSession();
    if (!user) return {};
    const [langMap, catMap] = await Promise.all([getLangMap(), getCatMap()]);
    if (!langMap || !catMap) return {};
    const { data, error } = await cl
        .from('user_category_progress')
        .select('language_id, category_id, total_correct_answers, current_cycle, levels_completed')
        .eq('user_id', user.id);
    if (error) throw error;
    const result = {};
    for (const row of data) {
        const langCode = langMap.toCode[row.language_id];
        const catSlug  = catMap.toSlug[row.category_id];
        if (!langCode || !catSlug) continue;
        const key = catSlug === 'colours' ? langCode : `${langCode}_${catSlug}`;
        result[key] = {
            totalAnswers:    row.total_correct_answers,
            currentCycle:    row.current_cycle,
            levelsCompleted: row.levels_completed,
        };
    }
    return result;
}

// ---------------------------------------------------------------------------
// Write operations — raw implementations + queue-on-failure wrappers
// ---------------------------------------------------------------------------

async function _doUpsertCategoryProgress(langCode, categorySlug, progress) {
    const cl = await getClient();
    if (!cl) throw new Error('offline');
    const user = await ensureSession();
    if (!user) throw new Error('no session');
    const [langMap, catMap] = await Promise.all([getLangMap(), getCatMap()]);
    const { error } = await cl
        .from('user_category_progress')
        .upsert({
            user_id:               user.id,
            language_id:           langMap.toId[langCode],
            category_id:           catMap.toId[categorySlug],
            total_correct_answers: progress.totalAnswers,
            current_cycle:         progress.currentCycle,
            levels_completed:      progress.levelsCompleted,
            updated_at:            new Date().toISOString(),
        }, { onConflict: 'user_id,language_id,category_id' });
    if (error) throw error;
}

export async function upsertCategoryProgress(langCode, categorySlug, progress) {
    try {
        await _doUpsertCategoryProgress(langCode, categorySlug, progress);
    } catch {
        enqueue('upsertCategoryProgress', [langCode, categorySlug, progress]);
    }
}

async function _doRecordSession(session) {
    const cl = await getClient();
    if (!cl) throw new Error('offline');
    const user = await ensureSession();
    if (!user) throw new Error('no session');
    const [langMap, catMap] = await Promise.all([getLangMap(), getCatMap()]);

    const categoryId = session.categorySlug ? (catMap.toId[session.categorySlug] ?? null) : null;

    const { error } = await cl.from('game_sessions').insert({
        user_id:         user.id,
        language_id:     langMap.toId[session.langCode],
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

export async function recordSession(session) {
    try {
        await _doRecordSession(session);
    } catch {
        enqueue('recordSession', [session]);
    }
}

async function _doUpsertUserStats(stats) {
    const cl = await getClient();
    if (!cl) throw new Error('offline');
    const user = await ensureSession();
    if (!user) throw new Error('no session');

    const { error } = await cl
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

export async function upsertUserStats(stats) {
    try {
        await _doUpsertUserStats(stats);
    } catch {
        enqueue('upsertUserStats', [stats]);
    }
}

async function _doUpsertAchievements(achievements) {
    const cl = await getClient();
    if (!cl) throw new Error('offline');
    const user = await ensureSession();
    if (!user) throw new Error('no session');

    const rows = achievements.map(a => ({
        user_id:     user.id,
        achievement: a.achievement,
        unlocked_at: a.unlockedAt,
    }));

    const { error } = await cl
        .from('user_achievements')
        .upsert(rows, { onConflict: 'user_id,achievement' });

    if (error) throw error;
}

export async function upsertAchievements(achievements) {
    try {
        await _doUpsertAchievements(achievements);
    } catch {
        enqueue('upsertAchievements', [achievements]);
    }
}

// ---------------------------------------------------------------------------
// GDPR — data export and account deletion
// ---------------------------------------------------------------------------

export async function exportUserData() {
    const cl = await getClient();
    if (!cl) return null;
    await ensureSession();
    const { data, error } = await cl.rpc('export_user_data');
    if (error) throw error;
    return data;
}

export async function deleteAccount() {
    const cl = await getClient();
    if (!cl) throw new Error('Cannot delete account while offline');
    await ensureSession();
    const { error } = await cl.rpc('delete_my_account');
    if (error) throw error;
    await cl.auth.signOut();
}

// ---------------------------------------------------------------------------
// Startup: try to load SDK and flush any queued writes
// ---------------------------------------------------------------------------
if (isConfigured()) {
    getClient().then((cl) => {
        if (cl) flushSyncQueue();
    });
}
