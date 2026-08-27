import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { findProduct } from "../mocks/products";
import { formatPrice } from "../lib/format";
import { QuantityStepper } from "../components/QuantityStepper";
import { EmptyState } from "../components/EmptyState";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { TrashIcon } from "../components/icons";

export function CartScreen() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const navigate = useNavigate();

  const rows = lines
    .map((line) => ({ line, product: findProduct(line.productId) }))
    .filter((row): row is { line: typeof lines[number]; product: NonNullable<ReturnType<typeof findProduct>> } => Boolean(row.product));

  const subtotal = rows.reduce((sum, { line, product }) => sum + product.price * line.quantity, 0);

  if (rows.length === 0) {
    return (
      <div>
        <ScreenHeader title="My Cart" />
        <div className="px-4 py-8 lg:px-8">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Browse the catalogue and add something fresh."
            action={{ label: "Start shopping", onClick: () => navigate("/") }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScreenHeader title="My Cart" />

      <div className="px-4 py-5 lg:px-8 lg:py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
          <ul className="flex-1 space-y-3">
            {rows.map(({ line, product }) => (
              <li key={line.productId} className="flex gap-3 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt="" className="h-20 w-20 flex-shrink-0 rounded-xl bg-surface-muted object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-ink-muted">
                        {product.unit} · {formatPrice(product.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-danger-bg hover:text-danger"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantityStepper
                      label={product.name}
                      quantity={line.quantity}
                      max={product.stock}
                      size="sm"
                      onDecrement={() => setQuantity(product.id, line.quantity - 1)}
                      onIncrement={() => setQuantity(product.id, line.quantity + 1)}
                    />
                    <span className="font-semibold text-ink">{formatPrice(product.price * line.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-24 lg:w-80 lg:flex-shrink-0">
            <div className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="text-sm font-semibold text-ink">Order summary</h2>
              <div className="mt-4 flex justify-between text-sm text-ink-muted">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-ink-muted">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-black/5 pt-3 text-base font-semibold text-ink">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99]"
              >
                Go to Checkout · {formatPrice(subtotal)}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
