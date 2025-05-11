"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful password reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
    } catch (error: unknown) {
      setError("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
        <div className="bg-primary/10 text-primary text-sm p-4 rounded-md mb-6">
          Инструкции по сбросу пароля отправлены на адрес {email}. Пожалуйста, проверьте вашу электронную почту.
        </div>
        <Link 
          href="/auth/login" 
          className="block w-full py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Вернуться к входу
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
      <p className="text-muted-foreground mb-6">
        Введите ваш email, и мы отправим вам инструкции по сбросу пароля.
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Введите ваш email"
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
              Отправка...
            </>
          ) : (
            "Отправить инструкции"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/auth/login" className="text-primary hover:underline">
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
}
