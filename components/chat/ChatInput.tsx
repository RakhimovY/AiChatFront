import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Plus, Mic, SlidersHorizontal } from "lucide-react";
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
    <form onSubmit={handleSubmit}>
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

        <div className="flex flex-col w-full rounded-xl border px-4 py-3">
          <AutoResizeTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.enterQuestion}
            disabled={isLoading}
            className="flex-1 min-h-[40px] max-h-[160px] resize-none border-none focus:ring-0 focus:outline-none p-0 text-gray-100 bg-transparent placeholder:text-gray-400 leading-6"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            disabled={isLoading}
          />

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleFileClick}
                disabled={isLoading}
                aria-label="Add attachment or tool"
                className="text-gray-400 hover:bg-gray-600 hover:text-gray-200 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-gray-400 hover:bg-gray-600 hover:text-gray-200 rounded-lg flex items-center gap-1 px-3 py-2"
                disabled={isLoading}
                aria-label="Tools"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>{"Инструменты"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                disabled={isLoading}
                aria-label="Voice input"
                className="bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-full"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
