import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

type CTASectionProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: React.ReactNode;
  bgClass?: string;
};

export default function CTASection({
  title,
  description,
  buttonText,
  buttonLink,
  icon = <ArrowRight className="ml-2 h-5 w-5" />,
  bgClass = "bg-primary/5"
}: CTASectionProps) {
  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container">
        <AnimateOnScroll animation="animate-slide-up" threshold={0.3}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {description}
            </p>
            <Link 
              href={buttonLink} 
              className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              {buttonText} {icon}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
