import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// List of countries with their codes
const countries = [
  { code: "RU", name: "Россия" },
  { code: "KZ", name: "Казахстан" },
  { code: "BY", name: "Беларусь" },
  { code: "UA", name: "Украина" },
  { code: "UZ", name: "Узбекистан" },
  { code: "KG", name: "Кыргызстан" },
  { code: "TJ", name: "Таджикистан" },
  { code: "TM", name: "Туркменистан" },
  { code: "AZ", name: "Азербайджан" },
  { code: "AM", name: "Армения" },
  { code: "GE", name: "Грузия" },
  { code: "MD", name: "Молдова" },
  { code: "US", name: "США" },
  { code: "GB", name: "Великобритания" },
  { code: "DE", name: "Германия" },
  { code: "FR", name: "Франция" },
  { code: "IT", name: "Италия" },
  { code: "ES", name: "Испания" },
  { code: "CN", name: "Китай" },
  { code: "JP", name: "Япония" },
  { code: "IN", name: "Индия" },
  { code: "BR", name: "Бразилия" },
  { code: "CA", name: "Канада" },
  { code: "AU", name: "Австралия" },
];

type CountrySelectorProps = {
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
};

export default function CountrySelector({ selectedCountry, onSelectCountry }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm]);

  // Check position when window is resized and handle outside clicks
  useEffect(() => {
    if (isOpen) {
      const handleResize = () => {
        checkPosition();
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          buttonRef.current && 
          !buttonRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.country-dropdown')
        ) {
          setIsOpen(false);
        }
      };

      // Check position after render
      setTimeout(checkPosition, 0);

      window.addEventListener('resize', handleResize);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousedown', handleClickOutside);
        // Clean up custom property when dropdown is closed
        document.documentElement.style.removeProperty('--dropdown-offset');
      };
    }
  }, [isOpen]);

  // Get the selected country name
  const selectedCountryName = selectedCountry 
    ? countries.find(c => c.code === selectedCountry)?.name || selectedCountry
    : null;

  // Check if there's enough space below the button when opening the dropdown
  const checkPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - buttonRect.bottom;

      // If there's less than 300px below the button, position the dropdown above
      setDropPosition(spaceBelow < 300 ? 'top' : 'bottom');

      // Also check horizontal position to ensure dropdown is fully visible
      const dropdownWidth = 224; // 56 * 4 = 224px (w-56)
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;

      // Adjust dropdown position if it would go off-screen
      if (buttonCenterX + dropdownWidth / 2 > viewportWidth) {
        // If dropdown would go off right edge, align it to the right edge of the button
        document.documentElement.style.setProperty('--dropdown-offset', `${Math.min(viewportWidth - dropdownWidth, buttonRect.right - dropdownWidth)}px`);
      } else if (buttonCenterX - dropdownWidth / 2 < 0) {
        // If dropdown would go off left edge, align it to the left edge of the button
        document.documentElement.style.setProperty('--dropdown-offset', `${Math.max(0, buttonRect.left)}px`);
      } else {
        // Center the dropdown under the button
        document.documentElement.style.setProperty('--dropdown-offset', `${buttonCenterX - dropdownWidth / 2}px`);
      }
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          checkPosition();
          setIsOpen(!isOpen);
        }}
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
          style={{
            left: 'var(--dropdown-offset, 0)',
            [dropPosition === 'top' ? 'bottom' : 'top']: buttonRef.current 
              ? `${dropPosition === 'top' 
                  ? window.innerHeight - buttonRef.current.getBoundingClientRect().top 
                  : buttonRef.current.getBoundingClientRect().bottom}px` 
              : 'auto'
          }}>
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
