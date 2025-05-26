import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import CountrySelector from "./CountrySelector";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import FileAttachment from "./FileAttachment";
import AutoResizeTextarea from "./AutoResizeTextarea";

type ChatInputProps = {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
  onFileSelect?: (file: File | null) => void;
  maxFileSize?: number; // in bytes, default 10MB
};

export default function ChatInput({ 
  input, 
  setInput, 
  handleSubmit, 
  isLoading, 
  disabled = false, 
  selectedCountry, 
  onSelectCountry,
  onFileSelect,
  maxFileSize = 10 * 1024 * 1024 // Default 10MB
}: ChatInputProps) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  // Wrapper for handleSubmit that clears the file before submitting
  const handleFormSubmit = (e: React.FormEvent) => {
    // Clear the file immediately when submitting
    if (selectedFile) {
      setSelectedFile(null);
      if (onFileSelect) onFileSelect(null);
    }

    // Call the original handleSubmit
    handleSubmit(e);
  };

  // Handle file selection
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  return (
    <div>
      {/* Display selected file information */}
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

      <form onSubmit={handleFormSubmit}>
        <div className="relative mb-2">
          <div className="flex flex-col w-full rounded-xl border bg-background shadow-md focus-within:ring-1 focus-within:ring-primary/50">
            {/* Auto-resize textarea for user input */}
            <AutoResizeTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.enterQuestion}
              className="flex-1 p-3 pt-4 pb-10 bg-transparent border-0 rounded-xl focus:outline-none"
              disabled={isLoading || disabled}
              maxHeight={200}
            />

            {/* Buttons positioned at the bottom of the input container */}
            <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-center">
              {/* File attachment button */}
              <FileAttachment
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                disabled={isLoading || disabled}
                maxFileSize={maxFileSize}
              />

              {/* Send button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim() || disabled}
                className="p-1.5 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className={`h-4 w-4 ${input.trim() ? 'text-primary' : 'text-muted-foreground'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Country selector and disclaimer in a single line */}
        <div className="flex items-center space-x-3 text-xs">
          <CountrySelector 
            selectedCountry={selectedCountry}
            onSelectCountry={onSelectCountry}
          />
          <p className="text-muted-foreground flex-1">
            {t.disclaimer}
          </p>
        </div>
      </form>
    </div>
  );
}
