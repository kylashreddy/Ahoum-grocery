import { useNavigate, useLocation } from "react-router-dom";

interface FailureState {
  message: string;
}

export function CheckoutFailureScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as FailureState | null;

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted text-5xl ring-1 ring-black/5" aria-hidden="true">
        🛍️
        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-danger text-sm font-bold text-white ring-4 ring-surface">
          !
        </span>
      </div>
      <h1 className="mt-5 text-xl font-semibold text-ink">Order failed</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {state?.message ?? "Something went wrong placing your order."} Your cart hasn't been touched.
      </p>
      <div className="mt-8 flex w-full flex-col gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="w-full rounded-full py-3.5 text-sm font-semibold text-ink-muted hover:bg-black/5"
        >
          Back to cart
        </button>
      </div>
    </div>
  );
}
