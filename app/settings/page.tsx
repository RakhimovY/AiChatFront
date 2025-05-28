"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import {
  CreditCard,
  HelpCircle,
  MessageSquare,
  Save,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import AuthCheck from "@/components/common/AuthCheck";
import {retryWithBackoff} from "@/lib/retryUtils";
import api from "@/lib/api";
import {ChatMessage} from "@/lib/chatApi";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(window.innerWidth >= 768);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create a local state to store displayed user data
  const [displayedUserData, setDisplayedUserData] = useState({
    name: "",
    email: "",
    country: "KZ",
  });

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    country: session?.user?.country || "KZ",
  });

  // Update form data and displayed user data when session is loaded
  useEffect(() => {
    if (session?.user) {
      const userData = {
        name: session.user.name || "",
        email: session.user.email || "",
        country: session.user.country || "KZ",
      };

      setFormData(prevData => ({
        ...prevData,
        ...userData
      }));

      setDisplayedUserData(userData);
    }
  }, [session]);

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the sidebar to close it on mobile
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          api.post(`/user/update-profile`, formData)
      );

      if (response.status === 200) {
        setSuccess(t.profileUpdatedSuccess || "Профиль успешно обновлен");

        // Update the displayed user data immediately
        setDisplayedUserData({
          ...displayedUserData,
          name: formData.name,
          country: formData.country,
        });

        // Update the session with the new user data
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
        <div className="flex flex-col min-h-screen">
          {/* Header component for both mobile and desktop */}
          <Header
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              pageTitle={t.accountDashboard || "Личный кабинет"}
              pageRoute="/settings"
          />

          <div className="flex flex-1 pt-16 md:pt-20">
            {/* Sidebar */}
            <div ref={sidebarRef} className="h-full absolute md:relative top-0 left-0">
              <Sidebar
                  isMobileMenuOpen={isMobileMenuOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  activePage="/settings"
              />
            </div>

            <main className="flex-1 p-6">
              <div className="mb-6 border-b">
                <h1 className="text-2xl font-bold py-2">
                  {t.accountDashboard || "Личный кабинет"}
                </h1>
              </div>

              {/* Unified Personal Account Content */}
              {/* User Profile Section */}
              <div className="flex items-center mb-6 p-4 border rounded-lg bg-primary/5">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  {session?.user?.image ? (
                      <img
                          src={session?.user?.image}
                          alt={displayedUserData.name}
                          className="h-16 w-16 rounded-full"
                      />
                  ) : (
                      <span className="text-primary text-2xl font-medium">
                    {displayedUserData.name ? displayedUserData.name.charAt(0).toUpperCase() : ''}
                  </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{displayedUserData.name}</h2>
                  <p className="text-muted-foreground">{displayedUserData.email}</p>
                </div>
              </div>

              {/* Profile Settings Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t.profileSettings || "Настройки профиля"}</h2>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                      {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-4">
                      {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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
                        placeholder={t.enterYourName || "Введите ваше имя"}
                    />
                  </div>

                  {/*<div className="space-y-2">*/}
                  {/*  <label htmlFor="email" className="text-sm font-medium">*/}
                  {/*    Email*/}
                  {/*  </label>*/}
                  {/*  <input*/}
                  {/*    id="email"*/}
                  {/*    name="email"*/}
                  {/*    type="email"*/}
                  {/*    value={formData.email}*/}
                  {/*    onChange={handleChange}*/}
                  {/*    required*/}
                  {/*    className="w-full p-2 border rounded-md"*/}
                  {/*    placeholder={t.enterYourEmail || "Введите ваш email"}*/}
                  {/*  />*/}
                  {/*</div>*/}

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
                      className="flex items-center justify-center w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                          {t.saving || "Сохранение..."}
                        </>
                    ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t.saveChanges || "Сохранить изменения"}
                        </>
                    )}
                  </button>
                </form>
              </div>

              {/* Quick Links Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t.quickLinks || "Быстрые ссылки"}</h2>
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
