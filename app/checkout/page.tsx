"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { Plan, FormData } from "@/components/checkout/types";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";
import SuccessMessage from "@/components/checkout/SuccessMessage";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "standard";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Define available plans
  const plans: Record<string, Plan> = {
    basic: {
      id: "basic",
      name: "Базовый",
      price: 990,
      description: "До 50 запросов в день, базовые консультации",
    },
    standard: {
      id: "standard",
      name: "Стандарт",
      price: 1990,
      description: "До 200 запросов в день, расширенные консультации",
    },
    professional: {
      id: "professional",
      name: "Профессиональный",
      price: 4990,
      description: "Безлимитные запросы, приоритетная поддержка",
    },
  };

  // Get current plan
  const currentPlan = plans[planId] || plans.standard;

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);

      setFormData({ ...formData, [name]: formatted });
      return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);

      setFormData({ ...formData, [name]: formatted });
      return;
    }

    // Format CVC
    if (name === "cvc") {
      const formatted = value.replace(/\D/g, "").slice(0, 3);
      setFormData({ ...formData, [name]: formatted });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Введите имя";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Введите номер карты";
    } else if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Номер карты должен содержать 16 цифр";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Введите срок действия";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Формат: ММ/ГГ";
    }

    if (!formData.cvc.trim()) {
      newErrors.cvc = "Введите CVC";
    } else if (formData.cvc.length !== 3) {
      newErrors.cvc = "CVC должен содержать 3 цифры";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // In a real application, this would be an API call to your payment processor
      // For demo purposes, we'll simulate a successful payment after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);

    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        submit: "Произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navigation />
        <SuccessMessage plan={currentPlan} />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/pricing" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к тарифам
          </Link>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Order summary */}
            <div className="md:col-span-2">
              <OrderSummary plan={currentPlan} />
            </div>

            {/* Payment form */}
            <PaymentForm 
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
