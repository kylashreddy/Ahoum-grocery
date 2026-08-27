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
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger-bg text-4xl" aria-hidden="true">
        ❌
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
