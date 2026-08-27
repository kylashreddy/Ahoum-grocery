import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomTabBar } from "./BottomTabBar";
import { ReconciliationBanner } from "../ReconciliationBanner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface-muted">
      <TopNav />
      <ReconciliationBanner />
      <main className="mx-auto max-w-7xl pb-24 lg:pb-10">{children}</main>
      <BottomTabBar />
    </div>
  );
}
