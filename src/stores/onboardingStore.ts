import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasOnboarded: boolean;
  complete: () => void;
}

// Gates the one-time splash/onboarding/location tour — shown on a shopper's
// very first visit only, never again once completed (or skipped).
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      complete: () => set({ hasOnboarded: true }),
    }),
    { name: "ahoum-onboarding" },
  ),
);
