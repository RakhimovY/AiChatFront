import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">LegalGPT</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">О нас</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Блог</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">Карьера</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Тарифы</Link></li>
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Возможности</Link></li>
              <li><Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground">Интеграции</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Документация</Link></li>
              <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">Руководства</Link></li>
              <li><Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">Поддержка</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Условия использования</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Политика конфиденциальности</Link></li>
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Политика cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LegalGPT. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}