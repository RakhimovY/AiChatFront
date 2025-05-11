import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock } from "lucide-react";
import { FormData } from "./types";

type PaymentFormProps = {
  formData: FormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function PaymentForm({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit
}: PaymentFormProps) {
  return (
    <div className="md:col-span-3">
      <h1 className="text-2xl font-bold mb-6">Оформление подписки</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Личная информация</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-md border ${
                    errors.name ? "border-destructive" : "border-input"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  placeholder="Иван Иванов"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-md border ${
                    errors.email ? "border-destructive" : "border-input"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  placeholder="ivan@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Платежная информация</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                  Номер карты
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 rounded-md border ${
                      errors.cardNumber ? "border-destructive" : "border-input"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.cardNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                    Срок действия
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-md border ${
                      errors.expiryDate ? "border-destructive" : "border-input"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="ММ/ГГ"
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-md border ${
                      errors.cvc ? "border-destructive" : "border-input"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    placeholder="123"
                  />
                  {errors.cvc && (
                    <p className="text-sm text-destructive mt-1">{errors.cvc}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {errors.submit && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {errors.submit}
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Lock className="h-4 w-4 mr-2" />
            <span>Ваши платежные данные защищены шифрованием</span>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Обработка..." : "Оформить подписку"}
          </button>
          
          <p className="text-xs text-center text-muted-foreground">
            Нажимая кнопку "Оформить подписку", вы соглашаетесь с нашими{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Условиями использования
            </Link>{" "}
            и{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}