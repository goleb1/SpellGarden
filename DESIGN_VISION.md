# SpellGarden Design Vision

Bigger, structural visual ideas that came out of an Oct 2026 design pass — things that
would meaningfully differentiate SpellGarden from being "Spelling Bee with different
colors," beyond the palette/type/icon refresh that's being shipped as a smaller first
pass (see BACKLOG.md). These need real design iteration (sketches, probably a few
rounds) before they're ready to become backlog tasks, so they live here until then.

## Why this exists

Even with a refined palette, type, and icons, the app still reads as a Spelling Bee
reskin because it shares Spelling Bee's actual skeleton: a honeycomb grid, a
horizontal button row, a plain side list of found words. Color alone can't fully
escape that — the shapes need to change too. The ideas below target the skeleton,
not the paint.

They're ranked roughly by impact-for-effort, highest first.

---

## 1. Make the plant-growth rank system visible, not textual

**What:** The game already has an 8-stage plant-growth rank system (Dormant → Seedling
→ Sprout → Budding → Blooming → Flourishing → Verdant → Botanist → Mother Earth,
defined in `LevelIndicator.tsx`'s `LEVELS` array) and the app's own description says
"watch your vocabulary grow." Right now that growth is only a text label and an
abstract progress bar fill. There's no actual plant.

**Idea:** A small illustrated plant/flower that visibly grows through those stages as
score climbs — a real companion element near the header (or wherever it reads best in
the iPad-landscape layout), not just a stat. This is the single biggest "this is
clearly not Spelling Bee" move available, and it's not decoration — it's surfacing a
mechanic that's already fully built in the scoring logic.

**Why it's #1:** Highest payoff for the amount of new logic needed — the score
thresholds and stage names already exist; this is purely a visual layer on top of
state that's already computed.

---

## 2. Break the hexagon — petal-shaped letter grid

**What:** Hex tiles are Spelling Bee's signature shape. Even recolored, a honeycomb
grid reads as "Spelling Bee, reskinned" before anyone processes color.

**Idea:** Render the letter grid as an actual flower — six rounded petals around a
center disc — instead of six hexagons around a hexagon. Exact same interaction
(click a letter, same radial layout, same center-letter-required rule), different
tile silhouette. This is the structural change that would read as genuinely different
at a glance, independent of color.

**Why it's #2:** High visual impact, but needs real shape/SVG work (clip-path or SVG
petal shapes that still tile cleanly, read legibly at small sizes, and work across
phone/desktop/iPad-landscape) — more design and implementation effort than #1.

---

## 3. Turn the found-words list into a literal garden bed

**What:** Right now "longer word = nicer color" (the bloom-by-length chip coloring)
is abstract — you have to already know the mapping to feel the payoff. The list is
functionally just a tagged word list.

**Idea:** Found words plant something — small flower/bloom glyphs in a literal
garden-bed strip, sized or varied by word length, with pangrams as a rare standout
bloom (a sunflower, tying back to the gold center letter). The found-words area
becomes a little illustration that fills in over the course of a puzzle instead of a
stack of text pills. The actual word text would still need to be readable (tap/hover
to reveal, or small labels under each bloom) — players need to verify what they've
found, so this augments the list rather than replacing its function.

**Why it's #3:** Meaningful payoff, moderate effort — mostly a rethink of
`FoundWordsList.tsx`'s rendering, reusing the bloom-color logic that's already in the
refreshed palette.

---

## 4. Smaller, cheap add-ons (pair with whichever of the above gets built)

- **Bloom/sprout micro-animation on finding a word.** Framer Motion is already a
  dependency; a quick grow-in animation when a word lands would tie the moment of
  success to the garden metaphor viscerally rather than just a chip fading in.
- **Extend the existing pangram/bingo particle burst.** `PuzzleInfo.tsx` already has
  a `Burst` component that fires small particles on a pangram or bingo — a bigger or
  flower-petal-shaped version of that same burst for pangrams would reinforce rarity
  without building a new animation system from scratch.
- **Planter-box / garden-bed framing chrome.** A raised-bed or planter-box visual
  frame around the whole board instead of a flat card, so the page's silhouette reads
  as "garden" before anyone even looks at colors.

---

## 5. Open question: the two-player household framing

SpellGarden is primarily played by James and his wife together, daily, on an iPad in
landscape. There may be something worth exploring in how the game frames that shared
ritual — but this needs to start from understanding the actual current setup (same
device/login, or separate accounts/devices?) before proposing anything concrete.
Revisit this once the structural ideas above are further along.

---

## Sequencing

1. Ship the smaller polish pass first (see BACKLOG.md's Visual Polish section): new
   palette/type/icons/input, refined dark mode. Low risk, already designed.
2. Come back to this file for the next design round once that's live. Likely starts
   with sketching #1 and #2, since those are the real differentiators.
