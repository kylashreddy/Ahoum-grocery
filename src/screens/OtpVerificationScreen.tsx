import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackIcon } from "../components/icons";

const CODE_LENGTH = 4;
const RESEND_COOLDOWN = 30;

export function OtpVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as { phone?: string } | null)?.phone;

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const code = digits.join("");
  const canVerify = code.length === CODE_LENGTH;

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col px-6 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
      >
        <BackIcon className="h-5 w-5" />
      </button>

      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">🔐</div>
      <h1 className="mt-6 text-2xl font-semibold text-ink">Verification</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Enter the {CODE_LENGTH}-digit code sent to {phone ? `+91 ${phone}` : "your number"}.
      </p>

      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canVerify) return;
          navigate("/select-location");
        }}
      >
        <div className="flex justify-between gap-3" role="group" aria-label="Verification code">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
              className="h-14 w-14 rounded-xl border border-black/10 text-center text-xl font-semibold outline-none focus-visible:border-brand-500"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!canVerify}
          className="mt-8 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Verify
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-ink-muted">
        {cooldown > 0 ? (
          <span>Resend code in {cooldown}s</span>
        ) : (
          <button type="button" onClick={() => setCooldown(RESEND_COOLDOWN)} className="font-medium text-brand-600 hover:underline">
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
