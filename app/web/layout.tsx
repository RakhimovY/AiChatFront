"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import AuthCheck from "@/components/common/AuthCheck";
import { useWebStore } from "@/lib/store/webStore";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isMobileMenuOpen = useWebStore((state) => state.isMobileMenuOpen);
  const setIsMobileMenuOpen = useWebStore((state) => state.setIsMobileMenuOpen);


  return (
    <AuthCheck>
      <div className="flex flex-1 pt-16 md:pt-20">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activePage={pathname}
        />
        <div className="flex-1">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </div>
    </AuthCheck>
  );
}
