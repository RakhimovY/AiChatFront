"use client";

import  { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, MessageSquare, CreditCard, Settings, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Header from "@/components/layout/Header";
import Sidebar, { MenuItem } from "@/components/layout/Sidebar";
import { useToast } from '@/components/ui/use-toast';
import subscriptionApi from '@/lib/subscriptionApi';
import api from "@/lib/api";

export default function SubscriptionSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

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

  // Extract session ID from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session');

      if (sessionId) {
        // Store the session ID from URL in state for verification
        localStorage.setItem('currentSessionId', sessionId);
      }
    }
  }, []);

  // Verify subscription status
  useEffect(() => {
    if (status === 'authenticated') {
      const verifySubscription = async () => {
        try {
          // Get the checkout ID and session ID from localStorage
          const checkoutId = localStorage.getItem('polarCheckoutId');
          const sessionId = localStorage.getItem('currentSessionId');
          const storedSessionId = localStorage.getItem('polarSessionId');

          // Verify that the session ID in the URL matches the one we stored
          const isValidSession = sessionId && storedSessionId && sessionId === storedSessionId;

          // Check subscription status directly from the backend
          const statusResponse = await subscriptionApi.checkSubscriptionStatus();

          if (statusResponse.hasActiveSubscription) {
            // User has active subscriptions
            setSubscriptionStatus('active');
            // Clean up localStorage
            localStorage.removeItem('polarCheckoutId');
            localStorage.removeItem('polarSessionId');
            localStorage.removeItem('currentSessionId');
          } else if (statusResponse.subscriptions.length > 0) {
            // User has subscriptions, but none are active (might be pending or canceled)
            const pendingSubscription = statusResponse.subscriptions.find(
              sub => sub.status === 'pending' || sub.status === 'created'
            );

            if (pendingSubscription) {
              setSubscriptionStatus('pending');
            } else {
              // Subscriptions exist but are canceled or expired
              setSubscriptionStatus('inactive');
            }
          } else if (isValidSession && checkoutId) {
            // Valid session and checkout ID, but no subscription found yet
            // This means the webhook hasn't been processed yet
            // Try a manual check with the checkout ID
            try {
              // Use the checkout ID to trigger a backend check
              await subscriptionApi.notifySubscriptionCreated(checkoutId);

              // Check status again after notification
              const refreshedStatus = await subscriptionApi.checkSubscriptionStatus();

              if (refreshedStatus.hasActiveSubscription) {
                setSubscriptionStatus('active');
                // Clean up localStorage
                localStorage.removeItem('polarCheckoutId');
                localStorage.removeItem('polarSessionId');
                localStorage.removeItem('currentSessionId');
              } else {
                // Still no active subscriptions, subscription might be pending
                setSubscriptionStatus('pending');
              }
            } catch (error) {
              console.error('Error checking subscription status:', error);
              setSubscriptionStatus('unknown');
            }
          } else {
            // No valid session or checkout ID, and no subscriptions found
            // Try a manual check as fallback
            try {
              // Use 'manual-check' to trigger a backend check without a specific subscription ID
              await subscriptionApi.notifySubscriptionCreated('manual-check');

              // Check status again after notification
              const refreshedStatus = await subscriptionApi.checkSubscriptionStatus();

              if (refreshedStatus.hasActiveSubscription) {
                setSubscriptionStatus('active');
              } else {
                // Still no active subscriptions, subscription might be pending
                setSubscriptionStatus('pending');
              }
            } catch (error) {
              console.error('Error checking subscription status:', error);
              setSubscriptionStatus('unknown');
            }
          }
        } catch (error) {
          console.error('Error verifying subscription:', error);
          setSubscriptionStatus('error');
        } finally {
          setIsVerifying(false);
        }
      };

      verifySubscription();
    }
  }, [status]);

  // Countdown timer
  useEffect(() => {
    if (status === 'authenticated' && !isVerifying) {
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

  // Separate effect for navigation after countdown reaches zero
  useEffect(() => {
    if (redirectCountdown === 0) {
      router.push('/subscription');
    }
  }, [redirectCountdown, router]);

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

  if (status === 'loading' || isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying your subscription...</p>
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
          <Card className={`max-w-md w-full ${subscriptionStatus === 'active' ? 'border-green-200' : subscriptionStatus === 'error' ? 'border-red-200' : 'border-amber-200'}`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {subscriptionStatus === 'active' ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : subscriptionStatus === 'error' ? (
                  <AlertCircle className="h-16 w-16 text-red-500" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-amber-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {subscriptionStatus === 'active' ? 'Subscription Successful!' : 
                 subscriptionStatus === 'error' ? 'Subscription Error' : 
                 'Subscription Processing'}
              </CardTitle>
              <CardDescription>
                {subscriptionStatus === 'active' ? 'Thank you for subscribing to our premium service.' : 
                 subscriptionStatus === 'error' ? 'There was an error processing your subscription.' : 
                 'Your subscription is being processed.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {subscriptionStatus === 'active' ? 
                  'Your subscription has been activated. You now have access to all premium features.' : 
                 subscriptionStatus === 'error' ? 
                  'Please check your subscription status on the subscription page or contact support.' : 
                  'Please wait while we verify your subscription. This may take a moment.'}
              </p>
              {!isVerifying && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Redirecting to subscription page in {redirectCountdown} seconds...
                </p>
              )}
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
