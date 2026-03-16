# Waffley — Deployment Checklist

## Local files to upload

Open this folder in Windows Explorer, then drag files into SiteGround File Manager:

```
C:\Users\sjbeale\source\repos\waffley\public\
```

To open it instantly, paste the path above into the Windows Explorer address bar and press Enter.

---

## Pre-deploy: bump the service worker cache version

Before uploading, open `public\sw.js` and increment the cache version on **line 1**:

```js
// e.g. change:
const CACHE_NAME = 'waffley-v3';
// to:
const CACHE_NAME = 'waffley-v4';
```

This forces browsers to bust the old cache and pick up your new files. Increment the number on every deploy.

---

## Step-by-step deployment

### 1. Open SiteGround File Manager

[https://tools.siteground.com/filemanager?siteId=SndEeFpITUZJQT09](https://tools.siteground.com/filemanager?siteId=SndEeFpITUZJQT09)

Navigate to `public_html/` — this is the document root for waffley.app.

### 2. Upload files

From `C:\Users\sjbeale\source\repos\waffley\public\`, upload the following to `public_html/`:

**Files to upload:**
- `index.html`
- `app.js`
- `data.js`
- `styles.css`
- `manifest.json`
- `sw.js`
- `robots.txt`
- `sitemap.xml`
- `lang/` (entire directory)
- `src/` (entire directory)

**Do NOT upload:**
- `.git/`
- `node_modules/`
- `supabase/`
- `docs/`
- `scripts/`
- `.env`
- `*.md` files
- `package.json`

### 3. Verify the deploy

After uploading, run through this checklist:

- [ ] Visit [https://waffley.app](https://waffley.app) in an incognito window
- [ ] Site loads and is served over HTTPS (padlock visible)
- [ ] Hard reload (Ctrl+Shift+R) — confirm you are getting the new version (check Network tab > `sw.js` > content shows new cache version string)
- [ ] Open DevTools > Application > Service Workers — click "Unregister", then hard-reload again to force SW re-registration
- [ ] Play through a round to confirm game logic works
- [ ] Test on mobile (or DevTools responsive mode)
- [ ] Check all 6 language tabs load correctly
- [ ] Forms / auth flow works (if applicable)

---

## Notes

- **SW cache-busting is mandatory on every deploy.** If you forget to bump the cache version, returning users may get stale JS/CSS for days. See `service-worker-deploys.md` in agent memory for the full verification checklist.
- SiteGround document root for waffley.app: `public_html/`
- Live site: [https://waffley.app](https://waffley.app)
