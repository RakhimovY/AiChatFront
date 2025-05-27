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
import { useToast } from "@/components/ui/use-toast";
import subscriptionApi, { Subscription } from "@/lib/subscriptionApi";
import SubscribeButton from "@/components/subscription/SubscribeButton";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AuthCheck from "@/components/common/AuthCheck";

export default function SubscriptionPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Set initial sidebar state based on screen width after component mounts
  useEffect(() => {
    setIsMobileMenuOpen(window.innerWidth >= 768);
  }, []);

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


  const [hasFetchedSubscriptions, setHasFetchedSubscriptions] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !hasFetchedSubscriptions) {
      fetchSubscriptions();
      setHasFetchedSubscriptions(true);
    }
  }, [status, hasFetchedSubscriptions]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const statusResponse = await subscriptionApi.checkSubscriptionStatus();
      setSubscriptions(statusResponse.subscriptions);
      if (
        !statusResponse.hasActiveSubscription &&
        statusResponse.message.includes("error")
      ) {
        toast({
          title: "Warning",
          description: statusResponse.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (polarSubscriptionId: string) => {
    setIsCancelling(polarSubscriptionId);
    try {
      const response =
        await subscriptionApi.cancelSubscription(polarSubscriptionId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Your subscription has been cancelled.",
        });
        setHasFetchedSubscriptions(false);
        fetchSubscriptions();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel subscription.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          Loading subscription information...
        </p>
      </div>
    );
  }

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
          <div ref={sidebarRef} className="h-full absolute md:relative top-0 left-0">
            <Sidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              activePage="/subscription"
            />
          </div>

          {/* Main content */}
          <main className="flex-1 p-6">
            {subscriptions.length === 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>No Active Subscriptions</CardTitle>
                    <CardDescription>
                      You don't have any active subscriptions. Subscribe to access
                      premium features.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <SubscribeButton
                      buttonText="Subscribe Now"
                      className="w-full md:w-auto"
                      planId="e545ed36-051e-48b5-aa98-082820de2381"
                    />
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{subscription.planName}</CardTitle>
                        <div className="flex items-center">
                          {subscription.status === "active" ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-green-500">
                                Active
                              </span>
                            </>
                          ) : subscription.status === "canceled" ? (
                            <>
                              <XCircle className="h-5 w-5 text-amber-500 mr-2" />
                              <span className="text-sm font-medium text-amber-500">
                                Cancelling
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                              <span className="text-sm font-medium text-destructive">
                                {subscription.status}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <CardDescription>
                        Subscription ID: {subscription.polarSubscriptionId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Current period:
                          </span>
                          <span>
                            {formatDate(subscription.currentPeriodStart)} -{" "}
                            {formatDate(subscription.currentPeriodEnd)}
                          </span>
                        </div>
                        {subscription.cancelAtPeriodEnd && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Cancellation status:
                            </span>
                            <span className="text-amber-500">
                              Will be cancelled at the end of the current period
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {subscription.status === "active" &&
                        !subscription.cancelAtPeriodEnd && (
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleCancelSubscription(
                                subscription.polarSubscriptionId,
                              )
                            }
                            disabled={
                              isCancelling === subscription.polarSubscriptionId
                            }
                          >
                            {isCancelling === subscription.polarSubscriptionId ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel Subscription"
                            )}
                          </Button>
                        )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
