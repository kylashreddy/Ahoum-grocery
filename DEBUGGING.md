# Debugging log

Two real issues found while exercising the app during development (not hypothetical write-ups) — both caught by actually driving the app and checking `localStorage`/store state, not just reading the code.

## 1. The cart-reconciliation banner never rendered, even though reconciliation worked

**Symptom.** Manually seeded `localStorage["ahoum-cart"]` with a cart containing a deleted product, an out-of-stock product, and a quantity of 999 on a normal product, then reloaded. `localStorage` afterwards showed the cart had been correctly fixed (bad lines dropped, quantity clamped to 20, price corrected) — but the `ReconciliationBanner` never appeared on screen. The user would have no idea their cart had changed.

**Diagnosis.** Added a temporary log and noticed `reconcile()` was being called twice on mount, and the second call ran with an already-clean cart, found nothing to fix, and overwrote `lastReconciliation` back to `[]` before the component had rendered the first result.

**Root cause.** React's `StrictMode` (on in this app, as it should be) intentionally double-invokes effects in development to surface exactly this kind of bug. `App.tsx`'s `useEffect(() => reconcile(), [reconcile])` ran twice; `reconcile()` itself was not idempotent with respect to the *notes* it produced — a second call against already-fixed data legitimately finds "nothing wrong" and clears the notes from the first call.

**Fix.** Added an in-memory (non-persisted) `hasReconciledThisSession` flag to `cartStore` — `reconcile()` is now a no-op after the first real run per app load. Also added `partialize: (state) => ({ lines: state.lines })` to the persist config so the guard flag and the notes themselves never leak into `localStorage` (they're session-transient by design). See [cartStore.ts](src/stores/cartStore.ts).

**Verification.** Re-seeded the same corrupted cart via `localStorage.setItem`, hard-reloaded, and confirmed the banner now lists all three corrections ("no longer available", "out of stock", "quantity adjusted from 999 to 20; price updated from $3.50 to $6.99") and stays visible. Also re-ran the full `reconcileLine` unit suite to confirm the underlying data-fixing logic was never the problem — only the UI's ability to show its result was.

## 2. The cart's own quantity stepper could bypass the 20-per-item cap

**Symptom.** `addItem` (used by the "+" button on product cards and the product detail page) capped every line at `min(stock, 20)`. But the Cart screen's own +/- stepper calls `setQuantity` directly, and `setQuantity` only checked `quantity <= 0` — it never looked at stock or the 20-unit cap at all. For any product with stock above 20 (several fixtures do, e.g. bananas at 60, sodas at 88+), a user could open the cart and click "+" past 20 indefinitely.

**Diagnosis.** Read through every call site that mutates `lines` and noticed `addItem` and `setQuantity` each hand-rolled their own bound instead of sharing one. `ProductCard`'s own increment button had the same class of bug in miniature: its `disabled` check only compared against `product.stock`, so for a high-stock item the button stayed enabled past 20 and clicking it silently did nothing once the store-side cap kicked in (in `addItem`) — confusing, not crash-inducing, but a real UX inconsistency.

**Root cause.** The 20-unit cap (`MAX_QUANTITY_PER_ITEM`) lived as a private constant used inline in `addItem` only; nothing forced other mutation paths or UI disabled-states to agree with it.

**Fix.** Exported `MAX_QUANTITY_PER_ITEM` and added a single `maxAllowedQuantity(product)` helper (`min(stock, MAX_QUANTITY_PER_ITEM)`) in `cartStore.ts`. `setQuantity` now looks up the live product and clamps through it; `addItem` was refactored to use the same helper; `ProductCard`, `CartScreen`, and `ProductDetailScreen` all now disable/cap their steppers using `maxAllowedQuantity` instead of `product.stock` directly.

**Verification.** Added `src/test/cartStore.test.ts`, which exercises the real store (not just the pure `reconcileLine` function): asserts `addItem` and `setQuantity` both land on exactly 20 for a 60-in-stock product when asked for 70, and that `setQuantity(..., 0)` still removes the line. All 13 tests pass (`npx vitest run`).
