"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle, XCircle, MessageSquare, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import subscriptionApi, { Subscription } from '@/lib/subscriptionApi';
import SubscribeButton from '@/components/subscription/SubscribeButton';
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Header from "@/components/layout/Header";
import Sidebar, { MenuItem } from "@/components/layout/Sidebar";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
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

  // Fetch subscriptions when component mounts
  const [hasFetchedSubscriptions, setHasFetchedSubscriptions] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !hasFetchedSubscriptions) {
      fetchSubscriptions();
      setHasFetchedSubscriptions(true);
    }
  }, [status, hasFetchedSubscriptions]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      // Use the new checkSubscriptionStatus method to get more comprehensive information
      const statusResponse = await subscriptionApi.checkSubscriptionStatus();
      setSubscriptions(statusResponse.subscriptions);
      // If there's an error, show it
      if (!statusResponse.hasActiveSubscription && statusResponse.message.includes('error')) {
        toast({
          title: "Warning",
          description: statusResponse.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
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
      const response = await subscriptionApi.cancelSubscription(polarSubscriptionId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Your subscription has been cancelled.",
        });
        // Reset the flag and refresh subscriptions list
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
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading subscription information...</p>
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
        <main className="flex-1 p-6">
          {subscriptions.length === 0 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>No Active Subscriptions</CardTitle>
                  <CardDescription>
                    You don't have any active subscriptions. Subscribe to access premium features.
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
                        {subscription.status === 'active' ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm font-medium text-green-500">Active</span>
                          </>
                        ) : subscription.status === 'canceled' ? (
                          <>
                            <XCircle className="h-5 w-5 text-amber-500 mr-2" />
                            <span className="text-sm font-medium text-amber-500">Cancelling</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                            <span className="text-sm font-medium text-destructive">{subscription.status}</span>
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
                        <span className="text-muted-foreground">Current period:</span>
                        <span>{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</span>
                      </div>
                      {subscription.cancelAtPeriodEnd && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cancellation status:</span>
                          <span className="text-amber-500">Will be cancelled at the end of the current period</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                      <Button 
                        variant="destructive" 
                        onClick={() => handleCancelSubscription(subscription.polarSubscriptionId)}
                        disabled={isCancelling === subscription.polarSubscriptionId}
                      >
                        {isCancelling === subscription.polarSubscriptionId ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Subscription'
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
  );
}
