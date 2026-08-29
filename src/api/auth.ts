import { simulateNetwork } from "./client";

export interface GoogleProfile {
  name: string;
  email: string;
}

const MOCK_GOOGLE_PROFILE: GoogleProfile = {
  name: "Busireddy Kylash Reddy",
  email: "busireddykylash.reddy@gmail.com",
};

// Mocks the redirect/popup round-trip of "Sign in with Google" — there's no
// real backend here, so this just returns a fixed profile after a delay.
export async function signInWithGoogle(): Promise<GoogleProfile> {
  return simulateNetwork(MOCK_GOOGLE_PROFILE, { minMs: 400, maxMs: 900 });
}
