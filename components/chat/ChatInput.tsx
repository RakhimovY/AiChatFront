import { useState } from "react";
import { Send } from "lucide-react";
import CountrySelector from "./CountrySelector";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import FileAttachment from "./FileAttachment";
import AutoResizeTextarea from "./AutoResizeTextarea";

type ChatInputProps = {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
  selectedCountry: string | null;
  onCountryChange: (country: string | null) => void;
};

export default function ChatInput({ 
  onSendMessage,
  isLoading,
  selectedCountry,
  onCountryChange,
}: ChatInputProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input, selectedFile || undefined);
      setInput("");
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const isInputValid = input.trim().length > 0;

  return (
    <div className="w-full">
      {selectedFile && (
        <div className="mb-2 p-2 bg-muted rounded-md flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-sm truncate">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(selectedFile.size / 1024)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleFileSelect(null)}
            className="text-muted-foreground hover:text-destructive p-1"
            aria-label="Remove file"
          >
            <span className="text-sm">×</span>
          </button>
        </div>
      )}

      <form onSubmit={handleFormSubmit} noValidate className="w-full">
        <div className="relative mb-2">
          <div className="flex flex-col w-full rounded-xl border bg-background shadow-md focus-within:ring-1 focus-within:ring-primary/50">
            <AutoResizeTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.enterQuestion}
              className="flex-1 p-3 pt-4 pb-10 bg-transparent border-0 rounded-xl focus:outline-none"
              disabled={isLoading}
              maxHeight={200}
              aria-label="Chat input"
            />

            <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-center">
              <FileAttachment
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                disabled={isLoading}
                maxFileSize={10 * 1024 * 1024}
              />

              <button
                type="submit"
                disabled={isLoading || !isInputValid}
                className="p-1.5 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className={`h-4 w-4 ${isInputValid ? 'text-primary' : 'text-muted-foreground'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <CountrySelector 
            selectedCountry={selectedCountry}
            onSelectCountry={onCountryChange}
          />
          <p className="text-muted-foreground flex-1">
            {t.disclaimer}
          </p>
        </div>
      </form>
    </div>
  );
}
