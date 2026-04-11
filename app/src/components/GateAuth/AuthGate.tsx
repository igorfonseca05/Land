"use client";

import { useAuth } from "@/app/src/context/useAuthContext";
import { GlobalSpinner } from "../globalSpinner/GlobalSpinner";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) return <GlobalSpinner />;

  return <>{children}</>;
}