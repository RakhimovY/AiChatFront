/**
 * List of countries with their codes
 */
export const countries = [
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

/**
 * Interface for country data
 */
export interface Country {
  code: string;
  name: string;
}

/**
 * Find a country by its code
 */
export function findCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

/**
 * Filter countries by search term
 */
export function filterCountries(searchTerm: string): Country[] {
  if (!searchTerm) {
    return countries;
  }
  
  const term = searchTerm.toLowerCase();
  return countries.filter(country => 
    country.name.toLowerCase().includes(term) ||
    country.code.toLowerCase().includes(term)
  );
}