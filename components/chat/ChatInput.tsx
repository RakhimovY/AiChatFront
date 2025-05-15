import { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import CountrySelector from "./CountrySelector";

type ChatInputProps = {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
};

export default function ChatInput({ input, setInput, handleSubmit, isLoading, disabled = false, selectedCountry, onSelectCountry }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex-1 relative ">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Лимит демо-запросов исчерпан" : "Введите ваш вопрос..."}
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
          Информация общего характера. Для юридических вопросов обратитесь к юристу.
        </p>
      </div>
    </div>
  );
}
