"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageCode, languageNames } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
        title={t.selectLanguage}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline">{t.selectLanguage}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-card border z-50"
        >
          <div className="py-1">
            {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${
                  language === code ? "bg-primary/10 font-medium" : ""
                }`}
              >
                {languageNames[code]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}