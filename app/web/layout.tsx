"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Edit, FileText, List } from "lucide-react";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const menuItems = [
    {
      icon: List,
      label: "Шаблоны",
      href: "/web/templates",
    },
    {
      icon: FileText,
      label: "Мои документы",
      href: "/web/documents",
    },
    {
      icon: Edit,
      label: "Редактор",
      href: "/web/editor",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        menuItems={menuItems}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activePage={pathname}
      />
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
