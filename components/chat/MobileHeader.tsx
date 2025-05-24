import Header from "@/components/layout/Header";

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
    <Header
      isMobileMenuOpen={isSidebarOpen}
      setIsMobileMenuOpen={setIsSidebarOpen}
      pageTitle="AIuris"
      pageRoute="/chat"
      exportChat={exportChat}
      showThemeToggle={true}
      showUserInfo={false}
      showBackButton={true}
    />
  );
}
