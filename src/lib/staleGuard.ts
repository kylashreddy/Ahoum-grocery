export interface StaleGuardLogEntry {
  requestId: number;
  discarded: boolean;
  finishedAt: number;
}

export type GuardedResult<T> = { stale: true } | { stale: false; value: T };

/**
 * Tracks the most recently *started* async request and discards the result
 * of any earlier request that resolves after it — the fix for engineering
 * challenge A (stale search responses). Kept framework-agnostic and
 * synchronous-to-construct so it's trivial to unit test without React.
 *
 * Usage: each call to `run` bumps the "current" request id. When the task
 * settles, its result is only honoured if no newer call has started since.
 */
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
