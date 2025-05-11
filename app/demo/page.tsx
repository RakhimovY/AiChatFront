"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInitializeDemoStore } from "@/store/demoStore";

export default function DemoPage() {
  const router = useRouter();
  
  // Initialize the demo store
  useInitializeDemoStore();
  
  // Redirect to chat page with demo mode
  useEffect(() => {
    router.push("/chat?mode=demo");
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}