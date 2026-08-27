import { useState } from "react";
import { useProductSearch } from "../hooks/useProductSearch";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { SearchIcon, CloseIcon } from "../components/icons";

export function SearchScreen() {
  const { query, setQuery, results, status, error, retry, debugLog } = useProductSearch();
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div>
      <ScreenHeader title="Search" />

      <div className="px-4 py-4 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-3 shadow-sm ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brand-500">
            <SearchIcon className="h-4 w-4 text-ink-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for milk, bread, eggs..."
              autoFocus
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <CloseIcon className="h-4 w-4 text-ink-muted" />
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-ink-muted">
            Latency is simulated (200-1200ms) per request. Type quickly — older, out-of-order responses are
            discarded automatically.{" "}
            <button type="button" className="font-medium text-brand-600 underline" onClick={() => setShowDebug((v) => !v)}>
              {showDebug ? "Hide" : "Show"} stale-response log
            </button>
          </p>

          {showDebug && (
            <div className="mt-2 rounded-xl bg-ink/95 p-3 font-mono text-[11px] text-white">
              {debugLog.length === 0 && <p className="text-white/60">No requests yet — start typing.</p>}
              {debugLog
                .slice()
                .reverse()
                .map((entry, i) => (
                  <p key={`${entry.requestId}-${i}`} className={entry.discarded ? "text-red-300" : "text-emerald-300"}>
                    request #{entry.requestId} {entry.discarded ? "discarded (stale, superseded by a newer search)" : "applied to UI"}
                  </p>
                ))}
            </div>
          )}

          <div className="mt-5">
            {status === "idle" && query.trim() === "" && (
              <EmptyState icon="🔎" title="Search for anything" description="Try “apple”, “Ifad”, or “beverages”." />
            )}

            {status === "loading" && <ProductGridSkeleton count={6} />}

            {status === "error" && <ErrorState onRetry={retry} message={error ?? "Search failed."} />}

            {status === "success" && results.length === 0 && (
              <EmptyState title={`No results for "${query}"`} description="Try a different keyword or brand." />
            )}

            {status === "success" && results.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
