"use client";

import { useEffect, useRef, useState } from "react";
import { LawyerDashboard } from '@/components/lawyer-request';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LawyerDashboardPage() {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Set initial sidebar state based on screen width after component mounts
  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close sidebar on outside clicks when it's open on mobile
      if (!isSidebarOpen || window.innerWidth >= 768) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        isMobileMenuOpen={isSidebarOpen}
        setIsMobileMenuOpen={setIsSidebarOpen}
        showThemeToggle={true}
        showUserInfo={false}
        showBackButton={true}
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar container with ref for click-outside detection */}
        <aside ref={sidebarRef}>
          <Sidebar
            isMobileMenuOpen={isSidebarOpen}
            setIsMobileMenuOpen={setIsSidebarOpen}
            activePage="/lawyer-dashboard"
          />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden p-3 md:ml-16">
          <div className="container py-6 mx-auto">
            <LawyerDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
