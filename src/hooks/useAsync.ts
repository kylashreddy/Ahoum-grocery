import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "loading" | "success" | "error";

export interface UseAsyncResult<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  retry: () => void;
}

// Generic load/error/retry state for a screen, with the same latest-wins
// guard as the search hook so rapid dep changes can't apply a stale result.
export function useAsync<T>(loader: (signal: AbortSignal) => Promise<T>, deps: React.DependencyList): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const requestIdRef = useRef(0);

  const retry = useCallback(() => setRetryToken((t) => t + 1), []);

  // `loader` is intentionally excluded: callers memoize it with useCallback,
  // and including it here would refetch on every render for callers that
  // don't. `retryToken` is appended so `retry()` can force a refetch even
  // when none of the real dependencies changed.
  const effectDeps = [...deps, retryToken];

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    setStatus("loading");
    setError(null);

    loader(controller.signal)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setData(result);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Something went wrong.");
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps);

  return { data, status, error, retry };
}
