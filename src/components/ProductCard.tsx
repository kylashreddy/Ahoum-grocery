import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { formatPrice } from "../lib/format";
import { maxAllowedQuantity, useCartStore } from "../stores/cartStore";
import { useFavoritesStore } from "../stores/favoritesStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const quantity = useCartStore((s) => s.lines.find((l) => l.productId === product.id)?.quantity ?? 0);
  const addItem = useCartStore((s) => s.addItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
        className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-base shadow-sm"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product.id}`} className="flex flex-col gap-2 rounded-xl focus-visible:outline-offset-4">
        <img src={product.image} alt="" className="aspect-square w-full rounded-xl bg-surface-muted object-cover" />
        <div>
          <p className="line-clamp-1 text-sm font-medium text-ink">{product.name}</p>
          <p className="text-xs text-ink-muted">{product.unit}</p>
        </div>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-semibold text-ink">{formatPrice(product.price)}</span>

        {outOfStock ? (
          <span className="rounded-full bg-danger-bg px-2 py-1 text-[11px] font-medium text-danger">Out of stock</span>
        ) : quantity > 0 ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setQuantity(product.id, quantity - 1)}
              aria-label={`Decrease quantity of ${product.name}`}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-300 text-brand-700 active:scale-95"
            >
              &minus;
            </button>
            <span className="min-w-[1.25rem] text-center text-sm font-medium tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => addItem(product, 1)}
              disabled={quantity >= maxAllowedQuantity(product)}
              aria-label={`Increase quantity of ${product.name}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white active:scale-95 disabled:cursor-not-allowed disabled:bg-brand-200"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-lg leading-none text-white shadow-sm transition hover:bg-brand-600 active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
