import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../lib/format";

interface SuccessState {
  orderId: string;
  total: number;
}

export function CheckoutSuccessScreen() {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-4xl" aria-hidden="true">
        ✅
      </div>
      <h1 className="mt-5 text-xl font-semibold text-ink">Order placed!</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Order <span className="font-medium text-ink">{state.orderId}</span> for {formatPrice(state.total)} is on its way.
      </p>
      <Link
        to="/"
        className="mt-8 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Continue shopping
      </Link>
    </div>
  );
}
