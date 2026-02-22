#!/usr/bin/env node
// Generate neural TTS audio clips for all speakable text using Azure Cognitive Services.
// Usage: AZURE_SPEECH_KEY=xxx AZURE_SPEECH_REGION=uksouth node scripts/generate-audio.js

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Azure config ──────────────────────────────────────────────
const SPEECH_KEY    = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'uksouth';

if (!SPEECH_KEY) {
    console.error('Error: AZURE_SPEECH_KEY environment variable is required.');
    process.exit(1);
}

const TTS_ENDPOINT = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

const VOICES = {
    es: 'es-ES-ElviraNeural',
    fr: 'fr-FR-DeniseNeural',
    de: 'de-DE-KatjaNeural',
    it: 'it-IT-ElsaNeural',
    cy: 'cy-GB-NiaNeural',
    pt: 'pt-PT-RaquelNeural',
};

const SPEECH_RATE = '0.85';

// ── Import data ───────────────────────────────────────────────
const {
    CATEGORY_DATA, VERB_CONJUGATIONS, VERB_PRONOUNS, PRONOUN_KEYS, VERB_LIST
} = await import(join(ROOT, 'data.js'));

// ── Helpers ───────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function synthesize(text, voice) {
    const langTag = voice.slice(0, 5); // e.g. "es-ES"
    const ssml = `<speak version='1.0' xml:lang='${langTag}'>
  <voice name='${voice}'>
    <prosody rate='${SPEECH_RATE}'>${escapeXml(text)}</prosody>
  </voice>
</speak>`;

    const res = await fetch(TTS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': SPEECH_KEY,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-64kbitrate-mono-mp3',
        },
        body: ssml,
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Azure TTS ${res.status}: ${body}`);
    }
    return Buffer.from(await res.arrayBuffer());
}

function escapeXml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Enumerate clips ───────────────────────────────────────────
const clips = []; // { lang, key, text }

const LANG_CODES = Object.keys(VOICES); // es, fr, de, it, cy, pt
const VOCAB_CATEGORIES = ['colours', 'adjectives', 'animals', 'food', 'weather'];
const NOUN_CATEGORIES = ['animals', 'food', 'weather'];
// Languages that have verb data (no Welsh)
const VERB_LANGS = LANG_CODES.filter(l => VERB_CONJUGATIONS[l]);

for (const lang of LANG_CODES) {
    for (const cat of VOCAB_CATEGORIES) {
        const data = CATEGORY_DATA[cat];
        const translations = data.translations[lang];
        if (!translations) continue;

        for (const item of data.items) {
            const base = translations[item];
            if (!base) continue;

            // Base translation
            clips.push({ lang, key: `${cat}-${item}`, text: base });

            const forms = data.forms?.[lang]?.[item];
            if (!forms) continue;

            // Feminine form (adjectives)
            if (forms.feminine) {
                clips.push({ lang, key: `${cat}-${item}-feminine`, text: forms.feminine });
            }

            // Article form (nouns)
            if (forms.article) {
                clips.push({ lang, key: `${cat}-${item}-article`, text: `${forms.article} ${base}` });
            }

            // Plural form (nouns)
            if (forms.plural && forms.pluralArticle) {
                clips.push({ lang, key: `${cat}-${item}-plural`, text: `${forms.pluralArticle} ${forms.plural}` });
            }
        }
    }
}

// Verb conjugations and phrases (no Welsh)
for (const lang of VERB_LANGS) {
    const conjugations = VERB_CONJUGATIONS[lang];
    const pronouns = VERB_PRONOUNS[lang];

    for (const verb of VERB_LIST) {
        const verbData = conjugations[verb];
        if (!verbData) continue;

        for (const pronKey of PRONOUN_KEYS) {
            const conjugation = verbData[pronKey];
            if (!conjugation) continue;

            // Conjugation only (e.g. "Soy")
            clips.push({ lang, key: `verbs-${verb}-${pronKey}`, text: conjugation });

            // Full phrase: pronoun + conjugation (e.g. "Yo Soy")
            const pronoun = pronouns[pronKey] || '';
            if (pronoun) {
                clips.push({ lang, key: `verbs-${verb}-${pronKey}-phrase`, text: `${pronoun} ${conjugation}` });
            }
        }
    }

    // Pronouns
    for (const pronKey of PRONOUN_KEYS) {
        const pronoun = pronouns[pronKey];
        if (pronoun) {
            clips.push({ lang, key: `pronouns-${pronKey}`, text: pronoun });
        }
    }
}

// ── Generate audio files ──────────────────────────────────────
const audioDir = join(ROOT, 'audio');
let generated = 0;
let skipped = 0;
let errors = 0;

console.log(`Total clips to generate: ${clips.length}`);

for (let i = 0; i < clips.length; i++) {
    const { lang, key, text } = clips[i];
    const dir = join(audioDir, lang);
    const filePath = join(dir, `${key}.mp3`);

    if (existsSync(filePath)) {
        skipped++;
        continue;
    }

    mkdirSync(dir, { recursive: true });

    try {
        const mp3 = await synthesize(text, VOICES[lang]);
        writeFileSync(filePath, mp3);
        generated++;
        console.log(`[${i + 1}/${clips.length}] ${lang}/${key}.mp3 — "${text}"`);
    } catch (err) {
        errors++;
        console.error(`[${i + 1}/${clips.length}] FAILED ${lang}/${key}.mp3 — ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await delay(100);
}

console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`);
