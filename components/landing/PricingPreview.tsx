import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

type PricingPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
};

type PricingPreviewProps = {
  title: string;
  description: string;
  plans: PricingPlan[];
};

export default function PricingPreview({ title, description, plans }: PricingPreviewProps) {
  return (
    <section className="pricing-section">
      <div className="container">
        <AnimateOnScroll animation="animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <AnimateOnScroll 
              key={plan.id} 
              animation="animate-zoom-in" 
              delay={index * 150}
              threshold={0.2}
            >
              <div className={`border rounded-lg p-6 bg-card h-full ${plan.popular ? 'relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
                    Популярный
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">${plan.price}<span className="text-muted-foreground text-sm font-normal">{plan.id === "free" ? "" : plan.id === "monthly" ? "/mo" : "/yr"}</span></p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={`/pricing?plan=${plan.id}`} 
                  className={`block text-center px-6 py-2 rounded-md ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'border border-primary text-primary hover:bg-primary/5'
                  } font-medium`}
                >
                  Подробнее
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
