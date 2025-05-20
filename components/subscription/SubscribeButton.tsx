"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Polar } from "@polar-sh/sdk";
import {redirect} from "next/navigation";

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
      // Using the Polar checkout directly with URL parameters
      const polar = new Polar({
        accessToken: process.env.NEXT_PUBLIC_POLAR_API_KEY,
      });

      const checkout = await polar.checkouts.create({
        products: ["e545ed36-051e-48b5-aa98-082820de2381"],
      });

      redirect(checkout.url)

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
