const CACHE_NAME = 'waffley-v1';
const CDN_CACHE  = 'waffley-cdn-v1';

const APP_SHELL = [
    '/',
    '/index.html',
    '/app.js',
    '/data.js',
    '/styles.css',
    '/src/api.js',
    '/manifest.json',
    '/lang/cy.js',
    '/lang/de.js',
    '/lang/es.js',
    '/lang/fr.js',
    '/lang/it.js',
    '/lang/pt.js',
];

const ESM_ENTRY = 'https://esm.sh/@supabase/supabase-js@2';

// ---------------------------------------------------------------------------
// Install — precache app shell + esm.sh entry point
// ---------------------------------------------------------------------------
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
            caches.open(CDN_CACHE).then((cache) => cache.add(ESM_ENTRY)),
        ]).then(() => self.skipWaiting())
    );
});

// ---------------------------------------------------------------------------
// Activate — clean old caches, claim clients
// ---------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
    const KEEP = new Set([CACHE_NAME, CDN_CACHE]);
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names.filter((n) => !KEEP.has(n)).map((n) => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

// ---------------------------------------------------------------------------
// Fetch strategies
// ---------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Supabase API — network only, never cache
    if (url.hostname.endsWith('.supabase.co')) return;

    // esm.sh CDN — cache-first, network fallback (catches entry + sub-deps)
    if (url.hostname === 'esm.sh' || url.hostname.endsWith('.esm.sh')) {
        event.respondWith(cacheFirst(event.request, CDN_CACHE));
        return;
    }

    // Navigation / HTML — network-first, cache fallback
    if (event.request.mode === 'navigate' ||
        event.request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirst(event.request, CACHE_NAME));
        return;
    }

    // App shell assets (JS, CSS, manifest) — cache-first, network fallback
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
});

// ---------------------------------------------------------------------------
// Strategy helpers
// ---------------------------------------------------------------------------
async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}
