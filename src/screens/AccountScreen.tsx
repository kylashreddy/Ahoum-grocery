import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../stores/sessionStore";
import { signInWithGoogle } from "../api/auth";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "../components/icons";

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function AccountScreen() {
  const { isAuthenticated, name, provider, logIn, logOut } = useSessionStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  if (isAuthenticated) {
    return (
      <div>
        <ScreenHeader title="Account" />
        <div className="mx-auto max-w-sm px-4 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl">
            {name?.charAt(0).toUpperCase()}
          </div>
          <p className="mt-4 text-lg font-semibold text-ink">Hey, {name}!</p>
          <p className="mt-1 text-sm text-ink-muted">
            {provider === "google" ? "Signed in with Google" : "Signed in"} for this session.
          </p>
          <button
            type="button"
            onClick={() => {
              logOut();
              navigate("/");
            }}
            className="mt-6 w-full rounded-full py-3 text-sm font-semibold text-danger hover:bg-danger-bg"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  const canSubmit = mode === "login" ? email.trim() && password.trim() : fullName.trim() && email.trim() && password.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    logIn({ name: mode === "signup" ? fullName.trim() : displayNameFromEmail(email.trim()), email: email.trim(), provider: "email" });
    navigate("/");
  };

  const handleGoogle = async () => {
    setGooglePending(true);
    const profile = await signInWithGoogle();
    logIn({ name: profile.name, email: profile.email, provider: "google" });
    navigate("/");
  };

  return (
    <div>
      <ScreenHeader title={mode === "login" ? "Log In" : "Sign Up"} />
      <form className="mx-auto max-w-sm px-4 py-8" onSubmit={handleSubmit}>
        <h1 className="text-xl font-semibold text-ink">{mode === "login" ? "Log In" : "Sign Up"}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {mode === "login" ? "Enter your email and password to continue." : "Create an account to start shopping."}
        </p>

        {mode === "signup" && (
          <div className="mt-6">
            <label htmlFor="full-name" className="block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:border-brand-500"
            />
          </div>
        )}

        <div className={mode === "signup" ? "mt-4" : "mt-6"}>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:border-brand-500"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Password
            </label>
            {mode === "login" && (
              <button
                type="button"
                onClick={() => setForgotMessage((v) => !v)}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative mt-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/10 px-4 py-3 pr-11 text-sm outline-none focus-visible:border-brand-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {forgotMessage && (
            <p className="mt-2 text-xs text-ink-muted" role="status">
              This is a mock login with no backend — there's no real password to reset.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "login" ? "Log In" : "Create Account"}
        </button>

        <div className="mt-6 flex items-center gap-3 text-xs text-ink-muted">
          <span className="h-px flex-1 bg-black/10" />
          or continue with
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <button
          type="button"
          onClick={() => void handleGoogle()}
          disabled={googlePending}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full border border-black/10 py-3 text-sm font-medium text-ink transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon className="h-4.5 w-4.5" />
          {googlePending ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-ink-muted">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-medium text-brand-600 hover:underline">
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")} className="font-medium text-brand-600 hover:underline">
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
