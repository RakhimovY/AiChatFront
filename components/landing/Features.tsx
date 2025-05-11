import { LucideIcon } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type FeaturesProps = {
  title: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
};

export default function Features({ title, features }: FeaturesProps) {
  return (
    <section className="features-section">
      <div className="container">
        <AnimateOnScroll animation="animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimateOnScroll 
                key={index} 
                animation="animate-slide-up" 
                delay={index * 100}
                threshold={0.2}
              >
                <div className="p-6 border rounded-lg h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
