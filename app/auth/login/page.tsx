import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад на главную
        </Link>

        <div className="max-w-md mx-auto">
          <AuthForm type="login" />
        </div>
      </div>
    </main>
  );
}