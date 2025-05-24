"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Polar } from "@polar-sh/sdk";

interface SubscribeButtonProps {
  planId: string;
  buttonText?: string;
  className?: string;
}

export default function SubscribeButton({ 
  planId, 
  buttonText = 'Subscribe', 
  className = '' 
}: SubscribeButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session?.user?.email) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Using the Polar checkout with the correct configuration
      const polar = new Polar({
        accessToken: process.env.NEXT_PUBLIC_POLAR_API_KEY!,
        server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      });

      // Generate a unique session ID for this checkout
      const sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('polarSessionId', sessionId);

      // Create checkout session with customer email and success URL including the session ID
      const checkout = await polar.checkouts.create({
        products: [planId], // Use the planId prop instead of hardcoded value
        customerEmail: session.user.email,
        successUrl: `${window.location.origin}/subscription/success?session=${sessionId}`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      });

      // Store checkout ID in localStorage to use it for verification on success page
      localStorage.setItem('polarCheckoutId', checkout.id);

      // Redirect to the checkout URL
      window.location.href = checkout.url;

    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast({
        title: "Subscription error",
        description: "There was an error initiating your subscription. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading || !session} 
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}
