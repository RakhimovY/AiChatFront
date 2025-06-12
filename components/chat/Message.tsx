import { useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Message as MessageType } from "./types";

interface MessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  documentUrl?: string;
  documentName?: string;
  isLoading?: boolean;
}

export default function Message({
  id,
  role,
  content,
  documentUrl,
  documentName,
  isLoading = false,
}: MessageProps) {
  const { t } = useLanguage();

  const formattedContent = useMemo(() => {
    if (!content) return "";

    return content
      .split("\n")
      .map((line, i) => {
        if (line.trim() === "") return <br key={i} />;
        return <p key={i}>{line}</p>;
      });
  }, [content]);

  const formattedTime = useMemo(() => {
    return format(new Date(), "HH:mm", { locale: ru });
  }, []);

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {role === "assistant" ? t.assistant : t.user}
          </span>
          <span className="text-sm text-muted-foreground">{formattedTime}</span>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t.assistantTyping}</span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {formattedContent}
          </div>
        )}

        {documentUrl && documentName && (
          <div className="mt-2">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {documentName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
