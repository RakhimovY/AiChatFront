import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
};

const SearchBar = React.memo(({ 
  value, 
  onChange, 
  onClear, 
  placeholder 
}: SearchBarProps) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10"
      aria-label="Search templates"
    />
    {value && (
      <button 
        onClick={onClear}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label="Clear search"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
));

SearchBar.displayName = "SearchBar";

export default SearchBar; 