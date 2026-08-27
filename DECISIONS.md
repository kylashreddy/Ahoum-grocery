# Engineering decisions

Non-trivial decisions, why they went the way they did, and what was traded off. Decisions that were simply dictated by the brief (e.g. "use Zustand", "TypeScript strict mode") aren't listed here.

## 1. Stale-search protection: layer an AbortController *and* a request-id guard, not just one

**The ambiguity.** The brief only requires that an older response never overwrite a newer one. The obvious minimal fix is either (a) `AbortController.abort()` the previous request when the query changes, or (b) track a monotonically increasing request id and ignore any response that isn't from the latest request.

**Options considered.**
- Abort-only: simplest, and stops the network call outright. But it depends on every layer between the fetch and the response actually honouring the abort signal promptly — the mock API does, but if this were swapped for a real fetch behind a slow proxy or a browser that queues the abort, there's a window where an aborted request's `.then()` could still fire before the abort propagates.
- Request-id-only: trivially correct regardless of what the network layer does, but doesn't actually cancel wasted work — the old request keeps running to completion for nothing.
- Both together (chosen): `AbortController` cancels the in-flight request as the primary mechanism (saves the wasted network round-trip), and `LatestRequestGuard` independently double-checks "am I still the latest?" before ever calling `setResults`. Belt-and-suspenders.

**Trade-off.** A little more code (`src/lib/staleGuard.ts` plus the `AbortController` bookkeeping in `useProductSearch`) than either mechanism alone. In exchange, the guard is provably correct on its own (see the four unit tests in `staleGuard.test.ts`, which never touch the network layer at all) — correctness doesn't depend on the abort machinery behaving perfectly.

## 2. Reconcile the persisted cart once per app load, not on every read

**The ambiguity.** The brief says "decide how your app handles" a persisted cart drifting from the live catalogue, but not *when* reconciliation should run.

**Options considered.**
- Reconcile on every cart read (e.g. inside a selector) — always perfectly up to date, but re-running the same drop/clamp logic on every render is wasted work and risks producing a fresh "banner" on every re-render if not carefully guarded.
- Reconcile once, right after the persisted store rehydrates (chosen) — cheap, and the user sees one clear "here's what changed" moment instead of a message that could flicker back in on unrelated re-renders.

**Trade-off.** If a product goes out of stock *while the app is already open* (impossible here since the catalogue is static mock data, but would matter with a real backend), the cart won't notice until the next full load. Given the brief frames this as a "refresh" scenario specifically, once-per-load matches the actual requirement; a real backend would likely also want a lighter-weight check on checkout as a second line of defence.

## 3. Checkout failure is a random ~25% chance, not a hidden debug toggle

**The ambiguity.** The brief wants both a success and a failure checkout state to exist and be reachable, but doesn't say how.

**Options considered.**
- A hidden query param or dev-only button to force failure — deterministic for a reviewer, but "hidden debug switches" are easy to forget about and don't reflect how the states would actually occur in production.
- A visible random failure rate baked into `placeOrder` (chosen), with the rate and the reasoning shown in the UI ("Orders fail about 1 in 4 times in this demo, so you can see both outcomes").
- The cart is deliberately *not* cleared on failure, only on success, so retrying is cheap and never requires re-adding items.

**Trade-off.** Less deterministic for a reviewer who wants to see the failure screen on the first try — mitigated by the ~1-in-4 odds making it easy to hit within a couple of attempts, and by the failure screen's "Try again" button routing straight back to `/checkout` with the cart intact.

## 4. Product imagery is generated inline (SVG data URIs), not fetched from a photo API

**The ambiguity.** Nothing in the brief mandates real photography, and "no backend required" pushes toward self-contained mock data.

**Options considered.**
- Pull from a stock-photo API (Unsplash/Pexels-style) — looks more realistic, but adds a network dependency, rate limits, and licensing considerations for something that's explicitly mock data.
- Generate a simple colored-tile-plus-emoji SVG per product at data-definition time (chosen, see `src/lib/placeholderImage.ts`) — zero network calls, zero licensing concerns, deterministic across environments (including CI or a reviewer with no internet).

**Trade-off.** Visually simpler than real product photography. Acceptable here since the assignment is graded on Figma *interpretation*, state management, and engineering judgement — not photo-realism — and the placeholder still carries per-category colour and a recognisable icon.
