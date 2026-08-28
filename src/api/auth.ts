import { simulateNetwork } from "./client";

export interface GoogleProfile {
  name: string;
  email: string;
}

const MOCK_GOOGLE_ACCOUNTS: GoogleProfile[] = [
  { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
  { name: "Arjun Mehta", email: "arjun.mehta@gmail.com" },
  { name: "Ananya Rao", email: "ananya.rao@gmail.com" },
];

// Mocks the redirect/popup round-trip of "Sign in with Google" — there's no
// real backend here, so this just returns a plausible profile after a delay.
export async function signInWithGoogle(): Promise<GoogleProfile> {
  const profile = MOCK_GOOGLE_ACCOUNTS[Math.floor(Math.random() * MOCK_GOOGLE_ACCOUNTS.length)];
  if (!profile) throw new Error("No mock Google accounts configured.");
  return simulateNetwork(profile, { minMs: 400, maxMs: 900 });
}
