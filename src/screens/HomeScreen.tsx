import { Link } from "react-router-dom";
import { useCallback } from "react";
import { fetchCategories, fetchFeaturedProducts } from "../api/products";
import { useAsync } from "../hooks/useAsync";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton, Skeleton } from "../components/Skeleton";
import { ErrorState } from "../components/ErrorState";
import { SearchIcon } from "../components/icons";
import { useSessionStore } from "../stores/sessionStore";

export function HomeScreen() {
  const name = useSessionStore((s) => s.name);

  const loadCategories = useCallback((signal: AbortSignal) => fetchCategories({ signal }), []);
  const loadFeatured = useCallback((signal: AbortSignal) => fetchFeaturedProducts({ signal }), []);

  const categories = useAsync(loadCategories, []);
  const featured = useAsync(loadFeatured, []);

  return (
    <div className="px-4 pt-5 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-ink-muted">Deliver to</p>
        <h1 className="text-xl font-semibold text-ink">
          {name ? `Hey ${name}, what's cooking today?` : "Home · fresh groceries in minutes"}
        </h1>

        <Link
          to="/search"
          className="mt-4 flex items-center gap-2 rounded-full bg-surface px-4 py-3 text-sm text-ink-muted shadow-sm ring-1 ring-black/5 lg:hidden"
        >
          <SearchIcon className="h-4 w-4" />
          Search "milk", "bread", "eggs"...
        </Link>

        <section className="mt-6" aria-label="Categories">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Shop by category</h2>
            <Link to="/explore" className="text-xs font-medium text-brand-600">
              See all
            </Link>
          </div>

          {categories.status === "loading" && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 flex-shrink-0" />
              ))}
            </div>
          )}

          {categories.status === "error" && <ErrorState onRetry={categories.retry} message="Couldn't load categories." />}

          {categories.status === "success" && categories.data && (
            <div className="flex gap-2 overflow-x-auto pb-1" role="list">
              {categories.data.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  role="listitem"
                  className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium text-ink ring-1 ring-black/5 transition hover:ring-brand-300"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-7 pb-4" aria-label="Featured products">
          <h2 className="mb-3 text-sm font-semibold text-ink">Popular right now</h2>

          {featured.status === "loading" && <ProductGridSkeleton count={8} />}
          {featured.status === "error" && <ErrorState onRetry={featured.retry} message="Couldn't load products." />}
          {featured.status === "success" && featured.data && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featured.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
