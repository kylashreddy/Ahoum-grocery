import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../stores/onboardingStore";
import { BackIcon } from "../components/icons";

const ZONES = ["Banasree", "Gulshan", "Dhanmondi", "Uttara", "Mirpur"];

export function SelectLocationScreen() {
  const navigate = useNavigate();
  const complete = useOnboardingStore((s) => s.complete);
  const [zone, setZone] = useState(ZONES[0]);
  const [area, setArea] = useState("");

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

      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl">📍</div>
      <h1 className="mt-6 text-2xl font-semibold text-ink">Select Your Location</h1>
      <p className="mt-1 text-sm text-ink-muted">Switch on your location to stay in tune with what's happening in your area.</p>

      <form
        className="mt-8 flex flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          complete();
          navigate("/", { replace: true });
        }}
      >
        <label htmlFor="zone" className="block text-sm font-medium text-ink">
          Your Zone
        </label>
        <select
          id="zone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:border-brand-500"
        >
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        <label htmlFor="area" className="mt-5 block text-sm font-medium text-ink">
          Your Area
        </label>
        <input
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Types of your area"
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus-visible:border-brand-500"
        />

        <button
          type="submit"
          className="mt-auto w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
