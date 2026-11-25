# The Presidential Turkey Atlas

A small, independently researched archive of America's luckiest birds.

**GitHub Pages URL (activation pending):** https://dev1niscool.github.io/presidential_turkeys/

The complete site is pushed to `main`. To enable hosting, open [Settings → Pages](https://github.com/dev1niscool/presidential_turkeys/settings/pages), choose **Deploy from a branch → main → /(root) → Save**. The connected app could push source but lacked the Pages and administration permissions required for initial activation.

## What’s inside

- Every annual formal presidential turkey pardon, 1989–2026 (38 years).
- Both birds’ names where recorded, ceremony dates, origins, retirement destinations, facts and sources.
- Search by name, year, president or origin; decade and president filters; chronological sorting.
- Shareable year profiles, e.g. `#year-2024`, and a short history separating earlier presentations from annual formal pardons.
- Locally stored public-domain archival photographs with per-image attribution. Missing photos and unknown names are labeled explicitly.

## Run locally

Python 3 and Node.js are enough; no package installation or build is needed.

```sh
npm run dev
# Open http://127.0.0.1:3000
npm test
```

GitHub Pages serves `main` at the repository root. All application and image URLs are relative, so project subpaths work. `.nojekyll` keeps the static files untouched.

## Update the archive

Edit `data/turkeys.json`. Each year has `year`, `names`, `president`, `date` (ISO date), `origin`, `retirement`, `fact`, `sources` (label/URL pairs), and an optional `note`. Empty `names` means not recorded; do not invent placeholder bird names. A single known name may have an unnamed alternate described in the note. Source the ceremonial bird/alternate distinction explicitly; name order alone does not assert it.

Photographs live in `assets/photos/`. `manifest.json` maps each year to its local path, accurate alt text, photographer, source page and license. `hero.json` records the cover photograph. Add only correctly identified photographs with suitable rights, compress them, and preserve provenance. Do not reuse another year's image to fill a gap.

Primary White House remarks and contemporaneous records take precedence when later summaries conflict. Several discrepancies are disclosed in the individual record notes. 2026 was checked against official White House pages on November 25, 2026; Texas A&M is the announced retirement destination, not a confirmed arrival.

## Image rights and independence

Photographs are U.S. federal-government works identified as public domain by their source records; see each profile and the manifests for exact credits and links. The graphic turkey mark was drawn for this site. Fonts are served by Google Fonts (DM Sans and Libre Caslon Display), with local system fallbacks. This project is not affiliated with the White House or the National Archives.

Corrections and additional sourced archival photographs are welcome through GitHub issues or pull requests.
