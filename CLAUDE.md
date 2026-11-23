# I-on

I-on is a daily phone check-in for an older parent. A friendly voice (the character is a capybara called Ion) asks a short set of everyday questions, and the family gets a plain-language report with next steps. This repository holds release 1 (r1): the marketing site and the caregiver web app as a working front end on invented example data. There is no sign-in and no real data yet.

## Commands

- `npm run dev` starts the dev server. `npm run build` builds to `dist/`. `npm run check` type-checks. Both must pass before a commit.
- `npm run pages:dev` serves `dist/` with the waitlist function and a local D1 database.
- `node scripts/shot.cjs http://localhost:4321 <out-dir> / /app/ ...` takes full-page screenshots at 1440 and 390 wide and reports sideways overflow and console errors.

## How it is put together

- Astro, static output, deployed to Cloudflare Pages (`ion-2d8.pages.dev`; pushes to `main` go live, other branches get a preview address). The only server code is `functions/api/waitlist.ts`, which writes to the D1 database bound as `DB`.
- r2 (sign-in, real data) is expected to move to Cloudflare Workers with the Astro adapter. Whether data lives in Supabase or Cloudflare is undecided.
- `src/styles/tokens.css` holds every colour, size, radius and shadow. Never write a hex colour, a font name or a one-off pixel size in a component. If a token is missing, add it to `tokens.css`.
- `src/components/ui/` is the small shared vocabulary: Button, Chip, Card, Eyebrow, Icon, IconBadge (an icon on a soft tinted tile), Capybara, HealthCard, StatTile, StepRow, LineChart, Spark (tiny trend line), Ring (progress ring), Flow (a row of steps joined by arrows), SectionHeading. Use these before making something new. Page-specific pieces go in `src/components/site/` or `src/components/app/`.
- `src/layouts/`: `SiteLayout` for marketing pages, `AppLayout` for every app page (it draws the rail menu, the top strip, the page heading and the standing line; pass a small picture in the `head-art` slot).
- `src/data/nav.ts` is the single list of pages, with a one-line `hint` for each. Menus and shortcut tiles are drawn from it. Add a page there, not in a layout.
- `src/data/example.ts` is the invented family. Pages never import it directly. They call the functions in `src/lib/loaders.ts`, which r2 will point at a database.
- `src/data/types.ts` holds the shapes of all data.

## The look

"Bright desk" on a warm ground (chosen by Nima, November 2026): cream and beige, an apricot accent, espresso for dark panels, sage, butter and a little sky blue beside them. Floating pill menu on the site, big rounded panels, the capybara Ion in a green scarf. It should feel like a kitchen table, not a clinic.

- Show before you tell. Where a picture, a small chart, a ring, a row of icons or a flow of steps says it, use that and cut the paragraph. One idea per card. No walls of text, and no picture that is only there to fill space.
- Small labels are plain sentence case in the main typeface. No capitals-only labels, no code typeface, no "01 / 05" counters.
- Every app page should answer "where am I and what can I do here?" at a glance: a short heading, one line under it, the main thing first.
- Desktop (1280 to 1440 wide) is the polished size for now. Phone widths must not break.

## Rules for words

- Plain language a tired family member can read at a glance. Short sentences. No jargon, no clinical terms.
- Never name a medicine, a drug or a diagnosis. Medicines appear under the family's own labels ("Morning pills").
- I-on describes and suggests. It never diagnoses, never advises on doses and never tells anyone to start or stop a medicine. "You might ask her doctor about" is the strongest it gets.
- I-on is not an emergency service and says so. `STANDING_LINE` from `src/data/nav.ts` appears on every page.
- No invented statistics. Figures about ageing and caregiving come only from `src/data/site.ts`, each with its source, a link, and the year where the source gives one.
- No em-dashes and no arrow characters in copy. No prices. No promises about what a call will catch.
- The example family is invented and labelled as example data.
- The older adult is spoken about with respect: "your mom", "she said", never "the patient" or "the senior".

## Rules for pages

- Works from 360 px wide to 1440 px and up. No sideways scrolling of the page. Wide things (charts, tables) scroll inside their own box.
- Every control is at least 44 px tall, reachable by keyboard, with a visible focus ring. One `h1` per page, headings in order, landmarks present, images and charts described in words.
- Text contrast at least 4.5 to 1. The apricot `--acc` and the companion fills (`--leaf`, `--butter`, `--sky`) are backgrounds and always carry ink text. Coloured text is `--acc-text` (terracotta) or `--leaf-text` (green). The orange `--sun` is decoration only.
- Meaning never rests on colour alone: status chips carry words.
- Motion is small, uses CSS or IntersectionObserver, and is switched off under `prefers-reduced-motion`. Pages read correctly with JavaScript off. `data-reveal` on an element makes it rise in once; inside it (or inside `data-draw`), `.draw-line` on an SVG path with `pathLength="1"`, `.draw-grow` on a bar and `.draw-pop` on a dot or tile draw themselves, staggered by `--i`.
- No third-party scripts, fonts or trackers. No chart library: charts are inline SVG built at build time.
- Keep JavaScript small. Prefer native elements (`details`, `dialog`, `form`, radio groups) over custom widgets.

More background is in `docs/lessons.md`.
