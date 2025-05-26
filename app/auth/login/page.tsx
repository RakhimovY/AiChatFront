"use client";

import AuthForm from "@/components/auth/AuthForm";
import Navigation from "@/components/layout/Navigation";

export default function LoginPage() {

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 mt-16">

        <div className="max-w-md mx-auto">
          <AuthForm type="login" />
        </div>
      </div>
    </main>
  );
}
