import { Plan } from "./types";

type OrderSummaryProps = {
  plan: Plan;
};

export default function OrderSummary({ plan }: OrderSummaryProps) {
  return (
    <div className="border rounded-lg p-6 bg-card sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>

      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>Тариф</span>
          <span className="font-medium">{plan.name}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="flex justify-between">
          <span>Стоимость</span>
          <span className="font-medium">${plan.price}{plan.id === "free" ? "" : plan.id === "monthly" ? "/mo" : "/yr"}</span>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between">
          <span>Пробный период</span>
          <span className="font-medium text-primary">7 дней бесплатно</span>
        </div>
      </div>

      <div className="flex justify-between font-semibold">
        <span>К оплате сегодня</span>
        <span className="text-xl">$0</span>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        После окончания пробного периода с вас будет списываться ${plan.price}{plan.id === "monthly" ? " ежемесячно" : plan.id === "yearly" ? " ежегодно" : ""}. 
        Вы можете отменить подписку в любое время до окончания пробного периода.
      </p>
    </div>
  );
}
