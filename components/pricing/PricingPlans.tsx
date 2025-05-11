import { Plan } from "./types";
import PlanCard from "./PlanCard";

type PricingPlansProps = {
  plans: Plan[];
};

export default function PricingPlans({ plans }: PricingPlansProps) {
  return (
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}