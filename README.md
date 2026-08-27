# Ahoum Grocery

A responsive React grocery-delivery app built from the Ahoum Frontend Developer Assignment Figma. Mobile-first, with a distinct desktop adaptation (see [DESIGN_NOTES.md](DESIGN_NOTES.md)). All data is mocked locally — no backend.

## Setup / run

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`). Resize below/above the `lg` breakpoint (1024px) to see the mobile vs. desktop layouts, or use your browser's device toolbar.

Other scripts:

```bash
npm run build      # type-check (tsc -b) + production build
npm run preview    # serve the production build locally
npx vitest run     # run the test suite once
npx vitest         # watch mode
npm run lint       # oxlint
```

## Architecture

```
src/
  api/            mock "network" layer — simulateNetwork() adds 200-1200ms random
                  latency (and an optional failure rate) to every call, so every
                  screen has to handle loading/error states for real
  lib/            framework-agnostic logic: staleGuard (challenge A), format,
                  placeholder image generator
  mocks/          static product + category fixtures
  stores/         Zustand stores — cartStore (persisted, reconciled on load),
                  favoritesStore (persisted), sessionStore (persisted, mock
                  entry/login only)
  hooks/          useAsync (generic load/error/retry), useProductSearch
                  (the stale-response-safe search hook)
  components/     shared UI: ProductCard, QuantityStepper, Skeleton/EmptyState/
                  ErrorState, FiltersPanel, layout/ (TopNav, BottomTabBar,
                  AppShell, ScreenHeader)
  screens/        one component per route
  test/           vitest unit tests (no React rendering needed — the two
                  engineering challenges are both tested as plain logic)
```

**State management.** Three separate Zustand stores, split by actual lifecycle/ownership rather than one global blob: `cartStore` (persisted + reconciled), `favoritesStore` (persisted, independent of cart), `sessionStore` (persisted, the mock login state). No Context/Redux, per the brief.

**Routing.** React Router, one route per screen (`/`, `/explore`, `/category/:id`, `/product/:id`, `/search`, `/cart`, `/favorites`, `/checkout`, `/checkout/success`, `/checkout/failure`, `/account`).

**Engineering challenge A (stale search):** `src/hooks/useProductSearch.ts` + `src/lib/staleGuard.ts`. Debounced input → `AbortController` cancels the previous in-flight request → a `LatestRequestGuard` independently discards the *result* of any request that's no longer the latest, even if abort didn't land in time. Proven with unit tests in `src/test/staleGuard.test.ts` (deferred promises resolved deliberately out of order); also visible live on the Search screen via "Show stale-response log".

**Engineering challenge B (persisted cart consistency):** `src/stores/cartStore.ts`'s `reconcileLine()` (pure, unit-tested in `cartReconciliation.test.ts`) handles: product deleted → dropped with a note; price changed → adopted from live data with a note; quantity zero/over-stock/over the 20-per-item cap → clamped or dropped with a note. Runs once per app load via `App.tsx`; surfaced to the user via `ReconciliationBanner`, dismissible. Full reasoning in [DECISIONS.md](DECISIONS.md).

**Required UX states:** skeleton loaders (`Skeleton.tsx`, used on Home/Explore/Category/Search/Product Detail), empty states (`EmptyState.tsx` — empty cart, empty favourites, no search results, no filtered results), failure + retry (`ErrorState.tsx`, driven by `useAsync`'s retry token), and visible focus rings (`:focus-visible` in `index.css`) plus `aria-label`/`aria-pressed` on every icon-only control.

## Known limitations

- Product imagery is generated inline (SVG placeholders), not real photography — see DECISIONS.md #4 for why.
- Checkout, delivery address, and payment are entirely mocked; "placing an order" doesn't persist anywhere beyond the success/failure screen.
- Filters (category + brand + in-stock) are client-side only over the already-fetched category page; there's no server-side filter query.
- The mock backend has no real persistence — categories/products are static fixtures, so "out of stock" or "price changed" scenarios are only reachable by manually editing `localStorage`'s `ahoum-cart` key (see DEBUGGING.md for exact steps) rather than through the UI over time.
- No automated end-to-end/browser tests — coverage is unit-level (`vitest`) for the logic that matters most (stale search, cart reconciliation, quantity caps); screen-level behaviour was verified manually.

## With another day, I would

- Add Playwright/Testing-Library coverage for full user flows (add → cart → checkout → success), not just the underlying logic.
- Make the Explore/Category screens' filters shareable via URL query params, so a filtered view is linkable/back-button-friendly.
- Add a proper skeleton for the Filters sidebar and Cart screen (currently only Home/Category/Search/Product Detail have one).
- Replace the SVG placeholder images with a small curated set of real product photos while keeping everything offline-safe (bundle them as static assets instead of fetching).
- Give the search debounce a small "typing" indicator distinct from the full loading skeleton, so short queries don't visually flash a whole skeleton grid.
