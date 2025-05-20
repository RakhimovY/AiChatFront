"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, MessageSquare, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Header from "@/components/layout/Header";
import Sidebar, { MenuItem } from "@/components/layout/Sidebar";

export default function SubscriptionSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only proceed if the sidebar is open and we're on mobile
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;

      // Check if the click was outside the sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Redirect to subscription page after 5 seconds
  useEffect(() => {
    if (status === 'authenticated') {
      const timer = setTimeout(() => {
        router.push('/subscription');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [router, status]);

  // Define menu items for the sidebar
  const menuItems: MenuItem[] = [
    { icon: MessageSquare, label: t.chats || "Чаты", href: "/chat" },
    { icon: CreditCard, label: t.subscription || "Подписка", href: "/subscription" },
    { icon: Settings, label: t.settings || "Настройки", href: "/settings" },
    { icon: HelpCircle, label: t.help || "Помощь", href: "/support" },
  ];

  // Ensure user object has required non-nullable properties
  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || undefined
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header component for both mobile and desktop */}
      <Header
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageTitle={t.subscription || "Подписка"}
        pageRoute="/subscription"
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar */}
        <Sidebar 
          menuItems={menuItems}
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activePage="/subscription"
        />

        {/* Main content */}
        <main className="flex-1 p-6 flex items-center justify-center">
          <Card className="border-green-200 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
              <CardDescription>
                Thank you for subscribing to our premium service.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Your subscription has been activated. You now have access to all premium features.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push('/subscription')}>
                View My Subscription
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
