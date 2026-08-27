import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../stores/favoritesStore";
import { PRODUCTS } from "../mocks/products";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/layout/ScreenHeader";

export function FavoritesScreen() {
  const favoriteIds = useFavoritesStore((s) => s.productIds);
  const navigate = useNavigate();
  const products = PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  return (
    <div>
      <ScreenHeader title="Favourites" />
      <div className="px-4 py-5 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 hidden text-xl font-semibold text-ink lg:block">Favourites</h1>
          {products.length === 0 ? (
            <EmptyState
              icon="🤍"
              title="No favourites yet"
              description="Tap the heart on any product to save it here."
              action={{ label: "Browse products", onClick: () => navigate("/explore") }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
