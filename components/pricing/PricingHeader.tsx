type PricingHeaderProps = {
  title: string;
  description: string;
};

export default function PricingHeader({ title, description }: PricingHeaderProps) {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}