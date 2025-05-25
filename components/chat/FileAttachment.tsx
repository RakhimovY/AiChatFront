import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

interface FileAttachmentProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  maxFileSize?: number; // in bytes, default 10MB
}

/**
 * Component for handling file attachments in chat
 */
export default function FileAttachment({
  selectedFile,
  onFileSelect,
  disabled = false,
  maxFileSize = 10 * 1024 * 1024 // Default 10MB
}: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (file) {
      // Check file size
      if (file.size > maxFileSize) {
        setFileError(`File size exceeds the maximum allowed size (${Math.round(maxFileSize / (1024 * 1024))}MB)`);
        onFileSelect(null);
        return;
      }

      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
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

      {/* Attach button */}
      <button
        type="button"
        onClick={handleAttachClick}
        disabled={disabled || !!selectedFile}
        className="p-1.5 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Attach file"
      >
        <Paperclip className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}