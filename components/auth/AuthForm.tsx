"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type AuthFormProps = {
  type: "login" | "register";
};

interface AuthFormData {
  name: string;
  email: string;
  password: string;
  country: string;
}

interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    country: "KZ", // Default country
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for error parameters in the URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "session_expired") {
      setError(t.sessionExpired);
    }
  }, [searchParams, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate password for registration
  const validatePassword = (password: string): string | null => {
    if (password.length < 12) {
      return t.passwordMinLength;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;
    if (!passwordRegex.test(password)) {
      return `${t.passwordRequirements} ${t.passwordLowercase}, ${t.passwordUppercase}, ${t.passwordNumber}, ${t.passwordSpecial}`;
    }

    return null;
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
          remember: rememberMe, // Pass the remember me preference
        });

        if (result?.error) {
          setError(t.invalidCredentials);
        } else {
          router.push("/account");
          router.refresh();
        }
      } else {
        // Validate password for registration
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          setError(passwordError);
          setIsLoading(false);
          return;
        }

        // Handle registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data: RegisterResponse = await response.json();

        if (!response.ok) {
          setError(data.message || t.registrationError);
        } else {
          // Auto login after registration
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
            remember: rememberMe, // Pass the remember me preference
          });

          if (result?.error) {
            setError(t.autoLoginError);
          } else {
            router.push("/account");
            router.refresh();
          }
        }
      }
    } catch (error: unknown) {
      setError(t.generalError);
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/account" });
    } catch (error: unknown) {
      console.error("Google sign in error:", error);
      setError(t.googleSignInError);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === "login" ? t.loginTitle : t.registerTitle}
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
              {t.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder={t.enterName}
            />
          </div>
        )}

        {type === "register" && (
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              {t.country}
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="KZ">Казахстан</option>
              <option value="RU">Россия</option>
              <option value="BY">Беларусь</option>
              <option value="UA">Украина</option>
              <option value="UZ">Узбекистан</option>
              <option value="KG">Кыргызстан</option>
              <option value="TJ">Таджикистан</option>
              <option value="TM">Туркменистан</option>
              <option value="AZ">Азербайджан</option>
              <option value="AM">Армения</option>
              <option value="GE">Грузия</option>
              <option value="MD">Молдова</option>
              <option value="US">США</option>
              <option value="GB">Великобритания</option>
              <option value="DE">Германия</option>
              <option value="FR">Франция</option>
              <option value="IT">Италия</option>
              <option value="ES">Испания</option>
              <option value="CN">Китай</option>
              <option value="JP">Япония</option>
              <option value="IN">Индия</option>
              <option value="BR">Бразилия</option>
              <option value="CA">Канада</option>
              <option value="AU">Австралия</option>
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder={t.enterEmail}
            autoComplete={type === "login" ? "username" : "email"}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            {t.password}
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
              placeholder={t.enterPassword}
              autoComplete={type === "login" ? "current-password" : "new-password"}
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
          {type === "register" && (
            <div className="text-xs text-muted-foreground mt-1">
              <p>{t.passwordRequirements}</p>
              <ul className="list-disc list-inside">
                <li>{t.passwordMinLength}</li>
                <li>{t.passwordLowercase}</li>
                <li>{t.passwordUppercase}</li>
                <li>{t.passwordNumber}</li>
                <li>{t.passwordSpecial}</li>
              </ul>
            </div>
          )}

          {type === "register" && (
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm">
                {t.rememberMe}
              </label>
            </div>
          )}
        </div>

        {type === "login" && (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm">
                {t.rememberMe}
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t.forgotPassword}
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
              {t.loading}
            </>
          ) : type === "login" ? (
            t.login
          ) : (
            t.register
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
              {t.continueWith}
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
            {t.noAccount}{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              {t.register}
            </Link>
          </>
        ) : (
          <>
            {t.alreadyHaveAccount}{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t.login}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
