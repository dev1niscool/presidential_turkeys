# The Presidential Turkey Atlas

A small, independently researched archive of America's luckiest birds.

**Live site:** https://dev1niscool.github.io/presidential_turkeys/

## Browse

A quiet turkey-selection screen. Hover or focus a portrait to preview it; click for facts and sources. Arrow keys move through the roster. Search by name, year, president or origin, or filter by decade.

The archive covers all 38 annual formal pardons, 1989–2026, with 35 year-specific public-domain images, including stills from official ceremony footage. The remaining three years (1994, 1995 and 1997) link to the Clinton Library’s ceremony films. Unknown names are labeled. Both birds are included where recorded. Year profiles have shareable links such as `#year-2024`.

## Run locally

Python 3 and Node.js are enough; no package installation or build is needed.

```sh
npm run dev
# Open http://127.0.0.1:3000
npm test
```

GitHub Pages serves `main` at the repository root. All application and image URLs are relative, so project subpaths work. `.nojekyll` keeps the static files untouched.

## Update the archive

Edit `data/turkeys.json`. Each year has `year`, `names`, `president`, `date` (ISO date), `origin`, `retirement`, `fact`, `sources` (label/URL pairs), and an optional `note`. An optional `video` object (`url`, `credit`) links an official ceremony film when a still is unavailable. Empty `names` means not recorded; do not invent placeholder bird names. A single known name may have an unnamed alternate described in the note. Source the ceremonial bird/alternate distinction explicitly; name order alone does not assert it.

Photographs live in `assets/photos/`. `manifest.json` maps each year to its local path, accurate alt text, photographer, source page and license. Video stills also record `videoTimestamp`; their source link identifies the original film. `hero.json` records the paired 2024 portrait. `portraits.js` keeps each turkey in frame. Add only correctly identified photographs with suitable rights, compress them, and preserve provenance. Do not reuse another year's image to fill a gap.

Primary White House remarks and contemporaneous records take precedence when later summaries conflict. Several discrepancies are disclosed in the individual record notes. 2026 was checked against official White House pages on November 25, 2026; Texas A&M is the announced retirement destination, not a confirmed arrival.

## Image rights and independence

Photographs are U.S. federal-government works identified as public domain by their source records; see each profile and the manifests for exact credits and links. The graphic turkey mark was drawn for this site. Fonts are served by Google Fonts (DM Sans and Libre Caslon Display), with local system fallbacks. This project is not affiliated with the White House or the National Archives.

Corrections and additional sourced archival photographs are welcome through GitHub issues or pull requests.

## Browser checks

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

To use an existing Chromium installation, set `TURKEY_CHROMIUM_PATH`. The browser checks exercise the actual static files at a simulated GitHub Pages subpath, including hover/focus, dialogs, filters and responsive layout.
