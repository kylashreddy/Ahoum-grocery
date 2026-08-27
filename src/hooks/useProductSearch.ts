import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../types/product";
import { searchProducts } from "../api/products";
import { isAbortError } from "../api/client";
import { LatestRequestGuard, type StaleGuardLogEntry } from "../lib/staleGuard";

export type SearchStatus = "idle" | "loading" | "success" | "error";

export interface UseProductSearchResult {
  query: string;
  setQuery: (value: string) => void;
  results: Product[];
  status: SearchStatus;
  error: string | null;
  retry: () => void;
  /** Debug log proving stale (out-of-order) responses were discarded. */
  debugLog: StaleGuardLogEntry[];
}

const DEBOUNCE_MS = 200;

// Abort cancels the previous request outright; the guard is a second,
// independent check that only honours a result if nothing newer has started
// since — so an aborted-too-late request can't overwrite a fresher one either.
export function useProductSearch(): UseProductSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<StaleGuardLogEntry[]>([]);

  const guard = useMemo(() => new LatestRequestGuard<Product[]>(), []);
  const abortRef = useRef<AbortController | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      abortRef.current?.abort();
      setResults([]);
      setStatus("idle");
      setError(null);
      return;
    }

    const timer = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("loading");
      setError(null);

      void guard
        .run((requestId) => {
          setDebugLog([...guard.log, { requestId, discarded: false, finishedAt: Date.now() }]);
          return searchProducts(trimmed, { signal: controller.signal });
        })
        .then((outcome) => {
          setDebugLog([...guard.log]);
          if (outcome.stale) return; // a newer search superseded this one
          setResults(outcome.value);
          setStatus("success");
        })
        .catch((err: unknown) => {
          if (isAbortError(err)) return;
          setStatus("error");
          setError(err instanceof Error ? err.message : "Something went wrong.");
        });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query, retryToken, guard]);

  return {
    query,
    setQuery,
    results,
    status,
    error,
    retry: () => setRetryToken((t) => t + 1),
    debugLog,
  };
}
