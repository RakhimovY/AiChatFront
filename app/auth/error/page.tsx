"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Set error message based on error code
    switch (error) {
      case "CredentialsSignin":
        setErrorMessage("Неверный email или пароль. Пожалуйста, попробуйте снова.");
        break;
      case "GoogleCredentialsNotConfigured":
        setErrorMessage("Ошибка конфигурации Google OAuth. Пожалуйста, обратитесь к администратору.");
        break;
      case "InvalidBackendResponse":
        setErrorMessage("Ошибка аутентификации на сервере. Пожалуйста, попробуйте позже.");
        break;
      case "BackendUnavailable":
        setErrorMessage("Сервер недоступен. Пожалуйста, проверьте подключение и попробуйте позже.");
        break;
      case "GoogleAuthFailed":
        setErrorMessage("Ошибка аутентификации через Google. Пожалуйста, попробуйте другой способ входа.");
        break;
      case "OAuthAccountNotLinked":
        setErrorMessage("Этот email уже используется с другим способом входа. Пожалуйста, войдите используя правильный метод.");
        break;
      case "OAuthSignin":
        setErrorMessage("Ошибка при инициализации OAuth. Пожалуйста, попробуйте позже.");
        break;
      case "OAuthCallback":
        setErrorMessage("Ошибка при обработке ответа OAuth. Пожалуйста, попробуйте позже.");
        break;
      default:
        setErrorMessage("Произошла ошибка при аутентификации. Пожалуйста, попробуйте снова.");
    }
  }, [error]);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться на страницу входа
        </Link>

        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-center">Ошибка аутентификации</h2>
          
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-6">
            {errorMessage}
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Вы можете попробовать следующие действия:
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>Проверить правильность введенных данных</li>
              <li>Попробовать другой способ входа</li>
              <li>Проверить подключение к интернету</li>
              <li>Попробовать позже, если проблема временная</li>
            </ul>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Link 
              href="/auth/login" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Вернуться на страницу входа
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}