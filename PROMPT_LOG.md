# AI prompt log

Tool used throughout: **Claude Code** (Sonnet 4.5), in an agentic session with direct shell, file, and browser access. This log records the material prompts, what was used verbatim vs. changed, and how each was verified — not a transcript of every message.

## Prompt 1 — "How do I approach this assignment?"

**Prompt (paraphrased):** given the assignment brief (a .docx), asked for a plan: what the tech stack should be, how to sequence the 24 hours, and specifically how to approach the two engineering challenges (stale search responses, persisted cart consistency).

**What I used:** the proposed time budget and screen list, the request-id-guard sketch for the search race condition, and the three-case reconciliation framing (missing product / stale price / bad quantity) for the cart — these became the actual shape of `useProductSearch` and `reconcileLine`.

**What I changed:** the initial sketch proposed either an abort-controller-only or id-guard-only fix for the search race; I deliberately combined both (see [DECISIONS.md](DECISIONS.md), decision 1) rather than taking the simpler single-mechanism suggestion, because an abort-only fix's correctness depends on every layer honouring the signal promptly, and a request-id guard alone doesn't cancel wasted work.

**How verified:** the guard logic was covered with unit tests (`staleGuard.test.ts`) simulating out-of-order resolution before writing any UI, so the mechanism was proven correct independent of the React wiring.

## Prompt 2 — Figma link, then "start building the project"

**Prompt:** shared the Figma file link (`Frontend-Grocery-App-Test`) and asked to proceed with implementation.

**What I used:** the full screen inventory read from the file (Home, Explore/"Find Products", category listing, Beverages-style product grid, Product Detail, Search, Filters, My Cart, Favourites, Checkout, order-success/error) and the visual language (green brand colour, rounded product cards, bottom nav with Shop/Explore/Cart/Favourite/Account) directly informed the component structure and Tailwind theme tokens.

**What I changed/rejected:** the Figma's mock filter data used placeholder brand names ("Individual Collection", "Osaria", "Rald", "Kid Famous") — kept these as-is for fidelity to the design's filter UI rather than inventing "nicer" brand names, since they're clearly intentional placeholder content in the source file, not something to "fix".

**How verified:** ran the dev server and drove it directly (add-to-cart, category filtering, search, checkout success flow, desktop breakpoint) via browser automation rather than trusting the code to be correct on inspection alone — this is what surfaced both real bugs below.

## What AI got wrong / what I corrected

1. **The cart-reconciliation banner silently never appeared.** The generated code called `reconcile()` in a `useEffect` with no guard against React StrictMode's intentional double-invocation in development. The second call ran against already-fixed data, found nothing wrong, and overwrote the first call's notes with an empty array — so the "your cart changed" banner was computed correctly and then erased before it could render. Caught by manually seeding a corrupted cart into `localStorage` and reloading, then noticing the store's final state was correct but the UI showed nothing. Fixed by adding an in-memory `hasReconciledThisSession` guard flag (excluded from persistence) so reconciliation only ever does real work once per load. Full write-up in [DEBUGGING.md](DEBUGGING.md#1-the-cart-reconciliation-banner-never-rendered-even-though-reconciliation-worked).

2. **The 20-unit-per-cart-line cap was enforced in `addItem` but not in `setQuantity`.** The initial implementation hardcoded the cap inline inside `addItem` only; the cart screen's own +/− stepper calls `setQuantity`, which had no cap at all, so a high-stock product's quantity could be pushed arbitrarily high directly from the cart screen while the product-card "+" button silently stopped working at 20 for the same product. Caught by re-reading every mutation path against the stated business rule rather than assuming one enforcement point was enough. Fixed by extracting a single `maxAllowedQuantity()` helper used by every mutation path and every disabled-state check. Write-up in [DEBUGGING.md](DEBUGGING.md#2-the-carts-own-quantity-stepper-could-bypass-the-20-per-item-cap).

Both fixes are covered by unit tests added specifically to catch a regression of the same bug (`cartStore.test.ts`), not just to demonstrate the fix once.

## Prompt 3 — "Check the Figma design one more time and verify or modify"

**Prompt:** asked to re-verify the built app against the Figma file rather than trust the first pass.

**What this caught:** the first implementation pass had invented plausible-looking but wrong Brand filter values ("Osaria", "Rald", "Kid Famous") instead of reading them precisely off the Filters screen at a legible zoom level. Re-inspecting at 200% zoom showed the real values are **Individual Collection, Cocola, Ifad, Kazi Farmas**. Separately, this pass also caught a structural omission: the Figma Filters screen has both a "Categories" section (Eggs / Noodles & Pasta / Chips & Crisps / Fast Food) and a "Brand" section, but the first build only implemented "Brand".

**What I changed:** replaced the three wrong brand values everywhere they appeared (`Brand` type, all mock products, `FiltersPanel`, `SearchScreen`'s placeholder copy). Added the missing "Categories" checkbox group to `FiltersPanel`, and — since `CategoryScreen` is scoped to one category by route — implemented it as a union filter: checking another category fetches and merges its products into the current view rather than only ever narrowing results, which is the only interpretation that makes sense given a single-category route.

**How verified:** `tsc -b`, the full test suite, and a production build all stayed clean; then confirmed live in the browser that toggling "Chips & Crisps" while on the Beverages category page expanded the result count from 5 to 8 (the correct union), and that the Filters panel now visually matches the Figma's two-section (Categories + Brand) structure.
