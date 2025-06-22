"use client";

import { useEffect, useRef, useState } from "react";
import { RequestStatusCard } from '@/components/lawyer-request';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RequestStatusPage({ params }: { params: { id: string } }) {
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
            activePage="/lawyer-request"
          />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden p-3 md:ml-16">
          <div className="container max-w-4xl py-6 mx-auto">
            <div className="mb-8">
              <Link 
                href="/lawyer-request" 
                className="flex items-center text-primary hover:text-primary/80 mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Request Form</span>
              </Link>

              <h1 className="text-3xl font-bold mb-2">Request Status</h1>
              <p className="text-gray-600">
                View the current status of your lawyer consultation request and add additional information if needed.
              </p>
            </div>

            <RequestStatusCard requestId={params.id} />

            <div className="mt-8 bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about your request or need assistance, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link href="/support">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
