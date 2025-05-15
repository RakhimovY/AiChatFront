"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validate password
  const validatePassword = (password: string): string | null => {
    if (password.length < 12) {
      return "Пароль должен содержать не менее 12 символов";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
    if (!passwordRegex.test(password)) {
      return "Пароль должен содержать как минимум одну строчную букву, одну заглавную букву, одну цифру и один специальный символ";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      // Make an API call to the frontend API route to reset the password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Произошла ошибка при сбросе пароля');
      }

      // If the request was successful, show the success message
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Произошла ошибка. Пожалуйста, попробуйте еще раз.");
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
          Ваш пароль был успешно изменен. Теперь вы можете войти в систему с новым паролем.
        </div>
        <Link 
          href="/auth/login" 
          className="block w-full py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Перейти к входу
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
      <p className="text-muted-foreground mb-6">
        Введите новый пароль для вашей учетной записи.
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Новый пароль
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md pr-10"
              placeholder="Введите новый пароль"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <p>Пароль должен содержать:</p>
            <ul className="list-disc list-inside">
              <li>Минимум 12 символов</li>
              <li>Хотя бы одну строчную букву (a-z)</li>
              <li>Хотя бы одну заглавную букву (A-Z)</li>
              <li>Хотя бы одну цифру (0-9)</li>
              <li>Хотя бы один специальный символ (@$!%*?&)</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Подтверждение пароля
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Подтвердите новый пароль"
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
              Сброс пароля...
            </>
          ) : (
            "Сбросить пароль"
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
