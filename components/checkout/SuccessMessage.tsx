import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Plan } from "./types";

type SuccessMessageProps = {
  plan: Plan;
};

export default function SuccessMessage({ plan }: SuccessMessageProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Оплата прошла успешно!</h1>
        <p className="text-muted-foreground mb-8">
          Спасибо за подписку на тариф "{plan.name}". Мы отправили подтверждение на ваш email.
        </p>
        <div className="space-y-4">
          <Link 
            href="/chat" 
            className="block w-full px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Перейти в чат
          </Link>
          <Link 
            href="/" 
            className="block w-full px-6 py-3 rounded-md border border-input hover:bg-secondary/50 font-medium"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}