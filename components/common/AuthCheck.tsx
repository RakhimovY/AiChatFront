"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const { status } = useSession();

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
