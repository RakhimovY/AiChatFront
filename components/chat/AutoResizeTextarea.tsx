import { useRef, useEffect, useCallback } from "react";

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Current value of the textarea */
  value: string;
  /** Function to handle value changes */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Optional function to handle key down events */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** Minimum height in pixels */
  minHeight?: number;
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
  maxHeight = 200,
  minHeight = 50,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on mount
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  // Handle textarea height adjustment
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Call the parent onChange handler
    onChange(e);

    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = "auto";

    // Set the height based on scrollHeight (with a max height)
    const newHeight = Math.min(
      Math.max(e.target.scrollHeight, minHeight),
      maxHeight
    );
    e.target.style.height = `${newHeight}px`;
  }, [onChange, maxHeight, minHeight]);

  // Adjust height when value changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, maxHeight, minHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInputChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`resize-none ${className}`}
      disabled={disabled}
      style={{ 
        maxHeight: `${maxHeight}px`,
        minHeight: `${minHeight}px`
      }}
      aria-label={placeholder}
      {...props}
    />
  );
}