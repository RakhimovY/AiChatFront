"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import SubscribeButton from './SubscribeButton';

interface SubscriptionPromoProps {
  className?: string;
}

export default function SubscriptionPromo({ className = '' }: SubscriptionPromoProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // If user is not authenticated, show a sign-in button
  const handleSignIn = () => {
    setIsLoading(true);
    router.push('/auth/login');
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl">Upgrade to Premium</CardTitle>
        <CardDescription>
          Get access to advanced features and priority support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Unlimited AI conversations</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Priority support</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Advanced document analysis</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Early access to new features</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        {status === 'authenticated' ? (
          <SubscribeButton
            planId="e545ed36-051e-48b5-aa98-082820de2381"
            buttonText="Subscribe Now"
            className="w-full"
          />
        ) : (
          <Button 
            onClick={handleSignIn} 
            disabled={isLoading} 
            className="w-full"
          >
            Sign in to Subscribe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}