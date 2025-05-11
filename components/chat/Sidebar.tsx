import Link from "next/link";
import { Bot, Trash2, User } from "lucide-react";

type SidebarProps = {
  isSidebarOpen: boolean;
  clearChat: () => void;
};

export default function Sidebar({ isSidebarOpen, clearChat }: SidebarProps) {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">LegalGPT</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-medium mb-2 text-sm text-muted-foreground">Недавние чаты</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-primary/10 font-medium">
              Консультация по договору аренды
            </button>
            <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-primary/10">
              Вопрос о трудовом праве
            </button>
            <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-primary/10">
              Налоговый вычет при покупке жилья
            </button>
          </div>
          
          <div className="mt-6">
            <button 
              onClick={clearChat}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
              <span>Очистить историю</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Пользователь</p>
              <p className="text-xs text-muted-foreground">Стандарт-тариф</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}