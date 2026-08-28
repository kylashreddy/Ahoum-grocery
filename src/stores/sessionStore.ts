import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthProvider = "email" | "google";

interface SessionState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  provider: AuthProvider | null;
  logIn: (params: { name: string; email: string; provider: AuthProvider }) => void;
  logOut: () => void;
}

// Auth is a single entry/login state per the brief, not a full auth flow.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      name: null,
      email: null,
      provider: null,
      logIn: ({ name, email, provider }) => set({ isAuthenticated: true, name, email, provider }),
      logOut: () => set({ isAuthenticated: false, name: null, email: null, provider: null }),
    }),
    { name: "ahoum-session" },
  ),
);
