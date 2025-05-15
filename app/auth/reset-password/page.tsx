"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <div className="container py-12">
          <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к входу
          </Link>

          <div className="max-w-md mx-auto">
            <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
              <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-6">
                Недействительный или отсутствующий токен сброса пароля. Пожалуйста, запросите новую ссылку для сброса пароля.
              </div>
              <Link 
                href="/auth/forgot-password" 
                className="block w-full py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Запросить сброс пароля
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к входу
        </Link>

        <div className="max-w-md mx-auto">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </main>
  );
}