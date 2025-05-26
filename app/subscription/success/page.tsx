"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  HelpCircle,
  Loader2,
  MessageSquare,
  Settings,
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
import { useToast } from "@/components/ui/use-toast";
import subscriptionApi from "@/lib/subscriptionApi";
import AuthCheck from "@/components/common/AuthCheck";

export default function SubscriptionSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
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
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session");

      if (sessionId) {
        localStorage.setItem("currentSessionId", sessionId);
      }
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      const verifySubscription = async () => {
        try {
          const checkoutId = localStorage.getItem("polarCheckoutId");
          const sessionId = localStorage.getItem("currentSessionId");
          const storedSessionId = localStorage.getItem("polarSessionId");
          const isValidSession =
            sessionId && storedSessionId && sessionId === storedSessionId;
          const statusResponse =
            await subscriptionApi.checkSubscriptionStatus();

          if (statusResponse.hasActiveSubscription) {
            setSubscriptionStatus("active");
            localStorage.removeItem("polarCheckoutId");
            localStorage.removeItem("polarSessionId");
            localStorage.removeItem("currentSessionId");
          } else if (statusResponse.subscriptions.length > 0) {
            const pendingSubscription = statusResponse.subscriptions.find(
              (sub) => sub.status === "pending" || sub.status === "created",
            );

            if (pendingSubscription) {
              setSubscriptionStatus("pending");
            } else {
              setSubscriptionStatus("inactive");
            }
          } else if (isValidSession && checkoutId) {
            try {
              await subscriptionApi.notifySubscriptionCreated(checkoutId);
              const refreshedStatus =
                await subscriptionApi.checkSubscriptionStatus();

              if (refreshedStatus.hasActiveSubscription) {
                setSubscriptionStatus("active");
                localStorage.removeItem("polarCheckoutId");
                localStorage.removeItem("polarSessionId");
                localStorage.removeItem("currentSessionId");
              } else {
                setSubscriptionStatus("pending");
              }
            } catch (error) {
              console.error("Error checking subscription status:", error);
              setSubscriptionStatus("unknown");
            }
          } else {
            try {
              await subscriptionApi.notifySubscriptionCreated("manual-check");
              const refreshedStatus =
                await subscriptionApi.checkSubscriptionStatus();

              if (refreshedStatus.hasActiveSubscription) {
                setSubscriptionStatus("active");
              } else {
                setSubscriptionStatus("pending");
              }
            } catch (error) {
              console.error("Error checking subscription status:", error);
              setSubscriptionStatus("unknown");
            }
          }
        } catch (error) {
          console.error("Error verifying subscription:", error);
          setSubscriptionStatus("error");
        } finally {
          setIsVerifying(false);
        }
      };

      verifySubscription();
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && !isVerifying) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, isVerifying]);

  useEffect(() => {
    if (redirectCountdown === 0) {
      router.push("/subscription");
    }
  }, [redirectCountdown, router]);


  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    image: session?.user?.image || undefined,
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying your subscription...</p>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="flex flex-col min-h-screen">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex flex-1 pt-16 md:pt-20">
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            activePage="/subscription"
          />

          <main className="flex-1 p-6 flex items-center justify-center">
            <Card
              className={`max-w-md w-full ${subscriptionStatus === "active" ? "border-green-200" : subscriptionStatus === "error" ? "border-red-200" : "border-amber-200"}`}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {subscriptionStatus === "active" ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : subscriptionStatus === "error" ? (
                    <AlertCircle className="h-16 w-16 text-red-500" />
                  ) : (
                    <AlertCircle className="h-16 w-16 text-amber-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {subscriptionStatus === "active"
                    ? "Subscription Successful!"
                    : subscriptionStatus === "error"
                      ? "Subscription Error"
                      : "Subscription Processing"}
                </CardTitle>
                <CardDescription>
                  {subscriptionStatus === "active"
                    ? "Thank you for subscribing to our premium service."
                    : subscriptionStatus === "error"
                      ? "There was an error processing your subscription."
                      : "Your subscription is being processed."}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {subscriptionStatus === "active"
                    ? "Your subscription has been activated. You now have access to all premium features."
                    : subscriptionStatus === "error"
                      ? "Please check your subscription status on the subscription page or contact support."
                      : "Please wait while we verify your subscription. This may take a moment."}
                </p>
                {!isVerifying && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Redirecting to subscription page in {redirectCountdown}{" "}
                    seconds...
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => router.push("/subscription")}>
                  View My Subscription
                </Button>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
