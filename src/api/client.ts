export class ApiError extends Error {
  constructor(message = "Network request failed. Please try again.") {
    super(message);
    this.name = "ApiError";
  }
}

export interface NetworkOptions {
  /** Minimum simulated latency in ms. */
  minMs?: number;
  /** Maximum simulated latency in ms. */
  maxMs?: number;
  /** Probability (0-1) that the request rejects with ApiError. */
  failRate?: number;
  signal?: AbortSignal;
}

const DEFAULTS: Required<Pick<NetworkOptions, "minMs" | "maxMs" | "failRate">> = {
  minMs: 200,
  maxMs: 1200,
  failRate: 0,
};

// Random 200-1200ms latency (by default) and an optional failure rate, abortable.
export function simulateNetwork<T>(value: T | (() => T), options: NetworkOptions = {}): Promise<T> {
  const { minMs, maxMs, failRate } = { ...DEFAULTS, ...options };
  const delay = minMs + Math.random() * (maxMs - minMs);

  return new Promise<T>((resolve, reject) => {
    if (options.signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new ApiError());
        return;
      }
      resolve(typeof value === "function" ? (value as () => T)() : value);
    }, delay);

    options.signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
