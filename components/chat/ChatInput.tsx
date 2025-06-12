import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import FileAttachment from "./FileAttachment";
import CountrySelector from "./CountrySelector";

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
  selectedCountry?: string;
  onCountryChange?: (country: string | null) => void;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  selectedCountry,
  onCountryChange,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() || file) {
        onSendMessage(message.trim(), file || undefined);
        setMessage("");
        setFile(null);
      }
    },
    [message, file, onSendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex flex-col gap-4">
        {selectedCountry && onCountryChange && (
          <CountrySelector
            selectedCountry={selectedCountry}
            onSelectCountry={onCountryChange}
            disabled={isLoading}
          />
        )}

        {file && (
          <FileAttachment
            selectedFile={file}
            onFileSelect={handleRemoveFile}
            disabled={isLoading}
          />
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <AutoResizeTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.enterQuestion}
              disabled={isLoading}
              className="min-h-[60px] max-h-[200px] resize-none"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              disabled={isLoading}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleFileClick}
              disabled={isLoading}
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() && !file || isLoading}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
