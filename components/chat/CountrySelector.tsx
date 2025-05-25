import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { countries, findCountryByCode, filterCountries } from "@/lib/countries";
import { useDropdownPosition } from "@/lib/hooks/useDropdownPosition";

type CountrySelectorProps = {
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
};

export default function CountrySelector({ selectedCountry, onSelectCountry }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  // Use the dropdown position hook
  const { position: dropPosition, style: dropdownStyle } = useDropdownPosition(
    buttonRef,
    isOpen,
    { minSpaceBelow: 300, dropdownWidth: 224 }
  );

  // Filter countries based on search term
  useEffect(() => {
    setFilteredCountries(filterCountries(searchTerm));
  }, [searchTerm]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.country-dropdown')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get the selected country name
  const selectedCountryName = selectedCountry 
    ? findCountryByCode(selectedCountry)?.name || selectedCountry
    : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
        title={t.selectCountry}
      >
        <MapPin className="h-3 w-3" />
        <span>{selectedCountryName || t.selectCountry}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div 
          className={`fixed z-50 w-56 rounded-md shadow-lg bg-card border country-dropdown ${
            dropPosition === 'top' 
              ? 'mb-1' // Position above the button with margin-bottom
              : 'mt-1' // Position below the button with margin-top
          }`}
          style={dropdownStyle}>
          <div className="p-2">
            <input
              type="text"
              placeholder={t.searchCountry}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => {
                onSelectCountry(null);
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent"
            >
              {t.noCountry}
            </button>
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onSelectCountry(country.code);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent ${
                  selectedCountry === country.code ? "bg-primary/10 font-medium" : ""
                }`}
              >
                {country.name} ({country.code})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
