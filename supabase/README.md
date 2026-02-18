# Waffley — Supabase Setup

This directory contains the database schema and seed scripts for the Waffley backend.

## Prerequisites

- A [Supabase](https://supabase.com) project (free tier is fine)
- Node.js 18+ (for running the seed script)

## Step 1 — Configure credentials

Copy `.env.example` to `.env` in the project root and fill in your values:

```bash
cp .env.example .env
```

Find your credentials in the Supabase Dashboard under **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Project URL (e.g. `https://xyz.supabase.co`) |
| `SUPABASE_ANON_KEY` | `anon` / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret — server/seed use only) |

## Step 2 — Run the schema

Open the **SQL Editor** in the Supabase Dashboard and paste the contents of `schema.sql`, then click **Run**.

Alternatively, if you have `psql` and your connection string:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
```

The schema is idempotent — safe to re-run. All `CREATE TABLE` and `CREATE INDEX` statements use `IF NOT EXISTS`. Policies use `CREATE POLICY` which will error if already present; wrap in a transaction and use `DROP POLICY IF EXISTS` first if you need to re-apply them.

## Step 3 — Seed content data

Install dependencies and run the seed script:

```bash
npm install
npm run seed
```

The seed script reads directly from `lang/*.js` (the same data files used by the frontend) and inserts all languages, categories, vocabulary, translations, word forms, speech aliases, verb conjugations, pronouns, and tenses.

The script is also idempotent — it uses `upsert` with `onConflict` throughout, so re-running will update rows without duplicating them.

## Step 4 — Configure the frontend

Before `src/api.js` loads, set your Supabase credentials as globals in `index.html`:

```html
<script>
  window.SUPABASE_URL      = 'https://your-project-ref.supabase.co';
  window.SUPABASE_ANON_KEY = 'your-anon-public-key-here';
</script>
```

## Schema overview

| Table | Purpose |
|---|---|
| `languages` | Supported languages (ES, FR, DE, IT, PT, CY) |
| `categories` | Vocabulary categories (animals, colours, food…) |
| `vocabulary_items` | Individual vocab items per category |
| `translations` | Per-language translations of each item |
| `word_forms` | Articles, plurals, feminine forms per language |
| `speech_aliases` | Alternate spellings accepted by speech recognition |
| `colour_cycle_pools` | Which colours appear in each cycle |
| `pronouns` | Subject pronoun keys (I, you, he, we, you_pl, they) |
| `pronoun_translations` | Target-language pronoun text per language |
| `tenses` | Verb tenses (present only for now) |
| `verbs` | Verb keys (be, have, go…) |
| `verb_english` | English conjugations per verb + pronoun |
| `verb_infinitives` | Infinitive form per verb + language |
| `verb_conjugations` | Full conjugation table per verb + language + tense + pronoun |
| `users` | User profiles (synced from Supabase Auth) |
| `user_category_progress` | Per-user progress per language + category |
| `user_verb_progress` | Per-user progress per language + tense |
| `user_stats` | Global stats (best streak, highest cycle, games played) |
| `user_language_stats` | Per-language correct answer and game counts |
| `user_item_mastery` | Per-item mastery tracking |
| `game_sessions` | Historical session log |

Row Level Security is enabled on all user tables. Each user can only read and write their own rows. Content tables are publicly readable.

## Database functions

Three RPC functions are exposed for the API layer:

- `get_category_vocab(p_lang, p_category)` — vocabulary + translations + forms + aliases for a category
- `get_verb_conjugations(p_lang)` — all present-tense conjugations for a language
- `get_pronoun_translations(p_lang)` — pronoun translation map for a language
