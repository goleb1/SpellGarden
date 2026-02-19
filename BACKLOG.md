# SpellGarden Backlog

A running list of cleanup tasks, tech debt, and low-priority improvements to revisit.
Work through these top to bottom — each item is its own focused session, commit, and PR.

---

## 1. UX & Error Handling

### Show user-facing error when game state fails to load/save
- **File:** `src/app/page.tsx` (line 40) and `src/lib/hooks/useGameState.ts`
- **What:** `stateError` is returned from `useGameState` but never consumed in `page.tsx`. If Firestore fails, the error is silently swallowed with no message shown to the player — they'd just see a broken game with no explanation.
- **Fix:** Display a toast or inline banner when `stateError` is non-null.
- **Priority:** Low-Medium — rare failure case, but confusing when it does happen.
- **Spotted:** Code review, Feb 2026

---

## 2. Code Quality & Refactoring

### Extract duplicate found-words list into a shared component
- **File:** `src/app/page.tsx` (lines ~351-390 and ~403-441)
- **What:** The mobile and desktop found-words lists are completely copy-pasted blocks of JSX, including a `getWordStyle()` function defined twice. Any styling or logic change must be made in two places.
- **Fix:** Extract into a `<FoundWordsList>` component that accepts words as a prop and is used in both layouts.
- **Priority:** Low — no bug, but a maintenance hazard every time word styling is changed.
- **Spotted:** Code review, Feb 2026

### Wrap keyboard handler functions in `useCallback`
- **File:** `src/app/page.tsx` (lines ~74, ~78, ~139) and `src/lib/hooks/useGameState.ts` (line ~116)
- **What:** `handleLetterClick`, `handleDelete`, `handleSubmit`, and `migrateLocalToFirestore` are recreated on every render, causing the keyboard `useEffect` to tear down and re-attach its listener unnecessarily. Currently flagged by the Vercel build as `react-hooks/exhaustive-deps` warnings.
- **Fix:** Wrap each function in `useCallback()` with appropriate dependency arrays.
- **Priority:** Low — no user-facing bug, just unnecessary work on each render.
- **Spotted:** Vercel build warnings, Feb 2026

### Fix potential flash of wrong grid size on mobile in `LetterGrid`
- **File:** `src/components/LetterGrid.tsx` (lines 21-31)
- **What:** `isMobile` initializes as `false` (desktop), then a `useEffect` corrects it after the first render. On mobile this causes the hex grid to briefly render at the wrong (desktop) radius before snapping.
- **Fix:** Initialize as `null` and skip rendering until the check has run, or replace JS detection with a CSS-only approach using Tailwind responsive classes.
- **Priority:** Low — very brief flash, most users won't notice.
- **Spotted:** Code review, Feb 2026

### Remove unnecessary handler wrappers for How to Play modal
- **File:** `src/app/page.tsx` (lines ~131-137)
- **What:** `handleCloseHowToPlay` and `handleShowHowToPlay` are single-line functions that just call `setIsHowToPlayModalOpen(true/false)`. They add no logic and can be inlined.
- **Fix:** Replace with inline arrow functions or pass the setter directly.
- **Priority:** Very low — purely cosmetic.
- **Spotted:** Code review, Feb 2026

---

## 3. Performance (More involved, investigate first)

### Reduce unused JavaScript (~83 KiB / ~450ms savings)
- **What:** Lighthouse flags 83 KiB of unused JavaScript, with an estimated 450ms LCP improvement if deferred. Likely caused by Firebase and Framer Motion being loaded eagerly on page load.
- **Fix:** First, investigate with `next build --analyze` (requires adding `@next/bundle-analyzer` as a dev dependency). Then look at lazy-loading modals (`dynamic(() => import(...))`) and deferring Firebase initialization until it's actually needed.
- **Priority:** Low-Medium — meaningful load time improvement, especially on mobile.
- **Spotted:** Lighthouse audit, Feb 2026

---

## 4. Major Upgrades (Plan carefully, do last)

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
