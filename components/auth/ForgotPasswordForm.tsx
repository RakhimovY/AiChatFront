"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Make an API call to the frontend API route to request a password reset
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.passwordResetError);
      }

      // If the request was successful, show the success message
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t.generalError);
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.resetPassword}</h2>
        <div className="bg-primary/10 text-primary text-sm p-4 rounded-md mb-6">
          {t.passwordResetSuccess.replace('{email}', email)}
        </div>
        <Link 
          href="/auth/login" 
          className="block w-full py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">{t.resetPassword}</h2>
      <p className="text-muted-foreground mb-6">
        {t.passwordResetInstructions}
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t.email}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder={t.enterEmail}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.sending}
            </>
          ) : (
            t.sendInstructions
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/auth/login" className="text-primary hover:underline">
          {t.backToLogin}
        </Link>
      </div>
    </div>
  );
}
