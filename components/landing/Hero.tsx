import Link from "next/link";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

type HeroProps = {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
};

export default function Hero({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: HeroProps) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll animation="animate-slide-down" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {title}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-fade-in" delay={300}>
            <p className="text-xl text-muted-foreground mb-8">
              {description}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="animate-slide-up" delay={500}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href={primaryButtonLink} 
                className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {primaryButtonText}
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link 
                  href={secondaryButtonLink} 
                  className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
