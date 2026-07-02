"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { LoadingScreen } from "./LoadingScreen";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace("/"); }, [loading, router, user]);
  if (loading || !user) return <LoadingScreen />;
  return children;
}
