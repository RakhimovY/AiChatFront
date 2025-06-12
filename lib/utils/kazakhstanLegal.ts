/**
 * Utility functions for Kazakhstan legal documents
 */

/**
 * Validates a Kazakhstan Individual Identification Number (IIN)
 * IIN is a 12-digit number where:
 * - First 6 digits represent birth date (YYMMDD)
 * - 7th digit represents century and gender (1-2: 19th century, 3-4: 20th century, 5-6: 21st century; odd: male, even: female)
 * - Next 4 digits are a serial number
 * - Last digit is a check digit
 */
export function validateIIN(iin: string): boolean {
  if (!/^\d{12}$/.test(iin)) {
    return false;
  }

  const centuryGender = parseInt(iin.charAt(6));
  if (centuryGender < 1 || centuryGender > 6) {
    return false;
  }

  const year = parseInt(iin.substring(0, 2));
  const month = parseInt(iin.substring(2, 4));
  const day = parseInt(iin.substring(4, 6));

  let fullYear: number;
  if (centuryGender === 1 || centuryGender === 2) {
    fullYear = 1800 + year;
  } else if (centuryGender === 3 || centuryGender === 4) {
    fullYear = 1900 + year;
  } else {
    fullYear = 2000 + year;
  }

  const date = new Date(fullYear, month - 1, day);
  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let sum = 0;

  for (let i = 0; i < 11; i++) {
    sum += parseInt(iin.charAt(i)) * weights[i];
  }

  const checkDigit = sum % 11;

  if (checkDigit === 10) {
    const weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
    sum = 0;

    for (let i = 0; i < 11; i++) {
      sum += parseInt(iin.charAt(i)) * weights2[i];
    }

    return sum % 11 === parseInt(iin.charAt(11));
  }

  return checkDigit === parseInt(iin.charAt(11));
}

/**
 * Validates a Kazakhstan Business Identification Number (BIN)
 * BIN is a 12-digit number where:
 * - First 4 digits represent registration date (YYMM)
 * - 5th digit represents type of entity
 * - 6th digit represents residency
 * - Next 5 digits are a serial number
 * - Last digit is a check digit
 */
export function validateBIN(bin: string): boolean {
  if (!/^\d{12}$/.test(bin)) {
    return false;
  }

  const entityType = parseInt(bin.charAt(4));
  if (entityType < 4 || entityType > 6) {
    return false;
  }

  const residency = parseInt(bin.charAt(5));
  if (residency !== 0 && residency !== 1) {
    return false;
  }

  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let sum = 0;

  for (let i = 0; i < 11; i++) {
    sum += parseInt(bin.charAt(i)) * weights[i];
  }

  const checkDigit = sum % 11;

  if (checkDigit === 10) {
    const weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
    sum = 0;

    for (let i = 0; i < 11; i++) {
      sum += parseInt(bin.charAt(i)) * weights2[i];
    }

    return sum % 11 === parseInt(bin.charAt(11));
  }

  return checkDigit === parseInt(bin.charAt(11));
}

/**
 * Formats a Kazakhstan address according to standard format
 */
export function formatKazakhstanAddress(
  region: string,
  city: string,
  street: string,
  building: string,
  apartment?: string,
  postalCode?: string
): string {
  let address = '';

  if (postalCode) {
    address += `${postalCode}, `;
  }

  address += `${region}, ${city}, ${street}, ${building}`;

  if (apartment) {
    address += `, кв. ${apartment}`;
  }

  return address;
}

/**
 * Generates a document number for Kazakhstan legal documents
 * Format: [Document Type Code]-[Year]-[Sequential Number]
 */
export function generateDocumentNumber(
  documentType: 'employment' | 'real-estate' | 'rental' | 'charter' | 'protocol' | 'power-of-attorney' | 'consumer-claim' | 'lawsuit',
  sequentialNumber: number
): string {
  const currentYear = new Date().getFullYear();

  const documentTypeCodes: Record<string, string> = {
    'employment': 'ТД',
    'real-estate': 'КП',
    'rental': 'АР',
    'charter': 'УС',
    'protocol': 'ПР',
    'power-of-attorney': 'ДВ',
    'consumer-claim': 'ПТ',
    'lawsuit': 'ИС',
  };

  const formattedNumber = sequentialNumber.toString().padStart(3, '0');

  return `${documentTypeCodes[documentType]}-${currentYear}-${formattedNumber}`;
}

/**
 * Checks if a document complies with Kazakhstan legislation requirements
 */
export function checkLegalCompliance(
  documentType: string,
  documentContent: string
): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];

  const commonRequiredPhrases = [
    'Республика Казахстан',
    'тенге',
  ];

  commonRequiredPhrases.forEach(phrase => {
    if (!documentContent.includes(phrase)) {
      issues.push(`Документ должен содержать фразу "${phrase}"`);
    }
  });

  switch (documentType) {
    case 'employment':
      if (!documentContent.includes('Трудовой кодекс Республики Казахстан')) {
        issues.push('Трудовой договор должен содержать ссылку на Трудовой кодекс Республики Казахстан');
      }
      if (!documentContent.includes('ИИН') || !documentContent.includes('БИН')) {
        issues.push('Трудовой договор должен содержать ИИН работника и БИН работодателя');
      }
      break;

    case 'real-estate':
      if (!documentContent.includes('государственной регистрации')) {
        issues.push('Договор купли-продажи недвижимости должен содержать пункт о государственной регистрации');
      }
      if (!documentContent.includes('кадастровый номер')) {
        issues.push('Договор купли-продажи недвижимости должен содержать кадастровый номер объекта');
      }
      if (!documentContent.includes('Департамент юстиции') && !documentContent.includes('ЦОН')) {
        issues.push('Договор купли-продажи недвижимости должен содержать упоминание Департамента юстиции или ЦОН');
      }
      break;

    case 'rental':
      if (!documentContent.includes('арендная плата')) {
        issues.push('Договор аренды должен содержать условия об арендной плате');
      }
      if (!documentContent.includes('гарантийный взнос')) {
        issues.push('Договор аренды должен содержать информацию о гарантийном взносе');
      }
      if (!documentContent.includes('коммунальных услуг')) {
        issues.push('Договор аренды должен содержать условия об оплате коммунальных услуг');
      }
      break;

    case 'charter':
      if (!documentContent.includes('Предпринимательский кодекс')) {
        issues.push('Устав ТОО должен содержать ссылку на Предпринимательский кодекс РК');
      }
      break;

    case 'power-of-attorney':
      if (!documentContent.includes('Без права передоверия') && !documentContent.includes('С правом передоверия')) {
        issues.push('Доверенность должна содержать указание о праве или запрете передоверия');
      }
      if (!documentContent.includes('ИИН')) {
        issues.push('Доверенность должна содержать ИИН доверителя и поверенного');
      }
      break;

    case 'consumer-claim':
      if (!documentContent.includes('Закон о защите прав потребителей')) {
        issues.push('Претензия должна содержать ссылку на Закон о защите прав потребителей');
      }
      break;

    case 'lawsuit':
      if (!documentContent.includes('Гражданский процессуальный кодекс')) {
        issues.push('Исковое заявление должно содержать ссылку на ГПК РК');
      }
      break;
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
}

/**
 * Transliterates Kazakh Cyrillic text to Latin script according to the 2017 standard
 */
export function transliterateKazakhToLatin(text: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'ә': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ғ': 'g',
    'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
    'й': 'i', 'к': 'k', 'қ': 'q', 'л': 'l', 'м': 'm', 'н': 'n',
    'ң': 'n', 'о': 'o', 'ө': 'o', 'п': 'p', 'р': 'r', 'с': 's',
    'т': 't', 'у': 'u', 'ұ': 'u', 'ү': 'u', 'ф': 'f', 'х': 'h',
    'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y',
    'і': 'i', 'ь': '', 'э': 'e', 'ю': 'iu', 'я': 'ia',
    'А': 'A', 'Ә': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Ғ': 'G',
    'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'J', 'З': 'Z', 'И': 'I',
    'Й': 'I', 'К': 'K', 'Қ': 'Q', 'Л': 'L', 'М': 'M', 'Н': 'N',
    'Ң': 'N', 'О': 'O', 'Ө': 'O', 'П': 'P', 'Р': 'R', 'С': 'S',
    'Т': 'T', 'У': 'U', 'Ұ': 'U', 'Ү': 'U', 'Ф': 'F', 'Х': 'H',
    'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SH', 'Ъ': '', 'Ы': 'Y',
    'І': 'I', 'Ь': '', 'Э': 'E', 'Ю': 'IU', 'Я': 'IA',
  };

  return text.split('').map(char => cyrillicToLatin[char] || char).join('');
}

/**
 * Generates a random valid Kazakhstan IIN for testing purposes
 */
export function generateTestIIN(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: 'male' | 'female'
): string {
  if (birthYear < 1800 || birthYear > 2100) {
    throw new Error('Invalid birth year');
  }
  if (birthMonth < 1 || birthMonth > 12) {
    throw new Error('Invalid birth month');
  }
  if (birthDay < 1 || birthDay > 31) {
    throw new Error('Invalid birth day');
  }

  const year = birthYear.toString().slice(-2);
  const month = birthMonth.toString().padStart(2, '0');
  const day = birthDay.toString().padStart(2, '0');

  let centuryGender: number;
  if (birthYear >= 1800 && birthYear < 1900) {
    centuryGender = gender === 'male' ? 1 : 2;
  } else if (birthYear >= 1900 && birthYear < 2000) {
    centuryGender = gender === 'male' ? 3 : 4;
  } else {
    centuryGender = gender === 'male' ? 5 : 6;
  }

  const serialNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const baseNumber = `${year}${month}${day}${centuryGender}${serialNumber}`;

  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let sum = 0;

  for (let i = 0; i < 11; i++) {
    sum += parseInt(baseNumber.charAt(i)) * weights[i];
  }

  let checkDigit = sum % 11;

  if (checkDigit === 10) {
    const weights2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
    sum = 0;

    for (let i = 0; i < 11; i++) {
      sum += parseInt(baseNumber.charAt(i)) * weights2[i];
    }

    checkDigit = sum % 11;
  }

  if (checkDigit === 10) {
    checkDigit = 0;
  }

  return `${baseNumber}${checkDigit}`;
}
