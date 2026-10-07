# SpellGarden Backlog

A running list of bugs, tech debt, and polish items to revisit.
Work through these top to bottom within a section — each item is its own focused session, commit, and PR.

Context: a full codebase + visual review was done Oct 2026 after months away from the project.
Two urgent items it found (stale puzzle schedule, dead dictionary API) were already fixed before
this list was written, so they're not included below — just the rest of what the review turned up.

Bigger, structural garden-theme ideas (a visible growing plant, a petal-shaped letter
grid, a literal garden-bed found-words view) came out of the same design pass but need
real sketching before they're ready to be tasks — see `DESIGN_VISION.md` instead of
here.

---

## Visual Polish (make it feel like a professional NYT-style game)

Palette, typography, the icon-vs-emoji swap, button shape/hierarchy, and the word
input were designed, implemented, and shipped (PR #15) — "Botanical Minimal, Dark":
a near-neutral dark background, the gold-center/purple-petal flower grid, the
rainbow-by-length "garden of blooms" found words, Space Grotesk (display) + Karla
(body) via `next/font`, and Phosphor duotone icons replacing every emoji in the app.
(Display font ended up as Space Grotesk, not the originally-floated Bricolage
Grotesque — Bricolage's capital Q was nearly indistinguishable from an O on the
letter tiles, a real legibility problem for a word game.) See `DESIGN_VISION.md`
for the larger structural ideas layered on top of this later.

### Desktop two-column layout disappears outside landscape
- **What:** The found-words sidebar and divider are gated behind `md:landscape:` classes. In an ordinary desktop browser window that happens to be taller than wide, the two-column layout vanishes entirely and the game looks like the mobile layout stretched out.
- **Fix:** Switch the breakpoint logic to a real width-based breakpoint (e.g. `lg:`) or a container query instead of `landscape`, and cap/center the content width on wide viewports instead of leaving the board pinned to the top-left.
- **Priority:** Medium — likely the actual cause of the oddly empty desktop screenshot from the review.
- **Spotted:** Code review, Oct 2026

### Bare spinner loading screen
- **What:** While `useGameState` loads, the whole page is replaced by a spinner on a black screen.
- **Fix:** Render a skeleton of the board/header shape instead, so the layout doesn't pop in.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Nothing to share — no OG image, manifest, or share card
- **What:** `public/` is empty. No Open Graph image, no `manifest.json`, no apple-touch-icon. Pasting the link anywhere shows a blank preview card.
- **Fix:** Add an OG image, web manifest, and touch icons. A Wordle-style "share your score" grid could follow later.
- **Priority:** Low — an easy one, but the game is mostly played by two people right now, so sharing isn't a focus.
- **Spotted:** Code review, Oct 2026

---

## Accessibility

Low priority overall — the game is mostly played by two people right now.

### Modals and messages aren't accessible
- **What:** No modal has `role="dialog"`, Escape doesn't close any of them, there's no focus trap, and the success/error message (`page.tsx`) has no `aria-live` region so screen readers never announce it.
- **Fix:** Add `role="dialog"` + `aria-modal`, an Escape key handler, basic focus trapping (or a small headless-UI-style primitive — `@headlessui/react` is already a dependency and unused elsewhere), and `aria-live="polite"` on the message container.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### Global `user-select: none`
- **What:** `globals.css` sets `user-select: none` on every element, so players can't copy a found word out.
- **Fix:** Scope `user-select: none` to the letter grid/buttons only, not globally.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

---

## Code Simplification / Tech Debt

This section is the current top priority (owner feedback, Oct 2026).

### `page.tsx` is doing too much
- **What:** 400+ lines, ten pieces of `useState`, and six separate modal-open booleans.
- **Fix:** Extract `<GameHeader>`, `<WordInput>`, and `<GameControls>` components; collapse the modal booleans into one `activeModal: 'yesterday' | 'definition' | 'hints' | 'howToPlay' | null` field.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Found-words list renders twice in the DOM
- **What:** `page.tsx` renders `<FoundWordsList>` once for mobile and once for desktop, with CSS hiding whichever doesn't apply — both copies exist in the DOM and both run Framer Motion animations.
- **Fix:** Render one instance and switch its layout/classes responsively, or conditionally render based on a `useMediaQuery`-style hook.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### Hint Level 3 fetches definitions one at a time
- **What:** `generateWordClues` awaits one `/api/definition/:word` call per unfound word, sequentially. The new API route is fast and cached (~0.3s/word measured), so this is no longer the 15-minute stall it used to be, but on a puzzle with 50-70 words it can still take a noticeable number of seconds before Level 3 is ready.
- **Fix:** Fetch with a small concurrency cap (e.g. 5-6 at a time), or better, load each card's definition lazily when the player taps it rather than pre-fetching the whole list.
- **Priority:** Low — works fine now, just not optimal.
- **Spotted:** Code review, Oct 2026

---

## Performance (More involved, investigate first)

### Reduce unused JavaScript (~83 KiB / ~450ms savings)
- **What:** Lighthouse flags 83 KiB of unused JavaScript, with an estimated 450ms LCP improvement if deferred. Likely caused by Firebase and Framer Motion being loaded eagerly on page load. (The full `puzzle_sets.json` import was also a contributor; that was moved server-side in Oct 2026, cutting the page's JS from 135 kB to 78 kB. Re-run Lighthouse before doing more here.)
- **Fix:** First, investigate with `next build --analyze` (requires adding `@next/bundle-analyzer` as a dev dependency). Then look at lazy-loading modals (`dynamic(() => import(...))`), and deferring Firebase initialization until it's actually needed.
- **Priority:** Low-Medium — meaningful load time improvement, especially on mobile.
- **Spotted:** Lighthouse audit, Feb 2026

---

## Major Upgrades (Plan carefully, do last)

### Update Next.js to address high-severity DoS vulnerabilities
- **What:** The current Next.js 14.x has two high-severity CVEs: DoS via Image Optimizer `remotePatterns` misconfiguration and HTTP request deserialization via insecure React Server Components.
- **Fix:** First check if a patched 14.x release is available. If not, plan a deliberate upgrade to Next.js 15 — `npm audit fix --force` would jump to Next.js 16 which is a large breaking change and needs proper testing.
- **Priority:** Medium — high severity, but DoS vectors are server-side. Assess actual exposure before treating as urgent.
- **Spotted:** `npm audit`, Feb 2026

### Review and clean up ESLint-related vulnerabilities
- **What:** Several moderate/high CVEs in `ajv`, `minimatch`, `brace-expansion`, and `glob` trace back to ESLint dev dependencies. Fixing requires downgrading ESLint to v4 (a major breaking change) and is not worth it right now.
- **Fix:** These are dev-only and have zero production impact. Revisit naturally when upgrading ESLint to a newer major version.
- **Priority:** Low — dev-only, no production impact. Safe to defer indefinitely.
- **Spotted:** `npm audit`, Feb 2026

---

## Decided Against (don't re-raise)

### Pinch-zoom lock stays
- `layout.tsx` sets `maximumScale: 1, userScalable: false` on purpose. The game is played mostly on an iPad, and accidental zooming kept breaking the layout mid-game. Keep the page non-zoomable.
- **Decided:** Oct 2026

### Level progress bar stays per-rank
- The review flagged the bar as misleading because it fills within the current rank rather than showing overall score. Owner's call: it reads clearly as progress toward the next rank, and an extra label would clutter the screen. Only revisit if it turns out to confuse real players.
- **Decided:** Oct 2026
