"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import AuthCheck from "@/components/common/AuthCheck";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();


  return (
    <AuthCheck>
      <div className="flex min-h-screen">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activePage={pathname}
        />
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </div>
    </AuthCheck>
  );
}
