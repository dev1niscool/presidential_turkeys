# Execution record — Presidential Turkey Atlas

User delegated design and implementation decisions and explicitly authorized repository and GitHub Pages publication.

- Research: independent early/recent researchers checked all 38 annual records; image researcher supplied 30 yearly photographs and hero provenance.
- Search: tests first failed due absent archive module, then passed with implementation; covers normalized multiword search, intersecting filters, empty results, reset and immutable sorting.
- Data: contiguous annual coverage, sources, proper unknown name handling, local JPEG signatures and provenance verified. Pillow decoded every photograph successfully.
- Preview: managed daemon initially received incompatible Python CLI arguments; added a preview adapter. Retry then failed because browser-port relay readiness timed out. No network or sandbox settings changed. Live Pages UI inspection planned after deployment.
- Implementation choice: newly cloned repository has only an initial README; built on feat/turkey-atlas branch in its dedicated checkout, preserving main until final verification.
- Content choice: unknown photographs remain explicit placeholders; unknown names are empty arrays. Sources identify any known alternate; record order alone does not indicate ceremonial bird.
- Publication: user's original instruction authorizes fast-forward main and Pages configuration; no extra publishing gate is needed.

- Independent review: Chromium verified combined filters, reset, direct-year navigation, browser Back, Escape and focus restoration, mobile widths and image decoding. Two important issues were optional hero metadata blocking archive load and missing cover-image fallback. Both fixed; new metadata-failure test observed red then green. Six tests pass. Rotated seal overflow was also corrected. Historical source checks were performed by the research agents, separate from code review.

- Source published: main f93003a. Pages activation blocked: connected GitHub App has contents/workflows access but no pages or administration write grants. REST creation returned empty HTTP 500; subsequent GET confirms no Pages site. Browser fallback failed at initialization. User was given the exact settings action. Do not claim the Pages URL is live until enabled and verified.

## Selection-screen revision

User requested a simpler, less verbose site resembling a video-game player-selection screen. Replaced the landing page with an interactive portrait roster and selected preview. Removed the hero introduction, slogans, statistics, timeline, about section and repeated labels. Existing factual records and sources remain in compact profiles; source notes and credits are expandable. Added keyboard arrows and year-specific image framing.

GitHub Pages was found enabled on main before the revision; the earlier activation blocker is resolved. Browser assertions passed for hover/focus preview, click, Escape/focus restoration, combined search/decade, empty reset, direct links and widths 320–1440. Six data/search tests pass.

## Archival-image recovery

User requested a wider photo search, including stills from old ceremony footage. Added the 1989 first-pardon photograph from the Bush Library/NARA; extracted public-domain White House Television stills for 1993 (03:40), 1996 (02:28), 2000 (07:04), and 2013 (04:05). Replaced the 1999 400-pixel image with its 1040-pixel archival version. Each asset was visually matched to its year; source records, library credits and video timestamps are retained in the manifest and profile credits.

The archive now has images for 35 of 38 years. Official Clinton Library ceremony films are linked for 1994, 1995 and 1997. Their videos were identified, but downloadable footage or correctly identified digitized photographs could not be obtained. The 1994 library finding aid lists photograph contact sheets P22270–P22299 but does not publish their images. No unrelated photographs were substituted. Film links use a small play symbol in the existing roster and a single “Watch ceremony” link in the profile.

The new browser assertions first failed on the missing 1989 image, then passed after integration. They decode all five recovered images, check the three official-film links, and guard against nested anchors. All six data/search tests pass, along with the existing hover, keyboard, dialog, filter and responsive checks.

Independent review found no concrete issues; all 35 image dimensions matched their manifests. Desktop portrait framing and the mobile film profile were visually inspected.

A final browser rerun exposed a timing issue in the new test: it moved focus before the native dialog close event finished restoring focus. Event logging confirmed the ordering; the checks now await that event before continuing.

## Final three portraits

The user supplied screenshots of the official 1994, 1995 and 1997 Clinton Library videos. The visible titles identify each year. Added the originals byte-for-byte, with exact browser viewport bounds excluding the player UI; no historical pixels were generated or retouched. The manifest preserves the official video links, Clinton Library credits, original dimensions and capture notes. No timestamp is claimed because none is visible. All 38 years now have images.

Browser assertions were updated from the three film-only tiles to screenshot previews, profile images and video-source credits. They first failed before integration and then passed. Six data/search tests also passed. Desktop roster and mobile profile framing were visually checked, with all three birds visible and player controls excluded.
