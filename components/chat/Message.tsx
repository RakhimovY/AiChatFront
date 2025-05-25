import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useMemo } from 'react';
import ImageMessage from './ImageMessage';
import { formatMessageContent } from '@/lib/messageFormatting';

type MessageProps = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  documentUrl?: string;
  documentName?: string;
  imageId?: string;
  imageAlt?: string;
};

export default function Message({ id, role, content, isLoading = false, documentUrl, documentName, imageId, imageAlt }: MessageProps) {
  const { t } = useLanguage();

  // Memoize the formatted content to prevent unnecessary re-rendering
  const formattedContent = useMemo(() => {
    return formatMessageContent(content);
  }, [content]);

  return (
    <div
      key={id}
      className={`message ${
        role === "user" ? "user-message" : "assistant-message"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>{t.assistantTyping}</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-start">
            <div className="flex-1 message-content">
              {formattedContent}
            </div>
          </div>

          {/* Image attachment */}
          {imageId && (
            <div className="mt-3 mb-2">
              <ImageMessage
                imageId={imageId}
                altText={imageAlt || "Attached image"} 
                className="rounded-md overflow-hidden"
              />
            </div>
          )}

          {/* Document attachment */}
          {documentUrl && documentName && (
            <div className="mt-2 flex">
              <a 
                href={documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-md"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>{documentName}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
