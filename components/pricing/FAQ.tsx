type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

export default function FAQ({ items }: FAQProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
          
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}