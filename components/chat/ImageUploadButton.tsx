import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

type ImageUploadButtonProps = {
  onImageSelect: (file: File | null) => void;
  disabled?: boolean;
  hasSelectedImage?: boolean;
  maxFileSize?: number; // in bytes
  className?: string;
};

export default function ImageUploadButton({
  onImageSelect,
  disabled = false,
  hasSelectedImage = false,
  maxFileSize = 50 * 1024 * 1024, // Default 50MB
  className = "",
}: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`Image size exceeds the maximum allowed size (${Math.round(maxFileSize / (1024 * 1024))}MB)`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onImageSelect(null);
        return;
      }

      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
        alert("Only JPG, PNG, and WebP images are supported");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onImageSelect(null);
        return;
      }

      onImageSelect(file);
    } else {
      onImageSelect(null);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />
      
      {/* Image upload button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled || hasSelectedImage}
        className={`p-1.5 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        aria-label="Upload image"
      >
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </button>
    </>
  );
}