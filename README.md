# Transfer Desk

Airport transfer board for HR, logistics and drivers. Post a flight, decide who
drives it, log what it cost, export the week.

## Where the data lives

Everything is stored **in your own browser** (`localStorage`). Nothing is sent
to a server, and nothing is stored in this repository.

That has one consequence worth understanding: **the board is not shared between
people.** Each person who opens the site gets their own separate board. HR will
not see what logistics does. Making it a genuine team board requires a backend —
see "Making the board shared" below.

Because the data is per-browser, clearing site data or switching device loses the
board. Use **Settings → Download a backup** regularly.

## Running it locally

```bash
npm install
npm run dev
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages. Enable it once under **Settings → Pages → Source →
GitHub Actions**.

The Vite `base` is `"./"`, so the built site works on any host — a GitHub Pages
project path, a custom domain, or Cloudflare Pages — with no config change.

## Making the board shared

`src/storage.js` is the only file that needs to change. It implements:

```js
await window.storage.get(key, shared)   // -> { value } | null
await window.storage.set(key, value, shared)
```

Replace those two bodies with `fetch()` calls to a backend (a Cloudflare Worker
with KV is the usual free choice) and keep the async shape. `src/transfer-desk.jsx`
needs no changes at all — it only ever talks to this interface.

Note that a shared board would hold passenger names and phone numbers, so a
hosted backend brings GDPR obligations that per-browser storage does not.

## Removing the demo data (before real use)

A dashed **DEMO** bar sits at the top of every tab with a "Fill with sample
transfers" button. To remove it completely, delete:

1. `src/demo-data.js`
2. the `import { makeDemoTransfers, DEMO_CONF } from "./demo-data.js"` line in `src/transfer-desk.jsx`
3. the `DemoBar` component block in `src/transfer-desk.jsx` (marked `DEMO BAR`)
4. the `seedDemo` / `clearBoard` functions (marked `DEMO`)
5. the `<DemoBar ... />` line inside `<div className="wrap">`

Nothing else references any of it.

## Privacy

- No credentials, API keys or tokens anywhere in this project.
- `index.html` sets `noindex, nofollow` so the site stays out of search results.
- On free GitHub Pages the repository and its source are public; the *data* is
  not, since it never leaves the browser.
