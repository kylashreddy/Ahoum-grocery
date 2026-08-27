import { useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../api/products";
import { useAsync } from "../hooks/useAsync";
import { Skeleton } from "../components/Skeleton";
import { ErrorState } from "../components/ErrorState";
import { SearchIcon } from "../components/icons";

export function ExploreScreen() {
  const loadCategories = useCallback((signal: AbortSignal) => fetchCategories({ signal }), []);
  const categories = useAsync(loadCategories, []);

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="hidden text-xl font-semibold text-ink lg:block">Find products</h1>
        <p className="hidden text-sm text-ink-muted lg:block">Browse the full catalogue by category.</p>

        <h1 className="text-lg font-semibold text-ink lg:hidden">Find Products</h1>

        <Link
          to="/search"
          className="mt-4 flex items-center gap-2 rounded-full bg-surface px-4 py-3 text-sm text-ink-muted shadow-sm ring-1 ring-black/5"
        >
          <SearchIcon className="h-4 w-4" />
          Search Store
        </Link>

        {categories.status === "loading" && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        )}

        {categories.status === "error" && (
          <div className="mt-5">
            <ErrorState onRetry={categories.retry} message="Couldn't load categories." />
          </div>
        )}

        {categories.status === "success" && categories.data && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.data.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex h-28 flex-col justify-end rounded-2xl p-4 text-sm font-semibold text-ink ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
