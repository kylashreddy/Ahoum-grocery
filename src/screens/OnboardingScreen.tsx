import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../stores/onboardingStore";

export function OnboardingScreen() {
  const navigate = useNavigate();
  const complete = useOnboardingStore((s) => s.complete);

  const skip = () => {
    complete();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-muted lg:py-10">
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-brand-600 lg:h-auto lg:max-w-sm lg:rounded-[2.5rem] lg:shadow-xl">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden lg:min-h-80">
          <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -right-16 top-24 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 translate-y-1/3 rounded-full bg-white/10" />
          <span className="text-8xl drop-shadow-lg" aria-hidden="true">
            🛍️
          </span>
          <button type="button" onClick={skip} className="absolute right-5 top-5 text-sm font-medium text-white/80 hover:text-white">
            Skip
          </button>
        </div>

        <div className="rounded-t-[2rem] bg-surface px-6 pb-10 pt-8 text-center">
          <div className="mb-5 flex justify-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-6 rounded-full bg-brand-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Welcome to our store</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
            Fresh groceries delivered to your doorstep in minutes — browse, order, and track it all in one place.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login/phone")}
            className="mt-8 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99]"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
