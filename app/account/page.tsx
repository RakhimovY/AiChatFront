"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AccountContent from "@/components/account/AccountContent";

export default function AccountPage() {
  const { data: session, status } = useSession();

  // If the user is not authenticated, redirect to the login page
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For demo purposes, use a mock user if session is not available
  // Ensure user object has required non-nullable properties
  const user = {
    name: session?.user?.name || "Демо Пользователь",
    email: session?.user?.email || "demo@example.com",
    image: session?.user?.image || undefined
  };

  return <AccountContent user={user} />;
}
