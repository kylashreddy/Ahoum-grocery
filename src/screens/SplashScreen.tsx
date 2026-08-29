import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate("/onboarding", { replace: true }), 1600);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <button
      type="button"
      onClick={() => navigate("/onboarding", { replace: true })}
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-brand-500 to-brand-700 text-white"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-5xl backdrop-blur-sm">
        🥬
      </span>
      <span className="text-2xl font-semibold tracking-wide">Ahoum Grocery</span>
      <span className="text-sm text-white/70">Fresh groceries, delivered fast</span>
      <span className="mt-6 h-1.5 w-24 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-white" />
      </span>
    </button>
  );
}
