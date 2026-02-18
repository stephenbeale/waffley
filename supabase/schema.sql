-- ============================================================
-- Waffley Database Schema
-- PostgreSQL / Supabase
-- ============================================================
-- Run in Supabase SQL Editor (or via psql) to create all tables.
-- Tables are created in dependency order.
-- All inserts use ON CONFLICT DO NOTHING for idempotency.
-- ============================================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- CONTENT TABLES (read-only after seeding)
-- ============================================================

CREATE TABLE IF NOT EXISTS languages (
    id            SMALLSERIAL PRIMARY KEY,
    code          VARCHAR(5)  NOT NULL UNIQUE,   -- 'es', 'fr', 'de', etc.
    name          VARCHAR(50) NOT NULL,           -- 'Spanish', 'French'
    flag          VARCHAR(10) NOT NULL,           -- emoji flag
    speech_code   VARCHAR(10) NOT NULL,           -- 'es-ES', 'fr-FR'
    supports_verbs BOOLEAN    NOT NULL DEFAULT TRUE,
    sort_order    SMALLINT    NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id           SMALLSERIAL PRIMARY KEY,
    slug         VARCHAR(30) NOT NULL UNIQUE,     -- 'colours', 'animals', etc.
    label        VARCHAR(50) NOT NULL,
    icon         VARCHAR(10) NOT NULL,
    display_type VARCHAR(10) NOT NULL DEFAULT 'emoji', -- 'emoji' | 'color'
    is_noun      BOOLEAN     NOT NULL DEFAULT FALSE,
    is_adjective BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order   SMALLINT    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vocabulary_items (
    id            SERIAL   PRIMARY KEY,
    category_id   SMALLINT NOT NULL REFERENCES categories(id),
    item_key      VARCHAR(30) NOT NULL,           -- 'dog', 'red', 'happy'
    display_value VARCHAR(30) NOT NULL,           -- emoji or CSS hex '#dc3545'
    sort_order    SMALLINT NOT NULL DEFAULT 0,
    UNIQUE (category_id, item_key)
);

CREATE TABLE IF NOT EXISTS translations (
    id          SERIAL   PRIMARY KEY,
    item_id     INTEGER  NOT NULL REFERENCES vocabulary_items(id),
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    text        VARCHAR(100) NOT NULL,
    UNIQUE (item_id, language_id)
);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON translations(language_id);

CREATE TABLE IF NOT EXISTS word_forms (
    id          SERIAL   PRIMARY KEY,
    item_id     INTEGER  NOT NULL REFERENCES vocabulary_items(id),
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    form_type   VARCHAR(20) NOT NULL,             -- 'article', 'plural', 'plural_article', 'feminine'
    text        VARCHAR(100) NOT NULL,
    UNIQUE (item_id, language_id, form_type)
);
CREATE INDEX IF NOT EXISTS idx_word_forms_item_lang ON word_forms(item_id, language_id);

CREATE TABLE IF NOT EXISTS speech_aliases (
    id          SERIAL   PRIMARY KEY,
    item_id     INTEGER  NOT NULL REFERENCES vocabulary_items(id),
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    alias       VARCHAR(100) NOT NULL,
    UNIQUE (item_id, language_id, alias)
);
CREATE INDEX IF NOT EXISTS idx_speech_aliases_item_lang ON speech_aliases(item_id, language_id);

CREATE TABLE IF NOT EXISTS colour_cycle_pools (
    id       SERIAL   PRIMARY KEY,
    cycle    SMALLINT NOT NULL,
    item_id  INTEGER  NOT NULL REFERENCES vocabulary_items(id),
    UNIQUE (cycle, item_id)
);

-- ============================================================
-- VERB TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS pronouns (
    id          SMALLSERIAL PRIMARY KEY,
    pronoun_key VARCHAR(10) NOT NULL UNIQUE,      -- 'I', 'you', 'he', 'she', 'we', 'you_pl', 'they'
    label       VARCHAR(20) NOT NULL,             -- 'I', 'You', 'He', 'She', etc.
    sort_order  SMALLINT    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pronoun_translations (
    id          SERIAL   PRIMARY KEY,
    pronoun_id  SMALLINT NOT NULL REFERENCES pronouns(id),
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    text        VARCHAR(50) NOT NULL,             -- 'Je', 'Tu', 'Yo', etc.
    UNIQUE (pronoun_id, language_id)
);

CREATE TABLE IF NOT EXISTS tenses (
    id         SMALLSERIAL PRIMARY KEY,
    tense_key  VARCHAR(20) NOT NULL UNIQUE,       -- 'present', 'past', 'future'
    label      VARCHAR(30) NOT NULL,
    sort_order SMALLINT    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS verbs (
    id         SMALLSERIAL PRIMARY KEY,
    verb_key   VARCHAR(20) NOT NULL UNIQUE,       -- 'be', 'have', 'go', etc.
    emoji      VARCHAR(10) NOT NULL,
    sort_order SMALLINT    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS verb_english (
    id          SERIAL   PRIMARY KEY,
    verb_id     SMALLINT NOT NULL REFERENCES verbs(id),
    pronoun_id  SMALLINT NOT NULL REFERENCES pronouns(id),
    text        VARCHAR(50) NOT NULL,             -- 'I am', 'You are', etc.
    UNIQUE (verb_id, pronoun_id)
);

CREATE TABLE IF NOT EXISTS verb_infinitives (
    id          SERIAL   PRIMARY KEY,
    verb_id     SMALLINT NOT NULL REFERENCES verbs(id),
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    infinitive  VARCHAR(50) NOT NULL,
    UNIQUE (verb_id, language_id)
);

CREATE TABLE IF NOT EXISTS verb_conjugations (
    id          SERIAL   PRIMARY KEY,
    verb_id     SMALLINT NOT NULL REFERENCES verbs(id),
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    tense_id    SMALLINT NOT NULL REFERENCES tenses(id),
    pronoun_id  SMALLINT NOT NULL REFERENCES pronouns(id),
    conjugation VARCHAR(100) NOT NULL,
    UNIQUE (verb_id, language_id, tense_id, pronoun_id)
);
CREATE INDEX IF NOT EXISTS idx_verb_conj_lang_tense ON verb_conjugations(language_id, tense_id);

-- ============================================================
-- USER TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name    VARCHAR(100),
    email           VARCHAR(255) UNIQUE,
    auth_provider   VARCHAR(20),                  -- 'google', 'apple', 'email', 'anonymous'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    preferences     JSONB       NOT NULL DEFAULT '{}'::JSONB
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS user_category_progress (
    id                    SERIAL   PRIMARY KEY,
    user_id               UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language_id           SMALLINT NOT NULL REFERENCES languages(id),
    category_id           SMALLINT NOT NULL REFERENCES categories(id),
    total_correct_answers INTEGER  NOT NULL DEFAULT 0,
    current_cycle         SMALLINT NOT NULL DEFAULT 1,
    levels_completed      INTEGER  NOT NULL DEFAULT 0,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, language_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_ucp_user ON user_category_progress(user_id);

CREATE TABLE IF NOT EXISTS user_verb_progress (
    id                    SERIAL   PRIMARY KEY,
    user_id               UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language_id           SMALLINT NOT NULL REFERENCES languages(id),
    tense_id              SMALLINT NOT NULL REFERENCES tenses(id),
    total_correct_answers INTEGER  NOT NULL DEFAULT 0,
    levels_completed      INTEGER  NOT NULL DEFAULT 0,
    current_cycle         SMALLINT NOT NULL DEFAULT 1,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, language_id, tense_id)
);

CREATE TABLE IF NOT EXISTS user_stats (
    id            SERIAL   PRIMARY KEY,
    user_id       UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    best_streak   INTEGER  NOT NULL DEFAULT 0,
    highest_cycle SMALLINT NOT NULL DEFAULT 1,
    games_played  INTEGER  NOT NULL DEFAULT 0,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS user_language_stats (
    id          SERIAL   PRIMARY KEY,
    user_id     UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language_id SMALLINT NOT NULL REFERENCES languages(id),
    correct     INTEGER  NOT NULL DEFAULT 0,
    games       INTEGER  NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, language_id)
);
CREATE INDEX IF NOT EXISTS idx_uls_user ON user_language_stats(user_id);

CREATE TABLE IF NOT EXISTS user_item_mastery (
    id             SERIAL   PRIMARY KEY,
    user_id        UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id        INTEGER  NOT NULL REFERENCES vocabulary_items(id),
    language_id    SMALLINT NOT NULL REFERENCES languages(id),
    form_type      VARCHAR(20) NOT NULL DEFAULT 'base',
    correct_streak SMALLINT NOT NULL DEFAULT 0,
    total_correct  INTEGER  NOT NULL DEFAULT 0,
    total_attempts INTEGER  NOT NULL DEFAULT 0,
    last_seen_at   TIMESTAMPTZ,
    UNIQUE (user_id, item_id, language_id, form_type)
);
CREATE INDEX IF NOT EXISTS idx_uim_user_lang ON user_item_mastery(user_id, language_id);

CREATE TABLE IF NOT EXISTS game_sessions (
    id              UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language_id     SMALLINT NOT NULL REFERENCES languages(id),
    category_id     SMALLINT REFERENCES categories(id),  -- NULL for verb mode
    mode            VARCHAR(10) NOT NULL,                 -- 'words' | 'verbs'
    phase           VARCHAR(20) NOT NULL,                 -- 'Learning', 'Practice', 'Typing', 'Speech'
    score           INTEGER  NOT NULL DEFAULT 0,
    total_questions INTEGER  NOT NULL DEFAULT 0,
    avg_response_ms INTEGER,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_time ON game_sessions(user_id, started_at DESC);

-- ============================================================
-- MATERIALISED VIEW — hot path for vocabulary loading
-- ============================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_category_vocabulary AS
SELECT
    vi.id          AS item_id,
    vi.item_key,
    vi.display_value,
    vi.sort_order  AS item_sort_order,
    c.id           AS category_id,
    c.slug         AS category_slug,
    c.display_type,
    t.text         AS translation,
    l.id           AS language_id,
    l.code         AS language_code
FROM vocabulary_items vi
JOIN categories c  ON c.id = vi.category_id
JOIN translations t ON t.item_id = vi.id
JOIN languages l   ON l.id = t.language_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_cat_vocab ON mv_category_vocabulary(item_id, language_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_category_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verb_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats             ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_language_stats    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item_mastery      ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions          ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own row
CREATE POLICY "users_self" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "ucp_self" ON user_category_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "uvp_self" ON user_verb_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "us_self" ON user_stats
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "uls_self" ON user_language_stats
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "uim_self" ON user_item_mastery
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "gs_self" ON game_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Content tables: public read, no write from client
ALTER TABLE languages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_forms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_aliases        ENABLE ROW LEVEL SECURITY;
ALTER TABLE colour_cycle_pools    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronouns              ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronoun_translations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenses                ENABLE ROW LEVEL SECURITY;
ALTER TABLE verbs                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE verb_english          ENABLE ROW LEVEL SECURITY;
ALTER TABLE verb_infinitives      ENABLE ROW LEVEL SECURITY;
ALTER TABLE verb_conjugations     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_public_read" ON languages            FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON categories           FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON vocabulary_items     FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON translations         FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON word_forms           FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON speech_aliases       FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON colour_cycle_pools   FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON pronouns             FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON pronoun_translations FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON tenses               FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON verbs                FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON verb_english         FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON verb_infinitives     FOR SELECT USING (true);
CREATE POLICY "content_public_read" ON verb_conjugations    FOR SELECT USING (true);

-- ============================================================
-- DATABASE FUNCTIONS (used by API layer)
-- ============================================================

-- Get full vocabulary for a category + language (translations + forms + aliases)
CREATE OR REPLACE FUNCTION get_category_vocab(p_lang TEXT, p_category TEXT)
RETURNS TABLE (
    item_key      TEXT,
    display_value TEXT,
    translation   TEXT,
    form_type     TEXT,
    form_text     TEXT,
    alias         TEXT
) LANGUAGE sql STABLE AS $$
    SELECT
        vi.item_key,
        vi.display_value,
        t.text         AS translation,
        wf.form_type,
        wf.text        AS form_text,
        sa.alias
    FROM vocabulary_items vi
    JOIN categories c      ON c.id = vi.category_id  AND c.slug = p_category
    JOIN languages l       ON l.code = p_lang
    JOIN translations t    ON t.item_id = vi.id       AND t.language_id = l.id
    LEFT JOIN word_forms wf ON wf.item_id = vi.id    AND wf.language_id = l.id
    LEFT JOIN speech_aliases sa ON sa.item_id = vi.id AND sa.language_id = l.id
    ORDER BY vi.sort_order, vi.item_key, wf.form_type;
$$;

-- Get all verb conjugations for a language
CREATE OR REPLACE FUNCTION get_verb_conjugations(p_lang TEXT)
RETURNS TABLE (
    verb_key    TEXT,
    emoji       TEXT,
    infinitive  TEXT,
    pronoun_key TEXT,
    conjugation TEXT,
    english     TEXT
) LANGUAGE sql STABLE AS $$
    SELECT
        v.verb_key,
        v.emoji,
        vi.infinitive,
        p.pronoun_key,
        vc.conjugation,
        ve.text AS english
    FROM verb_conjugations vc
    JOIN verbs v             ON v.id = vc.verb_id
    JOIN languages l         ON l.id = vc.language_id  AND l.code = p_lang
    JOIN tenses t            ON t.id = vc.tense_id     AND t.tense_key = 'present'
    JOIN pronouns p          ON p.id = vc.pronoun_id
    JOIN verb_infinitives vi ON vi.verb_id = v.id      AND vi.language_id = l.id
    JOIN verb_english ve     ON ve.verb_id = v.id      AND ve.pronoun_id = p.id
    ORDER BY v.sort_order, p.sort_order;
$$;

-- Get pronoun translations for a language
CREATE OR REPLACE FUNCTION get_pronoun_translations(p_lang TEXT)
RETURNS TABLE (
    pronoun_key TEXT,
    label       TEXT,
    translation TEXT
) LANGUAGE sql STABLE AS $$
    SELECT p.pronoun_key, p.label, pt.text AS translation
    FROM pronouns p
    JOIN pronoun_translations pt ON pt.pronoun_id = p.id
    JOIN languages l             ON l.id = pt.language_id AND l.code = p_lang
    ORDER BY p.sort_order;
$$;
