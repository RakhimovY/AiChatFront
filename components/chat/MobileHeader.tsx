import Link from "next/link";
import { ArrowLeft, Bot, Download, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type MobileHeaderProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  exportChat: () => void;
};

export default function MobileHeader({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  exportChat 
}: MobileHeaderProps) {
  return (
    <header className="border-b p-4 flex items-center justify-between md:hidden">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-md hover:bg-secondary"
      >
        {isSidebarOpen ? <ArrowLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <Link href="/chat" className="flex items-center space-x-2">
        <Bot className="h-5 w-5 text-primary" />
        <span className="font-bold">LegalGPT</span>
      </Link>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <button 
          onClick={exportChat}
          className="p-2 rounded-md hover:bg-secondary"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
