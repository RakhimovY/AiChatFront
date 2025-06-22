"use client";

import { useEffect, useRef, useState } from "react";
import { LawyerRequestForm } from '@/components/lawyer-request';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LawyerRequestPage() {
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
              <h1 className="text-3xl font-bold mb-2">Lawyer Consultation Request</h1>
              <p className="text-gray-600">
                Fill out the form below to request a consultation with one of our experienced lawyers.
                We will review your request and get back to you as soon as possible.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border">
              <LawyerRequestForm />
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">What to Expect</h2>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Our team will review your request within 24 hours.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You will receive a confirmation email with your request details.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>A lawyer specialized in your type of legal problem will be assigned to your case.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You can check the status of your request at any time from your account dashboard.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Urgent requests are prioritized and typically processed within 4 hours.</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
