"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  HelpCircle,
  MessageSquare,
  Settings,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AuthCheck from "@/components/common/AuthCheck";

export default function SubscriptionCancelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        router.push("/subscription");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [router, status]);


  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || undefined,
  };

  return (
    <AuthCheck>
      <div className="flex flex-col min-h-screen">
        {/* Header component for both mobile and desktop */}
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex flex-1 pt-16 md:pt-20">
          {/* Sidebar */}
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            activePage="/subscription"
          />

          {/* Main content */}
          <main className="flex-1 p-6 flex items-center justify-center">
            <Card className="max-w-md w-full">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-amber-500" />
                </div>
                <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
                <CardDescription>
                  You've cancelled the subscription process.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  No worries! You can subscribe anytime when you're ready to
                  access our premium features.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => router.push("/subscription")}>
                  Return to Subscriptions
                </Button>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
