"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, HelpCircle, MessageSquare, Save } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import AuthCheck from "@/components/common/AuthCheck";
import { retryWithBackoff } from "@/lib/retryUtils";
import api from "@/lib/api";
import { Translation } from "@/lib/i18n";

interface UserData {
  name: string;
  email: string;
  country: string;
  image?: string;
}

interface AlertProps {
  message: string;
  type: "error" | "success";
}

const Alert = ({ message, type }: AlertProps) => (
  <div className={`${type === "error" ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-800"} text-sm p-3 rounded-md mb-4`}>
    {message}
  </div>
);

const UserProfile = ({ userData }: { userData: UserData }) => (
  <div className="flex items-center mb-6 p-4 border rounded-lg bg-primary/5">
    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
      {userData.image ? (
        <img
          src={userData.image}
          alt={userData.name}
          className="h-16 w-16 rounded-full"
        />
      ) : (
        <span className="text-primary text-2xl font-medium">
          {userData.name ? userData.name.charAt(0).toUpperCase() : ""}
        </span>
      )}
    </div>
    <div>
      <h2 className="text-xl font-semibold">{userData.name}</h2>
      <p className="text-muted-foreground">{userData.email}</p>
    </div>
  </div>
);

const ProfileForm = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  isLoading, 
  error, 
  success, 
  t 
}: { 
  formData: UserData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string;
  success: string;
  t: Translation;
}) => (
  <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
    {error && <Alert message={error} type="error" />}
    {success && <Alert message={success} type="success" />}

    <div className="space-y-2">
      <label htmlFor="name" className="text-sm font-medium">
        {t.name || "Имя"}
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md"
        placeholder={t.enterName || "Введите ваше имя"}
      />
    </div>

    <div className="space-y-2">
      <label htmlFor="country" className="text-sm font-medium">
        {t.country || "Страна"}
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

    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md disabled:opacity-50"
    >
      {isLoading ? t.loading || "Загрузка..." : t.save || "Сохранить"}
    </button>
  </form>
);

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [displayedUserData, setDisplayedUserData] = useState<UserData>({
    name: "",
    email: "",
    country: "KZ",
  });

  const [formData, setFormData] = useState<UserData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    country: (session?.user as any)?.country || "KZ",
  });

  useEffect(() => {
    setIsMobileMenuOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (session?.user) {
      const userData = {
        name: session.user.name || "",
        email: session.user.email || "",
        country: (session.user as any)?.country || "KZ",
      };

      setFormData((prevData) => ({
        ...prevData,
        ...userData,
      }));

      setDisplayedUserData(userData);
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await retryWithBackoff(() =>
        api.post(`/user/update-profile`, formData),
      );

      if (response.status === 200) {
        setSuccess(t.profileUpdatedSuccess || "Профиль успешно обновлен");

        setDisplayedUserData({
          ...displayedUserData,
          name: formData.name,
          country: formData.country,
        });

        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            country: formData.country,
          },
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          t.profileUpdateError ||
          "Ошибка при обновлении профиля",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCheck>
      <div className="flex flex-col h-full">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          showThemeToggle={true}
          showUserInfo={true}
          showBackButton={false}
        />

        <div className="flex flex-1 pt-16 md:pt-20">
          <div ref={sidebarRef}>
            <Sidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              activePage="/settings"
              showRecentChats={false}
            />
          </div>

          <main className="flex-1 p-6 md:ml-16">
            <UserProfile userData={displayedUserData} />

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {t.profileSettings || "Настройки профиля"}
              </h2>

              <ProfileForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                success={success}
                t={t}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                {t.settings || "Настройки"}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 flex flex-col h-full">
                  <div>
                    <MessageSquare className="h-8 w-8 text-primary mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                      {t.startChat || "Начать чат"}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {t.chatDescription ||
                        "Задайте вопрос юридическому ассистенту и получите мгновенный ответ."}
                    </p>
                  </div>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/chat"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {t.goToChat || "Перейти к чату"}
                    </Link>
                  </div>
                </div>

                <div className="border rounded-lg p-6 flex flex-col h-full">
                  <div>
                    <CreditCard className="h-8 w-8 text-primary mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                      {t.manageSubscription || "Управление подпиской"}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {t.subscriptionDescription ||
                        "Просмотр и изменение вашего текущего тарифного плана."}
                    </p>
                  </div>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/subscription"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {t.manageSubscription || "Управление подпиской"}
                    </Link>
                  </div>
                </div>

                <div className="border rounded-lg p-6 flex flex-col h-full">
                  <div>
                    <HelpCircle className="h-8 w-8 text-primary mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                      {t.supportCenter || "Центр поддержки"}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {t.supportDescription ||
                        "Получите ответы на часто задаваемые вопросы или свяжитесь с нашей службой поддержки."}
                    </p>
                  </div>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/support"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {t.goToSupport || "Перейти в центр поддержки"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}
