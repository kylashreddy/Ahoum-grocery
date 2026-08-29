import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../stores/onboardingStore";
import { BackIcon } from "../components/icons";

export function PhoneSignInScreen() {
  const navigate = useNavigate();
  const complete = useOnboardingStore((s) => s.complete);
  const [phone, setPhone] = useState("");

  const canSubmit = phone.replace(/\D/g, "").length === 10;

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col px-6 py-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
        >
          <BackIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            complete();
            navigate("/", { replace: true });
          }}
          className="text-sm font-medium text-ink-muted hover:text-ink"
        >
          Skip
        </button>
      </div>

      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">📱</div>
      <h1 className="mt-6 text-2xl font-semibold text-ink">Sign in</h1>
      <p className="mt-1 text-sm text-ink-muted">Enter your mobile number — we'll send you a one-time code.</p>

      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          navigate("/login/verify", { state: { phone } });
        }}
      >
        <label htmlFor="phone" className="block text-sm font-medium text-ink">
          Mobile number
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-black/10 pl-4 focus-within:border-brand-500">
          <span className="text-sm font-medium text-ink-muted">+91</span>
          <span className="h-5 w-px bg-black/10" aria-hidden="true" />
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="98765 43210"
            className="w-full rounded-xl py-3 pr-4 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send OTP
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Prefer email?{" "}
        <Link to="/account" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
