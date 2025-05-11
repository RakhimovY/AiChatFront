import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <Link href="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к входу
        </Link>

        <div className="max-w-md mx-auto">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}