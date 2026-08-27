import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "loading" | "success" | "error";

export interface UseAsyncResult<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  retry: () => void;
}

/**
 * Runs an async loader on mount (and whenever `deps` change), tracking
 * loading/success/error state and exposing a manual retry. Guards against
 * setting state after unmount and against a stale response overwriting a
 * newer one when deps change quickly (same latest-wins principle as the
 * search hook, applied generically).
 */
export function useAsync<T>(loader: (signal: AbortSignal) => Promise<T>, deps: React.DependencyList): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const requestIdRef = useRef(0);

  const retry = useCallback(() => setRetryToken((t) => t + 1), []);

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
    // deps is caller-supplied and intentionally spread; retryToken forces a manual refetch.
  }, [...deps, retryToken]);

  return { data, status, error, retry };
}
