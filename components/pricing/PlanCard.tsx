import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Plan } from "./types";

type PlanCardProps = {
  plan: Plan;
};

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div 
      className={`border rounded-lg p-6 bg-card relative h-full flex flex-col shadow-sm ${
        plan.popular ? "border-primary ring-2 ring-primary/20" : ""
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
          Популярный
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <p className="text-3xl font-bold mb-2">${plan.price}<span className="text-muted-foreground text-sm font-normal">{plan.id === "free" ? "" : plan.id === "monthly" ? "/mo" : "/yr"}</span></p>
        <p className="text-muted-foreground">{plan.description}</p>
      </div>

      <Link 
        href={`/checkout?plan=${plan.id}`} 
        className={`block text-center px-6 py-3 rounded-md mb-6 font-medium transition-colors ${
          plan.popular 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "border border-primary text-primary hover:bg-primary/5"
        }`}
      >
        Выбрать тариф
      </Link>

      <div className="space-y-3 mt-auto">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle2 
              className={`h-5 w-5 mr-2 flex-shrink-0 ${
                feature.included ? "text-primary" : "text-muted-foreground/30"
              }`} 
            />
            <span className={feature.included ? "" : "text-muted-foreground/50"}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
