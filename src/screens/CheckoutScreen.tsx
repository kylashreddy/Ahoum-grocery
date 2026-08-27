import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { findProduct } from "../mocks/products";
import { formatPrice } from "../lib/format";
import { placeOrder } from "../api/checkout";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { EmptyState } from "../components/EmptyState";

export function CheckoutScreen() {
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const rows = lines
    .map((line) => ({ line, product: findProduct(line.productId) }))
    .filter((row): row is { line: typeof lines[number]; product: NonNullable<ReturnType<typeof findProduct>> } => Boolean(row.product));
  const subtotal = rows.reduce((sum, { line, product }) => sum + product.price * line.quantity, 0);

  if (rows.length === 0) {
    return (
      <div>
        <ScreenHeader title="Checkout" />
        <div className="px-4 py-8">
          <EmptyState title="Nothing to check out" description="Your cart is empty." action={{ label: "Back to shop", onClick: () => navigate("/") }} />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const result = await placeOrder(subtotal);
      clear();
      navigate("/checkout/success", { state: { orderId: result.orderId, total: subtotal } });
    } catch (err) {
      navigate("/checkout/failure", { state: { message: err instanceof Error ? err.message : "Order failed." } });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <ScreenHeader title="Checkout" />

      <div className="mx-auto max-w-2xl px-4 py-5 lg:px-8 lg:py-8">
        <section className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="text-sm font-semibold text-ink">Delivery address</h2>
          <p className="mt-1 text-sm text-ink-muted">221B Baker Street, Flat 3, London — mock address (no backend)</p>
        </section>

        <section className="mt-4 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="text-sm font-semibold text-ink">Payment method</h2>
          <p className="mt-1 text-sm text-ink-muted">Visa •••• 4242 — mock payment (no backend)</p>
        </section>

        <section className="mt-4 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Order summary</h2>
          <ul className="space-y-2">
            {rows.map(({ line, product }) => (
              <li key={product.id} className="flex justify-between text-sm text-ink-muted">
                <span>
                  {product.name} × {line.quantity}
                </span>
                <span className="text-ink">{formatPrice(product.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-black/5 pt-3 text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </section>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className="mt-6 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {placing ? "Placing order..." : `Place order · ${formatPrice(subtotal)}`}
        </button>
        <p className="mt-2 text-center text-xs text-ink-muted">Orders fail about 1 in 4 times in this demo, so you can see both outcomes.</p>
      </div>
    </div>
  );
}
