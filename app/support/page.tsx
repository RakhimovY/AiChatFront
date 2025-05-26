"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import SupportContent from "@/components/support/SupportContent";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function SupportPage() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

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
  };

  return <SupportContent user={user} />;
}
