import { useRef, useState, useCallback } from "react";
import { Paperclip, X } from "lucide-react";

type FileType = '.pdf' | '.doc' | '.docx' | '.txt' | '.rtf' | '.csv' | '.xls' | '.xlsx' | '.ppt' | '.pptx';

interface FileAttachmentProps {
  /** Currently selected file */
  selectedFile: File | null;
  /** Function to handle file selection */
  onFileSelect: (file: File | null) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Maximum file size in bytes (default: 10MB) */
  maxFileSize?: number;
  /** Allowed file types */
  acceptedFileTypes?: FileType[];
}

const DEFAULT_FILE_TYPES: FileType[] = [
  '.pdf', '.doc', '.docx', '.txt', '.rtf',
  '.csv', '.xls', '.xlsx', '.ppt', '.pptx'
];

/**
 * Component for handling file attachments in chat
 */
export default function FileAttachment({
  selectedFile,
  onFileSelect,
  disabled = false,
  maxFileSize = 10 * 1024 * 1024, // Default 10MB
  acceptedFileTypes = DEFAULT_FILE_TYPES
}: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (file) {
      // Check file size
      if (file.size > maxFileSize) {
        setFileError(`File size exceeds the maximum allowed size (${Math.round(maxFileSize / (1024 * 1024))}MB)`);
        onFileSelect(null);
        return;
      }

      // Check file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}` as FileType;
      if (!acceptedFileTypes.includes(fileExtension)) {
        setFileError(`File type not supported. Allowed types: ${acceptedFileTypes.join(', ')}`);
        onFileSelect(null);
        return;
      }

      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  }, [maxFileSize, onFileSelect, acceptedFileTypes]);

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  }, [onFileSelect]);

  // Trigger file input click
  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes.join(',')}
        aria-label="File attachment input"
      />

      {/* File error message */}
      {fileError && (
        <div 
          className="text-destructive text-sm mb-2 p-2 bg-destructive/10 rounded-md"
          role="alert"
        >
          {fileError}
        </div>
      )}

      {/* Attach button */}
      <button
        type="button"
        onClick={handleAttachClick}
        disabled={disabled || !!selectedFile}
        className="p-1.5 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Attach file"
        title="Attach file"
      >
        <Paperclip className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Remove file button */}
      {selectedFile && (
        <button
          type="button"
          onClick={handleRemoveFile}
          disabled={disabled}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-background border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Remove file"
          title="Remove file"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}