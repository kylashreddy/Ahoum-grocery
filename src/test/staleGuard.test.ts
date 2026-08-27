import { describe, expect, it } from "vitest";
import { LatestRequestGuard } from "../lib/staleGuard";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("LatestRequestGuard", () => {
  it("discards an older request that resolves after a newer one (out-of-order network)", async () => {
    const guard = new LatestRequestGuard<string>();
    const requestA = deferred<string>();
    const requestB = deferred<string>();

    // Request A ("milk") starts first.
    const outcomeAPromise = guard.run(() => requestA.promise);
    // Request B ("bread") starts while A is still pending.
    const outcomeBPromise = guard.run(() => requestB.promise);

    // B's network call returns first, even though it started second.
    requestB.resolve("results-for-bread");
    const outcomeB = await outcomeBPromise;

    // A's network call finally returns, later than B.
    requestA.resolve("results-for-milk");
    const outcomeA = await outcomeAPromise;

    expect(outcomeB).toEqual({ stale: false, value: "results-for-bread" });
    expect(outcomeA).toEqual({ stale: true });
  });

  it("accepts a request when it is still the latest one at completion time", async () => {
    const guard = new LatestRequestGuard<number>();
    const outcome = await guard.run(() => Promise.resolve(42));
    expect(outcome).toEqual({ stale: false, value: 42 });
  });

  it("keeps a log entry for every completed request, marking staleness correctly", async () => {
    const guard = new LatestRequestGuard<number>();
    const first = deferred<number>();
    const second = deferred<number>();

    const p1 = guard.run(() => first.promise);
    const p2 = guard.run(() => second.promise);

    second.resolve(2);
    await p2;
    first.resolve(1);
    await p1;

    expect(guard.log).toHaveLength(2);
    expect(guard.log[0]).toMatchObject({ requestId: 2, discarded: false });
    expect(guard.log[1]).toMatchObject({ requestId: 1, discarded: true });
  });

  it("handles three overlapping requests, keeping only the last-started one", async () => {
    const guard = new LatestRequestGuard<string>();
    const a = deferred<string>();
    const b = deferred<string>();
    const c = deferred<string>();

    const pa = guard.run(() => a.promise);
    const pb = guard.run(() => b.promise);
    const pc = guard.run(() => c.promise);

    // Resolve completely out of order: b, then a, then c (the latest).
    b.resolve("b");
    await pb;
    a.resolve("a");
    await pa;
    c.resolve("c");
    const outcomeC = await pc;

    expect(outcomeC).toEqual({ stale: false, value: "c" });
    expect(guard.log.filter((entry) => !entry.discarded)).toHaveLength(1);
    expect(guard.log.filter((entry) => entry.discarded)).toHaveLength(2);
  });
});
