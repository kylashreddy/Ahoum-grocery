import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  isAuthenticated: boolean;
  name: string | null;
  logIn: (name: string) => void;
  logOut: () => void;
}

/**
 * Deliberately minimal per the brief: onboarding/auth is represented by a
 * single entry/login state, not a full auth flow.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      name: null,
      logIn: (name) => set({ isAuthenticated: true, name }),
      logOut: () => set({ isAuthenticated: false, name: null }),
    }),
    { name: "ahoum-session" },
  ),
);
