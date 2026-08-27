import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Brand, CategoryId } from "../types/product";
import { fetchProductsByCategory } from "../api/products";
import { useAsync } from "../hooks/useAsync";
import { categoryName } from "../mocks/categories";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { FiltersPanel } from "../components/FiltersPanel";
import { FilterIcon, CloseIcon } from "../components/icons";

export function CategoryScreen() {
  const { categoryId = "" } = useParams<{ categoryId: CategoryId }>();
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loader = useCallback((signal: AbortSignal) => fetchProductsByCategory(categoryId as CategoryId, { signal }), [categoryId]);
  const { data, status, retry } = useAsync(loader, [categoryId]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      if (inStockOnly && p.stock <= 0) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      return true;
    });
  }, [data, inStockOnly, selectedBrands]);

  const toggleBrand = (brand: Brand) =>
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
  const clearFilters = () => {
    setSelectedBrands([]);
    setInStockOnly(false);
  };
  const activeFilterCount = selectedBrands.length + (inStockOnly ? 1 : 0);

  return (
    <div>
      <ScreenHeader
        title={categoryName(categoryId)}
        right={
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label="Open filters"
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
          >
            <FilterIcon className="h-5 w-5" />
            {activeFilterCount > 0 && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-brand-500" />
            )}
          </button>
        }
      />

      <div className="px-4 py-5 lg:px-8 lg:py-8">
        <div className="mx-auto flex max-w-7xl gap-8">
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <h1 className="mb-4 text-lg font-semibold text-ink">{categoryName(categoryId)}</h1>
            <FiltersPanel
              selectedBrands={selectedBrands}
              onToggleBrand={toggleBrand}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={() => setInStockOnly((v) => !v)}
              onClear={clearFilters}
            />
          </aside>

          <div className="min-w-0 flex-1">
            {status === "loading" && <ProductGridSkeleton count={6} />}
            {status === "error" && <ErrorState onRetry={retry} message="Couldn't load this category." />}
            {status === "success" && filtered.length === 0 && (
              <EmptyState
                title="No products match your filters"
                description="Try clearing a filter to see more results."
                action={activeFilterCount > 0 ? { label: "Clear filters", onClick: clearFilters } : undefined}
              />
            )}
            {status === "success" && filtered.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-surface lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3.5">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <h2 className="text-base font-semibold text-ink">Filters</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <FiltersPanel
              selectedBrands={selectedBrands}
              onToggleBrand={toggleBrand}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={() => setInStockOnly((v) => !v)}
              onClear={clearFilters}
            />
          </div>

          <div className="border-t border-black/5 p-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Apply Filter{filtered.length > 0 ? ` (${filtered.length})` : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
