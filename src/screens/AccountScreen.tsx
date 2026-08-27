import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../stores/sessionStore";
import { ScreenHeader } from "../components/layout/ScreenHeader";

export function AccountScreen() {
  const { isAuthenticated, name, logIn, logOut } = useSessionStore();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div>
        <ScreenHeader title="Account" />
        <div className="mx-auto max-w-sm px-4 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl">
            {name?.charAt(0).toUpperCase()}
          </div>
          <p className="mt-4 text-lg font-semibold text-ink">Hey, {name}!</p>
          <p className="mt-1 text-sm text-ink-muted">You're signed in for this session.</p>
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

  return (
    <div>
      <ScreenHeader title="Sign in" />
      <form
        className="mx-auto max-w-sm px-4 py-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          logIn(input.trim());
          navigate("/");
        }}
      >
        <h1 className="text-xl font-semibold text-ink">Welcome to Ahoum Grocery</h1>
        <p className="mt-1 text-sm text-ink-muted">Enter a display name to continue — this is a mock entry state, no real auth.</p>

        <label htmlFor="display-name" className="mt-6 block text-sm font-medium text-ink">
          Your name
        </label>
        <input
          id="display-name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Priya"
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:border-brand-500"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="mt-6 w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
