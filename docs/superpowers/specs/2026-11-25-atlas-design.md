# Presidential Turkeys — design

The user requests a tasteful atlas of every presidentially pardoned turkey, organized by year with fun facts and photographs, published in dev1niscool/presidential_turkeys and on GitHub Pages. They explicitly delegated design decisions and asked us to build.

## Direction
An editorial museum atlas: warm ivory paper, dark forest green, restrained rust accents, large serif type, fine rules, spacious photography. A photo-led introduction leads into the searchable annual collection, then a concise historical timeline and transparent source notes. Responsive and keyboard accessible.

## Approaches
A museum atlas balances archival authority and playful subject matter; chosen by the builder under the user's delegation. A magazine would privilege a few stories over complete browsing. A map would overemphasize geography and uncertain early origins. Use a buildless static site, vanilla JavaScript and CSS, with no runtime dependencies or accounts.

## Content and behavior
Cover each annual formal pardon from 1989 through the latest verified ceremony. Record both named birds when known; explicitly identify gaps. Keep pre-1989 milestones separate. Never invent names, dates or images. Every record has sources. Photos are actual labeled year-specific archival images with attribution; missing photos have an explicit archive placeholder.

Search names, years, presidents and origins. Combine search with decade and president filters and chronological sorting. Each record opens an accessible native dialog with facts, photo credit and source links; direct year URLs work. Include a random-record discovery button and a clear empty state/reset. Keep URLs and assets relative for GitHub Pages subpaths.

## Delivery
Store photographs locally and optimize them. Document updates and credits. Check data completeness and filter behavior, inspect desktop and mobile in browser, get independent code review, then push to main and enable GitHub Pages as explicitly requested.
