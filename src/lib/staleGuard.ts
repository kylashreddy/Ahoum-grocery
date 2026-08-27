export interface StaleGuardLogEntry {
  requestId: number;
  discarded: boolean;
  finishedAt: number;
}

export type GuardedResult<T> = { stale: true } | { stale: false; value: T };

// Ignores the result of any request that's no longer the latest one when it
// settles — framework-agnostic so it's testable without React (see staleGuard.test.ts).
export class LatestRequestGuard<T> {
  private currentId = 0;
  readonly log: StaleGuardLogEntry[] = [];

  /** Id of the most recently started request; exposed for debug UIs. */
  get latestRequestId(): number {
    return this.currentId;
  }

  async run(task: (requestId: number) => Promise<T>): Promise<GuardedResult<T>> {
    const requestId = ++this.currentId;
    const value = await task(requestId);
    const stale = requestId !== this.currentId;
    this.log.push({ requestId, discarded: stale, finishedAt: Date.now() });
    return stale ? { stale: true } : { stale: false, value };
  }
}
