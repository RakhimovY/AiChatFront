"use client";

import { useSession } from "next-auth/react";
import AccountSettingsContent from "@/components/settings/AccountSettingsContent";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || undefined,
    country: session?.user?.country || "",
  };

  return <AccountSettingsContent user={user} />;
}
