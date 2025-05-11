"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

type AuthFormProps = {
  type: "login" | "register";
};

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (type === "login") {
        // Handle login
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError("Неверный email или пароль");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        // Handle registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Ошибка при регистрации");
        } else {
          // Auto login after registration
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });

          if (result?.error) {
            setError("Ошибка при автоматическом входе");
          } else {
            router.push("/dashboard");
            router.refresh();
          }
        }
      }
    } catch (error) {
      setError("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Ошибка при входе через Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === "login" ? "Вход в аккаунт" : "Создание аккаунта"}
      </h2>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && (
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="Введите ваше имя"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Введите ваш email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Пароль
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md pr-10"
              placeholder="Введите пароль"
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
        </div>

        {type === "login" && (
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : type === "login" ? (
            "Войти"
          ) : (
            "Зарегистрироваться"
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Или продолжить с
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mt-4 py-2 border rounded-md hover:bg-secondary flex items-center justify-center"
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Google
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        {type === "login" ? (
          <>
            Нет аккаунта?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </>
        ) : (
          <>
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Войти
            </Link>
          </>
        )}
      </div>
    </div>
  );
}