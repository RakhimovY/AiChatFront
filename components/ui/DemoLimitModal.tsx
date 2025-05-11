"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useDemoStore } from "@/store/demoStore";

export default function DemoLimitModal() {
  const { isModalShown, hideModal } = useDemoStore();

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalShown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalShown]);

  if (!isModalShown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-card rounded-lg shadow-lg border">
        <button
          onClick={hideModal}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Лимит демо-запросов исчерпан</h2>
          <p className="text-muted-foreground mb-6">
            Вы использовали все 10 бесплатных запросов в демо-режиме. Чтобы продолжить пользоваться сервисом, пожалуйста, зарегистрируйтесь и выберите подходящий тариф.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium"
            >
              Посмотреть тарифы
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}