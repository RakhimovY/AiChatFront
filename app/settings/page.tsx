"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AccountSettingsContent from "@/components/settings/AccountSettingsContent";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

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

  // Ensure user object has required non-nullable properties
  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || undefined,
    country: session?.user?.country || ""
  };

  return <AccountSettingsContent user={user} />;
}
