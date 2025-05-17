import { useRef, useEffect, useState } from "react";
import { Send, Paperclip, X } from "lucide-react";
import CountrySelector from "./CountrySelector";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle textarea height adjustment
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = "auto";

    // Set the height based on scrollHeight (with a max height)
    const newHeight = Math.min(e.target.scrollHeight, 200);
    e.target.style.height = `${newHeight}px`;
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (file) {
      // Check file size
      if (file.size > maxFileSize) {
        setFileError(`File size exceeds the maximum allowed size (${Math.round(maxFileSize / (1024 * 1024))}MB)`);
        setSelectedFile(null);
        if (onFileSelect) onFileSelect(null);
        return;
      }

      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    } else {
      setSelectedFile(null);
      if (onFileSelect) onFileSelect(null);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) onFileSelect(null);
  };

  // Trigger file input click
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx,.ppt,.pptx"
      />

      {/* File error message */}
      {fileError && (
        <div className="text-destructive text-sm mb-2 p-2 bg-destructive/10 rounded-md">
          {fileError}
        </div>
      )}

      {/* Selected file display */}
      {selectedFile && (
        <div className="mb-2 p-2 bg-muted rounded-md flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(selectedFile.size / 1024)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleAttachClick}
          disabled={isLoading || disabled || !!selectedFile}
          className="p-3 rounded-md border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? t.demoLimitExceeded : t.enterQuestion}
            className="w-full p-3 pr-10 rounded-md border resize-none min-h-[50px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading || disabled}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim() || disabled}
          className="p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-2 space-y-2 md:space-y-0 max-w-full">
        <CountrySelector 
          selectedCountry={selectedCountry}
          onSelectCountry={onSelectCountry}
        />
        <p className="text-xs text-muted-foreground text-center md:text-right md:flex-1 mt-2 md:mt-0 px-2 py-1.5 bg-background/80 rounded leading-relaxed tracking-wide">
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
}
