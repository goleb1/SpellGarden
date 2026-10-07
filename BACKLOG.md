# SpellGarden Backlog

A running list of bugs, tech debt, and polish items to revisit.
Work through these top to bottom within a section — each item is its own focused session, commit, and PR.

Context: a full codebase + visual review was done Oct 2026 after months away from the project.
Two urgent items it found (stale puzzle schedule, dead dictionary API) were already fixed before
this list was written, so they're not included below — just the rest of what the review turned up.

---

## Bugs

### Puzzle can roll over a day early for players east of UTC
- **What:** `getTodaysPuzzle()` in `puzzleManager.ts` calls `date.toISOString().split('T')[0]` on a date that was reset with `setHours(0,0,0,0)` — i.e. *local* midnight. `toISOString()` converts to UTC first, so for anyone at a positive UTC offset (most of Europe, all of Asia/Australia), local midnight can land on the *previous* UTC day. Verified: `new Date('2026-10-07T00:00:00+10:00').toISOString()` → `2026-10-06`. Those players get yesterday's puzzle a day early (and "Yesterday's Puzzle" shows the wrong day too).
- **Fix:** Build the `YYYY-MM-DD` string from local `getFullYear()/getMonth()/getDate()` instead of `toISOString()`. Same fix applies in `getPuzzleForDate` and anywhere else a local day is turned into a lookup key.
- **Priority:** High — affects correctness of the daily puzzle for a large share of the player base.
- **Spotted:** Code review, Oct 2026

### `npm run populate-words` is broken
- **What:** The script runs `ts-node src/scripts/populateWordList.ts`, but `src/scripts/` doesn't exist in the repo. CLAUDE.md and `populate-words.js` both still reference it.
- **Fix:** Either restore the script (check git history / an old branch for it) or update the command + docs to point at wherever puzzle generation actually lives now.
- **Priority:** Medium — blocks the documented way to generate new puzzle sets.
- **Spotted:** Code review, Oct 2026

### Dead second Next config file with a risky rewrite in it
- **What:** Both `next.config.js` and `next.config.mjs` exist. Next only loads the `.js` one, so `.mjs` is silently ignored — but it still contains a `rewrites()` proxying `/api/:path*` to `https://api.openai.com/:path*` and `dangerouslyAllowSVG: true`. Harmless only because it's dead; confusing and risky if anyone ever renames the live config.
- **Fix:** Delete `next.config.mjs`. If the OpenAI proxy or SVG image support is actually needed, merge it into `next.config.js` deliberately. The `env:` block in `next.config.js` is also redundant — Next inlines `NEXT_PUBLIC_*` vars automatically.
- **Priority:** Low — not currently causing harm, just dead/confusing config.
- **Spotted:** Code review, Oct 2026

### `next/head` usage in `page.tsx` does nothing
- **What:** `page.tsx` imports and renders `<Head>` from `next/head`, which is a Pages Router API and a no-op in the App Router. The landscape-rotation CSS hack and viewport meta tag inside it never actually apply.
- **Fix:** Delete the `<Head>` block. If the landscape-rotation behavior is still wanted, implement it via a CSS file or `viewport`/`metadata` exports in `layout.tsx`.
- **Priority:** Low — dead code, but worth confirming landscape mode actually behaves the way you want once it's gone.
- **Spotted:** Code review, Oct 2026

---

## Visual Polish (make it feel like a professional NYT-style game)

### Harsh pure black/white palette
- **What:** `bg-black text-white` on `<main>` overrides the light/dark CSS variables already defined in `globals.css` (which are otherwise dead code). Pure `#000`/`#fff` reads as a developer default, not a finished game — especially for something garden-themed.
- **Fix:** Design a warm, paper-like palette (soft off-white background, deep green ink, muted accent colors) and apply it through the existing CSS variables instead of hardcoded Tailwind black/white.
- **Priority:** High — single highest-leverage visual change.
- **Spotted:** Code review, Oct 2026

### No custom typography
- **What:** No `next/font` setup anywhere; the whole app runs on the Tailwind system font stack.
- **Fix:** Add one display/serif font for the wordmark, score, and rank name, and a clean sans for UI text, loaded via `next/font`.
- **Priority:** High — pairs with the palette change for the biggest "polish" jump.
- **Spotted:** Code review, Oct 2026

### Emoji used as functional UI
- **What:** The rank chip (💤 Dormant), the pangram/bingo indicators next to the title, and the Sort button (`⏪`/`🔤`/`📶`) all rely on emoji instead of icons. They render inconsistently across platforms and the sort icons aren't guessable — `⏪` for "chronological" doesn't read as anything in particular.
- **Fix:** Replace with small SVG icons (an icon set is already a dependency — `react-icons` or `lucide-react`). Label the sort button with text ("Newest" / "A–Z" / "Length") instead of relying on the icon alone.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Control button corner-rounding looks like a bug
- **What:** The leaf-shaped buttons use `rounded-bl-3xl rounded-br-3xl rounded-tr-3xl` (asymmetric rounding meant to suggest a leaf), but in the 2×2 mobile grid the four buttons' rounded corners point in different directions and read as inconsistent/broken rather than intentional.
- **Fix:** Either commit fully to the leaf shape with one consistent orientation across all four buttons, or simplify to plain pill buttons.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Word input looks like a disabled form field
- **What:** The current-word display is a real `<input readOnly>` styled as a grey pill with placeholder text — it looks like a disabled input, and it's a pointless tab stop.
- **Fix:** Render the typed letters as large plain text with a blinking cursor (closer to the NYT Spelling Bee treatment) instead of an `<input>`.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Desktop two-column layout disappears outside landscape
- **What:** The found-words sidebar and divider are gated behind `md:landscape:` classes. In an ordinary desktop browser window that happens to be taller than wide, the two-column layout vanishes entirely and the game looks like the mobile layout stretched out.
- **Fix:** Switch the breakpoint logic to a real width-based breakpoint (e.g. `lg:`) or a container query instead of `landscape`, and cap/center the content width on wide viewports instead of leaving the board pinned to the top-left.
- **Priority:** Medium — likely the actual cause of the oddly empty desktop screenshot from the review.
- **Spotted:** Code review, Oct 2026

### Level progress bar is misleading
- **What:** `LevelIndicator` fills the bar based on progress *within the current rank*, not overall score vs. total. At 5/182 points the bar can render over 50% full because that's most of the way through the first (tiny) rank band. Players will read it as overall completion.
- **Fix:** Either show overall progress with rank ticks marked along the full bar, or make the per-rank framing explicit in the UI (e.g. a secondary "X / Y to next rank" label).
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Bare spinner loading screen
- **What:** While `useGameState` loads, the whole page is replaced by a spinner on a black screen.
- **Fix:** Render a skeleton of the board/header shape instead, so the layout doesn't pop in.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### Nothing to share — no OG image, manifest, or share card
- **What:** `public/` only contains the default `next.svg`/`vercel.svg`. No Open Graph image, no `manifest.json`, no apple-touch-icon. Pasting the link anywhere shows a blank preview card.
- **Fix:** Add an OG image, web manifest, and touch icons. Consider a Wordle-style "share your score" grid as a follow-up — for a daily game that spreads by word of mouth, this is probably the single highest-value feature addition.
- **Priority:** Medium-High for growth, even though it's not a "bug"
- **Spotted:** Code review, Oct 2026

---

## Accessibility

### Modals and messages aren't accessible
- **What:** No modal has `role="dialog"`, Escape doesn't close any of them, there's no focus trap, and the success/error message (`page.tsx`) has no `aria-live` region so screen readers never announce it.
- **Fix:** Add `role="dialog"` + `aria-modal`, an Escape key handler, basic focus trapping (or a small headless-UI-style primitive — `@headlessui/react` is already a dependency and unused elsewhere), and `aria-live="polite"` on the message container.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Global `user-select: none` and locked pinch-zoom
- **What:** `globals.css` sets `user-select: none` on every element, so players can't copy a found word out. `layout.tsx` sets `maximumScale: 1, userScalable: false`, blocking pinch-zoom site-wide, including for players who need it.
- **Fix:** Scope `user-select: none` to the letter grid/buttons only, not globally. Reconsider the zoom lock, or at least don't disable it on text-heavy screens like the How to Play modal.
- **Priority:** Low-Medium
- **Spotted:** Code review, Oct 2026

---

## Code Simplification / Tech Debt

### Full puzzle schedule is shipped to every client
- **What:** `puzzle_sets.json` (381 puzzles, growing) is imported directly into `puzzleManager.ts`, which runs client-side — every visitor downloads every future day's puzzle and answers in the initial JS bundle. This is almost certainly the main contributor to the "unused JavaScript" Lighthouse finding already in this backlog.
- **Fix:** Move puzzle lookup into a server-only module or route handler (`src/app/api/puzzle/route.ts`) that reads the JSON on the server and returns only the requested day's puzzle to the client.
- **Priority:** Medium-High — correctness concern (answers are inspectable in devtools) as well as performance.
- **Spotted:** Code review, Oct 2026

### `page.tsx` is doing too much
- **What:** 400+ lines, ten pieces of `useState`, six separate modal-open booleans, and `getInitialGameState()` called fresh on every render.
- **Fix:** Extract `<GameHeader>`, `<WordInput>`, and `<GameControls>` components; collapse the modal booleans into one `activeModal: 'yesterday' | 'definition' | 'hints' | 'howToPlay' | null` field; memoize or hoist the initial state call.
- **Priority:** Medium
- **Spotted:** Code review, Oct 2026

### Found-words list renders twice in the DOM
- **What:** `page.tsx` renders `<FoundWordsList>` once for mobile and once for desktop, with CSS hiding whichever doesn't apply — both copies exist in the DOM and both run Framer Motion animations.
- **Fix:** Render one instance and switch its layout/classes responsively, or conditionally render based on a `useMediaQuery`-style hook.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### Duplicate `GameState` type definitions that have already drifted
- **What:** `gameLogic.ts` and `useGameState.ts` each declare their own `GameState` interface. They're not identical (the hook's version has `lastUpdated`, the other doesn't).
- **Fix:** Define it once in a shared location and import it in both places.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### `useGameState` doesn't wait for auth to resolve
- **What:** On mount, `user` is `null` before Firebase auth resolves, so the hook reads (and writes) localStorage as a guest, then re-runs once auth lands. Signed-in players can see a flash of guest state before their real progress loads.
- **Fix:** Gate the initial load on an `authLoading` flag from `useAuth` before reading/writing state.
- **Priority:** Low-Medium
- **Spotted:** Code review, Oct 2026

### Hint Level 3 fetches definitions one at a time
- **What:** `generateWordClues` awaits one `/api/definition/:word` call per unfound word, sequentially. The new API route is fast and cached (~0.3s/word measured), so this is no longer the 15-minute stall it used to be, but on a puzzle with 50-70 words it can still take a noticeable number of seconds before Level 3 is ready.
- **Fix:** Fetch with a small concurrency cap (e.g. 5-6 at a time), or better, load each card's definition lazily when the player taps it rather than pre-fetching the whole list.
- **Priority:** Low — works fine now, just not optimal.
- **Spotted:** Code review, Oct 2026

### Dead code and files to remove
- `src/lib/userPreferences.ts` — `UserPreferencesManager` has zero call sites anywhere in the app.
- `setTestPuzzleIndex` in `puzzleManager.ts` — exported but never called; CLAUDE.md's "Testing Different Puzzles" section references it, so either wire it up to something (a dev-only query param or menu toggle) or drop both the function and the doc line.
- `next.config.mjs`, `populate-words.js` (once the script above is fixed/removed), `public/next.svg`, `public/vercel.svg` — template leftovers.
- `.cursorrules` — describes an `src/app/components` / `src/app/lib` layout that doesn't match the actual `src/components` / `src/lib` structure in this repo.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### Unused dependencies
- **What:** `@headlessui/react`, `@heroicons/react`, `lucide-react`, `react-markdown`, `date-fns`, and `firebase-admin` (a server-only SDK currently in production `dependencies`) have no references in `src/`. `react-icons` is pulled in for a single icon (`IoClose`). `an-array-of-english-words` is a build-time-only dependency and belongs in `devDependencies`.
- **Fix:** Remove unused packages; move `an-array-of-english-words` to devDependencies; either remove `firebase-admin` or move it to devDependencies if it's only used by a local script.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

### Misc small cleanup
- `package.json` name is still `"template-2"` from the starter template.
- Ten `console.log` calls ship to production, including user emails in `AuthContext.tsx` on every sign-in.
- `EnhancedDefinitionService` (`hintLogic.ts`) types its one dependency as `any`.
- README and CLAUDE.md both describe a bingo bonus of +10 points, but `gameLogic.ts` has no bingo scoring logic at all — docs and code have drifted.
- **Priority:** Low
- **Spotted:** Code review, Oct 2026

---

## Performance (More involved, investigate first)

### Reduce unused JavaScript (~83 KiB / ~450ms savings)
- **What:** Lighthouse flags 83 KiB of unused JavaScript, with an estimated 450ms LCP improvement if deferred. Likely caused by Firebase and Framer Motion being loaded eagerly on page load, plus the full `puzzle_sets.json` import described above.
- **Fix:** First, investigate with `next build --analyze` (requires adding `@next/bundle-analyzer` as a dev dependency). Then look at lazy-loading modals (`dynamic(() => import(...))`), deferring Firebase initialization until it's actually needed, and moving the puzzle data server-side (see Tech Debt section above — likely the biggest single win here).
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
