import { useRef, useEffect } from "react";

interface AutoResizeTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

/**
 * Textarea component that automatically resizes based on content
 */
export default function AutoResizeTextarea({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  className = "",
  maxHeight = 200
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle textarea height adjustment
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Call the parent onChange handler
    onChange(e);

    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = "auto";

    // Set the height based on scrollHeight (with a max height)
    const newHeight = Math.min(e.target.scrollHeight, maxHeight);
    e.target.style.height = `${newHeight}px`;
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`resize-none min-h-[50px] ${className}`}
      disabled={disabled}
      style={{ maxHeight: `${maxHeight}px` }}
    />
  );
}