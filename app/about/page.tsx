import { Linkedin, Mail, MessageSquare } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navigation activePage="about" />

      {/* About Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">О проекте LegalGPT</h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-center mb-12">
              LegalGPT создан с целью сделать юридическую помощь доступной для всех людей.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-6">Наша миссия</h2>
            <p>
              Мы верим, что каждый человек должен иметь доступ к качественной юридической информации и поддержке. 
              LegalGPT использует передовые технологии искусственного интеллекта, чтобы предоставить быстрые и точные 
              ответы на юридические вопросы, делая правовую помощь более доступной и понятной.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-6">Основные возможности</h2>
            <ul className="space-y-4">
              <li>
                <strong>Чат с ИИ</strong> - Задавайте юридические вопросы и получайте мгновенные ответы от нашего 
                искусственного интеллекта, обученного на правовых документах и законодательстве.
              </li>
              <li>
                <strong>Загрузка документов</strong> - Загружайте юридические документы и задавайте вопросы, 
                основываясь на их содержании. Наш ИИ проанализирует документ и предоставит релевантные ответы.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-6">О создателе</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary">YR</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Еркебулан Рахимов</h3>
                <p className="mb-4">
                  Основатель и разработчик LegalGPT. Еркебулан создал этот проект с целью демократизировать 
                  доступ к юридической информации и помочь людям лучше понимать свои права и обязанности.
                </p>
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://www.linkedin.com/in/rakhimov-yerkebulan/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <Linkedin className="h-5 w-5 mr-2" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mt-12 mb-6">Связаться с нами</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a 
                href="https://wa.me/77086934037?text=Здравствуйте!%20У%20меня%20вопрос%20о%20LegalGPT." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <MessageSquare className="h-10 w-10 text-green-500 mb-3" />
                <h3 className="font-medium mb-1">WhatsApp</h3>
                <p className="text-sm text-center text-muted-foreground">+7 708 693 4037</p>
              </a>
              
              <a 
                href="https://t.me/YerkebulanR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <MessageSquare className="h-10 w-10 text-blue-500 mb-3" />
                <h3 className="font-medium mb-1">Telegram</h3>
                <p className="text-sm text-center text-muted-foreground">@YerkebulanR</p>
              </a>
              
              <a 
                href="mailto:erke.bulan622@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Mail className="h-10 w-10 text-primary mb-3" />
                <h3 className="font-medium mb-1">Email</h3>
                <p className="text-sm text-center text-muted-foreground">erke.bulan622@gmail.com</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}