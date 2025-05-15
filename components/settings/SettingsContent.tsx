"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Settings, Save, User } from "lucide-react";
import Sidebar, { MenuItem } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import axios from "axios";

type SettingsContentProps = {
  user: {
    name: string;
    email: string;
    image?: string;
    country: string;
  };
};

export default function SettingsContent({ user }: SettingsContentProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    country: user.country || "Kazakhstan",
  });

  // Reference to the sidebar element
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only proceed if the sidebar is open and we're on mobile
      if (!isMobileMenuOpen || window.innerWidth >= 768) return;

      // Check if the click was outside the sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const menuItems: MenuItem[] = [
    { icon: User, label: "Аккаунт", href: "/account" },
    { icon: Settings, label: "Настройки", href: "/settings" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Call the backend API to update the user profile
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Профиль успешно обновлен");
        
        // Update the session with the new user data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email,
            country: formData.country,
          },
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Ошибка при обновлении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header component for both mobile and desktop */}
      <Header
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageTitle="Настройки"
        pageRoute="/settings"
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar */}
        <Sidebar 
          menuItems={menuItems}
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activePage="/settings"
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Настройки профиля</h1>
          
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
              <label htmlFor="country" className="text-sm font-medium">
                Страна
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="Kazakhstan">Казахстан</option>
                <option value="Russia">Россия</option>
                <option value="Belarus">Беларусь</option>
                <option value="Ukraine">Украина</option>
                <option value="Uzbekistan">Узбекистан</option>
                <option value="Kyrgyzstan">Кыргызстан</option>
                <option value="Tajikistan">Таджикистан</option>
                <option value="Turkmenistan">Туркменистан</option>
                <option value="Azerbaijan">Азербайджан</option>
                <option value="Armenia">Армения</option>
                <option value="Georgia">Грузия</option>
                <option value="Moldova">Молдова</option>
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
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}