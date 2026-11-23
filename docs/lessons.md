# Lessons kept from outside projects

Notes from three repositories read on 2026-11-23, sorted by when they apply.

## Used in r1

From Lowdefy (a framework where apps are written as configuration):
- Pages as data. One list of pages drives the menus and, later, who may see what (`src/data/nav.ts`).
- A small, fixed set of building blocks instead of one-off markup per page (`src/components/ui/`).
- Data requests kept apart from layout (`src/lib/loaders.ts`), so the source can change without touching pages.
- Data shapes written down and checked (`src/data/types.ts`).

From the spellbook of modern web development (a 2017 to 2018 link collection, useful for ideas, not for tool choices):
- Design tokens as the single source for the look.
- CSS Grid and Flexbox for layout, self-hosted fonts with `font-display: swap`.
- IntersectionObserver for scroll effects, native form elements, a performance budget checked with Lighthouse.

From the frontend learning kit (a link-only study guide):
- WCAG AA as the accessibility baseline, Core Web Vitals as the speed baseline.
- A content security policy and security headers from day one (`public/_headers`).
- End-to-end checks in a real browser (Playwright here).

## For r2 and later

- Roles and access declared next to each page (the `access` field in `nav.ts` is the start), enforced on the server.
- Schema validation at every boundary where data enters (forms, the call provider, the database).
- Unit tests with Vitest for the rules that turn call answers into report lines.
- Installable app and offline reading for the caregiver side (service worker, Workbox), local storage for drafts.
- Translations (Spanish first) with a message-format library.
- Lowdefy itself could serve as an internal operations screen (reviewing calls, managing families). It needs Node hosting, and Cloudflare support is unverified.
- Feature-folder structure in the style of Bulletproof React if the app grows a client-side framework.
