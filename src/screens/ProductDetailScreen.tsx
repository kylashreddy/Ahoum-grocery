import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../api/products";
import { useAsync } from "../hooks/useAsync";
import { useCartStore } from "../stores/cartStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { formatPrice } from "../lib/format";
import { Skeleton } from "../components/Skeleton";
import { ErrorState } from "../components/ErrorState";
import { QuantityStepper } from "../components/QuantityStepper";
import { BackIcon, HeartIcon } from "../components/icons";

export function ProductDetailScreen() {
  const { productId = "" } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const loader = useCallback((signal: AbortSignal) => fetchProductById(productId, { signal }), [productId]);
  const { data: product, status, error, retry } = useAsync(loader, [productId]);

  const addItem = useCartStore((s) => s.addItem);
  const cartLine = useCartStore((s) => s.lines.find((l) => l.productId === productId));
  const isFavorite = useFavoritesStore((s) => (product ? s.isFavorite(product.id) : false));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 lg:px-8 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-black/5 hover:bg-black/5"
        >
          <BackIcon className="h-5 w-5" />
        </button>
        {product && (
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm ring-1 ring-black/5 hover:bg-black/5"
          >
            <HeartIcon filled={isFavorite} className="h-5 w-5 text-red-500" />
          </button>
        )}
      </div>

      {status === "loading" && (
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {status === "error" && <ErrorState onRetry={retry} message={error ?? "Couldn't load this product."} />}

      {status === "success" && !product && (
        <ErrorState onRetry={retry} message="This product could not be found." />
      )}

      {status === "success" && product && (
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          <img src={product.image} alt="" className="aspect-square w-full rounded-3xl bg-surface object-cover" />

          <div className="mt-5 lg:mt-0">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">{product.name}</h1>
            <p className="mt-1 text-sm text-ink-muted">{product.unit}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-ink">{formatPrice(product.price)}</span>
              {product.stock <= 0 ? (
                <span className="rounded-full bg-danger-bg px-3 py-1 text-xs font-medium text-danger">Out of stock</span>
              ) : product.stock <= 5 ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Only {product.stock} left
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{product.description}</p>

            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <QuantityStepper
                  label={product.name}
                  quantity={qty}
                  max={product.stock}
                  onDecrement={() => setQty((q) => Math.max(1, q - 1))}
                  onIncrement={() => setQty((q) => Math.min(product.stock, q + 1))}
                />
                <button
                  type="button"
                  onClick={() => addItem(product, qty)}
                  className="flex-1 rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99]"
                >
                  {cartLine ? `Update cart (${cartLine.quantity} in cart)` : "Add to cart"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
