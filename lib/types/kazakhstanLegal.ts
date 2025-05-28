/**
 * TypeScript types for Kazakhstan legal entities and documents
 */

import { z } from "zod";

/**
 * Kazakhstan Individual (Physical Person) type
 */
export interface KazakhstanIndividual {
  fullName: string;
  iin: string;
  idDocument: {
    type: "id_card" | "passport" | "residence_permit";
    number: string;
    issueDate: string;
    issuedBy: string;
    expiryDate?: string;
  };
  address: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  citizenship: "Kazakhstan" | "other";
  birthDate: string;
  birthPlace?: string;
  gender: "male" | "female";
}

/**
 * Kazakhstan Legal Entity type
 */
export interface KazakhstanLegalEntity {
  name: string;
  bin: string;
  registrationDate: string;
  registrationNumber: string;
  legalAddress: string;
  actualAddress?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  director: {
    fullName: string;
    iin: string;
    position: string;
    authorityDocument: string;
  };
  entityType: "too" | "ao" | "ip" | "other";
  taxRegistrationInfo?: {
    taxRegistrationNumber: string;
    taxRegistrationDate: string;
    taxAuthority: string;
  };
  bankDetails?: {
    bankName: string;
    bik: string;
    accountNumber: string;
    currency: "KZT" | "USD" | "EUR" | "RUB";
  };
}

/**
 * Kazakhstan Employment Contract type
 */
export interface KazakhstanEmploymentContract {
  employer: KazakhstanLegalEntity;
  employee: KazakhstanIndividual;
  contractNumber: string;
  contractDate: string;
  position: string;
  salary: number;
  startDate: string;
  endDate?: string;
  contractType: "indefinite" | "fixed";
  probationPeriod: "none" | "1" | "2" | "3";
  workSchedule: "standard" | "shift" | "flexible";
  workLocation: string;
  additionalConditions?: string;
}

/**
 * Kazakhstan Real Estate type
 */
export interface KazakhstanRealEstate {
  type: "apartment" | "house" | "land" | "commercial";
  address: string;
  cadastralNumber: string;
  area: number;
  areaUnit: "sq_m" | "hectare";
  registrationDocument: {
    type: string;
    number: string;
    date: string;
    issuedBy: string;
  };
  restrictions?: string[];
  encumbrances?: string[];
}

/**
 * Kazakhstan Real Estate Purchase Agreement type
 */
export interface KazakhstanRealEstatePurchaseAgreement {
  seller: KazakhstanIndividual | KazakhstanLegalEntity;
  buyer: KazakhstanIndividual | KazakhstanLegalEntity;
  property: KazakhstanRealEstate;
  contractNumber: string;
  contractDate: string;
  price: number;
  paymentMethod: "cash" | "bank" | "escrow";
  paymentTerms: string;
  transferDate: string;
  additionalConditions?: string;
}

/**
 * Kazakhstan Rental Agreement type
 */
export interface KazakhstanRentalAgreement {
  landlord: KazakhstanIndividual | KazakhstanLegalEntity;
  tenant: KazakhstanIndividual | KazakhstanLegalEntity;
  property: KazakhstanRealEstate;
  contractNumber: string;
  contractDate: string;
  rentAmount: number;
  depositAmount: number;
  rentDueDay: string;
  startDate: string;
  endDate: string;
  paymentMethod: "cash" | "bank";
  utilitiesIncluded: boolean;
  additionalConditions?: string;
}

/**
 * Kazakhstan LLC Charter type
 */
export interface KazakhstanLLCCharter {
  companyName: string;
  bin: string;
  registrationDate: string;
  legalAddress: string;
  founders: Array<KazakhstanIndividual | KazakhstanLegalEntity>;
  authorizedCapital: number;
  sharesDistribution: Array<{
    founder: string;
    sharePercentage: number;
    shareAmount: number;
  }>;
  businessActivities: string[];
  managementStructure: "general_meeting_and_director" | "general_meeting_and_board" | "other";
  fiscalYear: "calendar" | "other";
  charterApprovalDate: string;
}

/**
 * Kazakhstan Meeting Protocol type
 */
export interface KazakhstanMeetingProtocol {
  companyName: string;
  bin: string;
  meetingType: "general" | "board" | "founders";
  meetingDate: string;
  meetingLocation: string;
  protocolNumber: string;
  chairman: string;
  secretary: string;
  attendees: string[];
  agenda: string[];
  decisions: Array<{
    agendaItem: string;
    decision: string;
    votingResults: {
      for: number;
      against: number;
      abstained: number;
    };
  }>;
  protocolDate: string;
}

/**
 * Kazakhstan Power of Attorney type
 */
export interface KazakhstanPowerOfAttorney {
  issuer: KazakhstanIndividual | KazakhstanLegalEntity;
  attorney: KazakhstanIndividual;
  documentNumber: string;
  issueDate: string;
  validUntil: string;
  powers: string[];
  revocable: boolean;
  transferRights: boolean;
  notarized: boolean;
  notaryInfo?: {
    notaryName: string;
    notaryLicense: string;
    notaryDistrict: string;
    registrationNumber: string;
  };
}

/**
 * Kazakhstan Consumer Claim type
 */
export interface KazakhstanConsumerClaim {
  claimant: KazakhstanIndividual;
  respondent: KazakhstanIndividual | KazakhstanLegalEntity;
  claimNumber: string;
  claimDate: string;
  purchaseInfo: {
    productOrService: string;
    purchaseDate: string;
    purchaseLocation: string;
    price: number;
    documentNumber?: string;
  };
  defectDescription: string;
  legalGrounds: string[];
  demands: string[];
  responseDeadline: string;
  attachments?: string[];
}

/**
 * Kazakhstan Lawsuit type
 */
export interface KazakhstanLawsuit {
  court: {
    name: string;
    address: string;
  };
  plaintiff: KazakhstanIndividual | KazakhstanLegalEntity;
  defendant: KazakhstanIndividual | KazakhstanLegalEntity;
  thirdParties?: Array<KazakhstanIndividual | KazakhstanLegalEntity>;
  caseSubject: string;
  claimAmount?: number;
  factsAndCircumstances: string;
  legalGrounds: string[];
  demands: string[];
  stateFee: number;
  attachments: string[];
  date: string;
}

/**
 * Zod schema for validating Kazakhstan IIN
 */
export const kazakhstanIINSchema = z.string()
  .length(12, { message: "ИИН должен содержать 12 цифр" })
  .regex(/^\d+$/, { message: "ИИН должен содержать только цифры" })
  .refine(
    (iin) => {
      // Basic validation - for complete validation use the validateIIN function from utils
      const centuryGender = parseInt(iin.charAt(6));
      return centuryGender >= 1 && centuryGender <= 6;
    },
    { message: "Некорректный ИИН" }
  );

/**
 * Zod schema for validating Kazakhstan BIN
 */
export const kazakhstanBINSchema = z.string()
  .length(12, { message: "БИН должен содержать 12 цифр" })
  .regex(/^\d+$/, { message: "БИН должен содержать только цифры" })
  .refine(
    (bin) => {
      // Basic validation - for complete validation use the validateBIN function from utils
      const entityType = parseInt(bin.charAt(4));
      const residency = parseInt(bin.charAt(5));
      return (entityType >= 4 && entityType <= 6) && (residency === 0 || residency === 1);
    },
    { message: "Некорректный БИН" }
  );

/**
 * Zod schema for validating Kazakhstan Individual
 */
export const kazakhstanIndividualSchema = z.object({
  fullName: z.string().min(2, { message: "ФИО должно содержать не менее 2 символов" }),
  iin: kazakhstanIINSchema,
  idDocument: z.object({
    type: z.enum(["id_card", "passport", "residence_permit"]),
    number: z.string().min(1, { message: "Номер документа обязателен" }),
    issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате YYYY-MM-DD" }),
    issuedBy: z.string().min(1, { message: "Орган выдачи обязателен" }),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате YYYY-MM-DD" }).optional(),
  }),
  address: z.string().min(5, { message: "Адрес должен содержать не менее 5 символов" }),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email({ message: "Некорректный email" }).optional(),
  }).optional(),
  citizenship: z.enum(["Kazakhstan", "other"]),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате YYYY-MM-DD" }),
  birthPlace: z.string().optional(),
  gender: z.enum(["male", "female"]),
});

/**
 * Zod schema for validating Kazakhstan Legal Entity
 */
export const kazakhstanLegalEntitySchema = z.object({
  name: z.string().min(2, { message: "Наименование должно содержать не менее 2 символов" }),
  bin: kazakhstanBINSchema,
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате YYYY-MM-DD" }),
  registrationNumber: z.string().min(1, { message: "Регистрационный номер обязателен" }),
  legalAddress: z.string().min(5, { message: "Юридический адрес должен содержать не менее 5 символов" }),
  actualAddress: z.string().optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email({ message: "Некорректный email" }).optional(),
    website: z.string().url({ message: "Некорректный URL" }).optional(),
  }).optional(),
  director: z.object({
    fullName: z.string().min(2, { message: "ФИО должно содержать не менее 2 символов" }),
    iin: kazakhstanIINSchema,
    position: z.string().min(1, { message: "Должность обязательна" }),
    authorityDocument: z.string().min(1, { message: "Документ, подтверждающий полномочия, обязателен" }),
  }),
  entityType: z.enum(["too", "ao", "ip", "other"]),
  taxRegistrationInfo: z.object({
    taxRegistrationNumber: z.string().min(1, { message: "Номер налоговой регистрации обязателен" }),
    taxRegistrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Дата должна быть в формате YYYY-MM-DD" }),
    taxAuthority: z.string().min(1, { message: "Налоговый орган обязателен" }),
  }).optional(),
  bankDetails: z.object({
    bankName: z.string().min(1, { message: "Наименование банка обязательно" }),
    bik: z.string().min(1, { message: "БИК обязателен" }),
    accountNumber: z.string().min(1, { message: "Номер счета обязателен" }),
    currency: z.enum(["KZT", "USD", "EUR", "RUB"]),
  }).optional(),
});